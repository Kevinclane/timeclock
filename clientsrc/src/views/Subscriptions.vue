<template>
  <div class="container">
    <div class="row">
      <sub-card v-for="sub in allSubs" :key="sub.Id" :sub="sub"> </sub-card>
    </div>
  </div>
</template>

<script>
import SubCard from "../components/Cards/SubCard.vue";
export default {
  name: "Subscriptions",
  data() {
    return {
      loaded: false,
      paidFor: false,
      product: {
        price: 9.99,
        description: "Just a test",
      },
    };
  },
  mounted() {
    this.$store.dispatch("getAllSubscriptions");
  },
  methods: {},
  computed: {
    allSubs() {
      return this.$store.state.allSubs;
    },
  },
  components: {
    SubCard,
  },
};
</script>