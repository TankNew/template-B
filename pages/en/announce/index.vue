<template>
  <section class="container">
    <h4 class="page-title">
      <span
        class="name"
      >{{ currentPath!==null?currentPath.displayName:currentPathParent.displayName }}</span>
      <span class="more"></span>
    </h4>
    <div class="announce-list-container">
      <div class="page-announce-list">
        <ul>
          <li
            v-for="item in pageContent.items"
            :key="item.id"
            @click="target(item.id,1)"
          >
            <div class="news-date">
              <span class="news-day">{{ new Date(item.creationTime).getDay() }}</span>
              <span
                class="news-month"
              >{{ new Date(item.creationTime).getFullYear() }}/{{ new Date(item.creationTime).getMonth()+1 }}</span>
            </div>
            <div class="news-info">
              <a class="news-title" href="javascript:void(0)">{{ item.title }}</a>
              <p class="news-intro">{{ filter(item.content,200) }}</p>
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
    </div>
  </section>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import tools from '../../../utiltools/tools'
export default {
  data() {
    return {
      collapse: true,
      currentPage: 1,
      perPage: 8,
      pageContent: {}
    }
  },
  computed: {
    ...mapState({
      navbars: state => state.app.navbars,
      currentPath: state => state.app.currentPath,
      currentPathParent: state => state.app.currentPathParent
    })
  },
  created() {
    this.pageChange()
  },
  methods: {
    target(id) {
      window.open(`/${this.culture}/announce/detail/` + String(id, '_blank'))
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
      this.pageContent = await this.$store.dispatch('app/getAnounces', params)
    }
  }
}
</script>
