<template>
  <div class="container">
    <div class="row">
      <plan-card v-for="plan in allPlans" :key="plan.Id" :plan="plan">
      </plan-card>
    </div>
  </div>
</template>

<script>
import PlanCard from "../components/Cards/PlanCard.vue";
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
    this.$store.dispatch("getAllPlans");
  },
  methods: {},
  computed: {
    allPlans() {
      return this.$store.state.allPlans;
    },
  },
  components: {
    PlanCard,
  },
};
</script>