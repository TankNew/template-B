export default function({ $axios, store, app, redirect }) {
  require(`assets/css/theme.${app.$env.NUXT_ENV_THEME}.less`)
  $axios.onRequest(
    config => {
      config.headers.common[store.state.app.headerName] = store.getters['app/getCulture']

      const multiTenancyHeader = 'Abp.TenantId'
      const multiTenancy = app.$cookies.get(multiTenancyHeader)
      // 加载ID环境变量
      config.headers.common[multiTenancyHeader] = app.$env.NUXT_ENV_TENANT_ID

      return config
    },
    function(error) {
      return Promise.reject(error)
    }
  )

  $axios.onResponse(
    response => {
      return response
    },
    error => {
      if (
        !!error.response &&
        !!error.response.data.error &&
        !!error.response.data.error.message &&
        error.response.data.error.details
      ) {
        console.error(error.response.data.error.message)
        console.error(error.response.data.error.details)
      } else if (!!error.response && !!error.response.data.error && !!error.response.data.error.message) {
        console.error(error.response.data.error.message)
        redirect('/error')
      } else if (!error.response) {
        console.error(`no response`)
      }
      console.error(`ajax error`)
      return Promise.reject(error)
    }
  )
}
