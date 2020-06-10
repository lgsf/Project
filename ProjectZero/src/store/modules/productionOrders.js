import { db } from "@/main";

const state = () => ({
    client: undefined,
    selected: [],
    search: '',
    productionOrders: [],
    statusList: ['Pendente', 'Em progresso', 'Finalizada'],
    selectedOrderTasks: [],
    kanbanColumns: [],
    selectedTask: undefined,
    showTaskDialog: false,
    showTaskItemDialog: false,
    selectedTaskItem: undefined
});

const mutations = {
    selectOrder(state, payload) {
        state.selected = payload;
        if (payload)
            state.client = payload.client;
    },
    searchFor(state, payload) {
        state.search = payload
    },
    updateOrders(state, payload) {
        state.productionOrders = payload
    },
    updateClient(state, payload) {
        state.client = payload;
        state.selected[0].client = payload;
    },
    updateOrderEndDate(state, payload) {
        state.selected[0].end_date = payload;
    },
    updateSelectedOrderTasks(state, payload) {
        state.selectedOrderTasks = payload
    },
    updateShowTaskDialog(state, payload) {
        state.showTaskDialog = payload
    },
    updateKanbanColumns(state) {
        state.kanbanColumns = state.statusList.map(status => ({
            title: status,
            tasks: state.selectedOrderTasks.filter(task => task.status == status)
        }));
    },
    updateSelectedTask(state, payload) {
        state.selectedTask = payload
    },
    updateTaskName(state, payload) {
        state.selectedTask.name = payload
    },
    updateTaskEndDate(state, payload) {
        state.selectedTask.end_date = payload
    },
    updateShowTaskItemDialog(state, payload) {
        state.showTaskItemDialog = payload
    },
    updateSelectedTaskItem(state, payload) {
        state.selectedTaskItem = payload
    }
};


function onProductionOrdersLoaded(payload) {
    let productionOrders = [];
    payload.forEach(orderSnapShot => {
        let orderData = orderSnapShot.data();
        orderData.id = orderSnapShot.id;
        productionOrders.push(orderData);
    });
    return new Promise(function (resolve, reject) {
        if (!productionOrders)
            reject(productionOrders);
        else
            resolve(productionOrders);
    })
}

function getOrderUsersIds(productionOrders) {
    let userIds = [];
    productionOrders.forEach(order => {
        userIds.push(order.administrator);
        userIds = userIds.concat(order.users);
        userIds = userIds.unique();
    });
    return userIds;
}

function completeOrdersWithUsersInformation(productionOrders, users) {
    productionOrders.forEach(order => {
        order.administratorName = users.filter(u => u.id == order.administrator)[0].name;
        order.usersList = order.users.map(u => ({
            id: u,
            name: users.filter(m => m.id == u)[0].name
        }));
    });
}

Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

const actions = {
    selectOrder(context, payload) {
        context.commit('selectOrder', payload)
    },
    searchFor(context, payload) {
        context.commit('searchFor', payload)
    },
    reloadOrders(context) {
        let self = this;
        db.collection("productionOrder")
            .get()
            .then(onProductionOrdersLoaded)
            .then(function (productionOrders) {
                self.dispatch('users/readUsers').then(function () {
                    let userIds = getOrderUsersIds(productionOrders);
                    let users = context.rootGetters['users/filterUsersById'](userIds);
                    completeOrdersWithUsersInformation(productionOrders, users);
                    context.commit('updateOrders', productionOrders);
                })
            });
    },
    loadTasksByOrder(context) {
        db.collection("productionOrder").doc(context.state.selected[0].id)
            .collection("tasks").get().then(snapshot => {
                let tasks = [];
                snapshot.forEach(taskSnapshot => {
                    let taskData = taskSnapshot.data();
                    taskData.id = taskSnapshot.id;
                    tasks.push(taskData);
                });
                let taskIds = tasks.map(t => t.id);
                let unmodifiedTasks = context.state.selectedOrderTasks.filter(t => !taskIds.includes(t.id));
                tasks = tasks.concat(unmodifiedTasks);
                this.dispatch('productionOrders/updateSelectedOrderTask', tasks).then(() => {
                    context.commit('updateKanbanColumns')
                });
            });
    },
    updateClient(context, payload) {
        context.commit("updateClient", payload);
    },
    updateOrderEndDate(context, payload) {
        context.commit('updateOrderEndDate', payload)
    },
    showTaskDialog(context, payload) {
        let task = payload
        task.items = []
        db.collection("productionOrder").doc(context.state.selected[0].id)
            .collection("tasks").doc(payload.id)
            .collection("items").get().then(snapshot => {
                snapshot.forEach(itemSnapshot => {
                    let itemData = itemSnapshot.data();
                    itemData.id = itemSnapshot.id;
                    task.items.push(itemData);
                });

                this.dispatch('productionOrders/updateSelectedTask', task).then(() => {
                    context.commit('updateShowTaskDialog', true)
                });
            });
    },
    updateSelectedOrderTask(context, payload) {
        context.commit('updateSelectedOrderTasks', payload)
    },
    updateSelectedTask(context, payload) {
        context.commit('updateSelectedTask', payload)
    },
    closeEditServiceOrderTaskModal(context) {
        context.commit('updateShowTaskDialog', false)
    },
    saveTask(context) {
        db.collection("productionOrder")
            .doc(context.state.selected[0].id)
            .collection("tasks").doc(context.state.selectedTask.id)
            .update({
                name: context.state.selectedTask.name,
                end_date: context.state.selectedTask.end_date,
                status: context.state.selectedTask.status
            })
            .then(() => { this.dispatch('productionOrders/loadTasksByOrder') })
            .then(() => { this.dispatch('productionOrders/closeEditServiceOrderTaskModal') })
            .catch(error => {
                console.error("Error updating document: ", error);
            });
    },
    updateTaskName(context, payload) {
        context.commit('updateTaskName', payload)
    },
    updateTaskEndDate(context, payload) {
        context.commit('updateTaskEndDate', payload)
    },
    onTaskDrag(context, payload) {
        if (payload.added) {
            context.state.kanbanColumns.forEach(column => {
                column.tasks.forEach(task => {
                    if (task.id == payload.added.element.id) {
                        context.state.selectedTask = context.state.selectedOrderTasks.find(c => c.id == payload.added.element.id)
                        context.state.selectedTask.status = column.title
                    }
                });
            });
            this.dispatch('productionOrders/saveTask')
        }

    },
    saveTaskItems(context, payload) {
        console.log(context)
        console.log(payload)
    },
    saveServiceOrder(context) {
        let serviceOrder = context.state.selected[0];
        if (!serviceOrder)
            return;
        db.collection("productionOrder")
            .doc(serviceOrder.id)
            .update({
                name: serviceOrder.name,
                client: serviceOrder.client || '',
                end_date: serviceOrder.end_date || ''
            })
            .then(() => {
                this.dispatch('setSuccessMessage', 'Ordem de serviço salva com sucesso.');
            }, () => {
                this.dispatch('setSuccessMessage', 'Ordem de serviço salva com sucesso.');
            })
            .catch(error => {
                console.error("Error updating document: ", error);
            });
    },
    showTaskItemDialog(context, payload) {
        this.dispatch('productionOrders/updateSelectedTaskItem', payload).then(() => {
            context.commit('updateShowTaskItemDialog', true)
        })
    },
    updateSelectedTaskItem(context, payload) {
        context.commit('updateTaskItem', payload)
    }
};

const getters = {};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}