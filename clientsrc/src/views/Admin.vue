<template>
  <div>
    <admin-navbar @setView="setView" />

    <div class="container-fluid text-light" v-if="view == 'Bugs'">
      <div class="row">
        <div class="col-12 p-3 bg-primary">Bugs</div>
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
    </div>

    <div class="container-fluid text-light" v-if="view == 'Suggestions'">
      <div class="row">
        <div class="col-12 p-3 bg-primary">Suggestions</div>
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
          @click="toggleActiveSuggestion(index)"
          class="col-2 text-green"
        >
          Open
        </div>
        <div
          v-else
          type="button"
          @click="toggleActiveSuggestion(index)"
          class="col-2 text-red"
        >
          Closed
        </div>
      </div>
    </div>

    <div class="container-fluid text-light" v-if="view == 'Feedback'">
      <div class="row">
        <div class="col-12 p-3 bg-primary">Feedback</div>
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
          @click="toggleActiveFeedback(index)"
          class="col-2 text-green"
        >
          Open
        </div>
        <div
          v-else
          type="button"
          @click="toggleActiveFeedback(index)"
          class="col-2 text-red"
        >
          Closed
        </div>
      </div>
    </div>

    <div class="container-fluid text-light" v-if="view == 'Subscriptions'">
      <div class="row">
        <form @submit="insertPlan" class="col-lg-4 offset-lg-1 col-12 my-3">
          <div class="row">
            <div class="col-12 dynamic-header2 bg-primary text-light">
              Add Plan
            </div>
          </div>
          <div class="row p-3 bg-secondary text-left text-light">
            <div class="col-12">Title</div>
            <input
              class="my-1 col-12"
              type="text"
              placeholder="Title..."
              name="Title"
              id="Title"
              v-model="newPlan.Title"
              required
            />
            <div class="col-12">Plan Type</div>
            <select
              class="my-1 col-12"
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
            <div class="col-12">Price per charge</div>
            <input
              class="my-1 col-12"
              type="text"
              placeholder="Price..."
              name="Price"
              v-model="newPlan.Price"
              required
            />
            <div class="col-12 d-flex align-items-center">
              Trial
              <input class="ml-3" type="checkbox" v-model="newPlan.Trial" />
            </div>
            <div class="col-12">Frequency</div>
            <select class="col-12" v-model="newPlan.Frequency">
              <option value="Monthly">Monthly</option>
              <option value="3 Month">3 Month</option>
              <option value="Yearly">Yearly</option>
            </select>
            <div class="col-12">PlanId</div>
            <input
              class="my-1 col-12"
              type="text"
              placeholder="PlanId..."
              name="PlanId"
              v-model="newPlan.PlanId"
              required
            />
            <div class="col-12">Bullet points about plan</div>
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
        </form>
        <div class="col-lg-4 offset-lg-1 col-12 my-3">
          <div class="row">
            <div class="col-12 dynamic-header2 bg-primary text-light">
              Plan Types
            </div>
          </div>
          <div class="row p-3 bg-secondary">
            <form @submit="addPlanStatus" class="col-12">
              <input type="text" v-model="newStatus" />
              <button class="btn btn-sm btn-green" type="submit">Add</button>
            </form>
            <div class="col-12 text-light text-left">
              <div
                v-for="(status, index) in statuses"
                :key="`status-${index}`"
                class="row"
              >
                <div
                  class="
                    col-12
                    d-flex
                    justify-content-around
                    align-items-center
                    my-2
                  "
                >
                  {{ status }}
                  <i
                    class="fa fa-trash text-red"
                    type="button"
                    @click="removePlanStatus(status)"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-5">
        <div class="col-12">
          <div class="row bg-primary text-white">
            <div class="col-12 my-2 dynamic-header2">Active Plans</div>
            <div class="col-3">Title</div>
            <div class="col-5">Description</div>
            <div class="col-2">Status</div>
            <div class="col-2">Trial</div>
          </div>
          <div
            class="
              row
              text-white
              bg-secondary
              border-black-1
              p-2
              d-flex
              align-items-center
            "
            v-for="plan in allPlans"
            :key="plan.Id"
          >
            <div class="col-3">{{ plan.Title }}</div>
            <ul class="col-5">
              <li
                v-for="(description, index) in plan.Description"
                :key="`description-${index}`"
              >
                {{ description }}
              </li>
            </ul>
            <div class="col-2">{{ plan.SubStatus }}</div>
            <div class="col-2">
              {{ plan.Trial }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid text-light" v-if="view == 'PromoCodes'">
      <div class="row my-2">
        <div class="col-12 dynamic-header2">Promo Codes</div>
        <div class="col-12">Codes by Type</div>
        <div class="col-12">Free Access: {{ promoCodeCounts.FreeAccess }}</div>
        <div class="col-12 mt-3">
          <button
            v-if="!showCodesSection"
            class="btn btn-info"
            @click="showCodes()"
          >
            Show Codes
          </button>
          <button v-else class="btn btn-danger" @click="showCodes()">
            Hide Codes
          </button>
        </div>
        <div v-if="showCodesSection" class="col-12 my-5 bg-secondary">
          <div class="row">
            <div v-if="showPWField" class="col-12">
              Password: <input type="text" v-model="pw" />
              <button class="btn btn-green btn-sm" @click="getPromoCodes()">
                Enter
              </button>
            </div>
            <div v-else class="col-12">
              <div class="row border-bottom-black">
                <div class="col-2">Code</div>
                <div class="col-4">Details</div>
                <div class="col-4">Type</div>
                <div class="col-2">Released</div>
              </div>
              <div class="row" v-for="code in promoCodes" :key="code._id">
                <div class="col-2">{{ code.Code }}</div>
                <div class="col-4">{{ code.Details }}</div>
                <div class="col-4">{{ code.Type }}</div>
                <div
                  type="button"
                  @click="toggleReleased(code._id)"
                  v-if="code.Released"
                  class="col-2"
                >
                  <i class="fa fa-circle text-red" aria-hidden="true"></i>
                </div>
                <div
                  type="button"
                  @click="toggleReleased(code._id)"
                  v-else
                  class="col-2"
                >
                  <i class="fa fa-circle text-green" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="row"></div>
        </div>
        <div class="col-12 mt-3">
          <input
            type="text"
            placeholder="# of new codes..."
            v-model="newCodes.Amount"
          />
          <select v-model="newCodes.Type">
            <option value="FreeAccess">Free Access</option>
          </select>
          <button class="btn btn-green btn-sm" @click="createPromoCodes()">
            Create Codes
          </button>
        </div>
      </div>
    </div>
    <div class="container-fluid text-light" v-if="view == 'DBUpdates'">
      <div class="row">
        <div class="col-12">
          Update TimeClocks in DB to save total time to TC object
        </div>
        <div class="col-12 mb-5">
          <button class="btn btn-sm btn-info" @click="updateDBTCTotals()">
            Update TimeClocks
          </button>
        </div>
        <div class="col-12">Update core DB. Calculate and save all data</div>
        <div class="col-12 mb-5">
          <button class="btn btn-sm btn-info" @click="updateProjectFormats()">
            Update Projects
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import swal from "sweetalert";
import PlanCard from "../components/Cards/PlanCard";
import AdminNavbar from "../components/AdminNavbar.vue";
export default {
  name: "Admin",
  data() {
    return {
      newPlan: {
        Title: "",
        Description: [],
        Price: "",
        Trial: false,
        Frequency: "",
        PlanId: "",
        Status: "",
      },
      newStatus: "",
      view: "",
      newCodes: {
        Amount: 0,
        Type: "",
      },
      pw: "",
      showCodesSection: false,
      showPWField: true,
    };
  },
  mounted() {
    this.$store.dispatch("getAllPlans");
    this.$store.dispatch("getFeedback");
    this.$store.dispatch("getPlanStatuses");
    this.$store.dispatch("getPromoCodeCounts");
  },
  methods: {
    insertPlan(e) {
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
        Description: [],
        Frequency: "",
        Trial: false,
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
      this.allFeedback.suggestions[i].Active =
        !this.allFeedback.suggestions[i].Active;
      this.$store.dispatch("editFeedback", this.allFeedback.suggestions[i]);
    },
    toggleActiveFeedback(i) {
      this.allFeedback.feedbacks[i].Active =
        !this.allFeedback.feedbacks[i].Active;
      this.$store.dispatch("editFeedback", this.allFeedback.feedbacks[i]);
    },
    addPlanStatus(e) {
      e.preventDefault();
      let apiObj = {
        Type: "PlanStatuses",
        Title: this.newStatus,
      };
      this.$store.dispatch("addPlanStatus", { ...apiObj });
      this.newStatus = "";
    },
    removePlanStatus(status) {
      let apiObj = { Title: status };
      this.$store.dispatch("removePlanStatus", apiObj);
    },
    createPromoCodes() {
      this.$store.dispatch("createPromoCodes", { ...this.newCodes });
      this.newCodes = {
        Amount: 0,
        Type: "",
      };
    },
    showCodes() {
      this.showCodesSection = !this.showCodesSection;
    },
    async getPromoCodes() {
      await this.$store.dispatch("getPromoCodes", { pw: this.pw });
      this.pw = "";
      if (this.$store.state.promoCodes.length > 0) {
        this.showPWField = false;
      }
    },
    toggleReleased(id) {
      this.$store.dispatch("togglePromoCodeReleased", id);
    },
    updateDBTCTotals() {
      this.$store.dispatch("updateDBTCTotals");
    },
    updateProjectFormats() {
      this.$store.dispatch("updateProjectFormats");
    },
  },
  computed: {
    allPlans() {
      return this.$store.state.allPlans;
    },
    allFeedback() {
      let allFeedback = this.$store.state.feedback;
      allFeedback.bugs.sort((a, b) => b.Active - a.Active);
      allFeedback.suggestions.sort((a, b) => b.Active - a.Active);
      allFeedback.feedbacks.sort((a, b) => b.Active - a.Active);
      return allFeedback;
    },
    statuses() {
      return this.$store.state.planStatuses;
    },
    promoCodeCounts() {
      return this.$store.state.promoCodeCounts;
    },
    promoCodes() {
      return this.$store.state.promoCodes;
    },
  },
  beforeDestroy() {
    this.$store.dispatch("clearPromoCodes");
  },
  components: {
    PlanCard,
    AdminNavbar,
  },
};
</script>

<style scoped>
input {
  background-color: lightgray;
  height: 2rem;
}
select {
  background-color: lightgray;
  height: 2rem;
}
.hide-sm {
  visibility: hidden;
}
@media screen and (min-width: 992px) {
  .hide-sm {
    visibility: visible;
  }
}
</style>