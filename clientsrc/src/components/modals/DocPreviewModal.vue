<template>
  <div class="container-fluid text-black">
    <div id="docTemplate" class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-12">
            Invoice for work performed by {{ user.Name }} to {{ project.Payee }}
          </div>
          <div class="col-12">Invoice #</div>
          <div class="col-12">Invoice Date: {{ today }}</div>
          <div class="col-12">Service Period: {{ payPeriodSelection }}</div>
        </div>
        <div
          class="row mt-4"
          v-for="(week, index) in modifiedWeeks"
          :key="`week-${index}`"
        >
          <div class="col-12">Week of {{ week.readable }}</div>
          <div class="col-12">
            <div class="row border-bottom-black">
              <div class="col-3">Date</div>
              <div class="col-6">Service</div>
              <div class="col-3">Hours</div>
            </div>
          </div>
          <div class="col-12 border-bottom-black">
            <div
              v-for="(day, index) in week.groupedWeek"
              :key="`day-${index}`"
              class="row"
            >
              <div class="col-3">{{ day.date }}</div>
              <div class="col-6">{{ day.service }}</div>
              <div class="col-3">{{ day.time }}</div>
            </div>
          </div>
          <div class="col-3 offset-9">EOW Total: {{ week.totalTimes }}</div>
        </div>
        <div class="row mt-5">
          <div class="col-12">
            <div
              class="row"
              v-for="(week, index) in weeks"
              :key="`week-${index}`"
            >
              <div v-if="!week.OTHours" class="col-9 text-right">
                {{ week.totalTimes }} x ${{ project.Rate }}/hr
              </div>
              <div v-if="!week.OTHours" class="col-3">${{ week.pay }}</div>
              <div v-if="week.OTHours" class="col-9 text-right">
                {{ week.regHours }} x ${{ project.Rate }}/hr
              </div>
              <div v-if="week.OTHours" class="col-3">${{ week.regPay }}</div>
              <div v-if="week.OTHours" class="col-9 text-right">
                {{ week.OTHours }} x ${{ week.OTRate }}/hr
              </div>
              <div v-if="week.OTHours" class="col-3">${{ week.OTPay }}</div>
            </div>
          </div>
        </div>
        <div class="row mt-3 border-bottom-black">
          <div class="col-3 offset-9">Balance Due</div>
        </div>
        <div class="row">
          <div class="col-3 offset-9">${{ totalPay }}</div>
        </div>
      </div>
    </div>
    <div class="row sticky-bottom">
      <div class="col-6">
        <button class="btn btn-danger" @click="closeModal()">Cancel</button>
      </div>
      <div class="col-6">
        <button class="btn btn-green" @click="exportToWord()">Download</button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "DocPreview",
  props: ["weeks"],
  data() {
    return {
      today: moment().format("MM/DD/YYYY"),
      modifiedWeeks: [],
    };
  },
  mounted() {
    this.groupWeeks();
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    project() {
      return this.$store.state.activeProject;
    },
    payPeriodSelection() {
      return this.$store.state.payPeriodSelection;
    },
    totalPay() {
      let i = 0;
      let total = 0;
      while (i < this.weeks.length) {
        total += this.weeks[i].pay;
        i++;
      }
      return total;
    },
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    groupWeeks() {
      this.modifiedWeeks = [...this.weeks];
      let i = 0;
      //loop through weeks
      while (i < this.modifiedWeeks.length) {
        let currentWeek = this.modifiedWeeks[i];
        let x = 0;
        let week = [];
        //loop through timeclocks
        while (x < currentWeek.timeClocks.length) {
          let currentDay = currentWeek.timeClocks[x];
          let day = {
            date: moment(currentDay[0].StartTime).format("MM/DD/YYYY"),
            time: 0,
            service: currentDay[0].Comment,
          };
          let y = 0;
          while (y < currentDay.length) {
            if (!day.service.includes(currentDay[y].Comment)) {
              day.service += " / " + currentDay[y].Comment;
            }
            let timeDiff = moment.duration(
              moment(currentDay[y].EndTime).diff(
                moment(currentDay[y].StartTime)
              )
            );
            day.time += parseFloat(timeDiff.asHours());
            y++;
          }
          day.time = day.time.toFixed(2);
          week.push(day);
          x++;
        }
        this.modifiedWeeks[i].groupedWeek = week;
        // groupedWeeks.push(week);
        i++;
      }
    },
    exportToWord() {
      let element = "docTemplate";
      let filename = "test";
      var preHtml =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
      var postHtml = "</body></html>";
      var html =
        preHtml + document.getElementById(element).innerHTML + postHtml;
      var blob = new Blob(["\ufeff", html], {
        type: "application/msword",
      });

      // Specify link url
      var url =
        "data:application/vnd.ms-word;charset=utf-8," +
        encodeURIComponent(html);

      // Specify file name
      filename = filename ? filename + ".doc" : "document.doc";

      // Create download link element
      var downloadLink = document.createElement("a");

      document.body.appendChild(downloadLink);

      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        // Create a link to the file
        downloadLink.href = url;

        // Setting the file name
        downloadLink.download = filename;

        //triggering the function
        downloadLink.click();
      }

      document.body.removeChild(downloadLink);
    },
  },
};
</script>

<style scoped>
.bg-gray {
  background-color: gray;
}
.sticky-bottom {
  position: absolute;
  bottom: 10px;
  width: 100%;
}
</style>