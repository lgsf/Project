const state = () => ({
    selected: []
});

const mutations = {
    selectGroup(state, payload) {
        state.selected = payload
    }
};
const actions = {
    select({ state, commit }, selected) {
        commit('selectGroup', selected)
        if (!state) console.log('Error, state is undifined.');
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
