<template>
  <div class="container">
    <h4 class="page-title">
      <span class="name">{{ currentPath.displayName }}</span>
      <span class="more"></span>
    </h4>
    <div class="page-content">
      <div class="contactus">
        <ul>
          <li>
            <label>{{ $L(`CompanyName`) }}</label>
            {{ companyInfo.appName }}
          </li>
          <li>
            <label>{{ $L(`Address`) }}</label>
            {{ companyInfo.appAddress }}
          </li>
          <li>
            <label>{{ $L(`Tel`) }}</label>
            {{ companyInfo.tel }}
          </li>
          <li>
            <label>{{ $L(`Email`) }}</label>
            {{ companyInfo.email }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      companyInfo: state => state.app.companyInfo,
      currentPath: state => state.app.currentPath,
      currentPathParent: state => state.app.currentPathParent
    })
  },
  created() {}
}
</script>
