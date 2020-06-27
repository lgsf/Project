import { db } from "@/main";

const state = () => ({
    selected: [],
    groups: [],
    menuItems: [],
    selectedMenuItems: [],
    editGroup: false
});

const mutations = {
    selectGroup(state, payload) {
        state.selected = payload;
        state.selectedMenuItems = [];
        if (state.selected && state.selected.length)
            state.selected[0].menu?.forEach(item => {
                let selectedItem = state.menuItems.reduce((m, n) => m.route == item.route ? m : n);
                state.selectedMenuItems.push(selectedItem.id)
            })
    },
    updateGroups(state, payload) {
        state.groups = payload;
    },
    editGroup(state, payload) {
        state.editGroup = payload;
    },
    updateMenuItems(state, payload) {
        state.menuItems = payload;
    },
    setSelectedMenuItems(state, payload) {
        state.selectedMenuItems = payload;
    }
};

function onGroupsLoaded(context, payload) {
    let groups = [];
    payload.forEach(groupsSnapShot => {
        let groupData = groupsSnapShot.data();
        groupData.id = groupsSnapShot.id;
        groups.push(groupData);
    });
    context.commit('updateGroups', groups);
}

function onMenuOptionsLoaded(context, snapshot) {
    let menuItems = [];
    snapshot.forEach(itemsSnapshot => {
        let appData = itemsSnapshot.data();
        appData.id = itemsSnapshot.id;
        menuItems.push(appData);
    });
    context.commit('updateMenuItems', menuItems);
}

function createNewGroup(context, selectedGroup) {
    let menu = getMenuSelectedItems(context);
    return db.collection("groups")
        .add({
            name: selectedGroup.name || "",
            email: selectedGroup.email || "",
            menu: menu || []
        });
}

function getMenuSelectedItems(context) {
    return context.state.menuItems.filter(
        m =>
            context.state.selectedMenuItems.includes(m.id) ||
            (!!m.children &&
                m.children.filter(n => context.state.selectedMenuItems.includes(n.id)).length > 0)
    )
}

function updateExistingGroup(context, selectedGroup) {
    if (!selectedGroup.name) return;
    let menu = getMenuSelectedItems(context)
    return db.collection("groups")
        .doc(selectedGroup.id)
        .set({
            name: selectedGroup.name || "",
            email: selectedGroup.email || "",
            menu: menu || []
        });
}

const actions = {
    select(context, selected) {
        context.commit('selectGroup', selected);
    },
    loadGroups(context) {
        db.collection("groups")
            .get()
            .then(function (snapshots) {
                onGroupsLoaded(context, snapshots)
            });
    },
    editGroup(context, payload) {
        context.commit('editGroup', payload);
    },
    loadMenuOptions(context) {
        db.collection("menuItems")
            .get()
            .then(function (snapshots) {
                onMenuOptionsLoaded(context, snapshots)
            })
    },
    setSelectedMenuItems(context, payload) {
        context.commit('setSelectedMenuItems', payload);
    },
    saveGroup(context) {
        let selectedGroup = context.state.selected?.length > 0 ? context.state.selected[0] : {};
        let recordActionPromise = undefined;
        if (!selectedGroup.id)
            recordActionPromise = createNewGroup(context, selectedGroup);
        else
            recordActionPromise = updateExistingGroup(context, selectedGroup);
        let self = this;
        recordActionPromise?.then(function () {
            self.dispatch('groups/loadGroups');
            context.commit('selectGroup', []);
            context.commit("editGroup", false);
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
