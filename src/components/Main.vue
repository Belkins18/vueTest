<template>
  <div class="main">
    <Navigation/>
    <router-view></router-view>
  </div>
</template>

<script>
// @ is an alias to /src
import Navigation from '@/components/Navigation.vue'

export default {
  name: 'main',
  components: {
    Navigation
  }
}
</script>
