import { db, moment } from "@/main"

const state = () => ({
    events: [],
    name: '',
    details: '',
    start: '',
    startTime:'',
    end: '',
    endTime:'',
    color: '#000000',
    editingUser:[]
  })

  const mutations =  {
    setEvents: (state, payload) => {
      state.events = payload
    },
    setSelectedEvent: (state, payload) => {
      state.selectedEvent = payload
    },
    setSelectedElement: (state, payload) => {
      state.selectedElement = payload
    },
    setName: (state, payload) => {
      state.name = payload
    },
    setDetails: (state, payload) => {
      state.details = payload
    },
    setStart: (state, payload) => {
      state.start = payload
    },
    setEnd: (state, payload) => {
      state.end = payload
    },
    setStartTime: (state, payload) => {
      state.startTime = payload
    },
    setEndTime: (state, payload) => {
      state.endTime = payload
    },
    setColor: (state, payload) => {
      state.color = payload
    },
    editUser(state, payload) {
      state.editingUser = payload
  }
}

const actions = {
    setEvent: async context => {
      context.dispatch('general/setIsLoading', '', {root:true})
      let snapshot = await db.collection('calEvent').get()
      const events = []
      snapshot.forEach(doc => {
        let userArray = []
        let author = {}
        userArray = doc.data().user
        author = doc.data().author
        if (userArray.length == 0) {
          let appData = doc.data()
          appData.id = doc.id
          events.push(appData)
        }
        else if (userArray.length > 0) {
          let appData = doc.data()
          appData.id = doc.id
          if (author == context.rootState.auth.user.uid)
            events.push(appData)
          userArray.forEach (item => {
            if (item.id == author)
              return
            else if (item.id == context.rootState.auth.user.uid) 
              events.push(appData)
          })
        }
      })
      context.commit('setEvents', events)
      context.dispatch('general/resetIsLoading', '', {root:true})
    },
    async updateEventStore (context, payload) {
      if (context.state.name && context.state.start && context.state.end && !context.state.startTime && !context.state.endTime) {
        await db.collection("calEvent").doc(payload.id).update({
          name: context.state.name,
          details: context.state.details,
          start: context.state.start,
          end: context.state.end,
          color: context.state.color
        })
        context.dispatch('setEvent')
      } else if (context.state.name && context.state.start && context.state.end && context.state.startTime && context.state.endTime){
          await db.collection("calEvent").doc(payload.id).update({
          name: context.state.name,
          details: context.state.details,
          start: context.state.start + ' ' + context.state.startTime,
          end: context.state.end + ' ' + context.state.endTime,
          color: context.state.color
        })
        context.dispatch('setEvent')
      }
    },

    async deleteEventStore (context, payload) {
      await db.collection("calEvent").doc(payload).delete()
      context.dispatch('setEvent')
    },

    addEvent: async context =>  {
      if (context.state.name && context.state.start && context.state.end && !context.state.startTime && !context.state.endTime) {
        await db.collection("calEvent").add({
          name: context.state.name,
          details: context.state.details,
          start: context.state.start,
          end: context.state.end,
          color: context.state.color,
          author: context.rootState.auth.user.uid,
          user: context.state.editingUser?.map((obj) => { return Object.assign({}, obj) }) || [],
        })
          if (context.state.editingUser.length == 0)
            context.dispatch('notifications/sendNotification', {
              name: "Sistema",
              title: "Novo evento",
              detail: "Um novo evento em que você está vinculado foi marcado! <br>Título do evento: <b>" + context.state.name + "</b> </br>Data do evento: <b>" + moment(context.state.start).format('DD/MM/YYYY') + "</b>" ,
              date: new Date().toLocaleString('pt-br'),
              user: [],
              userIds: context.rootState.users.userList.map(k => { return k.id}) || [],
              group: [],
              read: []
          }, {root:true})
          else
          context.dispatch('notifications/sendNotification', {
            name: "Sistema",
            title: "Novo evento",
            detail: "Um novo evento em que você está vinculado foi marcado! <br>Título do evento: <b>" + context.state.name + "</b> </br>Data do evento: <b>" + moment(context.state.start).format('DD/MM/YYYY') + "</b>" ,
            date: new Date().toLocaleString('pt-br'),
            user: context.state.editingUser?.map((obj) => { return Object.assign({}, obj) }) || [],
            userIds: context.state.editingUser.map(k => { return k.id}) || [],
            group: [],
            read: []
        }, {root:true})

          context.dispatch('setEvent')
      } 



      else if(context.state.name && context.state.start && context.state.end && context.state.startTime && context.state.endTime){
          await db.collection("calEvent").add({
          name: context.state.name,
          details: context.state.details,
          start: context.state.start + ' ' + context.state.startTime,
          end: context.state.end + ' ' + context.state.endTime,
          color: context.state.color,
          author: context.rootState.auth.user.uid,
          user: context.state.editingUser?.map((obj) => { return Object.assign({}, obj) }) || [],
        })
        context.dispatch('setEvent')
      }
      else {
        alert('Você deve inserir o nome, início e fim do evento')
      }
    },
    setName({ commit }, payload) {
      commit('setName', payload)
    },
    setDetails({ commit }, payload) {
      commit('setDetails', payload)
    },
    setStart({ commit }, payload) {
      commit('setStart', payload)
    },
    setEnd({ commit }, payload) {
      commit('setEnd', payload)
    },
    setStartTime({ commit }, payload) {
      commit('setStartTime', payload)
    },
    setEndTime({ commit }, payload) {
      commit('setEndTime', payload)
    },
    setColor({ commit }, payload) {
      commit('setColor', payload)
    },
    editUser({ commit }, payload) {
      commit('editUser', payload)
  }
  }


export default {
    namespaced: true,
    state,
    actions,
    mutations
}
