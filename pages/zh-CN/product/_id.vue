<template>
  <div class="container">
    <h4 class="page-title wide">
      <span class="name">{{ currentPath.displayName }}</span>
      <span class="more"></span>
    </h4>
    <section v-if="hasChildren">
      <div class="page-product-list">
        <ul>
          <li
            v-for="item in subGroups"
            :key="item.id"
            @click="goNewsGroup(item.id,3)"
          >
            <span class="cover">
              <img :src="item.cover" />
            </span>
            <div class="cover-info">
              <span class="cover-title">
                <a href="javascript:void(0)">{{ item.displayName }}</a>
              </span>
              <p v-html="filter(item.info,100)" class="cover-content"></p>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <section v-else>
      <div class="page-product-list">
        <ul>
          <li
            v-for="item in pageContent.items"
            :key="item.id"
            @click="goNewsDetail(item.id,3)"
          >
            <span class="cover">
              <img :src="item.cover" />
            </span>
            <div class="cover-info">
              <span class="cover-title">
                <a href="javascript:void(0)">{{ item.title }}</a>
              </span>
              <p v-html="filter(item.content,100)" class="cover-content"></p>
            </div>
          </li>
        </ul>
      </div>
      <div class="my-5">
        <b-pagination
          v-model="currentPage"
          :per-page="perPage"
          :total-rows="pageContent.totalCount"
          @input="pageChange"
          align="center"
          pills
        ></b-pagination>
      </div>
    </section>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import tools from '../../../utiltools/tools'
const c = 1
const p = 8
export default {
  data() {
    return {
      currentPage: c,
      perPage: p,
      collapse: true
    }
  },
  computed: {
    ...mapState({
      culture: state => state.app.culture,
      navbars: state => state.app.navbars,
      currentPath: state => state.app.currentPath,
      currentPathParent: state => state.app.currentPathParent,
      hasChildren: state => state.app.currentPath.children.length > 0
    })
  },
  validate({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.id)
  },
  async asyncData({ isDev, route, store, env, params, query, req, res, redirect, error }) {
    const param = {
      params: {
        IsActive: true,
        CatalogGroupId: route.params.id,
        SkipCount: (c - 1) * p,
        MaxResultCount: p
      }
    }
    const json = await store.dispatch('app/getCatalogList', param)
    const subJson = await store.dispatch('app/getCatalogGroupList', { params: { id: route.params.id } })

    return { pageContent: json, subGroups: subJson }
  },
  created() {},
  methods: {
    filter(val, length) {
      return tools.cutString(tools._filter(val), length)
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
    async pageChange() {
      const params = {
        params: {
          IsActive: true,
          CatalogGroupId: this.$route.params.id,
          SkipCount: (this.currentPage - 1) * this.perPage,
          MaxResultCount: this.perPage
        }
      }
      this.pageContent = await this.$store.dispatch('app/getCatalogList', params)
    }
  }
}
</script>
