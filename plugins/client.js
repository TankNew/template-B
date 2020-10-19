import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'
// import style (>= Swiper 6.x)
// import 'swiper/swiper-bundle.css'

// import style (<= Swiper 5.x)
import 'swiper/css/swiper.css'
// import VueAwesomeSwiper from 'vue-awesome-swiper/dist/ssr'
// If used in nuxt.js/ssr, you should keep it only in browser build environment
Vue.use(VueAwesomeSwiper)

if (process.browser) {
  // const VueAwesomeSwiper = require('vue-awesome-swiper/dist/ssr')
}
