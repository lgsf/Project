import { db, fileStorage, moment } from "@/main";
import router from '@/router'

const state = () => ({
    client: undefined,
    selected: '',
    search: '',
    serviceOrders: [],
    statusList: ['Pendente', 'Em progresso', 'Finalizada', 'Cancelada'],
    selectedOrderTasks: [],
    kanbanColumns: [],
    selectedTask: { name: '' },
    showTaskDialog: false,
    taskDialogInEditMode: false,
    showCreateOrderDialog: false,
    newOrder: { name: '', creation_date: new Date().toLocaleString('pt-br'), start_date: '', end_date: '', users: [], userGroups: [] },
    taskPriorityList: ['', 'Baixa', 'Media', 'Alta', 'Critica']
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
        state.selected.client = payload;
    },
    updateOrderStartDate(state, payload) {
        state.selected.start_date = payload;
    },
    updateOrderEndDate(state, payload) {
        state.selected.end_date = payload;
    },
    updateNewOrderStartDate(state, payload) {
        state.newOrder.start_date = payload;
    },
    updateNewOrderEndDate(state, payload) {
        state.newOrder.end_date = payload;
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
            tasks: state.selectedOrderTasks?.sort((a, b) => comparePriorities(a, b)).filter(task => task.status == status) || []
        }));
    },
    updateSelectedTask(state, payload) {
        state.selectedTask = payload
    },
    updateTaskDialogInEditMode(state, payload) {
        state.taskDialogInEditMode = payload
    }
};

function comparePriorities(a, b) {
    let priorityLevel = [
        { name: '', value: 0 },
        { name: 'Baixa', value: 1 },
        { name: 'Media', value: 2 },
        { name: 'Alta', value: 3 },
        { name: 'Critica', value: 4 },
    ]
    let priorityA = priorityLevel.find(p => p.name == (a.priority || '')).value
    let priorityB = priorityLevel.find(p => p.name == (b.priority || '')).value

    return priorityB - priorityA
}

function onServiceOrdersLoaded(payload) {
    let serviceOrders = [];
    payload.forEach(orderSnapShot => {
        let orderData = orderSnapShot.data();
        orderData.id = orderSnapShot.id;
        orderData.dateForSorting = orderData.creation_date;
        orderData.creation_date = moment.unix(orderData.creation_date).format('DD/MM/YYYY');
        if (orderData.start_date)
            orderData.start_date = moment.unix(orderData.start_date).format('DD/MM/YYYY');
        if (orderData.end_date)
            orderData.end_date = moment.unix(orderData.end_date).format('DD/MM/YYYY');
        serviceOrders.push(orderData);
    });

    serviceOrders = serviceOrders.sort((a, b) => b.dateForSorting - a.dateForSorting)

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

function uploadTaskFiles(context, order, resolve) {
    if (!context.state.selectedTask.files?.length)
        return resolve({order});
    let files = context.state.selectedTask.files.filter(m => m.newFile);
    let promises = [];
    files.forEach(file => {
        promises.push(fileStorage.ref(`orders/${order.id}/${file.name}`).put(file.file));
    });
    return Promise.all(promises).then(files => {
        resolve({ order, files });
    });
}

function updateTaskFilesReference(files, context) {
    if (!files || !files.length)
        return;
    context.state.selectedTask.files = context.state.selectedTask.files.filter(m => !m.newFile);
    files.forEach(newFile => {
        /* eslint-disable */
        var regex = new RegExp(/[^\/]+.[\w]*$/);
        context.state.selectedTask.files.push({
            bucket: newFile.metadata.bucket,
            fullPath: newFile.metadata.fullPath,
            size: newFile.metadata.size,
            name: regex.exec(newFile.metadata.fullPath)[0],
            lastModified: moment(newFile.metadata.updated).format('DD/MM/YYYY HH:mm:ss')
        });
    });
}

function saveCurrentSelectedTask(order, context, resolve) {
    let orderData = order.data();
    if (!context.state.selectedTask.priority)
        context.state.selectedTask.priority = '';
    var index = orderData.tasks.indexOf(orderData.tasks.find(t => t.id == context.state.selectedTask.id));
    orderData.tasks[index] = context.state.selectedTask;

    getOrderFromDatabase(context.state.selected.id).update({ tasks: orderData.tasks }).then(() => {
        context.dispatch('loadTasksByOrder');
        resolve();
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
    editServiceOrder(context) {
        if (context.state.selected)
            router.push({ path: `/EditServiceOrder/${context.state.selected.id}` });
        else
            context.commit('updateShowCreateOrderDialog', true)
    },
    returnToServiceOrders(context) {
        context.commit('selectOrder', false)
        router.push({ path: `/serviceOrder` })
    },
    openCreateOrderModal(context) {
        context.commit('updateShowCreateOrderDialog', true)
    },
    closeCreateOrderModal(context) {
        context.commit('updateShowCreateOrderDialog', false)
    },
    saveNewOrder(context) {
        let tasks = []
        if (context.state.newOrder.template) {
            tasks = context.state.newOrder.template.tasks.map((obj) => { return Object.assign({}, obj, { creation_date: formatDate(new Date().toLocaleString('pt-br').substr(0, 10)) }) }) || []
        }

        db.collection("serviceOrder").add({
            name: context.state.newOrder.name,
            client: context.state.newOrder.client,
            creation_date: moment(context.state.newOrder.creation_date, "DD/MM/YYYY").unix(),
            end_date: context.state.newOrder.end_date ? moment(context.state.newOrder.end_date, "DD/MM/YYYY").unix() : '',
            start_date: context.state.newOrder.start_date ? moment(context.state.newOrder.start_date, "DD/MM/YYYY").unix() : '',
            administrator: context.state.newOrder.administrator || '',
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
        this.dispatch('serviceOrders/editServiceOrder')
    },
    searchFor(context, payload) {
        context.commit('searchFor', payload)
    },
    reloadOrders(context) {
        let self = this;
        context.commit('selectOrder', '')
        db.collection("serviceOrder")
            .get()
            .then(onServiceOrdersLoaded)
            .then(function (serviceOrders) {
                self.dispatch('users/readUsers').then(function () {
                    let userIds = getOrderUsersIds(serviceOrders);
                    let users = context.rootGetters['users/filterUsersById'](userIds)
                    completeOrdersWithUsersInformation(serviceOrders, users)
                    context.commit('updateOrders', serviceOrders)
                })
            })
    },
    loadTasksByOrder(context, filterCurrentUser) {
        if (!context.state.selected) {
            getOrderFromDatabase(window.location.href.split('/')[4]).get()
                .then(snapshot => {
                    let order = snapshot.data()
                    order.id = window.location.href.split('/')[4]
                    context.commit('selectOrder', [order])
                    this.dispatch('serviceOrders/updateSelectedOrderTask',
                        snapshot.data().tasks.filter(task => !filterCurrentUser || (task.users && task.users.email == context.rootState.auth.user.email))).then(() => {
                            context.commit('updateKanbanColumns')
                        });
                })
        }
        else {
            getOrderFromDatabase(context.state.selected.id).get()
                .then(snapshot => {
                    this.dispatch('serviceOrders/updateSelectedOrderTask',
                        snapshot.data().tasks.filter(task => !filterCurrentUser || (task.users && task.users.email == context.rootState.auth.user.email))).then(() => {
                            context.commit('updateKanbanColumns')
                        });
                });
        }
    },
    updateClient(context, payload) {
        context.commit("updateClient", payload)
    },
    updateOrderStartDate(context, payload) {
        context.commit('updateOrderStartDate', payload)
    },
    updateOrderEndDate(context, payload) {
        context.commit('updateOrderEndDate', payload)
    },
    updateNewOrderStartDate(context, payload) {
        context.commit('updateNewOrderStartDate', payload)
    },
    updateNewOrderEndDate(context, payload) {
        context.commit('updateNewOrderEndDate', payload)
    },
    showTaskDialog(context, payload) {
        if (!payload.id) {
            payload.items = []
            payload.users = []
            payload.creation_date = new Date().toLocaleString('pt-br')
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
        context.commit('updateTaskDialogInEditMode', false)
        context.commit('updateShowTaskDialog', false)
    },
    saveTask(context) {
        if (context.state.selectedTask.id)
            getOrderFromDatabase(context.state.selected.id).get()
                .then(order => {
                    return new Promise(resolve => uploadTaskFiles(context, order, resolve));
                })
                .then(({ order, files }) => {
                    updateTaskFilesReference(files, context);
                    
                    return new Promise((resolve) => saveCurrentSelectedTask(order, context, resolve));
                })
                .then(() => {
                    this.dispatch('serviceOrders/closeTaskModal')
                })
                .catch(error => {
                    console.error("Error updating document: ", error);
                });
        else
            getOrderFromDatabase(context.state.selected.id).get()
                .then((order) => {
                    context.state.selectedTask.status = "Pendente";
                    if (!context.state.selectedTask.priority)
                        context.state.selectedTask.priority = ''

                    let orderData = order.data()

                    context.state.selectedTask.id = orderData.tasks.length + 1;
                    orderData.tasks.push(context.state.selectedTask)

                    getOrderFromDatabase(context.state.selected.id)
                        .update({ tasks: orderData.tasks })
                        .then(() => {
                            this.dispatch('serviceOrders/loadTasksByOrder')
                        });
                })
                .then(() => {
                    this.dispatch('serviceOrders/closeTaskModal')
                })
                .catch(error => {
                    console.error("Error updating document: ", error);
                });

        if (context.state.selectedTask.users && !context.state.selectedTask.users.length && context.state.selectedTask.users.email != context.rootState.auth.user.email) {
            this.dispatch('notifications/sendNotification', {
                name: "Sistema",
                title: "Alteração em tarefa",
                detail: "Houve uma alteração em uma de suas tarefas ou você foi vinculado a uma tarefa nova. Confira:" + " <br><br><a href='" + window.location.href + "'>Link para ordem</a><br>Nome da tarefa: <b>" + context.state.selectedTask.name + "</b> <br>Nome da ordem: <b>" + context.state.selected.name + "</b>",
                date: new Date().toLocaleString('pt-br'),
                user: [context.state.selectedTask.users],
                group: [],
                read: false
            })
        }

        context.commit('updateTaskDialogInEditMode', false)
    },
    deleteTask(context) {
        if (context.state.selectedTask.id) {
            getOrderFromDatabase(context.state.selected.id).get()
                .then((order) => {
                    let orderData = order.data()

                    orderData.tasks = orderData.tasks.filter(t => t.id != context.state.selectedTask.id)
                    getOrderFromDatabase(context.state.selected.id).update({ tasks: orderData.tasks }).then(() => {
                        this.dispatch('serviceOrders/loadTasksByOrder').then(() => {
                            this.dispatch('serviceOrders/closeTaskModal')
                        })
                    })
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

                        if (column.title == "Finalizada") {
                            context.state.selectedTask.end_date = new Date().toLocaleString('pt-br')
                        }
                        else {
                            if (column.title == "Em progresso") {
                                context.state.selectedTask.started_date = new Date().toLocaleString('pt-br')
                            }
                            else {
                                context.state.selectedTask.started_date = ''
                            }
                            context.state.selectedTask.end_date = ''
                        }

                        if (context.state.selectedTask.users && !context.state.selectedTask.users.length && context.state.selectedTask.users.email != context.rootState.auth.user.email) {
                            this.dispatch('notifications/sendNotification', {
                                name: "Sistema",
                                title: "Alteração de status de tarefa",
                                detail: "Uma tarefa que você é responsável teve seu status alterado. <br><br>Nome da tarefa: <b>" + context.state.selectedTask.name + "</b> <br>Nome da ordem: <b>" + context.state.selected.name + "</b>",
                                date: new Date().toLocaleString('pt-br'),
                                user: [context.state.selectedTask.users],
                                group: [],
                                read: false
                            })
                        }
                    }
                });
            });
            this.dispatch('serviceOrders/saveTask')
        }

    },
    saveServiceOrder(context) {
        let serviceOrder = context.state.selected
        if (!serviceOrder)
            return;
        db.collection("serviceOrder")
            .doc(serviceOrder.id)
            .update({
                name: serviceOrder.name,
                client: serviceOrder.client || '',
                creation_date: moment(serviceOrder.creation_date, "DD/MM/YYYY").unix(),
                end_date: serviceOrder.end_date ? moment(serviceOrder.end_date, "DD/MM/YYYY").unix() : '',
                start_date: serviceOrder.start_date ? moment(serviceOrder.start_date, "DD/MM/YYYY").unix() : ''
            })
            .then(() => {
                this.dispatch('general/setSuccessMessage', 'Ordem de serviço salva com sucesso.');
            })
            .catch(error => {
                console.error("Error updating document: ", error);
            });
    },
    setOrUnsetEditMode(context) {
        context.commit('updateTaskDialogInEditMode', !context.state.taskDialogInEditMode)
    },
    deleteOrder(context) {
        db.collection("serviceOrder").doc(context.state.selected.id)
            .delete()
            .then(() => {
                this.dispatch('serviceOrders/reloadOrders')
                    .then(() => { router.push({ path: "/serviceOrder" }); })
            })
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

