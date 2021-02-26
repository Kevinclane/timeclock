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
    <div class="col-5">
      <div class="row">
        <div class="col-6">
          <span v-show="Total.hour">{{ Total.hour }}h</span>
        </div>
        <div class="col-6">
          <span v-show="Total.minute">{{ Total.minute }}m</span>
        </div>
      </div>
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
    };
  },
  methods: {
    toggleEditForm() {
      this.showEditForm = !this.showEditForm;
    },
  },
  computed: {
    Start() {
      return moment(this.timeClock.StartTime).format("h:mm A");
    },
    End() {
      return moment(this.timeClock.EndTime).format("h:mm A");
    },
    FormStartHour() {
      return "";
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
        return diff;
      } else return {};
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
</style>