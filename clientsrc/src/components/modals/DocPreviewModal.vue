<template>
  <div class="container-fluid text-black">
    <div id="docTemplate" class="row">
      <div class="col-12">
        <div class="row">
          <div v-if="!showEditName" class="col-12">
            Invoice for work performed by
            {{ project.ProjectSettings.NameOnInvoice }} to
            {{ project.Payee }}
            <i
              class="fas fa-edit"
              type="button"
              @click="toggleShowEditName()"
            ></i>
          </div>
          <div v-else class="col-12">
            Invoice for work performed by
            <input
              type="text"
              v-model="project.ProjectSettings.NameOnInvoice"
            />
            to {{ project.Payee }}
            <i
              class="fa fa-check text-green ml-4"
              aria-hidden="true"
              type="button"
              @click="saveNameChange()"
            >
            </i>
            <i
              class="fa fa-times text-red ml-4"
              aria-hidden="true"
              type="button"
              @click="toggleShowEditName()"
            ></i>
          </div>
          <div v-if="!showEditNumber" class="col-12">
            Invoice #{{ activeIG.InvoiceNumber }}
            <i
              class="fas fa-edit"
              type="button"
              @click="toggleShowEditNumber()"
            ></i>
          </div>
          <div v-else class="col-12">
            Invoice # <input type="text" v-model="activeIG.InvoiceNumber" />
            <i
              class="fa fa-check text-green ml-4"
              aria-hidden="true"
              type="button"
              @click="saveNumberChange()"
            >
            </i>
            <i
              class="fa fa-times text-red ml-4"
              aria-hidden="true"
              type="button"
              @click="toggleShowEditNumber()"
            ></i>
          </div>
          <div v-if="!showEditToday" class="col-12">
            Invoice Date: {{ today }}
            <i
              class="fas fa-edit"
              type="button"
              @click="toggleShowEditToday()"
            ></i>
          </div>
          <div v-else class="col-12">
            Invoice Date: <input type="date" v-model="today" />
            <i
              class="fa fa-check text-green ml-4"
              aria-hidden="true"
              type="button"
              @click="saveTodayChange()"
            >
            </i>
            <i
              class="fa fa-times text-red ml-4"
              aria-hidden="true"
              type="button"
              @click="toggleShowEditToday()"
            ></i>
          </div>
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
        <button class="btn btn-green" @click="generateWordDoc()">
          Download
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import * as docx from "docx";
import * as fs from "file-saver";
import moment from "moment";
import { AlignmentType, TabStopPosition, TabStopType } from "docx";
export default {
  name: "DocPreview",
  props: ["weeks", "project"],
  data() {
    return {
      today: moment().format("MM/DD/YYYY"),
      modifiedWeeks: [],
      showEditName: false,
      showEditNumber: false,
      showEditToday: false,
      changedData: false,
    };
  },
  async mounted() {
    await this.activeCheck();
    await this.groupWeeks();
    if (this.project.ProjectSettings.RoundFrequency == "Week") {
      await this.roundWeeks();
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
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
    invoiceBody() {
      let body = [
        new docx.Paragraph({
          alignment: docx.AlignmentType.CENTER,
          children: [
            new docx.TextRun(
              `Invoice for work performed by ${this.project.ProjectSettings.NameOnInvoice} to ${this.project.Payee}`
            ),
          ],
        }),
        new docx.Paragraph({
          alignment: docx.AlignmentType.CENTER,
          children: [
            new docx.TextRun(`Invoice # ${this.activeIG.InvoiceNumber}`),
          ],
        }),
        new docx.Paragraph({
          alignment: docx.AlignmentType.CENTER,
          children: [new docx.TextRun(`Invoice date: ${this.today}`)],
        }),
        new docx.Paragraph({
          alignment: docx.AlignmentType.CENTER,
          children: [
            new docx.TextRun(`Service Period: ${this.payPeriodSelection}`),
          ],
        }),
        new docx.Paragraph({ text: " " }),
      ];
      let i = 0;
      while (i < this.modifiedWeeks.length) {
        let currentWeek = this.modifiedWeeks[i];
        body.push(
          new docx.Paragraph({
            children: [new docx.TextRun(`\tWeek of ${currentWeek.readable}`)],
            tabStops: [
              {
                type: TabStopType.CENTER,
                position: 4513,
              },
            ],
          })
        );
        body.push(
          new docx.Paragraph({
            children: [
              new docx.TextRun("Date"),
              new docx.TextRun("\tService"),
              new docx.TextRun("\t\tHours"),
            ],
            tabStops: [
              {
                type: TabStopType.CENTER,
                position: 4513,
              },
              {
                type: TabStopType.RIGHT,
                position: 7500,
              },
            ],
          })
        );
        let x = 0;
        while (x < currentWeek.groupedWeek.length) {
          let currentDay = currentWeek.groupedWeek[x];
          if (currentWeek.groupedWeek[x + 1] == undefined) {
            body.push(
              new docx.Paragraph({
                children: [
                  new docx.TextRun(`${currentDay.date}`),
                  new docx.TextRun(`\t${currentDay.service}`),
                  new docx.TextRun(`\t\t${currentDay.time}`),
                ],
                tabStops: [
                  {
                    type: TabStopType.CENTER,
                    position: 4513,
                  },
                  {
                    type: TabStopType.RIGHT,
                    position: 7500,
                  },
                ],
                border: {
                  bottom: {
                    color: "auto",
                    space: 1,
                    value: "single",
                    size: 6,
                  },
                },
              })
            );
          } else {
            body.push(
              new docx.Paragraph({
                children: [
                  new docx.TextRun(`${currentDay.date}`),
                  new docx.TextRun(`\t${currentDay.service}`),
                  new docx.TextRun(`\t\t${currentDay.time}`),
                ],
                tabStops: [
                  {
                    type: TabStopType.CENTER,
                    position: 4513,
                  },
                  {
                    type: TabStopType.RIGHT,
                    position: 7500,
                  },
                ],
              })
            );
          }
          x++;
        }
        body.push(
          new docx.Paragraph({
            children: [
              new docx.TextRun(`EOW Total: ${currentWeek.totalTimes}`),
            ],
            alignment: AlignmentType.RIGHT,
          })
        );
        i++;
      }
      body.push(
        new docx.Paragraph({
          children: [new docx.TextRun(" ")],
        })
      );
      body.push(
        new docx.Paragraph({
          children: [new docx.TextRun(" ")],
        })
      );
      i = 0;
      while (i < this.modifiedWeeks.length) {
        body.push(
          new docx.Paragraph({
            children: [
              new docx.TextRun(" "),
              new docx.TextRun(``),
              new docx.TextRun(
                `\t${this.modifiedWeeks[i].totalTimes} x $${this.project.Rate}/hr`
              ),
              new docx.TextRun(`\t\t$${this.modifiedWeeks[i].pay}`),
            ],
            tabStops: [
              {
                type: TabStopType.CENTER,
                position: 6500,
              },
              {
                type: TabStopType.RIGHT,
                position: 7500,
              },
            ],
          })
        );
        i++;
      }
      body.push(
        new docx.Paragraph({
          children: [new docx.TextRun(" ")],
        })
      );
      body.push(
        new docx.Paragraph({
          children: [new docx.TextRun("Balance Due")],
          alignment: AlignmentType.RIGHT,
          border: {
            bottom: {
              color: "auto",
              space: 1,
              value: "single",
              size: 6,
            },
          },
        })
      );
      body.push(
        new docx.Paragraph({
          children: [new docx.TextRun(`$${this.totalPay}`)],
          alignment: AlignmentType.RIGHT,
        })
      );
      return body;
    },
    activeIG() {
      return this.$store.state.activeInvoiceGroup;
    },
  },
  methods: {
    closeModal() {
      if (this.changedData) {
        this.$store.dispatch("getActiveProject", this.$route.params.projectId);
      }
      this.$emit("closeModal");
    },
    groupWeeks() {
      let ps = this.project.ProjectSettings;
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
            if (ps.RoundTime && ps.RoundFrequency == "TC") {
              timeDiff = parseFloat(timeDiff.asHours().toFixed(2));
              timeDiff = this.roundTime(timeDiff, ps.RoundTo);
              day.time += timeDiff;
            } else {
              day.time += parseFloat(timeDiff.asHours());
            }
            y++;
          }
          day.time = day.time.toFixed(2);
          // debugger;
          if (ps.RoundTime && ps.RoundFrequency == "Day") {
            day.time = this.roundTime(day.time, ps.RoundTo);
          }
          week.push(day);
          x++;
        }
        this.modifiedWeeks[i].groupedWeek = week;
        // groupedWeeks.push(week);
        i++;
      }
    },
    //time is a number with or without decimal
    //numbers after decimal are fractions of an hour
    roundTime(time, roundTo) {
      debugger;
      time = time.toString();
      let Hours;
      let Minutes;
      if (time.includes(".")) {
        let split = time.split(".");
        Hours = split[0];
        Minutes = parseFloat("." + split[1]);
      }
      Minutes = Math.round((Minutes * 60) / roundTo) * roundTo;
      if (Minutes == 60) {
        Minutes = 0;
        Hours++;
      }
      Hours = Hours.toString();
      Minutes = Math.round((Minutes / 60) * 100).toString();
      if (Minutes.length == 1) {
        Minutes = Minutes + "0";
      }
      time = parseFloat(Hours + "." + Minutes);
      return time;
    },
    roundWeeks() {
      debugger;
      let i = 0;
      while (i < this.modifiedWeeks.length) {
        this.modifiedWeeks[i].totalTimes = this.roundTime(
          this.modifiedWeeks[i].totalTimes,
          this.project.ProjectSettings.RoundTo
        );
        i++;
      }
    },
    generateWordDoc() {
      let doc = new docx.Document();

      doc.addSection({
        children: this.invoiceBody,
        // new docx.Paragraph[this.generatedWeeksForInvoice](),
        // this.generatedWeeksForInvoice,
      });

      docx.Packer.toBlob(doc).then((blob) => {
        fs.saveAs(blob, "Test.docx");
      });
    },
    toggleShowEditName() {
      this.showEditName = !this.showEditName;
    },
    saveNameChange() {
      this.project.ProjectSettings.projId = this.$route.params.projectId;
      this.$store.dispatch("saveProjectSettings", this.project.ProjectSettings);
      this.changedData = true;
      this.toggleShowEditName();
    },
    toggleShowEditNumber() {
      this.showEditNumber = !this.showEditNumber;
    },
    saveNumberChange() {
      this.$store.dispatch("updateInvoiceNumbers", this.activeIG);
      this.changedData = true;
      this.toggleShowEditNumber();
    },
    toggleShowEditToday() {
      this.showEditToday = !this.showEditToday;
    },
    saveTodayChange() {
      this.today = moment(this.today).format("MM/DD/YYYY");
      this.toggleShowEditToday();
    },
    activeCheck() {
      if (!this.project.Active) {
        this.$router.push({ name: "dashboard" });
      }
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