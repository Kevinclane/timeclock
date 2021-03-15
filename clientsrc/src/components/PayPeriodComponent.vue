<template>
  <option>{{ Start }} - {{ End }}</option>
</template>
<script>
import moment from "moment";
export default {
  name: "PayPeriodComponent",
  props: ["payPeriod", "index"],
  computed: {
    Start() {
      return moment(this.payPeriod.StartDay).format("MM/DD/YYYY");
    },
    End() {
      return moment(this.payPeriod.EndDay).format("MM/DD/YYYY");
    },
  },
};
</script>