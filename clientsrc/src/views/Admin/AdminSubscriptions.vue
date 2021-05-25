<template>
  <div class="container-fluid">
    <form @submit="insertPlan" class="row">
      <div class="col-6 offset-3 my-3">
        <div class="row p-3 rounded bg-secondary">
          <input
            class="my-1 col-6"
            type="text"
            placeholder="Title..."
            name="Title"
            v-model="newPlan.Title"
            required
          />
          <select
            class="my-1 col-6"
            name="status"
            v-model="newPlan.Status"
            required
          >
            <option
              v-for="status in statuses"
              :value="status"
              v-bind:key="status.$index"
            >
              {{ status }}
            </option>
          </select>

          <input
            class="my-1 col-6"
            type="text"
            placeholder="Price..."
            name="Price"
            v-model="newPlan.Price"
            required
          />
          <input
            class="my-1 col-6"
            type="text"
            placeholder="PlanId..."
            name="PlanId"
            v-model="newPlan.PlanId"
            required
          />
          <textarea
            class="my-1 col-12"
            name="Description"
            placeholder="Description..."
            v-model="newPlan.Description"
            rows="4"
            cols="50"
            required
          />
          <button type="submit" class="btn btn-info mt-2">Insert Plan</button>
        </div>
      </div>
    </form>
    <div class="row bg-midnight text-white">
      <h5 class="col-2">Title</h5>
      <h5 class="col-4">Description</h5>
      <h5 class="col-1">Status</h5>
      <h5 class="col-3">PlanId</h5>
      <h5 class="col-1">Edit</h5>
      <h5 class="col-1">Delete</h5>
    </div>
    <div
      class="row text-white bg-secondary border-black-1 p-2 d-flex align-items-center"
      v-for="plan in allPlans"
      :key="plan.Id"
    >
      <div class="col-2">{{ plan.Title }}</div>
      <div class="col-4">{{ plan.Description }}</div>
      <div class="col-1">{{ plan.SubStatus }}</div>
      <div class="col-3">{{ plan.PlanId }}</div>
      <div class="col-1">
        <i class="fa fa-pencil" aria-hidden="true"></i>
      </div>
      <div class="col-1">
        <i class="fa fa-trash text-red" aria-hidden="true"></i>
      </div>
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
    insertPlan(e) {
      debugger;
      e.preventDefault();
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