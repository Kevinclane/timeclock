<template>
  <div class="row d-flex align-items-center my-2">
    <div class="col-1">
      <span
        ><i
          class="fas fa-edit"
          type="button"
          :hidden="canEdit"
          @click="toggleEditForm"
        ></i
      ></span>
    </div>
    <div class="col-lg-4 col-6 order-1 order-lg-1">
      <span>{{ start }} -</span>
      <span v-if="timeClock.EndTime">{{ end }}</span>
    </div>
    <div class="col-lg-4 col-12 order-3 order-lg-2 text-center">
      {{ timeClock.Comment }}
    </div>
    <div v-if="timeClock.EndTime" class="col-lg-3 col-4 order-2 order-lg-3">
      {{ timeClock.TCTotalHours }} Hours
    </div>
    <div v-else class="col-lg-3 col-4 order-2 order-lg-3">
      {{ currentTimer.hour }}:
      <span v-if="currentTimer.minute < 10" class="mr-neg-4">0</span>
      {{ currentTimer.minute }}:
      <span v-if="currentTimer.second < 10" class="mr-neg-4">0</span>
      {{ currentTimer.second }}
    </div>
    <div v-if="showEditForm" class="editForm bg-light container order-4">
      <edit-time-clock-form-component
        :timeClock="timeClock"
        @deleteTimeClock="deleteTimeClock"
        @closeModal="toggleEditForm"
      />
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
    deleteTimeClock() {
      this.toggleEditForm();
      this.$store.dispatch("deleteTimeClock", this.timeClock);
    },
    startLiveClock() {
      let timeDiff = moment.duration(
        moment(this.currentDate).diff(moment(this.timeClock.StartTime))
      );
      let hour = parseInt(timeDiff.asHours());
      let minute = parseInt(timeDiff.asMinutes() - hour * 60);
      let second = parseInt(
        timeDiff.asSeconds() - hour * 60 * 60 - minute * 60
      );
      this.currentTimer = {
        hour: hour,
        minute: minute,
        second: second,
      };
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
    roundTime(time, roundTo) {
      time = time.toString();
      let hours;
      let minutes;
      if (time.includes(".")) {
        let split = time.split(".");
        hours = parseInt(split[0]);
        if (split[1].length == 1) {
          split[1] = parseInt(split[1] + "0");
        }
        minutes = parseInt(split[1]);
      } else {
        hours = parseInt(time);
        minutes = 0;
      }
      minutes = minutes * 0.6;
      let i = 0;
      while (minutes > roundTo) {
        i++;
        minutes = minutes - roundTo;
      }
      if (minutes < roundTo / 2) {
        minutes = i * roundTo;
      } else {
        minutes = (i + 1) * roundTo;
      }
      if (minutes >= 60) {
        minutes = 0;
        hours += 1;
      }
      // debugger
      hours = hours.toString();
      minutes = (minutes / 60).toString();
      if (minutes.includes(".")) {
        minutes = parseFloat(minutes).toFixed(2).toString();
        let minSplit = minutes.split(".");
        minutes = minSplit[1];
      }
      if (minutes.length == 1) {
        minutes = minutes + "0";
      }
      time = parseFloat(hours + "." + minutes);
      return time;
    },
  },
  computed: {
    start() {
      return moment(this.timeClock.StartTime).format("h:mm A");
    },
    end() {
      return moment(this.timeClock.EndTime).format("h:mm A");
    },
    project() {
      return this.$store.state.activeProject;
    },
    canEdit() {
      if (this.timeClock.EndTime) {
        return false;
      } else return true;
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