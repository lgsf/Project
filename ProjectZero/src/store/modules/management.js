import { db } from "@/main";

const state = () => ({
    serviceOrders: [],
    statusList: ['Pendente', 'Em progresso', 'Finalizada'],
    selectedOrderTasks: [],
    kanbanColumns: [],
    taskPriorityList: ['', 'Baixa', 'Média', 'Alta', 'Crítica']
})

const mutations = {
    updateOrders(state, payload) {
        state.serviceOrders = payload
    },
    updateKanbanColumns(state) {
        let taskList = []
        state.serviceOrders.forEach(so => {
            so.tasks.forEach(task => task.order = {name: so.name, id: so.id, end_date: so.end_date, administrator: so.administrator || ''})
            taskList = taskList.concat(so.tasks)
        })

        state.kanbanColumns = state.statusList.map(status => ({
            title: status == 'Pendente' ? 'Tarefas não iniciadas' : status == 'Em progresso' ? 'Tarefas em andamento' : 'Tarefas finalizadas',
            tasks: taskList.sort((a, b) => comparePriorities(a, b)).filter(task => task.status == status) || []
        }))
    }
}

function comparePriorities(a, b){
    let priorityLevel = [
        {name: '', value: 0},
        {name: 'Baixa', value: 1},
        {name: 'Média', value: 2},
        {name: 'Alta', value: 3},
        {name: 'Crítica', value: 4},
    ]
    let priorityA = priorityLevel.find(p => p.name == (a.priority || '')).value
    let priorityB = priorityLevel.find(p => p.name == (b.priority || '')).value
    
    return priorityB - priorityA
}

function onServiceOrdersLoaded(payload) {
    let serviceOrders = [];
    payload.forEach(orderSnapShot => {
        let orderData = orderSnapShot.data()
        orderData.id = orderSnapShot.id
        serviceOrders.push(orderData)
    })
    return new Promise(function (resolve, reject) {
        if (!serviceOrders)
            reject(serviceOrders)
        else
            resolve(serviceOrders)
    })
}

const actions = {
    loadKanban(context, payload){
        db.collection("serviceOrder")
            .get()
            .then(onServiceOrdersLoaded)
            .then((serviceOrders) => {context.commit('updateOrders', serviceOrders)})
            .then(() => {context.commit('updateKanbanColumns', payload)})
        
    }
}

const getters = {}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}