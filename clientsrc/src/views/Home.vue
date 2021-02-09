<template>
  <div class="home">
    <h1>Time Manager</h1>
  </div>
</template>


<script>
export default {
  name: "home",
  data() {
    return {};
  },
  async mounted() {
    await this.$store.dispatch("getProfile");
  },
  computed: {
    userInfo() {
      return this.$store.state.user;
    },
  },
  methods: {},
  components: {},
};
</script>


<style scoped>
</style>