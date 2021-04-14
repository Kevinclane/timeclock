<template>
  <div class="container">
    <div class="row">
      <div class="col-4">
        <div class="card-body p-2">
          <div class="card text-white">
            <div class="card-title bg-midnight">Basic Plan</div>
            <div class="card-text">
              Get access to unlimited projects for just $9.99/mo!
            </div>
          </div>
          <div class="card-footer" ref="paypal"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AYcNR6yomeNea5vOECeE_sq-qAhKxAVR_OLmkcbWaCkdvwdZ4dPKddnezSj-Lrgr3EnYekbWtxRLzYD4&disable-funding=credit,card";
    script.addEventListener("load", this.setLoaded);
    document.body.appendChild(script);
  },
  methods: {
    setLoaded() {
      this.loaded = true;
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              name: "Basic",
              description: this.product.description,
              billing_cycles: [
                {
                  frequency: {
                    interval_unit: "MONTH",
                    interval_count: 1,
                  },
                  tenure_type: "REGULAR",
                  sequence: 1,
                  total_cycles: 0,
                  pricing_scheme: {
                    value: this.product.price,
                    currency_code: "USD",
                  },
                },
              ],
              payment_preferences: {
                auto_bill_outstanding: true,
                payment_failure_threshhold: 1,
              },
            });
          },
        })
        .render(this.$refs.paypal);
    },
    // createOrder: function (data, actions) {
    //   return actions.order.create({
    //     purchase_units: [
    //       {
    //         amount: {
    //           value: "0.01",
    //         },
    //       },
    //     ],
    //   });
    // },
    // onApprove: function (data, actions) {
    //   return actions.order.capture().then(function (details) {
    //     alert("Transaction completed by TEST");
    //   });
    // },
  },
};
</script>