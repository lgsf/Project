
import { db } from "@/main";

const state = () => ({
    label: '',
    listTitle: "Clientes",
    editTitle: 'Cliente',
    selected: [],
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
        }],
    clients: [],
    users: [],
    editClient: false,
    editingName: '',
    editingCnpj: '',
    editingEmail: ''
});

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
        let anySelected = !!state.selected;
        state.editingName = anySelected ? state.selected[0].name : '';
        state.editingCnpj = anySelected ? state.selected[0].cnpj : '';
        state.editingEmail = anySelected ? state.selected[0].email : '';
        state.editClient = payload
    },
    editName(state, payload) {
        state.editingName = payload;
    },
    editEmail(state, payload) {
        state.editingEmail = payload;
    },
    editCnpj(state, payload) {
        state.editingCnpj = payload;
    },
    updateUsers(state, payload) {
        state.users = payload;
    }
};


function onGroupsLoaded(context, payload) {
    let clients = [];
    payload.forEach(clientSnapShot => {
        let clientData = clientSnapShot.data();
        clientData.id = clientSnapShot.id;
        clients.push(clientData);
    });
    context.commit('updateClients', clients);
}

function createNewClient(state) {
    return db.collection("clients")
        .add({
            name: state.editingName || "",
            email: state.editingEmail || "",
            cnpj: state.editingCnpj || ""
        });
}

function updateExistingClient(state) {
    return db.collection("clients")
        .doc(state.selected[0].id)
        .update({
            name: state.editingName || "",
            email: state.editingEmail || "",
            cnpj: state.editingCnpj || ""
        });
}

const actions = {
    selectClient({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.');
        var selected = !payload ? [] : payload;
        commit('selectClient', selected)
    },
    searchFor({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.');
        commit('searchFor', payload)
    },
    loadClients({ state, commit }) {
        db.collection("clients")
            .get()
            .then(function (snapshots) {
                onGroupsLoaded({ state, commit }, snapshots)
            });
    },
    editClient({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.');
        commit('editClient', payload)
    },
    editName({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.');
        commit('editName', payload)
    },
    editEmail({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.');
        commit('editEmail', payload)
    },
    editCnpj({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.');
        commit('editCnpj', payload)
    },
    saveClient({ state }) {
        if (!state.selected)
            createNewClient(state).then(() => {
                this.dispatch('clients/loadClients');
                this.dispatch('clients/editClient');
            });
        else
            updateExistingClient(state).then(() => {
                this.dispatch('clients/loadClients');
                this.dispatch('clients/editClient');
            });
    }
};
const getters = {
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
