import { db } from "@/main"

const state = () => ({
    label: '',
    listTitle: "Notícias",
    selected: [],
    search: '',
    searchLabel: 'Buscar',
    header: [
        {
          text: "Usuário",
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
      editingDate: ''
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
            let anySelected = !!state.selected
            state.editingName = anySelected ? state.selected.name : ''
            state.editingTitle = anySelected ? state.selected.title : ''
            state.editingDetail = anySelected ? state.selected.detail : ''
            state.editingDate = anySelected ? state.selected.date : ''
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
        }
    };

    function onGroupsLoaded(context, payload) {
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
                date: state.editingDate || ""
            })
    }

    function updateExistingNotification(state) {
        return db.collection("notifications")
            .doc(state.selected.id)
            .set({
                title: state.editingTitle || "",
                name: state.editingName || "",
                detail: state.editingDetail || "",
                date: state.editingDate || ""
            })
    }

    const actions = {
        selectNotification({ state, commit }, payload) {
            if (!state) console.log('Error, state is undifined.')
            var selected = !payload ? undefined : payload[0]
            commit('selectNotification', selected)
        },
        searchFor({ state, commit }, payload) {
            if (!state) console.log('Error, state is undifined.')
            commit('searchFor', payload)
        },
        loadNotifications({ state, commit }) {
            db.collection("notifications")
                .get()
                .then(function (snapshots) {
                    onGroupsLoaded({ state, commit }, snapshots)
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
        saveNotification({ state }) {
            if (!state.selected)
                createNewNotification(state).then(() => {
                    this.dispatch('notifications/loadNotifications')
                    this.dispatch('notifications/editNotification')
                });
            else
                updateExistingNotification(state).then(() => {
                    this.dispatch('notifications/loadNotifications')
                    this.dispatch('notifications/editNotification')
                });
        },
        deleteNotification({ state }) {
            db.collection("notifications")
            .doc(state.selected.id)
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
    const getters = {
    }
    
    export default {
        namespaced: true,
        state,
        getters,
        actions,
        mutations
    }
    