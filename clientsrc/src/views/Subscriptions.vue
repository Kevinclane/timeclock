<template>
  <div v-if="loading" class="container my-5">
    <div class="spinner-border my-5" role="status">
      <span class="visually-hidden my-5"></span>
    </div>
  </div>
  <div v-else class="container">
    <div v-if="activeSub" class="row text-light">
      <div class="col-6 offset-3">
        <div class="row bg-secondary mt-5">
          <div class="col-12 bg-primary dynamic-header2">
            My Subscription Status
          </div>
          <div class="col-12 py-2">{{ user.Plan.Title }}</div>
          <div class="col-12 py-2">Frequency: {{ user.Plan.Frequency }}</div>
          <div class="col-12 py-2">Status: {{ user.PPSubData.status }}</div>
          <div class="col-12 py-2">
            Next Charge:
            {{ nextBill }}
          </div>
          <div class="col-12 py-2">Charge Amount: ${{ user.Plan.Price }}</div>
          <div class="col-12 d-flex justify-content-around my-4">
            <button class="btn btn-sm btn-green">Update My Subscription</button>
            <button class="btn btn-sm btn-danger" @click="cancelSubscription()">
              Cancel My Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row d-flex justify-content-between my-3">
      <plan-card v-for="plan in allPlans" :key="plan.Id" :plan="plan">
      </plan-card>
    </div>
    <div
      v-if="showPromoCodeData"
      class="col-8 offset-2 text-light my-5 bg-secondary p-3"
    >
      <div class="row">
        <div class="col-12">Code: {{ promoCode }}</div>
        <div class="col-12">Plan:</div>
        <div class="col-12">Details:</div>
        <div class="col-12 d-flex justify-content-around mt-3">
          <button class="btn btn-info btn-sm">Enter different Code</button>
          <button class="btn btn-green btn-sm">Activate</button>
        </div>
      </div>
    </div>
    <div v-else class="col-12 text-light">
      PromoCode: <input type="text" v-model="promoCode" />
      <button class="btn btn-green btn-sm" @click="checkPromoCode()">
        Enter
      </button>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import swal from "sweetalert";
import PlanCard from "../components/Cards/PlanCard.vue";
export default {
  name: "Subscriptions",
  data() {
    return {
      activeSub: false,
      loading: true,
      promoCode: "",
      showPromoCodeData: false,
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
    cancelSubscription() {
      swal({
        title: "Are you sure?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal("Sorry to see you leave. You're welcome back anytime!", {
            icon: "success",
          });
          this.$store.dispatch("updateSubscription", { type: "cancel" });
        }
      });
    },
    toggleShowPromoCodeData() {
      this.showPromoCodeData = !this.showPromoCodeData;
    },
    checkPromoCode() {
      let reqObj = {
        code: this.promoCode,
      };
      this.$store.dispatch("checkPromoCode", reqObj);
      this.toggleShowPromoCodeData();
    },
    usePromoCode() {
      let reqObj = {
        code: this.promoCode,
      };
      this.$store.dispatch("usePromoCode", reqObj);
    },
  },
  computed: {
    allPlans() {
      return this.$store.state.allPlans;
    },
    user() {
      return this.$store.state.user;
    },
    nextBill() {
      return moment(
        this.$store.state.user.PPSubData.billing_info.next_billing_time
      ).format("MM/DD/YYYY");
    },
  },
  components: {
    PlanCard,
  },
};
</script>
