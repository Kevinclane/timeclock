<template>
  <div class="row">
    <div class="col-1">
      <span
        ><i class="fas fa-edit" type="button" @click="toggleEditForm"></i
      ></span>
    </div>
    <div class="col-6">
      <span>{{ Start }} -</span>
      <span v-if="timeClock.EndTime">{{ End }}</span>
    </div>
    <div v-if="showEditForm" class="editForm bg-light container">
      <edit-time-clock-form-component
        :timeClock="timeClock"
        @closeModal="toggleEditForm"
      />
    </div>
    <div v-if="timeClock.EndTime" class="col-4">{{ Total }} Hours</div>
    <div v-else class="col-4">
      {{ currentTimer.hour }}:
      <span v-if="currentTimer.minute < 10" class="mr-neg-4">0</span>
      {{ currentTimer.minute }}:
      <span v-if="currentTimer.second < 10" class="mr-neg-4">0</span>
      {{ currentTimer.second }}
    </div>
  </div>
</template>

<script>
import EditTimeClockFormComponent from "./EditTimeClockFormComponent.vue";
import moment from "moment";
export default {
  name: "TimeClockComponent",
  props: ["timeClock"],
  data() {
    return {
      showEditForm: false,
      currentTimer: {},
      currentDate: Date(),
    };
  },
  mounted() {
    if (!this.timeClock.EndTime) {
      this.startLiveClock();
    }
  },
  methods: {
    toggleEditForm() {
      this.showEditForm = !this.showEditForm;
    },
    startLiveClock() {
      let start = {
        hour: parseInt(moment(this.timeClock.StartTime).format("HH")),
        minute: parseInt(moment(this.timeClock.StartTime).format("mm")),
        second: parseInt(moment(this.timeClock.StartTime).format("ss")),
      };
      let current = {
        hour: parseInt(moment(this.currentDate).format("HH")),
        minute: parseInt(moment(this.currentDate).format("mm")),
        second: parseInt(moment(this.currentDate).format("ss")),
      };
      let diff = {
        hour: current.hour - start.hour,
        minute: current.minute - start.minute,
        second: current.second - start.second,
      };
      if (diff.second < 0) {
        diff.second += 60;
        diff.minute -= 1;
      }
      if (diff.minute < 0) {
        diff.minute += 60;
        diff.hour -= 1;
      }
      this.currentTimer = diff;
      this.updateTime();
    },
    updateTime() {
      setInterval(() => {
        this.currentTimer.second++;
        if (this.currentTimer.second == 60) {
          this.currentTimer.minute++;
          this.currentTimer.second = 0;
          if (this.currentTimer.minute == 60) {
            this.currentTimer.hour++;
            this.currentTimer.minute = 0;
          }
        }
      }, 1000);
    },
  },
  computed: {
    Start() {
      return moment(this.timeClock.StartTime).format("h:mm A");
    },
    End() {
      return moment(this.timeClock.EndTime).format("h:mm A");
    },
    Total() {
      if (this.timeClock.EndTime) {
        let start = {
          hour: parseInt(moment(this.timeClock.StartTime).format("HH")),
          minute: parseInt(moment(this.timeClock.StartTime).format("mm")),
          second: parseInt(moment(this.timeClock.StartTime).format("ss")),
        };
        let end = {
          hour: parseInt(moment(this.timeClock.EndTime).format("HH")),
          minute: parseInt(moment(this.timeClock.EndTime).format("mm")),
          second: parseInt(moment(this.timeClock.EndTime).format("ss")),
        };
        let diff = {
          hour: end.hour - start.hour,
          minute: end.minute - start.minute,
          second: end.second - start.second,
        };
        if (diff.second < 0) {
          diff.second += 60;
          diff.minute -= 1;
        }
        if (diff.minute < 0) {
          diff.minute += 60;
          diff.hour -= 1;
        }
        let res = diff.hour;
        res += diff.minute / 60;
        res = res.toFixed(2);
        return res;
      }
    },
  },
  components: {
    EditTimeClockFormComponent,
  },
};
</script>

<style scoped>
.editForm {
  position: relative;
  z-index: 100;
  padding: 10px;
  background-color: white;
  border: 2px solid black;
  border-radius: 5px;
}
.mr-neg-4 {
  margin-right: -4px;
  margin-left: -4px;
}
</style>