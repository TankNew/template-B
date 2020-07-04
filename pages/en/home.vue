<template>
  <section class="home">
    <section class="announce container">
      <h3 class="block-title">
        <span class="name">{{ $L(`Announce`) }}</span>
        <span class="more">
          <a :href="`/${culture}/annouce`">{{ $L('More') }} ></a>
        </span>
      </h3>
      <ul>
        <li v-for="item in announces" :key="item.id">
          <div class="cover">
            <img :src="item.cover" />
          </div>
          <h3>{{ item.title }}</h3>
        </li>
      </ul>
    </section>
    <section class="container product-list">
      <h3 class="block-title">
        <span class="name">{{ productGroup1.displayName }}</span>
        <span class="more">
          <a
            @click="goNewsGroup(productGroup1.id,3)"
            href="javascript:void(0)"
          >{{ $L('More') }} ></a>
        </span>
      </h3>
      <ul>
        <li
          v-for="item in productGroup1.items"
          @click="goNewsDetail(item.id,3)"
        >
          <div class="product-icon-container">
            <div class="product-icon">
              <span class="icon">
                <img :src="item.cover" />
              </span>
            </div>
            <div class="product-info">
              <span>{{ item.title }}</span>
            </div>
          </div>
        </li>
      </ul>
    </section>
    <section class="container">
      <section class="news-container">
        <section class="news">
          <div class="news-list">
            <dl>
              <dt class="block-title">
                <span class="name">{{ newsGroup1.displayName }}</span>
                <span class="more">
                  <a
                    @click="goNewsGroup(newsGroup1.id,1)"
                    href="javascript:void(0)"
                  >{{ $L('More') }} ></a>
                </span>
              </dt>
              <dd v-for="item in newsGroup1.items" :key="item">
                <a
                  class="gray"
                  href="javascript:void(0)"
                >{{ filter(`Documentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse plugin.`,60) }}</a>
              </dd>
            </dl>
          </div>
          <div class="ad">
            <div class="ad-img">
              <img ref="adImg" :src="ad1.img" />
            </div>
            <div class="ad-content">
              <h3 class="block-title">
                <span class="name">{{ ad1.title }}</span>
                <span class="more"></span>
              </h3>
              <div class="ad-text">
                {{ ad1.text }}Documentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse pluginDocumentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse pluginDocumentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse pluginDocumentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse pluginDocumentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our
                collapse pluginDocumentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse pluginDocumentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse pluginDocumentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse pluginDocumentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our
                collapse pluginDocumentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse pluginDocumentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse pluginDocumentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse pluginDocumentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse plugin
              </div>
              <div class="ad-links">
                <a
                  :href="ad1.url?ad1.url:'/'"
                  class="button-primary"
                >{{ $L(`More`) }} ></a>
              </div>
            </div>
          </div>
        </section>
      </section>
    </section>
    <section class="container picnews">
      <h3 class="block-title">
        <span class="name">{{ productGroup1.displayName }}</span>
        <span class="more">
          <a
            @click="goNewsGroup(productGroup1.id,3)"
            href="javascript:void(0)"
          >{{ $L('More') }} ></a>
        </span>
      </h3>
      <section class="looper">
        <client-only>
          <div v-swiper:mySwiper="swiperOption">
            <div class="swiper-wrapper position-relative">
              <div
                v-for="(item, index) in productGroup1.items"
                :key="index"
                class="swiper-slide"
              >
                <img :src="item.cover" />
                <div class="slide-info">
                  <a>{{ item.title }}</a>
                </div>
              </div>
            </div>
          </div>
        </client-only>
      </section>
    </section>
  </section>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import tools from '../../utiltools/tools'
import AppConsts from '../../utiltools/appconst'
export default {
  data() {
    return {
      wordIndex: 0,
      observer: null,
      announces: [],
      isProductLoading: false,
      swiperOption: {
        autoplay: true,
        slidesPerView: 5,
        spaceBetween: 30,
        slidesPerGroup: 5,
        loop: true
      }
    }
  },
  computed: {
    ...mapState({
      currentPath: state => state.app.currentPath,
      culture: state => state.app.culture,
      partners: state => state.app.partners,
      homePage: state => state.app.homePage
    })
  },
  async asyncData({ isDev, route, store, env, query, req, res, redirect, error }) {
    await store.dispatch('app/getHomePage')

    let newsGroup1, picGroup1, productGroup1, productGroup1Items, params, ad1, announces
    const homeGroups = store.state.app.homePage.groups.filter(x => x.catalogGroup)

    ad1 = store.state.app.homePage.blocks.length > 0 ? store.state.app.homePage.blocks[0] : {}
    newsGroup1 =
      homeGroups.filter(x => x.catalogGroup.catalogType === 1).length > 0
        ? homeGroups.filter(x => x.catalogGroup.catalogType === 1)[0].catalogGroup
        : null
    picGroup1 =
      homeGroups.filter(x => x.catalogGroup.catalogType === 2).length > 0
        ? homeGroups.filter(x => x.catalogGroup.catalogType === 2)[0].catalogGroup
        : null
    productGroup1 =
      homeGroups.filter(x => x.catalogGroup.catalogType === 3).length > 0
        ? homeGroups.filter(x => x.catalogGroup.catalogType === 3)[0].catalogGroup
        : null
    if (newsGroup1 !== null) {
      params = {
        params: {
          CatalogGroupId: newsGroup1.id,
          SkipCount: 0,
          MaxResultCount: 6,
          Sorting: 'IsTop DESC, Number DESC'
        }
      }
      newsGroup1.items = (await store.dispatch('app/getCatalogList', params)).items
    }
    if (picGroup1 !== null) {
      params = {
        params: {
          CatalogGroupId: picGroup1.id,
          SkipCount: 0,
          MaxResultCount: 6,
          Sorting: 'IsTop DESC, Number DESC'
        }
      }
      picGroup1.items = (await store.dispatch('app/getCatalogList', params)).items
    }
    if (productGroup1 !== null) {
      params = {
        params: {
          Id: productGroup1.id
        }
      }
      const result = await store.dispatch('app/getCatalogGroupList', params)
      productGroup1.children = result

      params = {
        params: {
          CatalogGroupId: productGroup1.id,
          SkipCount: 0,
          MaxResultCount: 6,
          Sorting: 'IsTop DESC, Number DESC'
        }
      }
      productGroup1.items = (await store.dispatch('app/getCatalogList', params)).items
    }
    params = {
      params: {
        SkipCount: 0,
        MaxResultCount: 2
      }
    }
    announces = (await store.dispatch('app/getAnounces', params)).items
    return { ad1, announces, newsGroup1, picGroup1, productGroup1 }
  },
  /**存放异步方法 */
  created() {},
  mounted() {},
  methods: {
    target(id) {
      window.open(`/${this.culture}/annouce/detail/` + String(id, '_blank'))
    },
    getImgUrl(val) {
      if (val) return AppConsts.remoteServiceBaseUrl + val
      else return null
    },
    goNewsGroup(id, type) {
      switch (type) {
        case 1:
          this.$router.push(`/${this.culture}/news/` + String(id))
          break
        case 2:
          this.$router.push(`/${this.culture}/photonews/` + String(id))
          break
        case 3:
          this.$router.push(`/${this.culture}/product/` + String(id))
          break
      }
    },
    goNewsDetail(id, type) {
      let typename
      switch (type) {
        case 1:
          typename = 'news'
          break
        case 2:
          typename = 'photonews'
          break
        case 3:
          typename = 'product'
          break
      }
      window.open(`/${this.culture}/` + typename + '/detail/' + String(id), '_blank')
    },
    filter(val, length) {
      return tools.cutString(tools._filter(val), length)
    },

    async loadProductGroup1SubGroupItems(item) {
      this.isProductLoading = true
      const params = {
        params: {
          CatalogGroupId: item.id,
          SkipCount: 0,
          MaxResultCount: 8,
          Sorting: 'IsTop DESC, Number DESC'
        }
      }
      const res = await this.$store.dispatch('app/getCatalogList', params)
      this.productGroup1Items = res.items
      this.isProductLoading = false
    }
  }
}
</script>
