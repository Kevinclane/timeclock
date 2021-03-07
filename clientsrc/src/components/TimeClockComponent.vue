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
    // this.makeDatesLocal();
  },
  methods: {
    toggleEditForm() {
      this.showEditForm = !this.showEditForm;
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
    makeDatesLocal() {
      // debugger;
      let SZ = this.timeClock.StartTime[this.timeClock.StartTime.length - 1];
      let EZ = "";
      if (this.timeClock.EndTime) {
        EZ = this.timeClock.EndTime[this.timeClock.EndTime.length - 1];
      }
      if (SZ == "Z") {
        this.timeClock.StartTime = moment(
          this.timeClock.StartTime.slice(0, -1)
        );
      }
      if (EZ == "Z") {
        this.timeClock.EndTime = moment(this.timeClock.EndTime.slice(0, -1));
      }
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
        let timeDiff = moment.duration(
          moment(this.timeClock.EndTime).diff(moment(this.timeClock.StartTime))
        );
        return timeDiff.asHours().toFixed(2);
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