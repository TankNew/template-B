import appconst from './utiltools/appconst'
let ajaxConfig = {
  // baseURL: appconst.remoteServiceBaseUrl,
  proxy: true,
  credentials: true
}
if (process.env.NODE_ENV === 'production')
  ajaxConfig = {
    baseURL: appconst.remoteServiceBaseUrl,
    // proxy: true,
    credentials: true
  }

const defaultTheme = 'blue'
let css = ['~/static/css/all.min.css']
if (process.env.NODE_ENV === 'development') css.push(`assets/css/theme.${defaultTheme}.less`)

export default {
  publicRuntimeConfig: {
    NUXT_ENV: process.env.NUXT_ENV || process.env.NODE_ENV,
    NUXT_ENV_THEME: process.env.NUXT_ENV_THEME || defaultTheme,
    NUXT_ENV_TENANT_ID: process.env.NUXT_ENV_TENANT_ID || 18,
    API_SECRET: `1234`
  },
  privateRuntimeConfig: {},
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: `Ednet共享建站 - 更节省、更安全` + process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      }
    ]
    // link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  // 删除nuxt自动生成的标签，可能影响seo
  hooks: {
    'render:route': (url, result) => {
      result.html = result.html.replace(/ data-n-head=".*?"/gi, '').replace(/ data-hid=".*?"/gi, '')
    }
  },
  router: {
    // scrollBehavior(to, from, savedPosition) {
    //   if (savedPosition) {
    //     return savedPosition
    //   } else {
    //     return { x: 0, y: 0 }
    //   }
    // },
    middleware: ['user-agent'],
    // 配置路由的模式，鉴于服务端渲染的特性，不建议修改该配置
    mode: 'history'
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css,
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/axios.js' },
    { src: '~/plugins/main.js' },
    { src: '~/plugins/combined-inject.js' },
    { src: '~/plugins/client.js', mode: 'client' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    'cookie-universal-nuxt'
  ],
  bootstrapVue: {
    bootstrapCSS: false, // Or `css: false`
    bootstrapVueCSS: true // Or `bvCSS: false`
  },
  /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     baseURL and proxy cannot be used at the same time, so when the proxy option is in use, you need to define prefix instead of baseURL.
     */
  axios: ajaxConfig,
  proxy: {
    '/api/': { target: 'https://cms.ednet.cn' },
    '/AbpUserConfiguration/': { target: 'https://cms.ednet.cn' }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'cheap-module-source-map'
      }
    }
  }
}
