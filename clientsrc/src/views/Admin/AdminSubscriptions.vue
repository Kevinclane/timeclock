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
              name="Title"
              v-model="newPlan.Title"
            />
            <input
              class="my-1"
              type="text"
              placeholder="Description..."
              name="Description"
              v-model="newPlan.Description"
            />
            <input
              class="my-1"
              type="text"
              placeholder="Price..."
              name="Price"
              v-model="newPlan.Price"
            />
            <input
              class="my-1"
              type="text"
              placeholder="PlanId..."
              name="PlanId"
              v-model="newPlan.PlanId"
            />
            <select name="status" v-model="newPlan.Status">
              <option
                v-for="status in statuses"
                :value="status"
                v-bind:key="status.$index"
              >
                {{ status }}
              </option>
            </select>
          </div>
          <div class="card-footer">
            <button class="btn btn-info mt-2" @click="insertPlan()">
              Insert Plan
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <plan-card v-for="plan in allPlans" :key="plan.Id" :plan="plan">
      </plan-card>
    </div>
  </div>
</template>

<script>
import PlanCard from "../../components/Cards/PlanCard";
export default {
  name: "AdminSubscriptions",
  data() {
    return {
      newPlan: {
        Title: "",
        Description: "",
        Price: "",
        PlanId: "",
        Status: "",
      },
      statuses: [
        "Basic",
        "Team0",
        "Team10",
        "Team20",
        "Team30",
        "Team40",
        "Team50",
        "Team60",
        "Team70",
        "Team80",
        "Team90",
        "Team100",
        "Ultimate",
        "Grandfather",
        "Admin",
      ],
    };
  },
  mounted() {
    this.$store.dispatch("getAllPlans");
  },
  methods: {
    insertPlan() {
      this.$store.dispatch("insertPlan", { ...this.newPlan });
      this.newPlan = {
        Title: "",
        Description: "",
        Price: "",
        PlanId: "",
        Status: "",
      };
    },
  },
  computed: {
    allPlans() {
      return this.$store.state.allPlans;
    },
  },
  components: {
    PlanCard,
  },
};
</script>