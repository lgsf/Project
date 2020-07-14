import { db } from "@/main"

const state = () => ({
    events: []
  })

  const mutations =  {
    setEvents: (state, events) => {
      state.events = events
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
    }
  }


export default {
    namespaced: true,
    state,
    actions,
    mutations
}
