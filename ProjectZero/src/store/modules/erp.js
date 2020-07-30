
import { db } from "@/main"

const state = () => ({
    label: '',
    listTitle: "Ordem Erp",
    selected: {
        tasks:[]
    },
    search: '',
    searchLabel: 'Buscar',
    header: [
        {
            text: "Nome",
            align: "start",
            value: "name"
        },
        {
            text: "Número de Tarefas",
            align: "start",
            value: "tasks.length"
        },
        {
            text: "Usuário(s)",
            align: "start",
            value: "usersConcatenated"
        }
    ]
    ,
    erpOrders: [],
    editErp: false,
    editingName: '',
    editingAdmin: {},
    editingUser:[],
})

const mutations = {
    selectErpOrder(state, payload) {
        state.selected = payload
    },
    searchFor(state, payload) {
        state.search = payload
    },
    updateErpOrders(state, payload) {
        state.erpOrders = payload
    },
    editErpOrder(state, payload) {
        state.editingName = state.selected.name || ''
        state.editingUser = state.selected.users || []
        state.editingAdmin = state.selected.administrator || {}
        state.editErp = payload
    },
    editName(state, payload) {
        state.editingName = payload
    },
    editUser(state, payload) {
        state.editingUser = payload
    },
    editAdmin(state, payload) {
        state.editingAdmin = payload
    }
}

function createNewErp(state) {
    if (state.selected.tasks) {
        let newTaskList = []
        state.selected.tasks.forEach(task => {
            task.items.forEach(item => {
                item.description = item.name
            })
            newTaskList.push(task)
        })
        state.selected.tasks = newTaskList
    }

    return db.collection("erpOrder")
        .add({
            name: state.editingName || '',
            administrator: state.editingAdmin || '',
            users: state.editingUser?.map((obj) => { return Object.assign({}, obj) }) || [],
            tasks: state.selected.tasks?.map((obj) => { return Object.assign({}, obj) }) || []
        })
}


function updateExistingErp(state) {

    if (state.selected.tasks) {
        let newTaskList = []
        state.selected.tasks.forEach(task => {
            task.items.forEach(item => {
                item.description = item.name
            })
            newTaskList.push(task)
        })
        state.selected.tasks = newTaskList
    }

    return db.collection("erpOrder")
        .doc(state.selected.id)
        .set({
            name: state.editingName || '',
            administrator: state.editingAdmin || '',
            users: state.editingUser?.map((obj) => { return Object.assign({}, obj) }) || [],
            tasks: state.selected.tasks?.map((obj) => { return Object.assign({}, obj) }) || []
        })
}

const actions = {
    selectErpOrder({ commit }, payload) {
        var selected = payload
        commit('selectErpOrder', selected)
        commit('editErpOrder', true)
    },
    
    closeSelectedErpOrder({ commit }) {
        commit('selectErpOrder', {
            tasks:[]
        })
        commit('editErpOrder', false)
    },
    
    searchFor({ commit }, payload) {
        commit('searchFor', payload)
    },

    editName({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.')
        commit('editName', payload)
    },

    editUser({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.')
        commit('editUser', payload)
    },

    editAdmin({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.')
        commit('editAdmin', payload)
    },

    loadErpOrders(context) {
        this.dispatch('general/setIsLoading')
        this.dispatch('general/resetAllMessages', '')
        db.collection("erpOrder")
            .get()
            .then((snapshots) => {
                let erpOrders = []
                snapshots.forEach(erpSnapShot => {
                    let erpData = erpSnapShot.data()
                    erpData.id = erpSnapShot.id
                    erpData.usersConcatenated = erpData.users.map(u => u.name).join(', ')
                    erpOrders.push(erpData)
                })
                context.commit('updateErpOrders', erpOrders)
                this.dispatch('general/resetIsLoading')
            })
    },

    editErpOrder({ commit }, payload) {
        commit('editErpOrder', payload);
    },

    saveErpOrder({ commit, state }) {
        if (!state.selected.id)
            createNewErp(state).then(() => {
                commit("selectErpOrder", {})
                this.dispatch('erp/loadErpOrders')
                this.dispatch('erp/closeSelectedErpOrder')
            })
        else
            updateExistingErp(state).then(() => {
                commit("selectErpOrder", {})
                this.dispatch('erp/loadErpOrders')
                this.dispatch('erp/closeSelectedErpOrder')
            })
    },

    getErpOrder(context, payload) {
        console.log(context)
        return db.collection("erp")
            .doc(payload.id)
    },

    deleteErp(context) {
        if (context.state.selected.id)
            db.collection("erpOrder").doc(context.state.selected.id)
            .delete().then(() => { this.dispatch('erp/closeSelectedErpOrder')
            .then(() => { this.dispatch('erp/loadErpOrders') }) })
        else
            this.dispatch('erp/editErpOrder')
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

