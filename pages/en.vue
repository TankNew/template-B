<template>
  <div class="body-container">
    <!-- 头部 -->
    <header>
      <div :class="['fixed-bar',currentPath.navbarType!==5?'sub':''] ">
        <div class="container position-relative">
          <div class="fixed-bar-content">
            <a @click="back" class="mobile-back">
              <i class="fas fa-chevron-left"></i>
              {{ $L(`Back`) }}
            </a>
            <div class="header-title">
              <div class="logo">
                <img :src="companyInfo.logo" />
              </div>
              <div class="company-name">{{ companyInfo.appName }}</div>
            </div>
            <div v-if="multiLangs" class="lang-bar-mobile">
              <a @click="changeLanguage('zh-CN')" class="lang-switch-btn">中/EN</a>
            </div>
            <div class="lang-bar-pc">
              <span>
                <i class="fas fa-phone-alt"></i>
                {{ companyInfo.tel }}
              </span>
              <span
                @click="isWeixinShow=true"
                href="javascript:void(0)"
                class="icon-weixin"
              >
                <i class="fab fa-weixin"></i>
              </span>
            </div>
          </div>
          <div v-if="isWeixinShow===true" class="wexin-code">
            <div class="code">
              <img :src="companyInfo.weixinBarCode" />
              <h6>扫一扫，直接在手机上打开</h6>
              <p>推荐微信、QQ扫一扫等扫码工具</p>
            </div>
            <span @click="isWeixinShow=false" class="close">
              <i class="fas fa-times"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="header-container">
        <!-- 导航 -->
        <div class="navbar-container">
          <b-navbar toggleable="lg" type="blue" variant="blue">
            <b-navbar-toggle target="nav-collapse">
              <i class="fas fa-align-justify"></i>
            </b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
              <b-navbar-nav>
                <section v-for="item in navbars" :key="item.id">
                  <b-nav-item-dropdown
                    v-if="item.children&&item.children.length>0"
                    :class="[currentPath.code&&((item.navbarType!==5&&currentPath.code.includes(item.code))||(item.navbarType===5&&currentPath.code===item.code))?'active':'']"
                    :text="$L(item.displayName)"
                  >
                    <b-dropdown-item
                      v-for="ditem in item.children"
                      :key="ditem.id"
                      :to="ditem.url"
                    >{{ $L(ditem.displayName) }}</b-dropdown-item>
                  </b-nav-item-dropdown>
                  <b-nav-item
                    v-else
                    :class="[currentPath.code&&((item.navbarType!==5&&currentPath.code.includes(item.code))||(item.navbarType===5&&currentPath.code===item.code))?'active':'']"
                    :to="item.url"
                  >{{ $L(item.displayName) }}</b-nav-item>
                </section>
              </b-navbar-nav>
            </b-collapse>
          </b-navbar>
        </div>
        <div v-if="multiLangs" class="lang-bar-navbar">
          <a @click="changeLanguage('zh-CN')" class="lang-switch-btn">中/EN</a>
        </div>
      </div>
    </header>
    <!-- banner -->
    <section :class="['banner',currentPath.navbarType!==5?'sub':'']">
      <client-only>
        <div v-swiper:mySwiper="swiperOption">
          <div class="swiper-wrapper position-relative">
            <div
              v-for="(item, index) in bannerImgs"
              :key="index"
              class="swiper-slide"
            >
              <img :src="getImgUrl(item.imgUrl)" />
              <div class="carousel-caption">
                <div :class="currentFontPosition(item)">
                  <h2>{{ item.title }}</h2>
                  <p>{{ item.subTitle }}</p>
                </div>
              </div>
            </div>
          </div>
          <div slot="button-prev" class="swiper-banner-prev"></div>
          <div slot="button-next" class="swiper-banner-next"></div>
          <div class="swiper-pagination"></div>
        </div>
      </client-only>
    </section>
    <section class="main">
      <div v-if="isDevelopment" class="development">
        <ul>
          <li v-for="item in themes" :key="item.displayName">
            <a
              @click="changeTheme(item)"
              :style="`background-color:hsl(${item.hue},${item.saturation},${item.lightness})`"
            ></a>
          </li>
        </ul>
      </div>
      <div v-if="!currentPath.isHome" class="breadCrumb-container">
        <div class="container">
          <b-breadcrumb :items="breadCrumbItems"></b-breadcrumb>
        </div>
      </div>
      <nuxt-child ref="main" />
    </section>
    <footer>
      <div class="container icp">
        <dl>
          <dt>
            Copyright
            <i class="far fa-copyright"></i>
            2019-{{ year }}
            {{ companyInfo.appName }}
          </dt>
          <dd v-for="item in companyInfo.icps">
            <a
              class="gongan secondary"
              target="_blank"
              href="http://beian.miit.gov.cn/publish/query/indexFirst.action"
            >
              <span>津ICP备{{ item }}</span>
            </a>
          </dd>
          <dd v-for="item in companyInfo.gongAns">
            <a
              :href="`http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${item}`"
              class="gongan secondary"
              target="_blank"
            >
              <img src="@/assets/imgs/gongan.png" />
              <span>津公网安备{{ item }}号</span>
            </a>
          </dd>
          <dd>
            技术支持：
            <a
              href="https://www.ednet.cn"
              class="secondary"
              target="_blank"
            >e德互联</a>
          </dd>
        </dl>
      </div>
    </footer>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import AppConsts from '../utiltools/appconst'
export default {
  head() {
    return {
      title: this.currentPath.displayName + ' - ' + this.companyInfo.appName + '-' + this.companyInfo.seoKeyWords,
      meta: [
        { hid: 'keywords', name: 'keywords', content: this.companyInfo.seoKeyWords },
        { hid: 'description', name: 'description', content: this.companyInfo.description }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: this.companyInfo.icon }]
    }
  },
  data() {
    return {
      slide: 0,
      year: new Date().getFullYear(),
      sliding: null,
      isWeixinShow: false,
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        navigation: {
          nextEl: '.swiper-banner-next',
          prevEl: '.swiper-banner-prev'
        },
        loop: true,
        autoHeight: true,
        on: {
          slideChange() {},
          tap() {}
        }
      }
    }
  },
  computed: {
    ...mapState({
      abp: state => state.abp,
      themes: state => state.themes,
      multiLangs: state => state.abp.localization.languages.length > 1,
      companyInfo: state => state.app.companyInfo,
      navbars: state => state.app.navbars.slice(0, 8),
      currentPath: state => state.app.currentPath,
      currentPathParent: state => state.app.currentPathParent,
      breadCrumbItems: state => state.app.breadCrumbItems,
      bannerImgs: state =>
        state.app.currentPath.bannerImgs
          ? state.app.currentPath.bannerImgs.length > 0
            ? state.app.currentPath.bannerImgs
            : state.app.currentPathParent
            ? state.app.currentPathParent.bannerImgs
            : []
          : []
    }),
    title() {
      return this.$L(this.currentPath.displayName)
    },
    Address() {
      return this.$L(`Address`)
    },
    Tel() {
      return this.$L(`Tel`)
    },
    Email() {
      return this.$L(`Email`)
    }
  },
  watch: {
    $route(val) {
      this.setcurrentPath({ path: this.$route.path })
    }
  },
  async asyncData(context) {
    let language = `en`
    context.app.$cookies.set(context.store.state.app.headerName, language, {
      path: context.store.state.abp.appPath || '/',
      maxAge: 5 * 365 * 86400000
    })
    context.store.commit('app/setCulture', language)
    await context.store.dispatch('app/getCompanyInfo')
    await context.store.dispatch('app/getNavbars')
    return { name: 'Main', userAgent: context.userAgent, language, theme: context.$config.NUXT_ENV_THEME }
  },
  created() {
    this.setcurrentPath({ path: this.$route.path })
  },
  methods: {
    changeTheme(val) {
      document.documentElement.style.setProperty('--primary-hue', val.hue)
      document.documentElement.style.setProperty('--primary-saturation', val.saturation)
      document.documentElement.style.setProperty('--primary-lightness', val.lightness)
    },
    back() {
      this.$router.back(-1)
    },
    changeLanguage(lang) {
      window.location.href = '/' + lang + '/home'
    },
    ...mapActions({ setcurrentPath: 'app/setcurrentPath' }),
    go(url) {
      this.$router.push({ path: url })
    },
    getImgUrl(val) {
      if (val) return AppConsts.remoteServiceBaseUrl + val
      else return null
    },
    currentFontPosition(item) {
      return `banner-font ${item.titleAlign} ${item.titleVertical}`
    }
  }
}
</script>
