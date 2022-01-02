<template>
  <div v-if="Week.overTime == 0" class="w-100">
    <div class="col-9 text-right">
      {{ Week.totalTime }} x ${{ Project.Rate }}/hr
    </div>
    <div class="col-3">${{ Week.totalPay }}</div>
  </div>

  <div v-else class="w-100">
    <div class="col-9 text-right">
      {{ Week.regTime }} x ${{ Project.Rate }}/hr
    </div>
    <div class="col-3">${{ Week.regPay }}</div>
    <div class="col-9 text-right">
      {{ Week.overTime }} x ${{ Project.ProjectSettings.OTRate }}/hr
    </div>
    <div class="col-3">${{ Week.OTPay }}</div>
  </div>
</template>

<script>
export default {
  name: "WeekTotals",
  props: ["Week", "Project"],
};
</script>