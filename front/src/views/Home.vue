<template>
  <div class="home">
    <input type="text" v-model="account">
    <input type="password" v-model="password">
    <input type="button" value="登入" @click="login">
    <input type="button" value="看商品" @click="product">
  </div>
</template>

<script>
export default {
  data () {
    return {
      account: '',
      password: ''
    }
  },
  methods: {
    product () {
      this.axios.get('http://localhost:3000/product')
        .then(res => {
          console.log(res.data)
        })
    },
    login () {
      this.axios.post('http://localhost:3000/login', {
        account: this.account,
        password: this.password
      })
        .then(res => {
          if (res.data.success) {
            alert('login success')
            this.$store.commit('login', res.data.account)
            this.$router.push('./about')
          } else {
            alert(res.data.message)
          }
        })
    }
  }
  // mounted () {
  //   this.axios.get('http://localhost:8080/product').then((response) => {
  //     console.log(response.data)
  //   })
  // }
}
</script>
