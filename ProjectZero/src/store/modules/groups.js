import { db } from "@/main"

const state = () => ({
    selected: '',
    groupName: '',
    groupEmail: '',
    groups: [],
    menuItems: [],
    selectedMenuItems: [],
    editGroup: false
})

const mutations = {
    selectGroup(state, payload) {
        state.selected = payload
        state.groupName = state.selected.name
        state.groupEmail = state.selected.email
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
        if (payload == false) {
            state.selected = ''
            state.groupName = ''
            state.groupEmail = ''
            state.selectedMenuItems = []
        }
    },
    updateMenuItems(state, payload) {
        state.menuItems = payload
    },
    setSelectedMenuItems(state, payload) {
        state.selectedMenuItems = payload
    },
    setName(state, payload) {
        state.groupName = payload
    },
    setEmail(state, payload) {
        state.groupEmail = payload
    },

}


function getMenuSelectedItems(context) {
    return context.state.menuItems.filter(
        m =>
            context.state.selectedMenuItems.includes(m.id) ||
            (!!m.children &&
                m.children.filter(n => context.state.selectedMenuItems.includes(n.id)).length > 0)
    )
}

function createNewGroup(context) {
    let menu = getMenuSelectedItems(context)
    return db.collection("groups")
        .add({
            name: context.state.groupName || "",
            email: context.state.groupEmail || "",
            menu: menu || []
        })
}



function updateExistingGroup(context) {
    let menu = getMenuSelectedItems(context)
    return db.collection("groups")
        .doc(context.state.selected.id)
        .set({
            name: context.state.groupName || "",
            email: context.state.groupEmail || "",
            menu: menu || []
        })
}

const actions = {
    select({ commit }, payload) {
        commit('selectGroup', payload)
        commit('editGroup', true)
    },

    clean({ commit}){
        commit('setName', '')
        commit('setEmail', '')
        commit('setSelectedMenuItems', [])
    },

    setName({ commit }, payload) {
        commit('setName', payload)
    },

    setEmail({ commit }, payload) {
        commit('setEmail', payload)
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
        if (!selectedGroup.id)
            createNewGroup(context).then(() => {
                this.dispatch('groups/loadGroups')
                context.commit("editGroup", false)
                this.dispatch('general/setSuccessMessage', 'Grupo criado com sucesso!')
            })
        else
            updateExistingGroup(context).then(() => {
                this.dispatch('groups/loadGroups')
                context.commit('selectGroup', '')
                context.commit("editGroup", false)
                this.dispatch('general/setSuccessMessage', 'Grupo modificado com sucesso!')
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
