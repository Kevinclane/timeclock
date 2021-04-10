<template>
  <div>
    <div class="row text-black">
      <div class="col-12">
        <h3>What services will you be providing?</h3>
        <textarea
          name="comments"
          cols="50"
          rows="10"
          v-model="comment"
        ></textarea>
      </div>
      <div class="col-12 mt-5 d-flex justify-content-around">
        <button class="btn btn-danger" @click="close">Close</button>
        <button class="btn btn-green" @click="clockOut">Clock Out</button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "TimeClockCommentModal",
  props: ["timeClock"],
  data() {
    return {
      comment: "",
    };
  },
  methods: {
    async clockOut() {
      let timeObj = {
        EndTime: moment(),
        Comment: this.comment,
        Id: this.timeClock._id,
      };
      await this.$store.dispatch("clockOut", timeObj);
      this.$emit("clockOut");
    },
    close() {
      this.$emit("closeModal");
    },
  },
};
</script>

<style scoped>
.backdrop {
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
}
</style>