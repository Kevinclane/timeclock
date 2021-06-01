<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 text-light bg-dark py-3 dynamic-header2">
        Please fill out this form to provide feedback.
      </div>
      <div class="col-10 offset-1 my-5 bg-secondary rounded p-4">
        <div class="row">
          <div class="col-12 my-1">
            <select v-model="feedback.Type">
              <option value="Bug">Report a bug</option>
              <option value="Suggestion">Make a suggestion</option>
              <option value="Feedback">General feedback</option>
            </select>
          </div>
          <div class="col-12">
            <textarea
              class="mx-w-txt"
              name="comments"
              cols="50"
              rows="10"
              v-model="feedback.Text"
            ></textarea>
          </div>
          <div class="col-12">
            <button @click="submit" class="btn btn-green">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Feedback",
  data() {
    return {
      feedback: {
        Type: "",
        Text: "",
      },
    };
  },
  methods: {
    submit() {
      this.$store.dispatch("submitFeedback", this.feedback);
    },
  },
};
</script>