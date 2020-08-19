import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

import pt from 'vuetify/src/locale/pt.ts'

export default new Vuetify({
  icons: {
    iconfont: 'md'
  },
  lang: {
    locales: { pt },
    current: 'pt',
  },
  theme: {
    themes: {
      light: {
        primary: '#607D8B',
        secondary: '#CFD8DC',
        accent: '#8c9eff',
        error: '#b71c1c',
      },
      dark: {
        primary: '#3949AB',
        secondary: '#9FA8DA',
        accent: '#8c9eff',
        error: '#b71c1c',
      },
    },
  },
})
