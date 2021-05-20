<template>
  <div class="col-lg-4 col-md-5 col-10 offset-1 offset-md-0 offset-lg-0 mb-2">
    <router-link
      v-bind:class="{ disabled: !project.Active }"
      :to="{ name: 'projectDetails', params: { projectId: project.id } }"
    >
      <div class="card border-primary mb-3 text-light project-card card-height">
        <div class="card-header">{{ project.Payee }}</div>
        <div class="card-body">
          <p class="card-text">Last Day Worked: {{ LastDayWorked }}</p>
          <p class="card-text">Hours this pay period: {{ TotalPPHours }}</p>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "ProjectCardComponent",
  props: ["project"],
  data() {
    return {
      payPeriodSelection: "",
      payPeriodDisplay: [],
    };
  },
  mounted() {
    if (this.project.InvoiceGroups) {
      this.updatePPSelection();
    }
  },
  computed: {
    LastDayWorked() {
      if (this.project.TimeClocks.length == 0) {
        return "Not Started";
      } else {
        let tcs = this.project.TimeClocks;
        let i = 1;
        let lastDay = tcs[0];
        while (i < tcs.length) {
          if (moment(tcs[i]).isAfter(moment(lastDay))) {
            lastDay = tcs[i];
          }
          i++;
        }
        return moment(lastDay).format("MM/DD/YYYY");
      }
    },

    TotalPPHours() {
      let times = this.payPeriodDisplay;
      let i = 0;
      let total = 0;
      while (i < times.length && times[i].EndTime) {
        let timeDiff = moment.duration(
          moment(times[i].EndTime).diff(moment(times[i].StartTime))
        );
        total += parseFloat(timeDiff.asHours());
        i++;
      }
      total = total.toFixed(2);
      return parseFloat(total);
    },
  },
  methods: {
    updatePPSelection() {
      if (this.payPeriodSelection == "") {
        let inital = this.project.InvoiceGroups.find((x) => x.Current);
        let start = moment(inital.StartDay).format("MM/DD/YYYY");
        let end = moment(inital.EndDay).format("MM/DD/YYYY");
        this.payPeriodSelection = `${start} - ${end}`;
      }
      let split = this.payPeriodSelection.split("-");
      let start = moment(split[0]);
      let end = moment(split[1]);
      let i = 0;
      //loops over every payPeriod object in InvoiceGroups
      while (i < this.project.InvoiceGroups.length) {
        //current payPeriod object being checked
        let IG = this.project.InvoiceGroups[i];
        let boolS = moment(IG.StartDay).isSameOrAfter(start);
        let boolE = moment(IG.EndDay).isSameOrBefore(end);
        if (boolS && boolE) {
          //should set correct timeClockGroups within query dates
          this.payPeriodDisplay = this.project.TimeClocks.filter(
            (tc) =>
              moment(tc.StartTime).isSameOrAfter(moment(IG.StartDay)) &&
              moment(tc.EndTime).isBefore(moment(IG.EndDay).add(1, "day"))
          );
          i = this.project.InvoiceGroups.length;
        } else i++;
      }
    },
  },
};
</script>

<style scoped>
</style>