<template>
  <div>
    <div class="container-fluid">
      <div class="row text-light d-flex justify-content-between mt-3">
        <div
          type="button"
          @click="setView('Feedback')"
          class="col-2 rounded-top bg-dark mx-1 py-2"
        >
          Feedback
        </div>
        <div
          type="button"
          @click="setView('Subscriptions')"
          class="col-2 rounded-top bg-dark mx-1 py-2"
        >
          Subs
        </div>
        <div class="col-2 rounded-top bg-dark mx-1 py-2"></div>
        <div class="col-2 rounded-top bg-dark mx-1 py-2"></div>
        <div class="col-2 rounded-top bg-dark mx-1 py-2"></div>
      </div>
    </div>

    <div class="container-fluid text-light" v-if="view == 'Feedback'">
      <div class="row">
        <div class="col-12 p-3 bg-midnight">Bugs</div>
      </div>
      <div class="row bg-secondary">
        <div class="col-3">Email</div>
        <div class="col-7">Report</div>
        <div class="col-2">Status</div>
      </div>
      <div
        v-for="(bug, index) in allFeedback.bugs"
        :key="`bug-${index}`"
        class="row border"
      >
        <div class="col-3">{{ bug.CreatorEmail }}</div>
        <div class="col-7">{{ bug.Text }}</div>
        <div
          v-if="bug.Active"
          type="button"
          @click="toggleActiveBug(index)"
          class="col-2 text-green"
        >
          Open
        </div>
        <div
          v-else
          type="button"
          @click="toggleActiveBug(index)"
          class="col-2 text-red"
        >
          Closed
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-12 p-3 bg-midnight">Suggestions</div>
      </div>
      <div class="row bg-secondary">
        <div class="col-3">Email</div>
        <div class="col-7">Report</div>
        <div class="col-2">Status</div>
      </div>
      <div
        v-for="(suggestion, index) in allFeedback.suggestions"
        :key="`suggestion-${index}`"
        class="row border"
      >
        <div class="col-3">{{ suggestion.CreatorEmail }}</div>
        <div class="col-7">{{ suggestion.Text }}</div>
        <div
          v-if="suggestion.Active"
          type="button"
          @click="toggleActiveBug(index)"
          class="col-2 text-green"
        >
          Open
        </div>
        <div
          v-else
          type="button"
          @click="toggleActiveBug(index)"
          class="col-2 text-red"
        >
          Closed
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-12 p-3 bg-midnight">Feedback</div>
      </div>
      <div class="row bg-secondary">
        <div class="col-3">Email</div>
        <div class="col-7">Report</div>
        <div class="col-2">Status</div>
      </div>
      <div
        v-for="(feedback, index) in allFeedback.feedbacks"
        :key="`feedback-${index}`"
        class="row border"
      >
        <div class="col-3">{{ feedback.CreatorEmail }}</div>
        <div class="col-7">{{ feedback.Text }}</div>
        <div
          v-if="feedback.Active"
          type="button"
          @click="toggleActiveBug(index)"
          class="col-2 text-green"
        >
          Open
        </div>
        <div
          v-else
          type="button"
          @click="toggleActiveBug(index)"
          class="col-2 text-red"
        >
          Closed
        </div>
      </div>
    </div>

    <div class="container-fluid" v-if="view == 'Subscriptions'">
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
            <input
              class="col-12 my-1"
              v-model="newPlan.Description[0]"
              type="text"
              name="Description0"
              id="Description1"
            />
            <input
              class="col-12 my-1"
              v-model="newPlan.Description[1]"
              type="text"
              name="Description1"
              id="Description1"
            />
            <input
              class="col-12 my-1"
              v-model="newPlan.Description[2]"
              type="text"
              name="Description2"
              id="Description1"
            />
            <input
              class="col-12 my-1"
              v-model="newPlan.Description[3]"
              type="text"
              name="Description3"
              id="Description1"
            />
            <input
              class="col-12 my-1"
              v-model="newPlan.Description[4]"
              type="text"
              name="Description4"
              id="Description1"
            />
            <input
              class="col-12 my-1"
              v-model="newPlan.Description[5]"
              type="text"
              name="Description5"
              id="Description1"
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
        <ul class="col-4">
          <li
            v-for="(description, index) in plan.Description"
            :key="`description-${index}`"
          >
            {{ description }}
          </li>
        </ul>
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
  </div>
</template>


<script>
import swal from "sweetalert";
import PlanCard from "../components/Cards/PlanCard";
export default {
  name: "Admin",
  data() {
    return {
      newPlan: {
        Title: "",
        Description: [],
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
      view: "Feedback",
    };
  },
  mounted() {
    this.$store.dispatch("getAllPlans");
    this.$store.dispatch("getFeedback");
  },
  methods: {
    insertPlan(e) {
      debugger;
      e.preventDefault();
      let i = 0;
      while (i < this.newPlan.Description.length) {
        if (this.newPlan.Description[i] == "") {
          this.newPlan.Description.splice(i, 1);
        } else {
          i++;
        }
      }
      this.$store.dispatch("insertPlan", { ...this.newPlan });
      this.newPlan = {
        Title: "",
        Description: "",
        Price: "",
        PlanId: "",
        Status: "",
      };
    },
    setView(view) {
      this.view = view;
    },
    toggleActiveBug(i) {
      this.allFeedback.bugs[i].Active = !this.allFeedback.bugs[i].Active;
      this.$store.dispatch("editFeedback", this.allFeedback.bugs[i]);
    },
    toggleActiveSuggestion(i) {
      this.allFeedback.suggestions[i].Active = !this.allFeedback.suggestions[i]
        .Active;
      this.$store.dispatch("editFeedback", this.allFeedback.suggestions[i]);
    },
    toggleActiveFeedback(i) {
      this.allFeedback.feedback[i].Active = !this.allFeedback.feedback[i]
        .Active;
      this.$store.dispatch("editFeedback", this.allFeedback.feedback[i]);
    },
  },
  computed: {
    allPlans() {
      return this.$store.state.allPlans;
    },
    allFeedback() {
      return this.$store.state.feedback;
    },
  },
  components: {
    PlanCard,
  },
};
</script>