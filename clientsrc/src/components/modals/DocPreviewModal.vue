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
            Invoice #{{ invoiceNumber }}
            <i
              class="fas fa-edit"
              type="button"
              @click="toggleShowEditNumber()"
            ></i>
          </div>
          <div v-else class="col-12">
            Invoice # <input type="text" v-model="invoiceNumber" />
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
            Invoice Date: {{ invoiceDate }}
            <i
              class="fas fa-edit"
              type="button"
              @click="toggleShowEditToday()"
            ></i>
          </div>
          <div v-else class="col-12">
            Invoice Date: <input type="date" v-model="invoiceDate" />
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
          <div class="col-12">Service Period: {{ activePP.ReadableDates }}</div>
        </div>
        <div
          class="row mt-4"
          v-for="(week, index) in activePP.Weeks"
          :key="`week-${index}`"
        >
          <div class="col-12">Week of {{ week.readableDates }}</div>
          <div class="col-12">
            <div class="row border-bottom-black">
              <div class="col-3 bold">Date</div>
              <div class="col-6 bold">Service</div>
              <div class="col-3 bold">Hours</div>
            </div>
          </div>
          <div class="col-12 border-bottom-black">
            <div v-if="week">
              <div
                v-for="(day, index) in week.days"
                :key="`day-${index}`"
                class="row"
              >
                <div v-if="day.tcs.length > 0" class="col-3">
                  {{ day.readableDate }}
                </div>
                <div v-if="day.tcs.length > 0" class="col-6">
                  {{ day.service }}
                </div>
                <div v-if="day.tcs.length > 0" class="col-3">
                  {{ day.totalTime }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-3 offset-9">EOW Total: {{ week.totalTime }}</div>
        </div>
        <div class="row mt-5">
          <div class="col-12">
            <div
              class="row"
              v-for="(week, index) in activePP.weeks"
              :key="`week-${index}`"
            >
              <div v-if="week.OTTime == 0" class="col-9 text-right">
                {{ week.totalTime }} x ${{ project.Rate }}/hr
              </div>
              <div v-if="week.OTTime == 0" class="col-3">
                ${{ week.totalPay }}
              </div>
              <div v-if="week.OTTime > 0" class="col-9 text-right">
                {{ week.regHours }} x ${{ project.Rate }}/hr
              </div>
              <div v-if="week.OTTime > 0" class="col-3">${{ week.regPay }}</div>
              <div v-if="week.OTTime > 0" class="col-9 text-right">
                {{ week.OTTime }} x ${{ week.OTRate }}/hr
              </div>
              <div v-if="week.OTTime > 0" class="col-3">${{ week.OTPay }}</div>
            </div>
          </div>
        </div>
        <div class="row mt-3 border-bottom-black">
          <div class="col-3 offset-9">Balance Due</div>
        </div>
        <div class="row">
          <div class="col-3 offset-9">${{ activePP.TotalPay }}</div>
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
import { docBuilder } from "../../helperFiles/documentBuilder.js";
import { AlignmentType, TabStopPosition, TabStopType } from "docx";
export default {
  name: "DocPreview",
  props: ["project"],
  data() {
    return {
      invoiceDate: moment().format("MM/DD/YYYY"),
      invoiceNumber: null,
      modifiedWeeks: [],
      showEditName: false,
      showEditNumber: false,
      showEditToday: false,
      changedData: false,
    };
  },
  async mounted() {
    if (this.activePP.InvoiceDate) {
      this.invoiceDate = moment(this.activePP.InvoiceDate).format("MM/DD/YYYY");
    } else {
      this.invoiceDate = moment().format("MM/DD/YYYY");
    }
    this.invoiceNumber = this.$store.state.invoiceNumber;
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    invoiceBody() {
      let body = [
        // new docx.Paragraph({
        //   alignment: docx.AlignmentType.CENTER,
        //   children: [
        //     new docx.TextRun(
        //       `Invoice for work performed by ${this.project.ProjectSettings.NameOnInvoice} to ${this.project.Payee}`
        //     ),
        //   ],
        // }),
        docBuilder.buildCenteredLine(
          `Invoice for work performed by ${this.project.ProjectSettings.NameOnInvoice} to ${this.project.Payee}`
        ),
        new docx.Paragraph({
          alignment: docx.AlignmentType.CENTER,
          children: [new docx.TextRun(`Invoice # ${this.invoiceNumber}`)],
        }),
        new docx.Paragraph({
          alignment: docx.AlignmentType.CENTER,
          children: [new docx.TextRun(`Invoice date: ${this.invoiceDate}`)],
        }),
        new docx.Paragraph({
          alignment: docx.AlignmentType.CENTER,
          children: [
            new docx.TextRun(`Service Period: ${this.activePP.ReadableDates}`),
          ],
        }),
        new docx.Paragraph({ text: " " }),
      ];
      let i = 0;
      while (i < this.activePP.Weeks.length) {
        let currentWeek = this.activePP.Weeks[i];
        body.push(
          new docx.Paragraph({
            children: [
              new docx.TextRun(`\tWeek of ${currentWeek.readableDates}`),
            ],
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
              new docx.TextRun({ text: "Date", bold: true }),
              new docx.TextRun({ text: "\tService", bold: true }),
              new docx.TextRun({ text: "\t\tHours", bold: true }),
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
        while (x < currentWeek.days.length) {
          let currentDay = currentWeek.days[x];
          if (currentDay.tcs.length > 0) {
            body.push(
              new docx.Paragraph({
                children: [
                  new docx.TextRun(`${currentDay.readableDate}`),
                  new docx.TextRun(`\t${currentDay.service}`),
                  new docx.TextRun(`\t\t${currentDay.totalTime}`),
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
              new docx.TextRun(``),
              new docx.TextRun(``),
              new docx.TextRun(``),
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
        body.push(
          new docx.Paragraph({
            children: [new docx.TextRun(`EOW Total: ${currentWeek.totalTime}`)],
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
      while (i < this.activePP.Weeks.length) {
        if (this.activePP.Weeks[i].overTime == 0) {
          body.push(
            new docx.Paragraph({
              children: [
                new docx.TextRun(" "),
                new docx.TextRun(``),
                new docx.TextRun(
                  `\t${this.activePP.Weeks[i].totalTime} x $${this.project.Rate}/hr`
                ),
                new docx.TextRun(`\t\t$${this.activePP.Weeks[i].totalPay}`),
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
        } else {
          body.push(
            new docx.Paragraph({
              children: [
                new docx.TextRun(" "),
                new docx.TextRun(``),
                new docx.TextRun(
                  `\t${this.activePP.Weeks[i].regTime} x $${this.project.Rate}/hr`
                ),
                new docx.TextRun(`\t\t$${this.activePP.Weeks[i].regPay}`),
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
          body.push(
            new docx.Paragraph({
              children: [
                new docx.TextRun(" "),
                new docx.TextRun(``),
                new docx.TextRun(
                  `\t${this.activePP.Weeks[i].overTime} x $${
                    this.project.Rate * 1.5
                  }/hr`
                ),
                new docx.TextRun(
                  `\t\t$${
                    this.activePP.Weeks[i].overTime * (this.project.Rate * 1.5)
                  }`
                ),
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
        }
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
          children: [new docx.TextRun(`$${this.activePP.TotalPay}`)],
          alignment: AlignmentType.RIGHT,
        })
      );
      return body;
    },
    activePP() {
      return this.$store.state.activePP;
    },
  },
  methods: {
    closeModal() {
      if (this.changedData) {
        this.$store.dispatch("getActiveProject", this.$route.params.projectId);
      }
      this.$emit("closeModal");
    },
    generateWordDoc() {
      let doc = new docx.Document();

      doc.addSection({
        children: this.invoiceBody,
      });
      docx.Packer.toBlob(doc).then((blob) => {
        fs.saveAs(
          blob,
          "Invoice" + this.project.Payee + this.invoiceNumber + ".docx"
        );
      });
      this.savePayPeriod(this.activePP);
    },
    savePayPeriod(payPeriod) {
      payPeriod.InvoiceDate = moment();
      this.$store.dispatch("savePayPeriodInvoiceData", payPeriod);
    },
    toggleShowEditName() {
      this.showEditName = !this.showEditName;
    },
    saveNameChange() {
      this.project.ProjectSettings.projectId = this.$route.params.projectId;
      this.$store.dispatch("saveProjectSettings", this.project.ProjectSettings);
      this.changedData = true;
      this.toggleShowEditName();
    },
    toggleShowEditNumber() {
      this.showEditNumber = !this.showEditNumber;
    },
    saveNumberChange() {
      this.changedData = true;
      this.toggleShowEditNumber();
    },
    toggleShowEditToday() {
      this.showEditToday = !this.showEditToday;
    },
    saveTodayChange() {
      this.invoiceDate = moment(this.invoiceDate).format("MM/DD/YYYY");
      this.toggleShowEditToday();
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