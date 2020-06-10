
import { db } from "@/main";

const state = () => ({
    label: '',
    listTitle: "Ordem de Erp",
    editTitle: 'Erp',
    selected: undefined,
    search: '',
    searchLabel: 'Buscar',
    header: [
        {
            text: "Nome",
            align: "start",
            value: "name"
        },
        {
            text: "Tarefas",
            align: "start",
            value: "task"
        },
        {
            text: "Usuário",
            align: "start",
            value: "user"
        }
    ]
    ,
    erp: [],
    editErp: false,
    editingName: '',
    editingTask: '',
    editingUser: ''
});

const mutations = {
    selectErp(state, payload) {
        state.selected = payload
    },
    searchFor(state, payload) {
        state.search = payload
    },
    updateErp(state, payload) {
        state.erp = payload
    },
    editErp(state, payload) {
        let anySelected = !!state.selected;
        state.editingName = anySelected ? state.selected.name : '';
        state.editingTask = anySelected ? state.selected.task : '';
        state.editingUser = anySelected ? state.selected.user : '';
        state.editErp = payload
    },
    editName(state, payload) {
        state.editingName = payload;
    },
    editTask(state, payload) {
        state.editingTask = payload;
    },
    editUser(state, payload) {
        state.editingUser = payload;
    }
};


function onGroupsLoaded(context, payload) {
    let erp = [];
    payload.forEach(erpSnapShot => {
        let erpData = erpSnapShot.data();
        erpData.id = erpSnapShot.id;
        erp.push(erpData);
    });
    context.commit('updateErp', erp);
}

function createNewErp(state) {
    return db.collection("erp")
        .add({
            name: state.editingName || "",
            task: state.editingTask || "",
            user: state.editingUser || ""
        });
}

function updateExistingErp(state) {
    return db.collection("erp")
        .doc(state.selected.id)
        .set({
            name: state.selected.name || "",
            administrator: state.selected.administrator,
            tasks: state.selected.tasks || [],
            users: state.selected.users || []
        });
}

const actions = {
    selectErp({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.');
        var selected = !payload ? undefined : payload[0];
        commit('selectErp', selected)
    },
    searchFor({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.');
        commit('searchFor', payload)
    },
    loadErp({ state, commit }) {
        db.collection("erp")
            .get()
            .then(function (snapshots) {
                onGroupsLoaded({ state, commit }, snapshots)
            });
    },
    editErp({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.');
        commit('editErp', payload)
    },
    editName({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.');
        commit('editName', payload)
    },
    editTask({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.');
        commit('editTask', payload)
    },
    editUser({ state, commit }, payload) {
        if (!state) console.log('Error, state is undifined.');
        commit('editUser', payload)
    },
    saveErp({ state }) {
        if (!state.selected)
            createNewErp(state).then(() => {
                this.dispatch('erp/loadErp');
                this.dispatch('erp/editErp');
            });
        else
            updateExistingErp(state).then(() => {
                this.dispatch('erp/loadErp');
                this.dispatch('erp/editErp');
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
