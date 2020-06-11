
import { db } from "@/main";

const state = () => ({
    label: '',
    listTitle: "Ordem Erp",
    selected: [],
    selectedOrder: {},
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
    erpOrders: [],
    editErp: false
});

const mutations = {
    selectErpOrder(state, payload) {
        state.selected = payload
        state.selectedOrder = state.selected.length ? state.selected[0] : { tasks: [] }
    },
    searchFor(state, payload) {
        state.search = payload
    },
    updateErpOrders(state, payload) {
        state.erpOrders = payload
    },
    editErpOrder(state, payload) {
        let anySelected = !!state.selected;
        state.editingName = anySelected ? state.selected.name : '';
        state.editingTask = anySelected ? state.selected.task : '';
        state.editingUser = anySelected ? state.selected.user : '';
        state.editErp = payload
    }
};


function onErpOrdersLoaded(context, payload) {
    let erpOrders = [];
    payload.forEach(erpSnapShot => {
        let erpData = erpSnapShot.data();
        erpData.id = erpSnapShot.id;
        erpOrders.push(erpData);
    });
    context.commit('updateErpOrders', erpOrders);
}

function createNewErp(state) {
    let admin = mapUser(state.selectedOrder.administrator);
    let users = (state.selectedOrder.users || []).map(m => mapUser(m));

    return db.collection("erp")
        .add({
            name: state.selectedOrder.name || '',
            administrator: admin,
            tasks: state.selectedOrder.tasks || [],
            users: users
        });
}

function mapUser(user) {
    let userMapped = '';
    if (!user)
        return userMapped;
    userMapped = {
        id: user.id,
        name: user.name,
        group_id: user.group_id,
        email: user.email
    };
    return userMapped;
}

function updateExistingErp(state) {
    let admin = mapUser(state.selectedOrder.administrator);
    let users = (state.selectedOrder.users || []).map(m => mapUser(m));

    return db.collection("erp")
        .doc(state.selectedOrder.id)
        .set({
            name: state.selectedOrder.name || '',
            administrator: admin,
            tasks: state.selectedOrder.tasks || [],
            users: users
        });
}

const actions = {
    selectErpOrder({ commit }, payload) {
        var selected = payload;
        commit('selectErpOrder', selected);
    },
    searchFor({ commit }, payload) {
        commit('searchFor', payload);
    },
    loadErpOrders({ state, commit }) {
        db.collection("erp")
            .get()
            .then(function (snapshots) {
                onErpOrdersLoaded({ state, commit }, snapshots)
            });
    },
    editErpOrder({ commit }, payload) {
        commit('editErpOrder', payload);
    },
    saveErpOrder({ commit, state }) {
        if (!state.selectedOrder.id)
            createNewErp(state).then(() => {
                commit("selectErpOrder", []);
                this.dispatch('erp/loadErpOrders');
                this.dispatch('erp/editErpOrder');
            });
        else
            updateExistingErp(state).then(() => {
                commit("selectErpOrder", []);
                this.dispatch('erp/loadErpOrders');
                this.dispatch('erp/editErpOrder');
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

