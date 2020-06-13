import { db } from "@/main";

const state = () => ({
    client: undefined,
    selected: [],
    search: '',
    serviceOrders: [],
    statusList: ['Pendente', 'Em progresso', 'Finalizada'],
    selectedOrderTasks: [],
    kanbanColumns: [],
    selectedTask: { name: '' },
    showTaskDialog: false,
    taskDialogInEditMode: false,
    showCreateOrderDialog: false,
    newOrder: { name: '', creation_date: formatDate(new Date().toISOString().substr(0, 10)), end_date: '', users: [], userGroups: [] }
});

const mutations = {
    updateShowCreateOrderDialog(state, payload) {
        state.showCreateOrderDialog = payload;
    },
    selectOrder(state, payload) {
        state.selected = payload;
        if (payload)
            state.client = payload.client;
    },
    searchFor(state, payload) {
        state.search = payload
    },
    updateOrders(state, payload) {
        state.serviceOrders = payload
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
    updateTaskDialogInEditMode(state, payload) {
        state.taskDialogInEditMode = payload
    }
};


function onServiceOrdersLoaded(payload) {
    let serviceOrders = [];
    payload.forEach(orderSnapShot => {
        let orderData = orderSnapShot.data();
        orderData.id = orderSnapShot.id;
        serviceOrders.push(orderData);
    });
    return new Promise(function (resolve, reject) {
        if (!serviceOrders)
            reject(serviceOrders);
        else
            resolve(serviceOrders);
    })
}

function getOrderUsersIds(serviceOrders) {
    let userIds = [];
    serviceOrders.forEach(order => {
        userIds.push(order.administrator);
        userIds = userIds.concat(order.users);
        userIds = userIds.unique();
    });
    return userIds;
}

function completeOrdersWithUsersInformation(serviceOrders, users) {
    serviceOrders.forEach(order => {
        order.administratorName = users.filter(u => u.id == order.administrator)[0]?.name;
        order.usersList = order?.users?.map(u => ({
            id: u,
            name: u.name
        })) || [];
    });
}

function getOrderFromDatabase(serviceOrderId) {
    return db.collection("serviceOrder")
        .doc(serviceOrderId)
}

function getTaskFromDatabase(serviceOrderId, taskId) {
    return db.collection("serviceOrder")
        .doc(serviceOrderId)
        .collection("tasks")
        .doc(taskId)
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
    openCreateOrderModal(context) {
        context.commit('updateShowCreateOrderDialog', true)
    },
    closeCreateOrderModal(context) {
        context.commit('updateShowCreateOrderDialog', false)
    },
    saveNewOrder(context) {
        let tasks = [];
        if (context.state.newOrder.template) {
            tasks = context.state.newOrder.template.tasks.map((obj) => { return Object.assign({}, obj, { creation_date: formatDate(new Date().toISOString().substr(0, 10)) }) }) || [];
        }

        db.collection("serviceOrder").add({
            name: context.state.newOrder.name,
            client: context.state.newOrder.client,
            creation_date: context.state.newOrder.creation_date,
            end_date: context.state.newOrder.end_date,
            users: context.state.newOrder.users.map((obj) => { return Object.assign({}, obj) }) || [],
            userGroups: context.state.newOrder.userGroups.map((obj) => { return Object.assign({}, obj) }) || [],
            tasks: tasks
        })
            .then(() => {
                this.dispatch('serviceOrders/reloadOrders').then(() => { context.commit('updateShowCreateOrderDialog', false) })
            })
    },
    selectOrder(context, payload) {
        context.commit('selectOrder', payload)
    },
    searchFor(context, payload) {
        context.commit('searchFor', payload)
    },
    reloadOrders(context) {
        let self = this;
        db.collection("serviceOrder")
            .get()
            .then(onServiceOrdersLoaded)
            .then(function (serviceOrders) {
                self.dispatch('users/readUsers').then(function () {
                    let userIds = getOrderUsersIds(serviceOrders);
                    let users = context.rootGetters['users/filterUsersById'](userIds);
                    completeOrdersWithUsersInformation(serviceOrders, users);
                    context.commit('updateOrders', serviceOrders);
                })
            });
    },
    loadTasksByOrder(context) {
        if (context.state.selected[0])
            getOrderFromDatabase(context.state.selected[0].id).get()
                .then(snapshot => {
                    this.dispatch('serviceOrders/updateSelectedOrderTask', snapshot.data().tasks).then(() => {
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
        if (!payload.id) {
            payload.items = []
            payload.users = []
            payload.creation_date = formatDate(new Date().toISOString().substr(0, 10))
            payload.items.push({ done: false, description: 'Item da tarefa (edite-me)' })
            context.commit('updateTaskDialogInEditMode', true)
        }

        context.commit('updateSelectedTask', payload)
        context.commit('updateShowTaskDialog', true)


    },
    updateSelectedOrderTask(context, payload) {
        context.commit('updateSelectedOrderTasks', payload)
    },
    updateSelectedTask(context, payload) {
        context.commit('updateSelectedTask', payload)
    },
    closeTaskModal(context) {
        context.commit('updateShowTaskDialog', false)
    },
    saveTask(context) {
        if (context.state.selectedTask.id)
            getTaskFromDatabase(context.state.selected[0].id, context.state.selectedTask.id)
                .set({
                    name: context.state.selectedTask.name,
                    creation_date: context.state.selectedTask.creation_date,
                    end_date: context.state.selectedTask.end_date,
                    status: context.state.selectedTask.status,
                    items: context.state.selectedTask.items.map((obj) => {
                        if (!obj.done)
                            return Object.assign({}, obj, { done: false });
                        return Object.assign({}, obj)
                    }) || [],
                    users: context.state.selectedTask.users.map((obj) => { return Object.assign({}, obj) }) || []
                })
                .then(() => {
                    this.dispatch('serviceOrders/loadTasksByOrder')
                })
                .then(() => {
                    this.dispatch('serviceOrders/closeTaskModal')
                })
                .catch(error => {
                    console.error("Error updating document: ", error);
                });
        else
            getOrderFromDatabase(context.state.selected[0].id).collection("tasks")
                .add(
                    {
                        name: context.state.selectedTask.name,
                        creation_date: context.state.selectedTask.creation_date,
                        end_date: context.state.selectedTask.end_date || '',
                        status: 'Pendente',
                        items: context.state.selectedTask.items.map((obj) => {
                            if (!obj.done)
                                return Object.assign({}, obj, { done: false });
                            return Object.assign({}, obj)
                        }) || [],
                        users: context.state.selectedTask.users.map((obj) => { return Object.assign({}, obj) }) || []
                    }
                )
                .then(() => {
                    this.dispatch('serviceOrders/loadTasksByOrder')
                })
                .then(() => {
                    this.dispatch('serviceOrders/closeTaskModal')
                })
                .catch(error => {
                    console.error("Error updating document: ", error);
                });

        context.commit('updateTaskDialogInEditMode', false)
    },
    deleteTask(context) {
        if (context.state.selectedTask.id) {
            getTaskFromDatabase(context.state.selected[0].id, context.state.selectedTask.id).delete()
                .then(() => {
                    this.dispatch('serviceOrders/loadTasksByOrder')
                })
                .then(() => {
                    this.dispatch('serviceOrders/closeTaskModal')
                })
        }
        else {
            this.dispatch('serviceOrders/loadTasksByOrder')
                .then(() => {
                    this.dispatch('serviceOrders/closeTaskModal')
                })
        }
    },
    onTaskDrag(context, payload) {
        if (payload.added) {
            context.state.kanbanColumns.forEach(column => {
                column.tasks.forEach(task => {
                    if (task.id == payload.added.element.id) {
                        context.state.selectedTask = context.state.selectedOrderTasks.find(c => c.id == payload.added.element.id)
                        context.state.selectedTask.status = column.title

                        if (column.title == "Finalizada")
                            context.state.selectedTask.end_date = formatDate(new Date().toISOString().substr(0, 10))
                        else
                            context.state.selectedTask.end_date = ''
                    }
                });
            });
            this.dispatch('serviceOrders/saveTask')
        }

    },
    saveServiceOrder(context) {
        let serviceOrder = context.state.selected[0];
        if (!serviceOrder)
            return;
        db.collection("serviceOrder")
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
    setOrUnsetEditMode(context) {
        context.commit('updateTaskDialogInEditMode', !context.state.taskDialogInEditMode)
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