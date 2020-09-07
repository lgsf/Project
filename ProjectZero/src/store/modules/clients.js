
import { db, moment } from "@/main"
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
            text: "Endereço",
            align: "start",
            value: "addressConcatenated"
        },
        {
            text: "Tipo",
            align: "start",
            value: "type"
        },
        {
            text: "Data criação",
            align: "start",
            value: "date"
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
    editingStatus: '',
    editingDate: '',
    editingType: '',
    editingCep: '',
    editingStreet: '',
    editingNeighborhood: '',
    editingNumber: '',
    editingComplement: '',
    editingCity: '',
    editingState: ''
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
        state.editingStatus = anySelected ? state.selected.status : 'Ativo',
        state.editingType = anySelected ? state.selected.type : '',
        state.editingDate = anySelected ? state.selected.date : '',
        state.editingCep = anySelected ? state.selected.address.cep : '',
        state.editingCity = anySelected ? state.selected.address.city : '',
        state.editingState = anySelected ? state.selected.address.state : '',
        state.editingNeighborhood = anySelected ? state.selected.address.neighborhood : '',
        state.editingStreet = anySelected ? state.selected.address.street : '',
        state.editingNumber = anySelected ? state.selected.address.number : '',
        state.editingComplement = anySelected ? state.selected.address.complement : '',
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
    editType(state, payload) {
        state.editingType = payload
    },
    editCep(state, payload) {
        state.editingCep = payload
    },
    editState(state, payload) {
        state.editingState = payload
    },
    editCity(state, payload) {
        state.editingCity = payload
    },
    editNeighborhood(state, payload) {
        state.editingNeighborhood = payload
    },
    editStreet(state, payload) {
        state.editingStreet = payload
    },
    editNumber(state, payload) {
        state.editingNumber = payload
    },
    editComplement(state, payload) {
        state.editingComplement = payload
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
            status: state.editingStatus || "Ativo",
            date: moment().format('DD/MM/YYYY'),
            type: state.editingType || "",
            address: {
                cep: state.editingCep,
                street: state.editingStreet,
                number: state.editingNumber,
                complement: state.editingComplement,
                neighborhood: state.editingNeighborhood,
                city: state.editingCity,
                state: state.editingState
                }
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
            status: state.editingStatus || "Ativo",
            type: state.editingType || "",
            address: {
                cep: state.editingCep,
                street: state.editingStreet,
                number: state.editingNumber,
                complement: state.editingComplement,
                neighborhood: state.editingNeighborhood,
                city: state.editingCity,
                state: state.editingState
                }
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

    cleanSelectionClient({ commit }) {
       commit('editName', '')
       commit('editEmail', '')
       commit('editCnpj', '')
       
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
                    clientData.addressConcatenated = clientData.address.street + ', ' + clientData.address.number + ' - ' + clientData.address.complement + ' - ' + clientData.address.neighborhood + ' - ' + clientData.address.city + '/' + clientData.address.state
                    clients.push(clientData)
                })
                commit('updateClients', clients)
                activeClients = clients.filter(obj => obj.status !== "Inativo" )
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

    editAddress({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.')
        commit('editCep', payload.cep)
        commit('editState', payload.state)
        commit('editCity', payload.city)
        commit('editNeighborhood', payload.neighborhood)
        commit('editStreet', payload.street)
    },

    editNumber({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.')
        commit('editNumber', payload)
    },

    editComplement({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.')
        commit('editComplement', payload)
    },

    editNeighborhood({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.')
        commit('editNeighborhood', payload)
    },

    editStreet({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.')
        commit('editStreet', payload)
    },

    editType({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.')
        commit('editType', payload)
    },

    saveClient({ state }) {
        if (!state.selected)
            createNewClient(state).then(() => {
                this.dispatch('clients/loadClients')
                this.dispatch('clients/closeSelectionClient')
                this.dispatch('general/setSuccessMessage', 'Cliente criado com sucesso!')
            })
        else
            updateExistingClient(state).then(() => {
                this.dispatch('clients/loadClients')
                this.dispatch('clients/closeSelectionClient')
                this.dispatch('general/setSuccessMessage', 'Cliente modificado com sucesso!')
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
