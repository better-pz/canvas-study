import i18n from './locales'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/fonticon/iconfont.css'

Vue.config.productionTip = false;


new Vue({
  i18n,
  router,
  render: h => h(App),
}).$mount('#app')
