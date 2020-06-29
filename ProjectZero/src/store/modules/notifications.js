import { db, moment} from "@/main"
import catchError from '@/utilities/firebaseErrors'


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
            value: "dateFormated"
          },
        {
            text: "Usuários",
            align: "start",
            value: "userConcatenated",
            hide: "true"
          },
        {
          text: "Grupos",
          align: "start",
          value: "groupConcatenated"
        },
        {
          text: "Mensagem",
          align: "start",
          value: "detail"
        }
        ],
      notifications: [],
      uniqueNotifications: [],
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
        updateMyNotifications(state, payload) {
            state.uniqueNotifications = payload
        },
        editNotification(state, payload) {
            state.editingName = state.selected[0]?.name || ''
            state.editingTitle = state.selected[0]?.title || ''
            state.editingDetail = state.selected[0]?.detail || ''
            state.editingDate =  moment().unix()
            state.editingUser =  state.selected[0]?.user || []
            state.editingGroup =  state.selected[0]?.group || []
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
            notificationData.userConcatenated = notificationData.user.map(u => u.name).join(', ')
            notificationData.groupConcatenated = notificationData.group.map(u => u.name).join(', ')
            notificationData.dateFormated = moment.unix(notificationData.date).format('DD/MM/YYYY HH:mm:ss')
            notifications.push(notificationData)
        })
        context.commit('updateNotifications', notifications)
        this.dispatch('general/resetIsLoading')
    }

    function createNewNotification(state) {
        return db.collection("notifications")
            .add({
                name: state.editingName || "",
                title: state.editingTitle || "",
                detail: state.editingDetail || "",
                date: moment().unix(),
                user: state.editingUser?.map((obj) => { return Object.assign({}, obj) }) || [],
                group: state.editingGroup?.map((obj) => { return Object.assign({}, obj) }) || [],
                read: false
            })
    }

    function updateExistingNotification(state) {
        return db.collection("notifications")
            .doc(state.selected[0].id)
            .set({
                title: state.editingTitle || "",
                name: state.editingName || "",
                detail: state.editingDetail || "",
                date: moment().unix(),
                user: state.editingUser?.map((obj) => { return Object.assign({}, obj) }) || [],
                group: state.editingGroup?.map((obj) => { return Object.assign({}, obj) }) || [],
                read: false
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
            this.dispatch('general/resetIsLoading')
            this.dispatch('general/resetAllMessages', '')
            commit('selectNotification', [])
            db.collection("notifications")
            .get()
            .then(function (snapshots) {
                onNotificationsLoaded({ state, commit }, snapshots)
            })   
        },

        readNotifications({ commit, rootState }) {
            let notifications = []
            db.collection("notifications")
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                  let userArray = []
                  let groupArray = []
                  userArray = doc.data().user
                  groupArray = doc.data().group
                  if(userArray.length == 0 && groupArray.length == 0){
                        notifications.push({
                          id: doc.id,
                          title: doc.data().title,
                          name: doc.data().name,
                          detail: doc.data().detail,
                          date: doc.data().date,
                          read: doc.data().read
                        })
                  }
                  else if (userArray.length > 0 && groupArray.length == 0) {
                        userArray.forEach (item =>  {
                        if(item.id == rootState.auth.user.uid){
                            notifications.push({
                              id: doc.id,
                              title: doc.data().title,
                              name: doc.data().name,
                              detail: doc.data().detail,
                              date: doc.data().date,
                              read: doc.data().read
                              })
                            }
                          })
                      }
                    else if (groupArray.length > 0 && userArray.length == 0){
                      groupArray.forEach (item => {
                        if(item.id == rootState.auth.userGroup){
                          notifications.push({
                            id: doc.id,
                            title: doc.data().title,
                            name: doc.data().name,
                            detail: doc.data().detail,
                            date: doc.data().date,
                            read: doc.data().read
                       })
                      }
                     })
                    }
                    else {
                        userArray.forEach (item =>  {
                        if(item.id == rootState.auth.user.uid){
                            notifications.push({
                              id: doc.id,
                              title: doc.data().title,
                              name: doc.data().name,
                              detail: doc.data().detail,
                              date: doc.data().date,
                              read: doc.data().read
                              })
                            }
                          })
                          groupArray.forEach (item => {
                            if(item.id == rootState.auth.userGroup){
                              notifications.push({
                                id: doc.id,
                                title: doc.data().title,
                                name: doc.data().name,
                                detail: doc.data().detail,
                                date: doc.data().date,
                                read: doc.data().read
                          })
                          }
                        })
                    }
                })
              let uniqueSet = new Set (notifications.map(e => JSON.stringify(e)))
              let uniqueNotifications = Array.from(uniqueSet).map(e => JSON.parse(e))
              uniqueNotifications.sort((a, b) => (a.read > b.read) ? 1 : (a.read === b.read) ? ((a.date < b.date) ? 1 : -1) : -1 )
              commit('updateMyNotifications', uniqueNotifications)
              this.dispatch('general/resetIsLoading')
            })
        },

        readItem({ commit }, payload){
            commit('selectNotification', [])
               db.collection("notifications")
                     .doc(payload.id)
                     .update({
                         read: true
                     })
          },
     
        unreadItem({ commit }, payload){
            commit('selectNotification', [])
            db.collection("notifications")
                 .doc(payload.id)
                 .update({
                     read: false
                 })
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
            if (state.selected.length == 0 || !state.selected[0].id)
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
                let errorMessage = catchError(error)
                this.dispatch('general/setErrorMessage', errorMessage)
            })
        },

        deleteNotificationItem( { commit }, payload) {
            db.collection("notifications")
            .doc(payload.id)
            .delete()
            .then(() =>{
                commit('selectNotification', [])
                this.dispatch('notifications/readNotifications')
            })
            .catch((error) => {
                let errorMessage = catchError(error)
                this.dispatch('general/setErrorMessage', errorMessage)
            })
        },
        
        deleteMultipleNotifications({ state }) {
            state.selected.forEach(doc => {
            db.collection("notifications")
            .doc(doc.id)
            .delete()
            .then(() => {
                this.dispatch('notifications/loadNotifications')
                this.dispatch('notifications/editNotification')
            }).catch((error) => {
                let errorMessage = catchError(error)
                this.dispatch('general/setErrorMessage', errorMessage)
            })
          })
        },

        sendNotification(context, payload){
            if(context)
            db.collection("notifications")
            .add({
                name: payload.name,
                title: payload.title,
                detail: payload.detail,
                date: moment().unix(),
                user: payload.user,
                group: payload.group,
                read: false
            })
        }
}
    
    export default {
        namespaced: true,
        state,
        actions,
        mutations
    }
    