<template>
  <div>
    <i
      class="fas fa-trash-alt del-icon"
      type="button"
      @click="deleteTimeClock"
    ></i>
    <form @submit="updateTimeClock" class="mt-2">
      <div class="row">
        <div class="col-12 center-center my-1">
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
          <input
            class="h-100 ml-1 w-25"
            type="date"
            name="StartDay"
            id="StartDay"
            v-model="editedTime.startDay"
            required
          />
        </div>
        <div class="col-12 center-center my-1">
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
          <input
            class="h-100 ml-1 w-25"
            type="date"
            name="EndDay"
            id="EndDay"
            v-model="editedTime.endDay"
            required
          />
        </div>
        <div class="col-12 d-flex justify-content-center">
          <textarea
            name="comments"
            cols="50"
            rows="10"
            v-model="editedTime.comment"
            placeholder="Comments"
            required
          ></textarea>
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
  mounted() {
    this.editedTime = {};
  },
  data() {
    return {
      editedTime: {
        startHour: "",
        startMinute: "",
        startAMPM: "",
        startDay: "",
        endHour: "",
        endMinute: "",
        endAMPM: "",
        endDay: "",
        comment: this.timeClock.Comment,
      },
    };
  },
  mounted() {
    this.setEditedTimeObj();
  },
  methods: {
    updateTimeClock(e) {
      e.preventDefault();
      let startTimeString =
        this.editedTime.startDay +
        " " +
        this.editedTime.startHour +
        ":" +
        this.editedTime.startMinute +
        " " +
        this.editedTime.startAMPM;
      let endTimeString =
        this.editedTime.endDay +
        " " +
        this.editedTime.endHour +
        ":" +
        this.editedTime.endMinute +
        " " +
        this.editedTime.endAMPM;
      let abort = moment(startTimeString).isBefore(moment(this.project.Start));
      if (!abort) {
        let newTimeClock = { ...this.timeClock };
        newTimeClock.StartTime = moment(startTimeString);
        newTimeClock.EndTime = moment(endTimeString);
        newTimeClock.Comment = this.editedTime.comment;
        this.$store.dispatch("updateTimeClock", newTimeClock);
        this.$emit("closeModal");
      } else {
        swal({
          title:
            "Cannot change a time clock to a time prior to Project's start date",
          icon: "warning",
        });
      }
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
            icon: "success",
          });
          this.$emit("deleteTimeClock");
        }
      });
    },
    setEditedTimeObj() {
      this.editedTime.startHour = moment(this.timeClock.StartTime).format("HH");
      if (this.editedTime.startHour < 12) {
        this.editedTime.startAMPM = "AM";
      } else {
        this.editedTime.startAMPM = "PM";
        this.editedTime.startHour = (
          parseInt(this.editedTime.startHour) - 12
        ).toString();
      }
      if (this.editedTime.startHour < 1) {
        this.editedTime.startHour = "12";
      }
      this.editedTime.startMinute = moment(this.timeClock.StartTime).format(
        "mm"
      );

      this.editedTime.endHour = moment(this.timeClock.EndTime).format("HH");
      if (this.editedTime.endHour < 12) {
        this.editedTime.endAMPM = "AM";
      } else {
        this.editedTime.endAMPM = "PM";
        this.editedTime.endHour = (
          parseInt(this.editedTime.endHour) - 12
        ).toString();
      }
      if (this.editedTime.endHour == "0") {
        this.editedTime.endHour = "12";
      }
      this.editedTime.endMinute = moment(this.timeClock.EndTime).format("mm");
      this.editedTime.startDay = moment(this.timeClock.StartTime);
    },
  },
  computed: {
    project() {
      return this.$store.state.activeProject;
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