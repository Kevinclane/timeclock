import moment from "moment"
import swal from "sweetalert"
import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index'
import { api } from "./AxiosService"

function roundTime(time, roundTo) {
  time = time.toString();
  let hours;
  let minutes;
  if (time.includes(".")) {
    let split = time.split(".");
    hours = parseInt(split[0]);
    if (split[1].length == 1) {
      split[1] = parseInt(split[1] + "0");
    }
    minutes = parseInt(split[1]);
  } else {
    hours = parseInt(time);
    minutes = 0;
  }
  minutes = minutes * 0.6;
  let i = 0;
  while (minutes > roundTo) {
    i++;
    minutes = minutes - roundTo;
  }
  if (minutes < roundTo / 2) {
    minutes = i * roundTo;
  } else {
    minutes = (i + 1) * roundTo;
  }
  if (minutes >= 60) {
    minutes = 0;
    hours += 1;
  }
  hours = hours.toString();
  minutes = (minutes / 60).toString();
  if (minutes.includes(".")) {
    minutes = (parseFloat(minutes).toFixed(2)).toString();
    let minSplit = minutes.split(".");
    minutes = minSplit[1];
  }
  if (minutes.length == 1) {
    minutes = minutes + "0";
  }
  time = parseFloat(hours + "." + minutes);
  return time;
}

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    user: {},
    projects: [],
    activeProject: {},
    activeInvoiceGroup: {},
    payPeriodDisplay: [],
    activePP: {},
    invoiceNumber: 0,
    allPlans: [],
    planStatuses: [],
    feedback: [],
    activeFeedback: {},
    promoCodeData: {},
    promoCodeCounts: {},
    promoCodes: []
  },


  mutations: {
    //#region USER/PROFILE
    setUser(state, user) {
      state.user = user
    },
    setProfilePic(state, pic) {
      state.user.Picture = pic
    },
    //#endregion END USER/PROFILE

    //#region PROJECT STUFF
    setProjects(state, projects) {
      state.projects = projects
    },
    setActiveProject(state, project) {
      if (project.Start) {
        let SZ = project.Start[project.Start.length - 1]
        let EZ = project.End[project.End.length - 1]
        if (SZ == "Z") {
          project.Start = project.Start.slice(0, -1)
        }
        if (EZ == "Z") {
          project.End = project.End.slice(0, -1)
        }
      }
      state.activeProject = project
    },
    addProject(state, project) {
      state.projects.push(project)
    },
    clearActiveProject(state) {
      state.activeProject = {};
      state.payPeriodDisplay = []
      state.activePP = {};
    },
    clearProjects(state) {
      state.projects = []
    },
    clearPromoCodes(state) {
      state.promoCodes = [],
        state.codeCounts = {},
        state.promoCodeData = {}
    },
    setProjectSettings(state, settings) {
      state.activeProject.ProjectSettings = settings
    },

    //#endregion END PROJECT STUFF

    //#region TIMECLOCK STUFF

    updateTimeClock(state, timeClock) {
      let index = state.activeProject.TimeClocks.findIndex(t => t.id == timeClock.id)
      state.activeProject.TimeClocks.splice(index, 1, timeClock)
    },
    deleteTimeClock(state, timeClock) {
      let index = state.activeProject.TimeClocks.findIndex(t => t.id == timeClock.id)
      state.activeProject.TimeClocks.splice(index, 1)
    },

    //#endregion END TIMECLOCK STUFF

    //#region CALCULATED/DISPLAY STUFF

    setPPDisplay(state, PPs) {
      state.payPeriodDisplay = PPs
    },
    setActivePayPeriod(state, PP) {
      state.activePP = PP;
    },
    setTimeClockGroups(state, timeClockGroups) {
      state.timeClockGroups = timeClockGroups
    },
    setTotalPPTimes(state, total) {
      state.totalPPTimes = parseFloat(total)
    },
    setPPSelection(state, PP) {
      state.payPeriodSelection = PP
    },
    setWeeks(state, weeks) {
      state.weeks = weeks
    },

    //#endregion END CALCULATED/DISPLAY STUFF

    insertNewPlan(state, plan) {
      state.allPlans.push(plan)
    },
    setAllPlans(state, plans) {
      state.allPlans = plans
    },
    setPlanStatuses(state, statuses) {
      state.planStatuses = statuses
    },
    setFeedback(state, feedback) {
      state.feedback = feedback
    },
    setActiveFeedback(state, feedback) {
      state.activeFeedback = feedback
    },
    setPromoCodeData(state, data) {
      state.promoCodeData = data
    },
    setPromoCodeCounts(state, codeCounts) {
      state.promoCodeCounts = codeCounts
    },
    setPromoCodes(state, promoCodes) {
      state.promoCodes = promoCodes
    },
    setInvoiceNumber(state, invoiceNumber) {
      state.invoiceNumber = invoiceNumber;
    }

  },


  actions: {
    //#region -- AUTH STUFF --
    setBearer({ }, bearer) {
      api.defaults.headers.authorization = bearer;
    },
    resetBearer() {
      api.defaults.headers.authorization = "";
    },

    //#endregion -- END AUTH STUFF --

    //#region  -- PROFILE STUFF --
    async getProfile({ commit }) {
      try {
        let res = await api.get("/profile")
        commit("setUser", res.data)
      } catch (err) {
        console.error(err)
      }
    },
    async uploadProfilePicture({ commit }, pic) {
      try {
        let apiObj = {
          picString: pic
        }
        let res = await api.put("profile/profilepic", apiObj)
        commit("setProfilePic", res.data)
      } catch (error) {
        console.error(error)
      }
    },
    async updateContactInfo({ commit }, contacts) {
      try {
        let res = await api.put("profile/updatecontactinfo", contacts)
        commit("setUser", res.data)
      } catch (error) {
        console.error(error)
      }
    },
    async updateBusinessInfo({ commit }, BInfo) {
      try {
        let res = await api.put("profile/updatebusinessinfo", BInfo)
        commit("setUser", res.data)
      } catch (error) {
        console.error(error)
      }
    },

    //#endregion --END PROFILE STUFF

    //#region  -- PROJECT STUFF --

    async getProjects({ commit }) {
      try {
        let res = await api.get("/projects/all")
        commit("setProjects", res.data)
      } catch (error) {
        console.error(error)
      }
    },
    async getActiveProject({ commit, dispatch }, id) {
      try {
        let res = await api.get("/projects/" + id);

        let currentPP = res.data.InvoiceGroups.find(p => p.Current == true);
        await commit("setPPDisplay", res.data.InvoiceGroups);
        await dispatch("getActivePayPeriod", currentPP.id);
        commit("setActiveProject", res.data);

      } catch (error) {
        console.error(error)
      }
    },
    async createProject({ commit }, projectData) {
      try {
        let res = await api.post("/projects", projectData)
        commit("addProject", res.data)
      } catch (error) {
        console.error(error)
      }
    },
    async editProject({ commit, dispatch }, projectData) {
      try {
        let res = await api.put("/projects/" + projectData.id, projectData)
        await commit("setActiveProject", res.data)
        dispatch("weeklyTimes")
      } catch (error) {
        console.error(error)
      }
    },
    async deleteProject({ }, id) {
      try {
        await api.delete("/projects/" + id)
        router.push({ name: "dashboard" });
      } catch (error) {
        console.error(error)
      }
    },
    async saveProjectSettings({ commit }, settings) {
      try {
        let res = await api.put("/projects/projectsettings/update/" + settings.ProjectId, settings)
        commit("setProjectSettings", res.data)
      } catch (error) {
        console.error(error)
      }
    },
    async updateInvoiceNumbers({ commit, dispatch }, IG) {
      try {
        let IGs = [...this.state.activeProject.InvoiceGroups]
        let index = IGs.findIndex(i => i.StartDay == IG.StartDay)
        let i = 0
        while (i < IGs.length) {
          IGs[i].InvoiceNumber = IG.InvoiceNumber - index + i
          i++
        }
        let res = api.put("/projects/invoicegroups/update", [...IGs])
        await commit("setIGs", res.data)
      } catch (error) {
        console.error(error)
      }
    },
    async getActivePayPeriod({ commit }, PPid) {
      try {
        let res = await api.get("/payperiods/" + PPid);
        commit("setActivePayPeriod", res.data);

      } catch (error) {

      }
    },

    //#endregion -- END PROJECT STUFF --

    //#region  -- TIME CLOCK STUFF --

    async clockIn({ commit, dispatch }, obj) {
      try {
        let res = await api.post("/timeclock", obj)
        dispatch("getActivePayPeriod", this.state.activePP.id);
      } catch (error) {
        console.error(error)
      }
    },
    async clockOut({ commit, dispatch }, obj) {
      try {
        let res = await api.put("/timeclock/out/" + obj.id, obj)
        dispatch("getActivePayPeriod", this.state.activePP.id);
      } catch (error) {
        console.error(error)
      }
    },
    async createTimeClock({ commit, dispatch }, timeClock) {
      try {
        let res = await api.post("/timeclock", timeClock)
        dispatch("getActivePayPeriod", this.state.activePP.id);
      } catch (error) {
        console.error(error)
      }
    },
    async updateTimeClock({ commit, dispatch }, timeClock) {
      try {
        let res = await api.put("/timeclock/" + timeClock.id, timeClock)
        dispatch("getActivePayPeriod", this.state.activePP.id);
      } catch (error) {
        console.error(error)
      }
    },
    async deleteTimeClock({ commit, dispatch }, timeClock) {
      try {
        let res = await api.delete("timeclock/" + timeClock.id)
        dispatch("getActivePayPeriod", this.state.activePP.id);
      } catch (error) {
        console.error(error)
      }
    },

    //#endregion -- END TIME CLOCK STUFF --

    //#region  -- DATA CLEARING --

    clearActiveProject({ commit }) {
      commit("clearActiveProject")
    },
    clearProjects({ commit }) {
      commit("clearProjects")
    },
    clearPromoCodes({ commit }) {
      commit("clearPromoCodes")
    },

    //#endregion -- END DATA CLEARING --


    //#region  --MISC FUNCTIONS --

    async getActivePayPeriod({ commit, dispatch }, PPid) {
      try {
        let res = await api.get("/payperiods/" + PPid);
        if (res.data.InvoiceNumber == 0) {
          dispatch("getInvoiceNumber");
        } else {
          commit("setInvoiceNumber", res.data.InvoiceNumber);
        }
        commit("setActivePayPeriod", res.data);

      } catch (error) {
        console.error(error);
      }
    },
    async getInvoiceNumber({ commit }) {
      let userId = this.state.user.id;
      let res = await api.get("/invoices/" + userId);
      commit("setInvoiceNumber", res.data.Number);
    },
    async savePayPeriodInvoiceData({ }, payPeriod) {
      try {
        payPeriod.Weeks = [];
        await api.put("/payperiods/" + payPeriod.id, payPeriod);
      } catch (error) {
        console.error(error);
      }
    },
    //#endregion MISC

    //#region FEEDBACK

    async submitFeedback({ }, feedback) {
      try {
        let res = await api.post("/feedback", feedback)
        if (res.data) {
          swal("Thank you for the feedback!")
          router.push({ name: "dashboard" });
        }
      } catch (error) {
        console.error(error)
      }
    },
    async getFeedback({ commit }) {
      try {
        let res = await api.get("/feedback/all")
        let feedback = {
          bugs: [],
          suggestions: [],
          feedbacks: []
        }
        let i = 0
        while (i < res.data.length) {
          if (res.data[i].Type == "Bug") {
            feedback.bugs.push(res.data[i])
          } else if (res.data[i].Type == "Suggestion") {
            feedback.suggestions.push(res.data[i])
          } else if (res.data[i].Type == "Feedback") {
            feedback.feedbacks.push(res.data[i])
          }
          i++
        }
        commit("setFeedback", feedback)
      } catch (error) {
        console.error(error)
      }
    },
    async getFeedbackById({ commit }, id) {
      try {
        let res = await api.get("/feedback/" + id)
        commit("setActiveFeedback", res.data)
      } catch (error) {
        console.error(error)
      }
    },
    async editFeedback({ }, feedback) {
      try {
        let res = await api.put("/feedback/" + feedback.id, feedback)
      } catch (error) {
        console.error(error)
      }
    },

    //#endregion END REGION FEEDBACK

    //#region PLANS

    async insertPlan({ commit }, rawData) {
      try {
        let res = await api.post("/plans", rawData)
        commit("insertNewPlan", res.data)
      } catch (error) {
        console.error(error)
      }
    },

    async getAllPlans({ commit }) {
      try {
        let res = await api.get("/plans")
        commit("setAllPlans", res.data)
      } catch (error) {
        console.error(error)
      }
    },

    async getPlanStatuses({ commit }) {
      try {
        let res = await api.get("/plans/planstatuses")
        commit("setPlanStatuses", res.data[0].Title)
      } catch (error) {
        console.error(error)
      }
    },

    async addPlanStatus({ commit }, status) {
      try {
        let res = await api.put("/plans/planstatuses", status)
        commit("setPlanStatuses", res.data.Title)
      } catch (error) {
        console.error(error)
      }
    },

    async removePlanStatus({ commit }, apiObj) {
      try {
        let res = await api.put("/plans/planstatuses/remove", apiObj)
        commit("setPlanStatuses", res.data.Title)
      } catch (error) {
        console.error(error)
      }
    },

    //#endregion PLANS

    //#region SUBSCRIPTIONS

    async updateSubscription({ }, data) {
      if (data.type == "cancel") {
        await api.put("/subscription/cancel")
      } else if (data.type == "update") {
        await api.put("/subscriptions/updatesubscription", data.paypalRes)
      }
      router.push({ name: "dashboard" })
    },
    async subscribe({ }, paypalRes) {
      await api.put("/subscriptions/updatesubscription", paypalRes)
      router.push({ name: "dashboard" })
    },
    async cancelSubscription({ }, paypalData) {
      try {
        await api.put("subscriptions/cancel", paypalData)
        router.push({ name: 'dashboard' })
      } catch (error) {
        console.error(error)
      }
    },

    //#endregion SUBSCRIPTIONS

    //#region PROMOCODES

    async createPromoCodes({ commit, dispatch }, codeData) {
      try {
        let apiObj = {}
        if (codeData.Type == "FreeAccess") {
          apiObj = {
            Amount: codeData.Amount,
            SubStatus: "Grandfather",
            Details: "Free Lifetime Access!",
            Type: codeData.Type
          }
        }
        let res = await api.post("/subscriptions/addpromocodes", apiObj)
      } catch (error) {
        console.error(error)
      }
    },
    async checkPromoCode({ commit, dispatch }, reqObj) {
      try {
        let res = await api.put("/subscriptions/getpromocode", reqObj)
        commit("setPromoCodeData", res.data)
      } catch (error) {
        console.error(error)
      }
    },
    async usePromoCode({ commit, dispatch }, reqObj) {
      try {
        let res = await api.put("/subscriptions/usepromocode", reqObj)
        commit("setUser", res.data)
        swal("You're all set! Thanks for choosing TimeTrackers!")
        router.push({ name: "dashboard" })
      } catch (error) {
        console.error(error)
      }
    },
    async getPromoCodeCounts({ commit }) {
      try {
        let res = await api.get("/subscriptions/getpromocodecount")
        commit("setPromoCodeCounts", res.data)
      } catch (error) {
        console.error(error)
      }
    },
    async getPromoCodes({ commit }, apiObj) {
      try {
        let res = await api.put("/subscriptions/getallpromocodes", apiObj)
        if (res.data) {
          commit("setPromoCodes", res.data)
        }
      } catch (error) {
        window.alert(error)
        console.error(error)
      }
    },
    async togglePromoCodeReleased({ commit }, id) {
      try {
        let res = await api.put("/subscriptions/togglePromoCodeReleased/" + id)
        commit("setPromoCodes", res.data)
      } catch (error) {
        console.error(error)
      }
    },

    //#endregion PROMOCODES

    //#region UPDATES



    //#endregion UPDATES

  },
  modules: {

  }
})
