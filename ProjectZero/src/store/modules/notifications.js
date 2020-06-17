import { db } from "@/main"

const state = () => ({
    label: '',
    listTitle: "Notificações",
    selected: [],
    search: '',
    searchLabel: 'Buscar',
    header: [
        {
          text: "Autor",
          align: "start",
          value: "name"
        } ,
        {
          text: "Título",
          align: "start",
          value: "title"
        },
        {
            text: "Data",
            align: "start",
            value: "date"
          },
        {
          text: "Usuários",
          align: "start",
          value: "user"
        },
        {
          text: "Grupos",
          align: "start",
          value: "group"
        },
        {
          text: "Mensagem",
          align: "start",
          value: "detail"
        }
        ],
      notifications: [],
      editNotification: false,
      editingName: '',
      editingTitle: '',
      editingDetail: '',
      editingDate: '',
      editingUser:[],
      editingGroup:[]
    })

    const mutations = {
        selectNotification(state, payload) {
            state.selected = payload
        },
        searchFor(state, payload) {
            state.search = payload
        },
        updateNotifications(state, payload) {
            state.notifications = payload
        },
        editNotification(state, payload) {
            state.editingName = state.selected[0]?.name || ''
            state.editingTitle = state.selected[0]?.title || ''
            state.editingDetail = state.selected[0]?.detail || ''
            state.editingDate =  state.selected[0]?.date || ''
            state.editingUser =  state.selected[0]?.user || []
            state.editingUser =  state.selected[0]?.group || []
            state.editNotification = payload
        },
        editName(state, payload) {
            state.editingName = payload
        },
        editTitle(state, payload) {
            state.editingTitle = payload
        },
        editDetail(state, payload) {
            state.editingDetail = payload
        },
        editDate(state, payload) {
            state.editingDate = payload
        },
        editUser(state, payload) {
            state.editingUser = payload
        },
        editGroup(state, payload) {
            state.editingGroup = payload
        }
    }

    function onNotificationsLoaded(context, payload) {
        let notifications = []
        payload.forEach(notificationSnapShot => {
            let notificationData = notificationSnapShot.data()
            notificationData.id = notificationSnapShot.id
            notifications.push(notificationData)
        })
        context.commit('updateNotifications', notifications)
    
    }

    function createNewNotification(state) {
        return db.collection("notifications")
            .add({
                name: state.editingName || "",
                title: state.editingTitle || "",
                detail: state.editingDetail || "",
                date: state.editingDate || "",
                user: state.editingUser?.map((obj) => { return Object.assign({}, obj) }) || [],
                group: state.editingGroup?.map((obj) => { return Object.assign({}, obj) }) || []
            })
    }

    function updateExistingNotification(state) {
        return db.collection("notifications")
            .doc(state.selected[0].id)
            .set({
                title: state.editingTitle || "",
                name: state.editingName || "",
                detail: state.editingDetail || "",
                date: state.editingDate || "",
                user: state.editingUser?.map((obj) => { return Object.assign({}, obj) }) || [],
                group: state.editingGroup?.map((obj) => { return Object.assign({}, obj) }) || []
            })
    }

    const actions = {
        selectNotification({ commit }, payload) {
            commit('selectNotification', payload)
        },
        searchFor({ state, commit }, payload) {
            if (!state) console.log('Error, state is undifined.')
            commit('searchFor', payload)
        },
        loadNotifications({ state, commit }) {
            db.collection("notifications")
            .get()
            .then(function (snapshots) {
                onNotificationsLoaded({ state, commit }, snapshots)
            });
                
        },
        editNotification({ state, commit }, payload) {
            if (!state) console.log('Error, state is undifined.')
            commit('editNotification', payload)
        },
        editName({ state, commit }, payload) {
            if (!state) console.log('Error, state is undifined.')
            commit('editName', payload)
        },
        editTitle({ state, commit }, payload) {
            if (!state) console.log('Error, state is undifined.')
            commit('editTitle', payload)
        },
        editDetail({ state, commit }, payload) {
            if (!state) console.log('Error, state is undifined.')
            commit('editDetail', payload)
        },
        editDate({ state, commit }, payload) {
            if (!state) console.log('Error, state is undifined.')
            commit('editDate', payload)
        },
        editUser({ state, commit }, payload) {
            if (!state) console.log('Error, state is undifined.')
            commit('editUser', payload)
        },
        editGroup({ state, commit }, payload) {
            if (!state) console.log('Error, state is undifined.')
            commit('editGroup', payload)
        },
        saveNotification({ state }) {
            if (state.selected.length == 0)
                createNewNotification(state).then(() => {
                    this.dispatch('notifications/loadNotifications')
                    this.dispatch('notifications/editNotification', false)
                })
            else
                updateExistingNotification(state).then(() => {
                    this.dispatch('notifications/loadNotifications')
                    this.dispatch('notifications/editNotification', false)
                })
        },
        deleteNotification({ state }) {
            db.collection("notifications")
            .doc(state.selected[0].id)
            .delete()
            .then(()=>{
                this.dispatch('notifications/loadNotifications')
                this.dispatch('notifications/editNotification')
            })
            .catch((error) => {
              console.error("Error deleting: ", error)
            })
    } 
}
    
    export default {
        namespaced: true,
        state,
        actions,
        mutations
    }
    