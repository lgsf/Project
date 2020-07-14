import { db } from "@/main"

const state = () => ({
    events: [],
    name: '',
    details: '',
    start: '',
    startTime:'',
    end: '',
    endTime:'',
    color: '#000000',
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
    }
}

const actions = {
    setEvent: async context => {
      let snapshot = await db.collection('calEvent').get()
      const events = []
      snapshot.forEach(doc => {
        let appData = doc.data()
        appData.id = doc.id
        events.push(appData)
      })
      context.commit('setEvents', events)
    },
    async updateEventStore (context, payload) {
      context.commit('setDetails', payload.details)
      await db.collection('calEvent').doc(payload.id).update({
        details: context.state.details
      })
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
          color: context.state.color
        })
        context.dispatch('setEvent')
      } else if(context.state.name && context.state.start && context.state.end && context.state.startTime && context.state.endTime){
          await db.collection("calEvent").add({
          name: context.state.name,
          details: context.state.details,
          start: context.state.start + ' ' + context.state.startTime,
          end: context.state.end + ' ' + context.state.endTime,
          color: context.state.color
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
  }


export default {
    namespaced: true,
    state,
    actions,
    mutations
}
