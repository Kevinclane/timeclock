<template>
  <div class="col-4 card">
    <div class="card-body p-2">
      <div class="card text-white">
        <h3 class="card-title bg-midnight">{{ sub.Title }}</h3>
        <div class="card-text">
          {{ sub.Description }}
        </div>
      </div>
      <div class="card-footer" :id="paypalButtonContainer"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SubCard",
  props: ["sub"],
  data() {
    return {
      paypalButtonContainer: "paypal-button-container" + this.sub.PlanId,
    };
  },
  mounted() {
    this.setupPaypalButtons(this.sub);
  },
  methods: {
    setupPaypalButtons(sub) {
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
              plan_id: sub.PlanId,
              intent: "subscription",
              amount: {
                currency_code: "USD",
                value: sub.Price.toString(),
              },
            });
          },
          onApprove: function (data, actions) {
            alert("Thank you for subscribing!");
            this.$store.dispatch("updateUserSubscription", res.data);
          },
        })
        .render("#paypal-button-container" + this.sub.PlanId);
    },
  },
};
</script>