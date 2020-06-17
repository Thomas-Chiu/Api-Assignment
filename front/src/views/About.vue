<template>
  <div class="about">
    <h1>This is an about page</h1>
    <input type="button" value="看商品" @click="product" />
    <input type="button" value="登出" @click="logout" />
  </div>
</template>

<script>
export default {
  methods: {
    product () {
      this.axios.get('http://localhost:3000/product')
        .then(res => {
          console.log(res.data)
        })
    },
    logout () {
      this.axios.get('http://localhost:3000/logout')
        .then(res => {
          this.$store.commit('logout')
          this.$router.push('/')
        })
    }
  }
}
</script>
