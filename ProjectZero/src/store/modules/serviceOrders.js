import { db, fileStorage, moment } from "@/main"
import router from '@/router'
import catchError from '@/utilities/firebaseErrors'
import uuidv4 from '@/utilities/uidGenerator'

const state = () => ({
    client: undefined,
    selected: '',
    search: '',
    statusList: ['Pendente', 'Em progresso', 'Finalizada', 'Cancelada'],
    serviceOrders: [],
    selectedOrderTasks: [],
    kanbanColumns: [],
    selectedTask: { name: '' },
    showTaskDialog: false,
    taskDialogInEditMode: false,
    showCreateOrderDialog: false,
    newOrder: { name: '', creation_date: new Date().toLocaleString('pt-br'), start_date: '', end_date: '', users: [], userGroups: [], status: 'Pendente' },
    taskPriorityList: ['', 'Baixa', 'Média', 'Alta', 'Crítica']
})

const mutations = {
    updateShowCreateOrderDialog(state, payload) {
        state.showCreateOrderDialog = payload
    },
    selectOrder(state, payload) {
        state.selected = payload
        if (payload)
            state.client = payload.client
    },
    searchFor(state, payload) {
        state.search = payload
    },
    updateOrders(state, payload) {
        state.serviceOrders = payload
    },
    updateClient(state, payload) {
        state.client = payload
        state.selected.client = payload
    },
    updateStatus(state, payload) {
        state.selected.status = payload
    },
    updateOrderStartDate(state, payload) {
        state.selected.start_date = payload
    },
    updateOrderStartDateTime(state, payload) {
        state.selected.start_date_time = payload
    },
    updateOrderEndDate(state, payload) {
        state.selected.end_date = payload
    },
    updateOrderEndDateTime(state, payload) {
        state.selected.end_date_time = payload
    },
    updateNewOrder(state, payload) {
        state.newOrder = payload
    },
    updateNewOrderStartDate(state, payload) {
        state.newOrder.start_date = payload
    },
    updateNewOrderEndDate(state, payload) {
        state.newOrder.end_date = payload
    },
    updateSelectedOrderTasks(state, payload) {
        state.selectedOrderTasks = payload
        state.selected.tasks = payload
    },
    updateShowTaskDialog(state, payload) {
        state.showTaskDialog = payload
    },
    updateKanbanColumns(state) {
        state.kanbanColumns = state.statusList.map(status => ({
            title: status,
            tasks: state.selectedOrderTasks?.sort((a, b) => comparePriorities(a, b)).filter(task => task.status == status) || []
        }))
    },
    updateSelectedTask(state, payload) {
        if(payload.comments)
            payload.comments = payload.comments.sort((a, b) => b.creation_date - a.creation_date);
        state.selectedTask = payload
    },
    updateTaskDialogInEditMode(state, payload) {
        state.taskDialogInEditMode = payload
    }
}

function comparePriorities(a, b) {
    let priorityLevel = [
        { name: '', value: 0 },
        { name: 'Baixa', value: 1 },
        { name: 'Média', value: 2 },
        { name: 'Alta', value: 3 },
        { name: 'Crítica', value: 4 },
    ]
    let priorityA = priorityLevel.find(p => p.name == (a.priority || '')).value
    let priorityB = priorityLevel.find(p => p.name == (b.priority || '')).value

    return priorityB - priorityA
}

function onServiceOrdersLoaded(context, payload) {
    let serviceOrders = []
    payload.forEach(orderSnapShot => {
        let orderData = orderSnapShot.data()

        if (context.rootState.auth.userGroup == 'bmyiE5pvx66Ct7Wmj78b' || orderData.administrator?.email == context.rootState.auth.user.email ||
            orderData.users.some(u => u.email == context.rootState.auth.user.email)) {
            orderData.id = orderSnapShot.id
            orderData.dateForSorting = orderData.creation_date
            orderData.creation_date = moment.unix(orderData.creation_date).format('DD/MM/YYYY')
            if (orderData.start_date){
                orderData.start_date_time = moment.unix(orderData.start_date).format('DD/MM/YYYY, HH:mm:ss')
                orderData.start_date = moment.unix(orderData.start_date).format('DD/MM/YYYY')
            }
            if (orderData.end_date){
                orderData.end_date_time = moment.unix(orderData.end_date).format('DD/MM/YYYY, HH:mm:ss')
                orderData.end_date = moment.unix(orderData.end_date).format('DD/MM/YYYY')
            }
            serviceOrders.push(orderData)
        }
    })

    serviceOrders = serviceOrders.sort((a, b) => b.dateForSorting - a.dateForSorting)

    return new Promise(function (resolve, reject) {
        if (!serviceOrders)
            reject(serviceOrders)
        else
            resolve(serviceOrders)
    })
}

function getOrderUsersIds(serviceOrders) {
    let userIds = []
    serviceOrders.forEach(order => {
        userIds.push(order.administrator)
        userIds = userIds.concat(order.users)
        userIds = userIds.unique()
    })
    return userIds
}

function completeOrdersWithUsersInformation(serviceOrders, users) {
    serviceOrders.forEach(order => {
        order.administratorName = users.filter(u => u.id == order.administrator)[0]?.name
        order.usersList = order?.users?.map(u => ({
            id: u,
            name: u.name
        })) || []
    })
}

function getOrderFromDatabase(serviceOrderId) {
    return db.collection("serviceOrder")
        .doc(serviceOrderId)
}

function uploadTaskFiles(context, order, resolve) {
    if (!context.state.selectedTask.files?.length)
        return resolve({ order })
    let taskId = context.state.selectedTask.id
    let files = context.state.selectedTask.files.filter(m => m.newFile)
    let promises = []
    files.forEach(file => {
        let promise = fileStorage.ref(`orders/${order.id}/${taskId}/${file.name}`).put(file.file)
        promise = promise.then(getFileDownloadUrl)
        promises.push(promise)
    })
    return Promise.all(promises).then(files => {
        resolve({ order, files })
    })
}

function getFileDownloadUrl(file) {
    return new Promise(resolve => {
        fileStorage.ref(file.metadata.fullPath)
            .getDownloadURL()
            .then(url => {
                file.url = url
                resolve(file)
            })
    })
}

function updateTaskFilesReference(files, context) {
    if (!files || !files.length)
        return
    context.state.selectedTask.files = context.state.selectedTask.files.filter(m => !m.newFile)
    files.forEach(newFile => {
        /* eslint-disable */
        var regex = new RegExp(/[^\/]+.[\w]*$/)
        context.state.selectedTask.files.push({
            bucket: newFile.metadata.bucket,
            fullPath: newFile.metadata.fullPath,
            size: newFile.metadata.size,
            name: regex.exec(newFile.metadata.fullPath)[0],
            url: newFile.url,
            lastModified: moment(newFile.metadata.updated).format('DD/MM/YYYY HH:mm:ss')
        })
    })
}

function saveCurrentSelectedTask(order, context, resolve) {
    let orderData = order.data()
    context.state.selectedTask.priority = context.state.selectedTask.priority || ''
    context.state.selectedTask.tags = context.state.selectedTask.tags || []
    var index = orderData.tasks.indexOf(orderData.tasks.find(t => t.id == context.state.selectedTask.id))
    orderData.tasks[index] = context.state.selectedTask
    let tags = (orderData.tags || []).concat(context.state.selectedTask.tags || [])
    tags = tags.unique((a, b) => a.color == b.color)
    context.state.selected.tags = tags

    getOrderFromDatabase(context.state.selected.id)
        .update({ tasks: orderData.tasks, tags: tags }).then(() => {
            context.dispatch('loadTasksByOrder')
            resolve()
        })
}



function addNewTaskToOrder(context, order, resolve) {
    context.state.selectedTask.status = "Pendente"
    if (!context.state.selectedTask.priority)
        context.state.selectedTask.priority = ''

    let orderData = order.data()

    context.state.selectedTask.id = uuidv4()
    let newTask = Object.assign({}, context.state.selectedTask, { files: [] })
    let user = context.rootGetters['users/getUserByEmail'](context.rootState.auth.user.email)
    newTask.created_by = user[0]
    context.state.selectedTask.created_by = user[0]
    orderData.tasks.push(newTask);

    getOrderFromDatabase(context.state.selected.id)
        .update({ tasks: orderData.tasks })
        .then(() => {
            context.dispatch('loadTasksByOrder').then(() => getOrderFromDatabase(order.id).get().then(order => resolve(order)))
        })
}

function loadTasksByOrder(context, filterCurrentUser, resolve) {
    if (!context.state.selected) {
        getOrderFromDatabase(window.location.href.split('/')[4]).get()
            .then(snapshot => {
                let order = snapshot.data()
                order.id = window.location.href.split('/')[4]
                context.commit('selectOrder', order)
                let selectedOrderTasks = snapshot.data()
                    .tasks
                    .filter(task => !filterCurrentUser || (task.users && task.users.email == context.rootState.auth.user.email))
                
                selectedOrderTasks.forEach(task => { if(!task.comments) task.comments = []; });
                context.dispatch('updateSelectedOrderTask', selectedOrderTasks)
                    .then(() => {
                        context.commit('updateKanbanColumns')
                        resolve()
                    })
            })
    }
    else {
        getOrderFromDatabase(context.state.selected.id).get()
            .then(snapshot => {
                let selectedOrderTasks = snapshot.data()
                    .tasks
                    .filter(task => !filterCurrentUser || (task.users && task.users.email == context.rootState.auth.user.email))
                context.dispatch('updateSelectedOrderTask', selectedOrderTasks)
                    .then(() => {
                        context.commit('updateKanbanColumns')
                        resolve()
                    })
            })
    }
}

function formatDate(date) {
    if (!date) return null

    const [year, month, day] = date.split("-")
    return `${day}/${month}/${year}`
}

Array.prototype.unique = function (compare) {
    var a = this.concat()
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (!compare && a[i] === a[j] || compare && compare(a[i], a[j]))
                a.splice(j--, 1)
        }
    }
    return a
}

const actions = {
    editServiceOrder(context) {
        if (context.state.selected)
            router.push({ path: `/EditServiceOrder/${context.state.selected.id}` })
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
        context.commit('updateNewOrder', { name: '', creation_date: new Date().toLocaleString('pt-br'), start_date: '', end_date: '', users: [], userGroups: [], status: 'Pendente' })
    },
    saveNewOrder(context) {
        let tasks = []
        if (context.state.newOrder.template) {
            tasks = context.state.newOrder.template.tasks.map((obj) => { return Object.assign({}, obj, { creation_date: formatDate(new Date().toLocaleString('pt-br').substr(0, 10)) }) }) || []
        }
        db.collection("serviceOrder").add({
            name: context.state.newOrder.name,
            status: context.state.newOrder.status || 'Pendente',
            client: context.state.newOrder.client || '',
            creation_date: moment(context.state.newOrder.creation_date, "DD/MM/YYYY").unix(),
            end_date: context.state.newOrder.end_date ? moment(context.state.newOrder.end_date, "DD/MM/YYYY").unix() : '',
            start_date: context.state.newOrder.start_date ? moment(context.state.newOrder.start_date, "DD/MM/YYYY").unix() : '',
            administrator: context.state.newOrder.administrator || '',
            users: context.state.newOrder.users.map((obj) => { return Object.assign({}, obj) }) || [],
            userGroups: context.state.newOrder.userGroups.map((obj) => { return Object.assign({}, obj) }) || [],
            tasks: tasks
        })
            .then(() => {
                this.dispatch('notifications/sendNotification', {
                    name: "Sistema",
                    title: "Nova ordem de serviço",
                    detail: "Uma nova ordem de serviço, na qual você está vinculado, foi criada!  <br>Nome da ordem: <b>" + context.state.newOrder.name + "</b>",
                    date: new Date().toLocaleString('pt-br'),
                    user: context.state.newOrder.users.map((obj) => { return Object.assign({}, obj) }) || [],
                    userIds: context.state.newOrder.users.map(k => { return k.id}) || [],
                    groupIds: context.state.newOrder.userGroups.map(k => { return k.id}) || [],
                    group: context.state.newOrder.userGroups.map((obj) => { return Object.assign({}, obj) }) || [],
                    read: []
                })
                this.dispatch('serviceOrders/reloadOrders').then(() => { 
                context.commit('updateNewOrder', { name: '', creation_date: new Date().toLocaleString('pt-br'), start_date: '', end_date: '', users: [], userGroups: [], status: 'Pendente' })
                context.commit('updateShowCreateOrderDialog', false) })
            })
    },
    selectOrder(context, payload) {
        context.commit('selectOrder', payload)
        this.dispatch('serviceOrders/editServiceOrder')
    },
    searchFor(context, payload) {
        context.commit('searchFor', payload)
    },
    reloadOrders(context, payload) {
        let self = this
        if (payload !== true){
        context.commit('selectOrder', '')
        this.dispatch('general/resetAllMessages', '')
        }
        this.dispatch('general/setIsLoading').then(() => {
            db.collection("serviceOrder")
                .get()
                .then((orders) => {
                    onServiceOrdersLoaded(context, orders)
                        .then((serviceOrders) => {
                            self.dispatch('users/readUsers').then(function () {
                                let userIds = getOrderUsersIds(serviceOrders)
                                let users = context.rootGetters['users/filterUsersById'](userIds)
                                completeOrdersWithUsersInformation(serviceOrders, users)
                                context.commit('updateOrders', serviceOrders)
                                self.dispatch('general/resetIsLoading')
                            })
                        })
                })
        })
    },
    loadTasksByOrder(context, payload) {
        if (payload && payload.skipLoading) {
            return new Promise(resolve => loadTasksByOrder(context, payload.filterCurrentUser, resolve))
        }

        this.dispatch('general/resetAllMessages', '')
        this.dispatch('general/setIsLoading').then(() => {
            let promise = new Promise(resolve => loadTasksByOrder(context, payload?.filterCurrentUser, resolve))
            promise.then(() => this.dispatch('general/resetIsLoading'))
            return promise
        })
    },
    updateClient(context, payload) {
        context.commit("updateClient", payload)
    },
    updateStatus(context, payload) {
        context.commit("updateStatus", payload)
        if (payload == "Em progresso") {
            context.commit('updateOrderStartDate', moment().unix())
            context.commit('updateOrderStartDateTime', moment().format('DD/MM/YYYY, HH:mm:ss'))
            this.dispatch('serviceOrders/initiateOrder')
        } 
        else if (payload == "Finalizada"){
            context.commit('updateOrderEndDate', moment().unix())
            context.commit('updateOrderEndDateTime', moment().format('DD/MM/YYYY, HH:mm:ss'))
            this.dispatch('serviceOrders/finalizeOrder', true)
        }
        else {
            context.commit('updateOrderEndDate', moment().unix())
            context.commit('updateOrderEndDateTime', moment().format('DD/MM/YYYY, HH:mm:ss'))
            this.dispatch('serviceOrders/finalizeOrder')
        }
        
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
        this.dispatch('serviceOrders/loadTasksByOrder', { skipLoading: true })
        context.commit('updateTaskDialogInEditMode', false)
        context.commit('updateShowTaskDialog', false)
    },
    saveTask(context) {
        if (context.state.selectedTask.id)
            getOrderFromDatabase(context.state.selected.id).get()
                .then(order => {
                    return new Promise(resolve => uploadTaskFiles(context, order, resolve))
                })
                .then(({ order, files }) => {
                    updateTaskFilesReference(files, context);
                    return new Promise((resolve) => saveCurrentSelectedTask(order, context, resolve))
                })
                .then(() => {
                    this.dispatch('serviceOrders/closeTaskModal')
                })
                .catch(error => {
                    let errorMessage = catchError(error)
                    this.dispatch('general/setErrorMessage', errorMessage)
                })
        else
            getOrderFromDatabase(context.state.selected.id).get()
                .then((order) => {
                    return new Promise(resolve => addNewTaskToOrder(context, order, resolve))
                })
                .then(order => {
                    return new Promise(resolve => uploadTaskFiles(context, order, resolve))
                })
                .then(({ order, files }) => {
                    updateTaskFilesReference(files, context)
                    return new Promise((resolve) => saveCurrentSelectedTask(order, context, resolve))
                })
                .then(() => {
                    this.dispatch('serviceOrders/closeTaskModal')
                })
                .catch(error => {
                    let errorMessage = catchError(error)
                    this.dispatch('general/setErrorMessage', errorMessage)
                })

        if (context.state.selectedTask.users && context.state.selectedTask.users.email && context.state.selectedTask.users.email != context.rootState.auth.user.email) {
            this.dispatch('notifications/sendNotification', {
                name: "Sistema",
                title: "Alteração em tarefa",
                detail: "Houve uma alteração em uma de suas tarefas ou você foi vinculado a uma tarefa nova. Confira:" + " <br><br><a href='" + window.location.href + "'>Link para ordem</a><br>Nome da tarefa: <b>" + context.state.selectedTask.name + "</b> <br>Nome da ordem: <b>" + context.state.selected.name + "</b>",
                date: new Date().toLocaleString('pt-br'),
                user: [context.state.selectedTask.users],
                userIds: [context.state.selectedTask.users.id],
                groupIds: [],
                group: [],
                read: []
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

                        if (context.state.selectedTask.users && context.state.selectedTask.users.email && context.state.selectedTask.users.email != context.rootState.auth.user.email) {
                            this.dispatch('notifications/sendNotification', {
                                name: "Sistema",
                                title: "Alteração de status de tarefa",
                                detail: "Uma tarefa que você é responsável teve seu status alterado. <br><br>Nome da tarefa: <b>" + context.state.selectedTask.name + "</b> <br>Nome da ordem: <b>" + context.state.selected.name + "</b>",
                                date: new Date().toLocaleString('pt-br'),
                                user: [context.state.selectedTask.users],
                                userIds: [context.state.selectedTask.users.id],
                                groupIds: [],
                                group: [],
                                read: []
                            })
                        }
                    }
                })
            })
            this.dispatch('serviceOrders/saveTask')
        }

    },
    saveServiceOrder(context) {
        let serviceOrder = context.state.selected
        if (!serviceOrder)
            return
            
        db.collection("serviceOrder")
            .doc(serviceOrder.id)
            .update({
                name: serviceOrder.name,
                client: serviceOrder.client || '',
                creation_date: moment(serviceOrder.creation_date, "DD/MM/YYYY").unix(),
                end_date: serviceOrder.end_date ? moment(serviceOrder.end_date, "DD/MM/YYYY").unix() : '',
                start_date: serviceOrder.start_date ? moment(serviceOrder.start_date, "DD/MM/YYYY").unix() : '',
                users: serviceOrder.users || [],
                administrator: serviceOrder.administrator || '',
                groups: serviceOrder.groups || [],
                status: serviceOrder.status || 'Pendente'
            })
            .then(() => {
                this.dispatch('general/setSuccessMessage', 'Ordem de serviço salva com sucesso.')
            })
            .catch(error => {
                let errorMessage = catchError(error)
                this.dispatch('general/setErrorMessage', errorMessage)
            })
    },
    initiateOrder(context) {
        let serviceOrder = context.state.selected
        if (!serviceOrder)
            return
        db.collection("serviceOrder")
            .doc(serviceOrder.id)
            .update({
                start_date: serviceOrder.start_date,
                status: serviceOrder.status
            })
            .then(() => {
                this.dispatch('general/setSuccessMessage', 'A ordem de serviço foi inicializada com sucesso.')
            })
            .catch(error => {
                let errorMessage = catchError(error)
                this.dispatch('general/setErrorMessage', errorMessage)
            })
    },
    finalizeOrder(context, payload) {
        let serviceOrder = context.state.selected
        if (!serviceOrder)
            return
        db.collection("serviceOrder")
            .doc(serviceOrder.id)
            .update({
                end_date: serviceOrder.end_date,
                status: serviceOrder.status
            })
            .then(() => {
                if (payload === true) {
                this.dispatch('general/setSuccessMessage', 'A ordem de serviço foi finalizada com sucesso.')
                }
                else {
                    this.dispatch('general/setSuccessMessage', 'A ordem de serviço foi cancelada com sucesso.')
                }
                
            })
            .catch(error => {
                let errorMessage = catchError(error)
                this.dispatch('general/setErrorMessage', errorMessage)
            })
    },
    setOrUnsetEditMode(context) {
        context.commit('updateTaskDialogInEditMode', !context.state.taskDialogInEditMode)
    },
    deleteOrder(context) {
        db.collection("serviceOrder").doc(context.state.selected.id)
            .delete()
            .then(() => {
                this.dispatch('serviceOrders/reloadOrders')
                    .then(() => { router.push({ path: "/serviceOrder" }) })
            })
    },
    saveComment(context, payload){
        context.state.selectedTask.comments = context.state.selectedTask.comments || [];
        let user = context.rootGetters['users/getUserByEmail'](context.rootState.auth.user.email)
        
        context.state.selectedTask.comments.push({
            text: payload,
            creation_date: moment().unix(),
            created_by: user[0]
        })

        context.state.selectedTask.comments = context.state.selectedTask.comments.sort((a, b) => b.creation_date - a.creation_date);
        var index = context.state.selectedOrderTasks.indexOf(context.state.selectedOrderTasks.find(t => t.id == context.state.selectedTask.id))
        context.state.selectedOrderTasks[index] = context.state.selectedTask

        getOrderFromDatabase(context.state.selected.id)
            .update({ tasks: context.state.selectedOrderTasks })
    }
}

const getters = {
    getAllTasksByOrderBut(state) {
        return (filters) => {
            let selectedOrder = state.serviceOrders
                .reduce((a, b) => b.id == filters.orderId ? b : a, undefined)
            if (!selectedOrder)
                return []
            let filteredTasks = selectedOrder.tasks?.filter(m => m.id != filters.taskId)
            return filteredTasks || []
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

