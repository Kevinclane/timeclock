<template>
  <div v-if="loading" class="container my-5">
    <div class="spinner-border my-5" role="status">
      <span class="visually-hidden my-5"></span>
    </div>
  </div>
  <div v-else class="container">
    <div v-if="activeSub" class="row text-light">
      <div class="col-12 my-2">Looks like you're already subscribed!</div>
      <div class="col-12 my-2">
        This website is currently in it's Beta stages and will be updated asap!
      </div>
      <div class="col-12 my-2">
        If you wish to cancel your membership, please go to paypal directly to
        do so
      </div>
      <div class="col-12 my-2">
        Click
        <a
          class="text-primary"
          href="https://www.paypal.com/myaccount/autopay/"
          target="_blank"
          >HERE</a
        >
        for a direct link to the subscriptions page.
      </div>
      <div class="col-12 my-2">
        I hope you're enjoying this app and I appreciate your support!
        <i class="fa fa-heart text-red" aria-hidden="true"></i>
      </div>
      <div class="col-12 my-2">
        Please leave some feedback
        <span class="text-primary" type="button" @click="toFeedback()"
          >HERE</span
        >
        so I can make this app even better!
      </div>
    </div>
    <div v-else class="row d-flex justify-content-between my-3">
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
      activeSub: false,
      loading: true,
    };
  },
  async mounted() {
    this.$store.dispatch("getAllPlans");
    this.checkSubStatus();
  },
  methods: {
    async checkSubStatus() {
      await this.$store.dispatch("getProfile");
      if (this.$store.state.user.Subscription.SubStatus !== "Free") {
        this.activeSub = true;
        this.loading = false;
      } else {
        this.activeSub = false;
        this.loading = false;
      }
    },
  },
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