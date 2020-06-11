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
    selectedTaskItem: { description: '' }
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
    updateTaskUsers(state, payload) {
        state.selectedTask.users = payload
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

function formatDate(date) {
    if (!date) return null;

    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
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
        let task = payload || context.state.selectedTask
        task.items = []
        task.users = []
        if (!task.id) {
            task.creation_date = formatDate(new Date().toISOString().substr(0, 10))
            task.items.push({ done: false, description: 'Item da tarefa (edite-me)' })
        }

        if (task.id)
            db.collection("productionOrder").doc(context.state.selected[0].id)
                .collection("tasks").doc(task.id)
                .collection("items").get().then(snapshot => {
                    snapshot.forEach(itemSnapshot => {
                        let itemData = itemSnapshot.data();
                        itemData.id = itemSnapshot.id;
                        task.items.push(itemData);
                    });

                    db.collection("productionOrder").doc(context.state.selected[0].id)
                        .collection("tasks").doc(task.id)
                        .collection("users").get().then(snapshot => {
                            snapshot.forEach(itemSnapshot => {
                                let itemData = itemSnapshot.data();
                                itemData.id = itemSnapshot.id;
                                task.users.push(itemData);
                            });

                            this.dispatch('productionOrders/updateSelectedTask', task).then(() => {
                                context.commit('updateShowTaskDialog', true)
                            });
                        });
                })
        else
            this.dispatch('productionOrders/updateSelectedTask', task).then(() => { context.commit('updateShowTaskDialog', true) })
    },
    updateSelectedOrderTask(context, payload) {
        context.commit('updateSelectedOrderTasks', payload)
    },
    updateSelectedTask(context, payload) {
        context.commit('updateSelectedTask', payload)
    },
    closeEditServiceOrderTaskModal(context) {
        context.commit('updateSelectedTask', { name: '', items: [], users: [] })
        context.commit('updateShowTaskDialog', false)
    },
    saveTask(context) {
        if (context.state.selectedTask.id)
            db.collection("productionOrder")
                .doc(context.state.selected[0].id)
                .collection("tasks").doc(context.state.selectedTask.id)
                .update({
                    name: context.state.selectedTask.name,
                    end_date: context.state.selectedTask.end_date,
                    status: context.state.selectedTask.status
                })
                .then(() => { this.dispatch('productionOrders/saveTaskUsers') })
                .then(() => { this.dispatch('productionOrders/showTaskDialog') })
                .then(() => { this.dispatch('productionOrders/closeEditServiceOrderTaskModal') })
                .catch(error => {
                    console.error("Error updating document: ", error);
                });
        else
            db.collection("productionOrder")
                .doc(context.state.selected[0].id)
                .collection("tasks")
                .add({
                    name: context.state.selectedTask.name,
                    end_date: context.state.selectedTask.end_date || '',
                    status: 'Pendente',
                    creation_date: context.state.selectedTask.creation_date
                })
                .then((recentAdded) => {
                    let added = context.state.selectedTask;
                    added.id = recentAdded.id;
                    this.dispatch('productionOrders/updateSelectedTask', added)
                })
                .then(() => { this.dispatch('productionOrders/saveTaskUsers') })
                .then(() => { this.dispatch('productionOrders/showTaskDialog') })
                .then(() => { this.dispatch('productionOrders/closeEditServiceOrderTaskModal') })
                .catch(error => {
                    console.error("Error updating document: ", error);
                });
    },
    saveTaskUsers(context) {
        db.collection("productionOrder")
            .doc(context.state.selected[0].id)
            .collection("tasks").doc(context.state.selectedTask.id)
            .collection("users")
            .get().then(snapshot => {
                snapshot.forEach((item) => {
                    db.collection("productionOrder")
                        .doc(context.state.selected[0].id)
                        .collection("tasks")
                        .doc(context.state.selectedTask.id)
                        .collection("users")
                        .doc(item.id)
                        .delete()
                })
            })
            .then(() => {
                context.state.selectedTask.users.forEach(user => {
                    db.collection("productionOrder")
                        .doc(context.state.selected[0].id)
                        .collection("tasks").doc(context.state.selectedTask.id)
                        .collection("users")
                        .add({
                            name: user.name,
                            id: user.id,
                            email: user.email
                        })
                })
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
    updateTaskUsers(context, payload) {
        context.commit('updateTaskUsers', payload)
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
    saveTaskBeforeSavingTaskItem(context) {
        if (!context.state.selectedTask.id)
            this.dispatch('productionOrders/saveTask')
    },
    saveTaskItem(context) {
        this.dispatch('saveTaskBeforeSavingTaskItem').then(() => {
            if (context.state.selectedTaskItem.id)
                db.collection("productionOrder")
                    .doc(context.state.selected[0].id)
                    .collection("tasks")
                    .doc(context.state.selectedTask.id)
                    .collection("items")
                    .doc(context.state.selectedTaskItem.id)
                    .update({
                        description: context.state.selectedTaskItem.description
                    })
                    .then(() => { this.dispatch('productionOrders/loadTasksByOrder') })
                    .then(() => { this.dispatch('productionOrders/updateSelectedTask', context.state.selectedOrderTasks.find(t => t.id == context.state.selectedTask.id)) })
                    .then(() => { this.dispatch('productionOrders/closeEditTaskItemModal') })
                    .catch(error => {
                        console.error("Error updating document: ", error);
                    });
            else
                db.collection("productionOrder")
                    .doc(context.state.selected[0].id)
                    .collection("tasks")
                    .doc(context.state.selectedTask.id)
                    .collection("items")
                    .add({
                        description: context.state.selectedTaskItem.description,
                        done: false
                    })
                    .then(() => { this.dispatch('productionOrders/loadTasksByOrder') })
                    .then(() => { this.dispatch('productionOrders/closeEditTaskItemModal') })
                    .catch(error => {
                        console.error("Error updating document: ", error);
                    });
        })
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
        console.log(payload)
        this.dispatch('productionOrders/updateSelectedTaskItem', payload).then(() => {
            console.log(context.state.selectedTaskItem)
            context.commit('updateShowTaskItemDialog', true)
            console.log(context.state.showTaskItemDialog)
        })
    },
    updateSelectedTaskItem(context, payload) {
        context.commit('updateSelectedTaskItem', payload)
    },
    closeEditTaskItemModal(context) {
        context.commit('updateShowTaskItemDialog', false)
    },
    updateSelectedTaskItemDescription(context, payload) {
        let obj = context.state.selectedTaskItem
        obj.description = payload
        context.commit('updateSelectedTaskItem', obj)
    },
    removeTaskItem(context, payload) {
        db.collection("productionOrder")
            .doc(context.state.selected[0].id)
            .collection("tasks")
            .doc(context.state.selectedTask.id)
            .collection("items")
            .doc(payload.id)
            .delete()
            .then(() => { this.dispatch('productionOrders/updateSelectedTask', context.state.selectedOrderTasks.find(t => t.id == context.state.selectedTask.id)) })
            .then(() => { this.dispatch('productionOrders/showTaskDialog') })
            .then(() => { this.dispatch('productionOrders/closeEditTaskItemModal') })
            .catch(error => {
                console.error("Error updating document: ", error);
            });
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