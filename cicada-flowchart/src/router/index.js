import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/home/index.vue'),
   
  },

  {
    path: '/demo',
    name: 'demo',
    component: () => import('@/views/demo/index.vue'),
  },
]

const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

export default router
