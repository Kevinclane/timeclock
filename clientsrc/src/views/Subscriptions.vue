<template>
  <div class="container">
    <div class="row">
      <div class="col-4">
        <div class="card-body p-2">
          <div class="card text-white">
            <h3 class="card-title bg-midnight">Basic Plan</h3>
            <div class="card-text">
              Get access to unlimited projects for just $9.99/mo!
            </div>
          </div>
          <div
            class="card-footer"
            id="paypal-button-container-P-60M8600290984641EMCHWWQQ"
          ></div>
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
    // const script = document.createElement("script");
    // script.src =
    //   "https://www.paypal.com/sdk/js?client-id=AYcNR6yomeNea5vOECeE_sq-qAhKxAVR_OLmkcbWaCkdvwdZ4dPKddnezSj-Lrgr3EnYekbWtxRLzYD4&vault=true&intent=subscription";
    // script.addEventListener("load", this.setLoaded);
    // document.body.appendChild(script);
    paypal
      .Buttons({
        style: {
          shape: "pill",
          color: "blue",
          layout: "vertical",
          label: "subscribe",
        },
      })
      .render("#paypal-button-container-P-60M8600290984641EMCHWWQQ");
  },
  methods: {
    setLoaded() {
      this.loaded = true;
      window.paypal
        .Buttons({
          createSubscription: function (data, actions) {
            return actions.subscription.create({
              plan_id: "P-60M8600290984641EMCHWWQQ",
            });
          },
          onApprove: function (data, actions) {
            alert("Thank you for subscribing!");
          },
        })
        .render("#paypal-button-container-P-60M8600290984641EMCHWWQQ");
    },
  },
};
</script>