<template>
  <option :value="`${service}`">{{ service }}</option>
</template>

<script>
export default {
  name: "TimeClockServiceOptions",
  props: ["service"],
};
</script>