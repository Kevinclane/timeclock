<template>
  <div>
    <i
      class="fas fa-trash-alt del-icon"
      type="button"
      @click="deleteTimeClock"
    ></i>
    <form @submit="updateTimeClock">
      <div class="row">
        <div
          class="col-12 d-flex justify-content-center align-items-center my-1"
        >
          <input
            class="mx-w-50"
            type="number"
            name="startHour"
            id="startHour"
            placeholder="hour"
            v-model="editedTime.startHour"
            minlength="2"
            maxlength="2"
            min="1"
            max="12"
            required
          />
          :
          <input
            class="mx-w-50"
            type="number"
            name="startMinute"
            id="startMinute"
            placeholder="minute"
            v-model="editedTime.startMinute"
            minlength="2"
            maxlength="2"
            min="0"
            max="59"
            required
          />
          <select
            name="startAMPM"
            id="startAMPM"
            required
            v-model="editedTime.startAMPM"
            class="h-100 ml-1"
          >
            <option value="AM" selected>AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        <div
          class="col-12 d-flex justify-content-center align-items-center my-1"
        >
          <input
            class="mx-w-50"
            type="number"
            name="endHour"
            id="endHour"
            placeholder="hour"
            v-model="editedTime.endHour"
            minlength="2"
            maxlength="2"
            min="1"
            max="12"
            required
          />
          :
          <input
            class="mx-w-50"
            type="number"
            name="endMinute"
            id="endMinute"
            placeholder="minute"
            v-model="editedTime.endMinute"
            minlength="2"
            maxlength="2"
            min="0"
            max="59"
          />
          <select
            name="endAMPM"
            id="endAMPM"
            required
            v-model="editedTime.endAMPM"
            class="h-100 ml-1"
          >
            <option value="AM" selected>AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        <div class="col-12 d-flex justify-content-between">
          <button
            class="btn btn-sm btn-danger"
            type="button"
            @click="closeModal"
          >
            Cancel
          </button>
          <button class="btn btn-sm btn-green" type="submit">Save</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import moment from "moment";
import swal from "sweetalert";
export default {
  name: "EditTimeClockFormComponent",
  props: ["timeClock"],
  data() {
    return {
      editedTime: {
        startHour: "",
        startMinute: "",
        startAMPM: "",
        endHour: "",
        endMinute: "",
        endAMPM: "",
      },
    };
  },
  methods: {
    updateTimeClock(e) {
      e.preventDefault();
      let date = moment(this.timeClock.StartTime).format("MM-DD-YYYY");
      let startTimeString =
        this.editedTime.startHour +
        ":" +
        this.editedTime.startMinute +
        " " +
        this.editedTime.startAMPM;
      let endTimeString =
        this.editedTime.endHour +
        ":" +
        this.editedTime.endMinute +
        " " +
        this.editedTime.endAMPM;
      let newTimeClock = { ...this.timeClock };
      newTimeClock.StartTime = moment(date + " " + startTimeString);
      newTimeClock.EndTime = moment(date + " " + endTimeString);
      this.$store.dispatch("updateTimeClock", newTimeClock);
      this.$emit("closeModal");
    },
    closeModal() {
      this.$emit("closeModal");
    },
    deleteTimeClock() {
      swal({
        title: "Are you sure?",
        text: "Once deleted, this data will be gone forever.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal("This time clock has been deleted!", {
            icon: "green",
          });
          this.$store.dispatch("deleteTimeClock", this.timeClock);
          this.$emit("closeModal");
        }
      });
    },
  },
};
</script>

<style scoped>
.mx-w-50 {
  max-width: 50%;
  width: 5rem;
}
.del-icon {
  position: absolute;
  top: 3px;
  right: 3px;
  color: #e74c3c;
  z-index: 101;
}
</style>