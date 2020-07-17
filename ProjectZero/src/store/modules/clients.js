
import { db } from "@/main"
import catchError from '@/utilities/firebaseErrors'

const state = () => ({
    label: '',
    listTitle: "Clientes",
    editTitle: 'Cliente',
    selected: '',
    search: '',
    searchLabel: 'Buscar',
    header: [
        {
            text: "Nome",
            align: "start",
            value: "name"
        },
        {
            text: "CNPJ",
            align: "start",
            value: "cnpj"
        },
        {
            text: "E-mail",
            align: "start",
            value: "email"
        },
        {
            text: "Estado Atual",
            align: "start",
            value: "status"
        }],
    clients: [],
    activeClients: [],
    editClient: false,
    editingName: '',
    editingCnpj: '',
    editingEmail: '',
    editingStatus: ''
})

const mutations = {
    selectClient(state, payload) {
        state.selected = payload
    },  
    searchFor(state, payload) {
        state.search = payload
    },
    updateClients(state, payload) {
        state.clients = payload
    },
    editClient(state, payload) {
        let anySelected = state.selected 
        state.editingName = anySelected ? state.selected.name : ''
        state.editingCnpj = anySelected ? state.selected.cnpj : ''
        state.editingEmail = anySelected ? state.selected.email : ''
        state.editingStatus = anySelected ? state.selected.status : 'Ativo'
        state.editClient = payload
    },
    editName(state, payload) {
        state.editingName = payload
    },
    editEmail(state, payload) {
        state.editingEmail = payload
    },
    editCnpj(state, payload) {
        state.editingCnpj = payload
    },
    editStatus(state, payload) {
        state.editingStatus = payload
    },
    updateActiveClients(state, payload) {
        state.activeClients = payload
    }
}


function createNewClient(state) {
    return db.collection("clients")
        .add({
            name: state.editingName || "",
            email: state.editingEmail || "",
            cnpj: state.editingCnpj || "",
            status: state.editingStatus || "Ativo"
        }).catch(error => {
            let errorMessage = catchError(error)
            this.dispatch('general/setErrorMessage', errorMessage)
        })
}

function updateExistingClient(state) {
    return db.collection("clients")
        .doc(state.selected.id)
        .update({
            name: state.editingName || "",
            email: state.editingEmail || "",
            cnpj: state.editingCnpj || "",
            status: state.editingStatus || "Ativo"
        }).catch(error => {
            let errorMessage = catchError(error)
            this.dispatch('general/setErrorMessage', errorMessage)
        })
}

const actions = {
    selectClient({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.')
        var selected = payload
        commit('selectClient', selected)
        commit('editClient', true)
    },

    closeSelectionClient({ commit }, payload) {
        var selected = payload
        commit('selectClient', selected)
        commit('editClient', false)
    },

    searchFor({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.')
        commit('searchFor', payload)
    },

    loadClients({ commit }) {
        this.dispatch('general/setIsLoading')
        this.dispatch('general/resetAllMessages', '')
        db.collection("clients")
            .get()
            .then((snapshots) => {
                let clients = []
                let activeClients = []
                snapshots.forEach(clientSnapShot => {
                    let clientData = clientSnapShot.data()
                    clientData.id = clientSnapShot.id
                    clients.push(clientData)
                })
                commit('updateClients', clients)
                activeClients = clients.filter(obj => obj.status !== "Desativado" )
                commit('updateActiveClients', activeClients)
                this.dispatch('general/resetIsLoading')
            }).catch(error => {
                let errorMessage = catchError(error)
                this.dispatch('general/setErrorMessage', errorMessage)
            })
    },

    editClient({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.')
        commit('editClient', payload)
    },

    editName({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.')
        commit('editName', payload)
    },

    editEmail({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.')
        commit('editEmail', payload)
    },

    editCnpj({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.')
        commit('editCnpj', payload)
    },

    editStatus({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.')
        commit('editStatus', payload)
    },

    saveClient({ state }) {
        if (!state.selected)
            createNewClient(state).then(() => {
                this.dispatch('clients/loadClients')
                this.dispatch('clients/closeSelectionClient')
            })
        else
            updateExistingClient(state).then(() => {
                this.dispatch('clients/loadClients')
                this.dispatch('clients/closeSelectionClient')
            })
    }
}

const getters = {
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
