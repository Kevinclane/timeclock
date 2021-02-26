<template>
  <div class="home bgimg container-fluid text-white">
    <div class="row">
      <h1 class="col">Time Clock</h1>
    </div>
    <div class="row">
      <div class="col-12">Online Time Clock</div>
      <div class="col-12">Track hours as a contractor or as a team</div>
    </div>
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
  beforeDestroy() {
    this.$store.dispatch("emptyData");
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
.bgimg {
  background-image: url("../assets/clockMechanics.jpg");
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  font-family: "Gloria Hallelujah", cursive;
  margin: 0 auto;
  overflow-x: hidden;
  user-select: none;
}
</style>