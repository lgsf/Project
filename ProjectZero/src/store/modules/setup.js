import { db } from '@/main'
import { fileStorage } from '@/main'
import catchError from '@/utilities/firebaseErrors'

const state = () => ({
  id: '',
  selectedTheme: '',
  companyName: '',
  companyContact: '',
  companyEmail: '',
  imgUrl: '',
  image: null
})

const mutations = {
  setID(state, payload) {
    state.id = payload
  },

  setName(state, payload) {
    state.companyName = payload
  },

  setContact(state, payload) {
    state.companyContact = payload
  },

  setEmail(state, payload) {
    state.companyEmail = payload
  },

  setTheme(state, payload) {
    state.selectedTheme = payload
  },

  setImgUrl(state, payload) {
    state.imgUrl = payload
  },

  setImage(state, payload) {
    state.image = payload
  }
}

const actions = {

  setName({ commit }, payload) {
    commit('setName', payload)
  },

  setEmail({ commit }, payload) {
    commit('setEmail', payload)
  },

  setContact({ commit }, payload) {
    commit('setContact', payload)
  },

  readCompanyName({ commit }) {
    db.collection("systemConfiguration")
      .get()
      .then((querySnapshot) => {
        let companyName = ''
        querySnapshot.forEach((doc) => {
          companyName = doc.data().company_name
        })
        commit('setName', companyName)
      })
      .catch(error => {
        let errorMessage = catchError(error)
        this.dispatch('general/setErrorMessage', errorMessage)
      })
  },

  readLogo({ commit }) {
    let imgUrl = ''
    fileStorage
      .ref("logo")
      .listAll()
      .then(result => {
        result.items[0].getDownloadURL().then(url => {
          imgUrl = url
          commit('setImgUrl', imgUrl)
        })
      }).catch(error => {
        let errorMessage = catchError(error)
        this.dispatch('general/setErrorMessage', errorMessage)
      })
  },

  readConfiguration({ commit }) {
    this.dispatch('general/setIsLoading')
    this.dispatch('general/resetAllMessages', '')
    db.collection("systemConfiguration")
      .get()
      .then((querySnapshot) => {
        let id, companyName, companyContact, companyEmail, selectedTheme
        querySnapshot.forEach((doc) => {
          id = doc.id
          companyName = doc.data().company_name
          companyContact = doc.data().company_phone
          companyEmail = doc.data().company_email
          selectedTheme = doc.data().theme_code
        })
        commit('setID', id)
        commit('setName', companyName)
        commit('setContact', companyContact)
        commit('setEmail', companyEmail)
        commit('setTheme', selectedTheme)
        this.dispatch('general/resetIsLoading')
      })
      .catch((error) => {
        this.dispatch('general/resetIsLoading')
        let errorMessage = catchError(error)
        this.dispatch('general/setErrorMessage', errorMessage)
      })

    let imgUrl = ''
    fileStorage
      .ref("logo")
      .listAll()
      .then(result => {
        result.items[0].getDownloadURL().then(url => {
          imgUrl = url
          commit('setImgUrl', imgUrl)
        })
      })
      .catch(error => {
        let errorMessage = catchError(error)
        this.dispatch('general/setErrorMessage', errorMessage)
      })
  },

  onFilePicked(context, event) {
    let imgUrl, image;
    const inputFile = event.target.files[0];
    const fileReader = new FileReader();
    let promise = new Promise(resolve => {
      fileReader.onload = (e) => {
        imgUrl = e.target.result
        resolve();
      };
    });
    fileReader.readAsDataURL(inputFile);
    promise.then(() => {
      context.commit('setImgUrl', imgUrl);
      image = inputFile;
      context.commit('setImage', image);
    });
  },

  saveConfiguration({ state }) {
    db.collection("systemConfiguration")
      .doc(state.id)
      .update({
        company_name: state.companyName || "",
        company_phone: state.companyContact || "",
        company_email: state.companyEmail || "",
        theme_code: state.selectedTheme,
      })
      .then(() => {
        const fileName = 'logo/logo-dropo' + state.image.name.slice(state.image.name.lastIndexOf('.'))
        const storageRef = fileStorage.ref(fileName)
        storageRef.put(state.image)
      })
      .then(() => {
        this.dispatch('general/setSuccessMessage', 'Suas configurações foram salvas com sucesso!')
        this.dispatch('setup/readConfiguration')
      })
      .catch((error) => {
        this.dispatch('general/resetIsLoading')
        let errorMessage = catchError(error)
        this.dispatch('general/setErrorMessage', errorMessage)
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