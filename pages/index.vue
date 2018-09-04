<template>
  <div>首页</div>
</template>

<script>
  export default {
    async asyncData({ app, store, redirect }) {
      let areaId = store.state.country.id

      app.$axios.setHeader('token', store.state.token)
      let res = await app.$axios.get('/cms/portal_areas')
      if (res.data.length > 0) {
        let tag = false
        res.data.forEach((item, index) => {
          if (item.id == areaId && !item.portalStatus) {
            tag = true
          }
        })
        if (!tag) redirect('/tvguid');
      }
    },
    head() {
      return {
        title: 'Users'
      }
    }
  }
</script>

<style scoped>
  .title {
    margin: 30px 0;
  }

  .users {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .user {
    margin: 10px 0;
  }
</style>