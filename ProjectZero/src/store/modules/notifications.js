import { db, moment} from "@/main"
import catchError from '@/utilities/firebaseErrors'


Array.prototype.unique = function (compare) {
    var a = this.concat()
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (!compare && a[i] === a[j] || compare && compare(a[i], a[j]))
                a.splice(j--, 1)
        }
    }
    return a;
}

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
            text: "Usuário(s)",
            align: "start",
            value: "userConcatenated",
            hide: "true"
          },
        {
          text: "Grupo(s)",
          align: "start",
          value: "groupConcatenated"
        },
        {
          text: "Mensagem",
          align: "start",
          value: "detail"
        }
        ],
      newNotifications: [],
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

  async function createNewNotification(state) {
        if (state.editingGroup.length > 0){
            let group_Ids = state.editingGroup.map(k => { return k.id})
            let groupUser_Ids = await updateUserIdsVector(group_Ids)
            let userUser_Ids = state.editingUser?.map(k => { return k.id}) || []
            let finalArray_Ids = groupUser_Ids.concat(userUser_Ids).unique()
            return db.collection("notifications")
            .add({
                title: state.editingTitle || "",
                name: state.editingName || "",
                detail: state.editingDetail || "",
                date: moment().unix(),
                user: state.editingUser?.map((obj) => { return Object.assign({}, obj) }) || [],
                userIds: finalArray_Ids,
                group: state.editingGroup?.map((obj) => { return Object.assign({}, obj) }) || [],
                read: []
            })
    }
        else
            return db.collection("notifications")
                .add({
                    name: state.editingName || "",
                    title: state.editingTitle || "",
                    detail: state.editingDetail || "",
                    date: moment().unix(),
                    user: state.editingUser?.map((obj) => { return Object.assign({}, obj) }) || [],
                    userIds: state.editingUser?.map(k => { return k.id}) || [],
                    group: state.editingGroup?.map((obj) => { return Object.assign({}, obj) }) || [],
                    read: []
                })
        }

   async function updateUserIdsVector(group_Ids) {
        let user_Ids = []
        for (const item of group_Ids){
            let snapshots = await db.collection("users").where("group_id", "==", item).get()
            snapshots.docs.forEach(item2 => {
                user_Ids.push(item2.id)
                })
        }
        return user_Ids
        
    }

   async function updateExistingNotification(state, rootState) {
        if (state.editingGroup.length > 0) {
            let group_Ids = state.editingGroup.map(k => { return k.id})
            let groupUser_Ids = await updateUserIdsVector(group_Ids)
            let userUser_Ids = state.editingUser?.map(k => { return k.id}) || []
            let finalArray_Ids = groupUser_Ids.concat(userUser_Ids).unique()
            return db.collection("notifications")
            .doc(state.selected[0].id)
            .set({
                title: state.editingTitle || "",
                name: state.editingName || "",
                detail: state.editingDetail || "",
                date: moment().unix(),
                user: state.editingUser?.map((obj) => { return Object.assign({}, obj) }) || [],
                userIds: finalArray_Ids,
                group: state.editingGroup?.map((obj) => { return Object.assign({}, obj) }) || [],
                read: []
            })
    }
        else if (state.editingUser.length == 0 && state.editingGroup == 0) 
            return db.collection("notifications")
            .doc(state.selected[0].id)
            .set({
                title: state.editingTitle || "",
                name: state.editingName || "",
                detail: state.editingDetail || "",
                date: moment().unix(),
                user: state.editingUser?.map((obj) => { return Object.assign({}, obj) }) || [],
                userIds: rootState.users.userList.map(k => { return k.id}) || [],
                group: state.editingGroup?.map((obj) => { return Object.assign({}, obj) }) || [],
                read: []
            })
        else
            return db.collection("notifications")
            .doc(state.selected[0].id)
            .set({
                title: state.editingTitle || "",
                name: state.editingName || "",
                detail: state.editingDetail || "",
                date: moment().unix(),
                user: state.editingUser?.map((obj) => { return Object.assign({}, obj) }) || [],
                userIds: state.editingUser?.map(k => { return k.id}) || [],
                group: state.editingGroup?.map((obj) => { return Object.assign({}, obj) }) || [],
                read: []
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

        loadNotifications({ commit }) {
            this.dispatch('general/setIsLoading')
            this.dispatch('general/resetAllMessages', '')
            commit('selectNotification', [])
            db.collection("notifications")
            .get()
            .then((snapshots) => {
                let notifications = []
                snapshots.forEach(notificationSnapShot => {
                    let notificationData = notificationSnapShot.data()
                    notificationData.id = notificationSnapShot.id
                    notificationData.userConcatenated = notificationData.user.map(u => u.name).join(', ')
                    notificationData.groupConcatenated = notificationData.group.map(u => u.name).join(', ')
                    notificationData.dateFormated = moment.unix(notificationData.date).format('DD/MM/YYYY HH:mm:ss')
                    notifications.push(notificationData)
                    })
                commit('updateNotifications', notifications)
                this.dispatch('general/resetIsLoading')
                })   
        },

        readItem({ commit, rootState }, payload){
            commit('selectNotification', [])
            let readArray = payload.read
            readArray.push({id: rootState.auth.user.uid})
            db.collection("notifications")
                    .doc(payload.id)
                    .update({
                        read: readArray
                    })
          },
     
        unreadItem({ commit, rootState }, payload){
            commit('selectNotification', [])
            let readArray = payload.read.filter(obj => obj.id !== rootState.auth.user.uid)
            db.collection("notifications")
                 .doc(payload.id)
                 .update({
                     read: readArray
                 })
          },
        
        editNotification({ state, commit }, payload) {
            if (!state) console.log('Error, state is undifined.')
            commit('editNotification', payload)
        },

        cleanNotification({ state, commit }) {
            if (!state) console.log('Error, state is undifined.')
            commit('editName', '')
            commit('editTitle', '')
            commit('editDetail', '')
            commit('editDate', '')
            commit('editUser', [])
            commit('editGroup', [])
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

        saveNotification({ state, rootState }) {
            if (state.selected.length == 0 || !state.selected[0].id)
                createNewNotification(state, rootState).then(() => {
                    this.dispatch('notifications/loadNotifications')
                    this.dispatch('notifications/editNotification', false)
                    this.dispatch('general/setSuccessMessage', 'Notificação criada com sucesso!')
                })
            else
                updateExistingNotification(state, rootState).then(() => {
                    this.dispatch('notifications/loadNotifications')
                    this.dispatch('notifications/editNotification', false)
                    this.dispatch('general/setSuccessMessage', 'Notificação modificada com sucesso!')
                })
        },

        deleteNotification({ state }) {
            db.collection("notifications")
            .doc(state.selected[0].id)
            .delete()
            .then(()=>{
                this.dispatch('notifications/loadNotifications')
                this.dispatch('notifications/editNotification')
                this.dispatch('general/setSuccessMessage', 'Notificação excluída com sucesso!')
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
            .catch((error) => {
                let errorMessage = catchError(error)
                this.dispatch('general/setErrorMessage', errorMessage)
            })
          })
          Promise.all(state.selected).then(() => {
            this.dispatch('notifications/loadNotifications')
            this.dispatch('notifications/editNotification')
            this.dispatch('general/setSuccessMessage', 'Notificações excluídas com sucesso!')
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
                userIds: payload.userIds,
                group: payload.group,
                read: []
            })
        }
}
    
    export default {
        namespaced: true,
        state,
        actions,
        mutations
    }
    