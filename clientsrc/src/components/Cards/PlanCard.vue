<template>
  <div
    class="
      col-lg-3 col-8
      offset-2 offset-lg-0
      text-white
      bg-secondary
      rounded
      my-3
    "
  >
    <div class="row">
      <h4 class="col-12 bg-midnight p-2">{{ plan.Title }}</h4>
      <div class="col-12 py-3 bg-gold text-black mb-2">
        {{ plan.Frequency }} Subscription
      </div>
      <ul class="col-8 offset-2 col-lg-10 offset-lg-1">
        <li
          v-for="(description, index) in plan.Description"
          :key="`description-${index}`"
        >
          {{ description }}
        </li>
      </ul>
    </div>
    <div class="col-12" :id="paypalButtonContainer"></div>
  </div>
</template>

<script>
import swal from "sweetalert";
export default {
  name: "PlanCard",
  props: ["plan"],
  data() {
    return {
      paypalButtonContainer: "paypal-button-container" + this.plan.PlanId,
    };
  },
  mounted() {
    this.setupPaypalButtons(this.plan, this.updateSubscription);
  },
  methods: {
    setupPaypalButtons(plan, updateSubscription) {
      paypal
        .Buttons({
          style: {
            shape: "pill",
            color: "blue",
            layout: "vertical",
            label: "subscribe",
            height: 35,
          },
          createSubscription: function (data, actions) {
            return actions.subscription.create({
              plan_id: plan.PlanId,
              intent: "subscription",
              amount: {
                currency_code: "USD",
                value: plan.Price,
              },
            });
          },
          onApprove: function (data, actions) {
            swal({
              title: "Thank you for subscribing!",
              icon: "success",
              button: "Close",
            });
            updateSubscription(data);
          },
        })
        .render("#paypal-button-container" + this.plan.PlanId);
    },
    updateSubscription(data) {
      data.plan_id = this.plan.PlanId;
      this.$store.dispatch("subscribe", data);
    },
  },
};
</script>

<style scoped>
.bg-gold {
  background-color: gold;
}
</style>