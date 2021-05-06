<template>
  <div class="col-4 card">
    <div class="card-body p-2">
      <div class="card text-white">
        <h3 class="card-title bg-midnight p-2">{{ plan.Title }}</h3>
        <div class="card-text">
          {{ plan.Description }}
        </div>
      </div>
      <div class="card-footer" :id="paypalButtonContainer"></div>
    </div>
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