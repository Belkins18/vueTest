<template>
  <!-- Navigation -->
  <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
    <div class="container">
      <router-link class="navbar-brand" to="/">My Stock</router-link>
      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        Menu
        <i class="fas fa-bars"></i>
      </button>
      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="home">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="products">Products</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="orders">Orders</router-link>
          </li>
        </ul>

        <div class="mt-md-0">
          <div class="nav-item">
            <router-link class="nav-link" to="signIn">LogIn</router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    name: "Navigation",
  }
</script>

<style scoped>

</style>