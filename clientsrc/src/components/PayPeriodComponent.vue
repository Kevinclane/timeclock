<template>
  <option :value="payPeriod.id">{{ payPeriod.ReadableDates }}</option>
</template>
<script>
export default {
  name: "PayPeriodComponent",
  props: ["payPeriod"],
};
</script>