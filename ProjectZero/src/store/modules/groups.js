import { db } from "@/main"

const state = () => ({
    selected: '',
    groups: [],
    menuItems: [],
    selectedMenuItems: [],
    editGroup: false
})

const mutations = {
    selectGroup(state, payload) {
        state.selected = payload
        state.selectedMenuItems = []
        if (state.selected)
            state.selected.menu?.forEach(item => {
                let selectedItem = state.menuItems.reduce((m, n) => m.route == item.route ? m : n)
                state.selectedMenuItems.push(selectedItem.id)
            })
    },
    updateGroups(state, payload) {
        state.groups = payload
    },
    editGroup(state, payload) {
        state.editGroup = payload
    },
    updateMenuItems(state, payload) {
        state.menuItems = payload
    },
    setSelectedMenuItems(state, payload) {
        state.selectedMenuItems = payload
    }
}


function getMenuSelectedItems(context) {
    return context.state.menuItems.filter(
        m =>
            context.state.selectedMenuItems.includes(m.id) ||
            (!!m.children &&
                m.children.filter(n => context.state.selectedMenuItems.includes(n.id)).length > 0)
    )
}

function createNewGroup(context, selectedGroup) {
    let menu = getMenuSelectedItems(context)
    return db.collection("groups")
        .add({
            name: selectedGroup.name || "",
            email: selectedGroup.email || "",
            menu: menu || []
        })
}



function updateExistingGroup(context, selectedGroup) {
    if (!selectedGroup.name) return
    let menu = getMenuSelectedItems(context)
    return db.collection("groups")
        .doc(selectedGroup.id)
        .set({
            name: selectedGroup.name || "",
            email: selectedGroup.email || "",
            menu: menu || []
        })
}

const actions = {
    select(context, selected) {
        context.commit('selectGroup', selected)
        context.commit('editGroup', true)
    },

    loadGroups(context) {
        this.dispatch('general/setIsLoading')
        this.dispatch('general/resetAllMessages', '')
        db.collection("groups")
            .get()
            .then((snapshots) => {
                let groups = []
                snapshots.forEach(groupsSnapShot => {
                    let groupData = groupsSnapShot.data()
                    groupData.id = groupsSnapShot.id
                    groups.push(groupData)
                })
                context.commit('updateGroups', groups)
                this.dispatch('general/resetIsLoading')
            })
    },

    editGroup(context, payload) {
        context.commit('editGroup', payload)
    },

    loadMenuOptions(context) {
        db.collection("menuItems")
            .get()
            .then((snapshots) => {
                let menuItems = []
                snapshots.forEach(itemsSnapshot => {
                    let appData = itemsSnapshot.data()
                    appData.id = itemsSnapshot.id
                    menuItems.push(appData)
                })
                context.commit('updateMenuItems', menuItems)
            })
    },

    setSelectedMenuItems(context, payload) {
        context.commit('setSelectedMenuItems', payload)
    },
    
    saveGroup(context) {
        let selectedGroup = context.state.selected
        let recordActionPromise = undefined
        if (!selectedGroup.id)
            recordActionPromise = createNewGroup(context, selectedGroup)
        else
            recordActionPromise = updateExistingGroup(context, selectedGroup)
        recordActionPromise?.then(() => {
            this.dispatch('groups/loadGroups')
            context.commit('selectGroup', '')
            context.commit("editGroup", false)
        })
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
