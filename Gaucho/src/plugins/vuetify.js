import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'md'
  },
  theme: {
    primary: '#ff0000',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#ff4444',
    info: '#33b5e5',
    success: '#00C851',
    warning: '#ffbb33'
  }
})
