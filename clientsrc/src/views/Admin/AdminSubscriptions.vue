<template>
  <div class="container">
    <div class="row">
      <div class="col-6 offset-3 my-3">
        <div class="card">
          <div class="card-body">
            <input
              class="my-1"
              type="text"
              placeholder="Title..."
              v-model="newSub.Title"
            />
            <input
              class="my-1"
              type="text"
              placeholder="Description..."
              v-model="newSub.Description"
            />
            <input
              class="my-1"
              type="text"
              placeholder="Price..."
              v-model="newSub.Price"
            />
            <input
              class="my-1"
              type="text"
              placeholder="PlanId..."
              v-model="newSub.PlanId"
            />
          </div>
          <div class="card-footer">
            <button class="btn btn-info mt-2" @click="createNewSub()">
              Insert Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <sub-card v-for="sub in allSubs" :key="sub.Id" :sub="sub"> </sub-card>
    </div>
  </div>
</template>

<script>
import SubCard from "../../components/Cards/SubCard";
export default {
  name: "AdminSubscriptions",
  data() {
    return {
      newSub: {
        Title: "",
        Description: "",
        Price: "",
        PlanId: "",
      },
    };
  },
  mounted() {
    this.$store.dispatch("getAllSubscriptions");
  },
  methods: {
    createNewSub() {
      this.$store.dispatch("createSubscription", { ...this.newSub });
      this.newSub = {
        Title: "",
        Description: "",
        Price: "",
        PlanId: "",
      };
    },
  },
  computed: {
    allSubs() {
      return this.$store.state.allSubs;
    },
  },
  components: {
    SubCard,
  },
};
</script>