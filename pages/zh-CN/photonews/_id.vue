<template>
  <div class="container">
    <div class="news-page-block-title">
      <h4 class="page-title wide">
        <span class="name">{{ currentPath.displayName }}</span>
        <span class="more">
          <a v-if="collapse" @click="collapse=!collapse">
            {{ $L(`Expand`) }}
            <i class="fas fa-angle-down"></i>
          </a>
          <a v-else @click="collapse=!collapse">
            {{ $L(`Collapse`) }}
            <i class="fas fa-angle-up"></i>
          </a>
        </span>
      </h4>
      <div
        v-if="currentPath.children&&currentPath.children.length>0"
        :class="['page-sub-groups',collapse?'':'expand']"
      >
        <div @click="collapse=true" class="table">
          <div @click.stop.prevent class="list">
            <dl class="container">
              <dd v-for="child in currentPath.children" :key="child.id">
                <a
                  @click.stop.prevent="goNewsGroup(child.catalogGroupId,2)"
                  href="javascript:void(0)"
                >{{ child.displayName }}</a>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <section class="page-news-list-container">
      <div class="page-news-leftbar">
        <dl
          v-if="currentPath.children.length>0"
          class="page-news-leftbar-groups"
        >
          <dt>{{ currentPath.displayName }}</dt>
          <dd v-for="item in currentPath.children" :key="item.code">
            <a
              @click="goNewsGroup(item.catalogGroupId,2)"
              href="javascript:void(0)"
            >{{ item.displayName }}</a>
          </dd>
        </dl>
        <dl class="page-news-leftbar-announce">
          <dt>{{ $L(`Announce`) }}</dt>
          <dd v-for="item in announces" :key="item.code">
            <a @click="target(item.id)" href="javascript:void(0)">
              <i class="fas fa-chevron-right"></i>
              {{ item.title }}
            </a>
          </dd>
        </dl>
        <dl class="page-news-leftbar-contactus">
          <dt>{{ $L(`ContactUs`) }}</dt>
          <dd>
            <label>{{ $L(`Tel`) }}</label>
            {{ companyInfo.tel }}
          </dd>
          <dd>
            <label>{{ $L(`Email`) }}</label>
            {{ companyInfo.email }}
          </dd>
        </dl>
      </div>
      <div class="page-photo-news-list">
        <ul>
          <li v-for="item in pageContent.items" :key="item.id">
            <div class="news-cover">
              <a @click="goNewsDetail(item.id,2)" href="javascript:void(0)">
                <img :src="item.cover" />
              </a>
            </div>
            <div class="news-info">
              <a
                @click="goNewsDetail(item.id,2)"
                class="news-title"
                href="javascript:void(0)"
              >{{ item.title }}</a>
              <p class="news-intro">{{ filter(item.content,300) }}</p>
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
export default {
  data() {
    return {
      collapse: true,
      currentPage: 1,
      perPage: 6,
      pageContent: {}
    }
  },
  computed: {
    ...mapState({
      companyInfo: state => state.app.companyInfo,
      culture: state => state.app.culture,
      navbars: state => state.app.navbars,
      currentPath: state => state.app.currentPath,
      currentPathParent: state => state.app.currentPathParent,
      hasChildren: state => state.app.currentPath.children.length > 0
    })
  },
  watch: {
    $route(val) {
      this.currentPage = 1
      this.perPage = 10
      this.pageChange()
    }
  },
  validate({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.id)
  },
  async asyncData({ isDev, route, store, env, params, query, req, res, redirect, error }) {
    const subGroups = await store.dispatch('app/getCatalogGroupList', { params: { id: route.params.id } })
    params = {
      params: {
        SkipCount: 0,
        MaxResultCount: 2
      }
    }
    const announces = (await store.dispatch('app/getAnounces', params)).items
    return { subGroups, announces }
  },
  created() {
    this.pageChange()
  },
  methods: {
    target(id) {
      window.open(`/${this.culture}/announce/detail/` + String(id, '_blank'))
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
