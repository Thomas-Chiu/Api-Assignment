<template>
  <div class="home">
    <input type="text" v-model="account">
    <input type="password" v-model="password">
    <input type="button" value="登入" @click="login">
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
    login () {

    }
  },
  mounted () {
    this.axios.get('http://localhost:8080/product').then((response) => {
      console.log(response.data)
    })
  }
}
</script>
