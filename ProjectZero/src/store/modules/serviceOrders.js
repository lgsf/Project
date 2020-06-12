import { db } from "@/main";

const state = () => ({
    client: undefined,
    selected: [],
    search: '',
    serviceOrders: [],
    statusList: ['Pendente', 'Em progresso', 'Finalizada'],
    selectedOrderTasks: [],
    kanbanColumns: [],
    selectedTask: undefined,
    showTaskDialog: false
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
        order.usersList = !order.users ? [] : order.users.map(u => ({
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
        db.collection("serviceOrder").doc(context.state.selected[0].id)
            .collection("tasks").get().then(snapshot => {
                let tasks = [];
                snapshot.forEach(taskSnapshot => {
                    let taskData = taskSnapshot.data();
                    taskData.id = taskSnapshot.id;
                    tasks.push(taskData);
                });
                this.dispatch('serviceOrders/updateSelectedOrderTask', tasks).then(() => {
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
    fetchTaskItemsAndUsers(context, payload) {
        payload = payload || context.state.selectedTask;
        payload.items = [];
        payload.users = [];
        db.collection("serviceOrder").doc(context.state.selected[0].id)
            .collection("tasks").doc(payload.id)
            .collection("items").get().then(snapshot => {
                snapshot.forEach(itemSnapshot => {
                    let itemData = itemSnapshot.data();
                    itemData.id = itemSnapshot.id;
                    payload.items.push(itemData);
                });

                db.collection("serviceOrder").doc(context.state.selected[0].id)
                    .collection("tasks").doc(payload.id)
                    .collection("users").get().then(snapshot => {
                        snapshot.forEach(itemSnapshot => {
                            let itemData = itemSnapshot.data();
                            itemData.id = itemSnapshot.id;
                            payload.users.push(itemData);
                        });

                        this.dispatch('serviceOrders/updateSelectedTask', payload)
                    });
            })
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
            this.dispatch('serviceOrders/fetchTaskItemsAndUsers', task)
        else
            this.dispatch('serviceOrders/updateSelectedTask', task)
        context.commit('updateShowTaskDialog', true)
    },
    updateSelectedOrderTask(context, payload) {
        context.commit('updateSelectedOrderTasks', payload)
    },
    updateSelectedTask(context, payload) {
        context.commit('updateSelectedTask', payload)
    },
    closeTaskModal(context) {
        context.commit('updateSelectedTask', { name: '', items: [], users: [] })
        context.commit('updateShowTaskDialog', false)
    },
    saveTask(context) {
        if (context.state.selectedTask.id)
            db.collection("serviceOrder")
                .doc(context.state.selected[0].id)
                .collection("tasks").doc(context.state.selectedTask.id)
                .update({
                    name: context.state.selectedTask.name,
                    end_date: context.state.selectedTask.end_date,
                    status: context.state.selectedTask.status
                })
                .then(() => {
                    this.dispatch('serviceOrders/saveTaskUsers')
                        .then(() => { this.dispatch('serviceOrders/fetchTaskItemsAndUsers') })
                })
                .catch(error => {
                    console.error("Error updating document: ", error);
                });
        else
            db.collection("serviceOrder")
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
                    this.dispatch('serviceOrders/updateSelectedTask', added)
                        .then(() => {
                            this.dispatch('serviceOrders/saveTaskUsers')
                                .then(() => {
                                    this.dispatch('serviceOrders/saveTaskItem')
                                        .then(() => {
                                            this.dispatch('serviceOrders/fetchTaskItemsAndUsers')
                                        });
                                });
                        })
                })
                .catch(error => {
                    console.error("Error updating document: ", error);
                });
    },
    saveTaskUsers(context) {
        db.collection("serviceOrder")
            .doc(context.state.selected[0].id)
            .collection("tasks").doc(context.state.selectedTask.id)
            .collection("users")
            .get().then(snapshot => {
                snapshot.forEach((item) => {
                    db.collection("serviceOrder")
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
                    db.collection("serviceOrder")
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
            .then(() => { this.dispatch('serviceOrders/fetchTaskItemsAndUsers') })
            .catch(error => {
                console.error("Error updating document: ", error);
            });
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
            this.dispatch('serviceOrders/saveTask')
        }

    },
    saveTaskItem(context) {
        this.dispatch('serviceOrders/saveTaskBeforeSavingTaskItem').then(() => {
            if (context.state.selectedTaskItem.id)
                db.collection("serviceOrder")
                    .doc(context.state.selected[0].id)
                    .collection("tasks")
                    .doc(context.state.selectedTask.id)
                    .collection("items")
                    .doc(context.state.selectedTaskItem.id)
                    .update({
                        description: context.state.selectedTaskItem.description
                    })
                    .then(() => {
                        this.dispatch('serviceOrders/closeEditTaskItemModal')
                    })
                    .catch(error => {
                        console.error("Error updating document: ", error);
                    });
            else
                db.collection("serviceOrder")
                    .doc(context.state.selected[0].id)
                    .collection("tasks")
                    .doc(context.state.selectedTask.id)
                    .collection("items")
                    .add({
                        description: context.state.selectedTaskItem.description,
                        done: false
                    })
                    .then(() => {
                        this.dispatch('serviceOrders/fetchTaskItemsAndUsers')
                            .then(() => { this.dispatch('serviceOrders/closeEditTaskItemModal') })
                    })
                    .catch(error => {
                        console.error("Error updating document: ", error);
                    });
        })
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
};

const getters = {};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}