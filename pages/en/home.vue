<template>
  <section class="home">
    <section v-if="announces && announces.length > 0" class="announce container">
      <h3 class="block-title">
        <span class="name">{{ $L(`Announce`) }}</span>
        <span class="more">
          <a :href="`/${culture}/announce`">{{ $L('More') }} ></a>
        </span>
      </h3>
      <ul>
        <li v-for="item in announces" :key="item.id" @click="target(item.id)">
          <div class="cover">
            <img :src="item.cover" />
          </div>
          <h3>{{ item.title }}</h3>
        </li>
      </ul>
    </section>
    <section v-if="productGroup1" class="container product-list">
      <h3 class="block-title">
        <span class="name">{{ productGroup1.title }}</span>
        <span class="more">
          <a @click="goNewsGroup(productGroup1.catalogGroupId, productGroup1.type)" href="javascript:void(0)">{{ $L('More') }} ></a>
        </span>
      </h3>
      <ul>
        <li v-for="item in productGroup1.children" :key="item.id" @click="goNewsGroup(item.id, productGroup1.type)">
          <div class="product-icon-container">
            <div class="product-icon">
              <span class="icon">
                <img :src="item.icon" />
              </span>
            </div>
            <div class="product-info">
              <span>{{ item.displayName }}</span>
            </div>
          </div>
        </li>
      </ul>
    </section>
    <section v-if="picGroup1" class="container picnews">
      <h3 class="block-title">
        <span class="name">{{ picGroup1.title }}</span>
        <span class="more">
          <a @click="goNewsGroup(picGroup1.catalogGroupId, picGroup1.type)" href="javascript:void(0)">{{ $L('More') }} ></a>
        </span>
      </h3>
      <section class="looper">
        <client-only>
          <div v-swiper:picSwiper="swiperOption">
            <div class="swiper-wrapper position-relative">
              <div
                v-for="item in picGroup1.items"
                :key="item.id"
                :data-index="item.id"
                :data-group="picGroup1.type"
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
    <section v-if="newsGroup1" class="container">
      <section class="news-container">
        <section class="news">
          <div class="news-list">
            <dl>
              <dt class="block-title">
                <span class="name">{{ newsGroup1.title }}</span>
                <span class="more">
                  <a @click="goNewsGroup(newsGroup1.catalogGroupId, newsGroup1.type)" href="javascript:void(0)">{{ $L('More') }} ></a>
                </span>
              </dt>
              <dd v-for="item in newsGroup1.items" :key="item.id">
                <a @click="goNewsDetail(item.id, newsGroup1.type)" class="gray" href="javascript:void(0)">{{
                  filter(item.title, 60)
                }}</a>
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
              <div class="ad-text">{{ ad1.text }}</div>
              <div class="ad-links">
                <a :href="ad1.url ? ad1.url : 'javascript:void(0)'" class="button-primary">{{ $L(`More`) }} ></a>
              </div>
            </div>
          </div>
        </section>
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
      isProductLoading: false
    }
  },
  computed: {
    swiperOption() {
      let that = this
      let option = {
        autoplay: true,
        slidesPerView: 3,
        spaceBetween: 30,
        slidesPerGroup: 3,
        loop: true,
        on: {
          click() {
            const realIndex = this.clickedSlide.dataset.index
            const group = parseInt(this.clickedSlide.dataset.group)
            that.goNewsDetail(realIndex, group)
          }
        }
      }
      return option
    },
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
    productGroup1 = homeGroups.length > 0 ? homeGroups[0] : null
    picGroup1 = homeGroups.length > 1 ? homeGroups[1] : null
    newsGroup1 = homeGroups.length > 2 ? homeGroups[2] : null

    if (newsGroup1 !== null) {
      params = {
        params: {
          CatalogGroupId: newsGroup1.catalogGroupId,
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
          CatalogGroupId: picGroup1.catalogGroupId,
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
          Id: productGroup1.catalogGroupId
        }
      }
      const result = await store.dispatch('app/getCatalogGroupList', params)
      productGroup1.children = result

      params = {
        params: {
          CatalogGroupId: productGroup1.catalogGroupId,
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
        MaxResultCount: 1
      }
    }
    announces = (await store.dispatch('app/getAnounces', params)).items
    return { ad1, announces, newsGroup1, picGroup1, productGroup1 }
  },
  created() {},
  methods: {
    handleClickSlide(index, reallyIndex) {
      console.log(index)
      console.log(reallyIndex)
    },
    target(id) {
      window.open(`/${this.culture}/announce/detail/` + String(id, '_blank'))
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
