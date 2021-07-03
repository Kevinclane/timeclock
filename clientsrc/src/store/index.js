import moment from "moment"
import swal from "sweetalert"
// const fs = require("fs")
import * as fs from "file-saver"
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
  // debugger
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
    timeClockGroups: [],
    weeks: [],
    totalPPTimes: 0,
    payPeriodSelection: "",
    payPeriodDisplay: [],
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
      state.activeProject = {}
      state.timeClockGroups = [],
        state.totalPPTimes = 0,
        state.payPeriodSelection = "",
        state.payPeriodDisplay = []
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
    setActiveInvoiceGroup(state, IG) {
      state.activeInvoiceGroup = IG
    },
    setIGs(state, IGs) {
      state.activeProject.InvoiceGroups = IGs
    },

    //#endregion END PROJECT STUFF

    //#region TIMECLOCK STUFF

    addNewTimeClock(state, timeClock) {
      state.activeProject.TimeClocks.push(timeClock)
    },
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
        debugger
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
        let res = await api.get("/projects/" + id)
        commit("setActiveProject", res.data)
        dispatch("groupTimeClocks")
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
        let data = await api.delete("/projects/" + id)
        console.log(data.data)
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
        console.log("newIGS: ", IGs)
        let res = api.put("/projects/invoicegroups/update", [...IGs])
        await commit("setIGs", res.data)
      } catch (error) {
        console.error(error)
      }
    },

    //#endregion -- END PROJECT STUFF --

    //#region  -- TIME CLOCK STUFF --

    async clockIn({ commit, dispatch }, obj) {
      try {
        let res = await api.post("/timeclock", obj)
        await commit("addNewTimeClock", res.data)
        dispatch("groupTimeClocks")
      } catch (error) {
        console.error(error)
      }
    },
    async clockOut({ commit, dispatch }, obj) {
      try {
        let res = await api.put("/timeclock/out/" + obj.id, obj)
        commit("updateTimeClock", res.data)
        dispatch("groupTimeClocks")
      } catch (error) {
        console.error(error)
      }
    },
    async createTimeClock({ commit, dispatch }, timeClock) {
      try {
        let res = await api.post("/timeclock", timeClock)
        commit("addNewTimeClock", res.data)
        dispatch("groupTimeClocks")
      } catch (error) {
        console.error(error)
      }
    },
    async updateTimeClock({ commit, dispatch }, timeClock) {
      try {
        let res = await api.put("/timeclock/" + timeClock.id, timeClock)
        commit("updateTimeClock", res.data)
        dispatch("groupTimeClocks")
      } catch (error) {
        console.error(error)
      }
    },
    async deleteTimeClock({ commit, dispatch }, timeClock) {
      try {
        let res = await api.delete("timeclock/" + timeClock.id)
        await commit("deleteTimeClock", res.data)
        dispatch("groupTimeClocks")
      } catch (error) {
        console.error(error)
      }
    },
    //Groups timeclocks of the same day into an array
    //"TimeClockGroups" is an array of these arrays
    async groupTimeClocks({ commit, dispatch }) {
      let timeClocks = [...this.state.activeProject.TimeClocks];
      let finishedArr = [];
      while (timeClocks.length > 0) {
        let tempArr = [];
        let i = 0;
        tempArr.push(timeClocks[0]);
        timeClocks.splice(0, 1);
        while (i < timeClocks.length) {
          if (
            moment(tempArr[0].StartTime).isSame(timeClocks[i].StartTime, "day")
          ) {
            tempArr.push(timeClocks[i]);
            timeClocks.splice(i, 1);
          } else i++;
        }
        tempArr.sort((a, b) => moment(a.StartTime).format('HH') - moment(b.StartTime).format('HH'))
        finishedArr.push(tempArr);
      }
      finishedArr.sort((a, b) =>
        (moment(a[0].StartTime).format("MM")
          + moment(a[0].StartTime).format("DD"))
        - (moment(b[0].StartTime).format("MM")
          + moment(b[0].StartTime).format("DD")))
      await commit("setTimeClockGroups", finishedArr)
      dispatch("updatePPSelection", finishedArr)
    },
    //Calculates the total times for the active payperiod
    totalPPTimes({ commit }) {
      let tcg = this.state.payPeriodDisplay
      let i = 0;
      let total = 0
      while (i < tcg.length) {
        let currentDay = tcg[i]
        let x = 0
        while (x < currentDay.length && currentDay[x].EndTime) {
          total += currentDay[x].TCTotalHours
          x++
        }
        i++
      }
      commit("setTotalPPTimes", total.toFixed(2))
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
    //Finds and sets all TimeClockGroups based on active PayPeriod selection
    async updatePPSelection({ commit, dispatch }) {
      let timeClockGroups = this.state.timeClockGroups
      if (this.state.payPeriodSelection == "") {
        let inital = this.state.activeProject.InvoiceGroups.find((x) => x.Current);
        let start = moment(inital.StartDay).format("MM/DD/YYYY");
        let end = moment(inital.EndDay).format("MM/DD/YYYY");
        let newPP = `${start} - ${end}`;
        await commit("setPPSelection", newPP)
      }
      let split = this.state.payPeriodSelection.split("-");
      let start = moment(split[0])
      let end = moment(split[1])
      let i = 0;
      //loops over every payPeriod object in InvoiceGroups
      while (i < this.state.activeProject.InvoiceGroups.length) {
        //current payPeriod object being checked
        let IG = this.state.activeProject.InvoiceGroups[i];
        let boolS = moment(IG.StartDay).isSameOrAfter(start);
        let boolE = moment(IG.EndDay).isSameOrBefore(end);
        if (boolS && boolE) {
          //sets correct timeClockGroups within query dates
          commit("setActiveInvoiceGroup", IG)
          let PPRender = timeClockGroups.filter(
            (tcg) =>
              moment(tcg[0].StartTime).isSameOrAfter(moment(IG.StartDay)) &&
              moment(tcg[0].EndTime).isBefore(moment(IG.EndDay).add(1, "day"))
          );
          i = this.state.activeProject.InvoiceGroups.length;
          commit("setPPDisplay", PPRender)
        } else i++;
      }
      dispatch("totalPPTimes")
      dispatch("weeklyTimes")
    },
    async changePPSelection({ commit, dispatch }, newPP) {
      await commit("setPPSelection", newPP)
      dispatch("updatePPSelection")
    },
    weeklyTimes({ commit, dispatch }) {
      //tcg is an array of all timeclocks within the active payperiod grouped into individual arrays of the same day ie. [ [Day1], [Day2], ect ]
      //Each day can have multiple Timeclocks
      let tcg = [...this.state.payPeriodDisplay]
      let split = this.state.payPeriodSelection.split("-");
      let start = moment(split[0]);
      // let end = moment(split[1]);

      //Split into separate weeks
      let weeks = []
      let tempStart = start
      while (tcg.length > 0) {
        let weekS = moment(tempStart).format("MM/DD/YYYY")
        let weekE = moment(tempStart).add(6, "days").format("MM/DD/YYYY")
        let week = weekS + "-" + weekE
        weekE = moment(tempStart).add(7, "days")
        let weeklyTcs = []
        let x = 0
        let finished = false
        //this loop should collect all of the day arrays that are withing the current week
        while (!finished) {
          //currentDay is an array of Timeclocks of the same day
          let currentDay = tcg[x]
          let check = moment(currentDay[0].StartTime)
          let inWeekCheck = check.isBefore(weekE)
          //if the day array is within the week, push to the week's array and remove from list
          if (inWeekCheck) {
            weeklyTcs.push(currentDay)
            tcg.splice(x, 1)
            if (tcg.length == 0) {
              finished = true;
            }
          } else {
            finished = true;
          }
        }
        let weekObj = {
          readable: week,
          timeClocks: weeklyTcs
        }
        weeks.push(weekObj)
        tempStart = moment(tempStart).add(7, "days")
      }

      let ps = this.state.activeProject.ProjectSettings

      //calculates times per week
      let i = 0;
      //loop through each week
      while (i < weeks.length) {
        //total will be the total hours of this week
        let total = 0;
        let x = 0
        //loop through each Time Clock day group
        while (x < weeks[i].timeClocks.length) {
          let currentDay = weeks[i].timeClocks[x]
          let y = 0
          let tempTotal = 0
          //loop through each Time Clock within each day group
          while (y < currentDay.length) {
            let timeDiff = currentDay[y].TCTotalHours
            if (ps.RoundTime && ps.RoundFrequency == "TC") {
              // timeDiff = parseFloat(timeDiff.asHours().toFixed(2));
              timeDiff = roundTime(timeDiff, ps.RoundTo);
              tempTotal += timeDiff;
            } else {
              tempTotal += timeDiff
            }
            y++
          }
          if (ps.RoundTime && ps.RoundFrequency == "Day") {
            tempTotal = tempTotal.toFixed(2)
            tempTotal = roundTime(tempTotal, ps.RoundTo)
          }
          total += tempTotal
          x++
        }
        weeks[i].totalTimes = total.toFixed(2);
        if (ps.RoundTime && ps.RoundFrequency == "Week") {
          weeks[i].totalTimes = roundTime(weeks[i].totalTimes, ps.RoundTo)
        }
        if (ps.OT && weeks[i].totalTimes > 40) {
          weeks[i].OTHours = parseFloat((weeks[i].totalTimes - 40).toFixed(2))
          weeks[i].OTRate = parseFloat((this.state.activeProject.Rate * ps.OTRate).toFixed(2))
          weeks[i].regHours = 40
          weeks[i].OTPay = parseFloat(((weeks[i].totalTimes - 40) * (this.state.activeProject.Rate * ps.OTRate)).toFixed(2))
          let payTotal = 40 * this.state.activeProject.Rate
          weeks[i].regPay = payTotal.toFixed(2)
          payTotal += parseFloat((weeks[i].totalTimes - 40) * (this.state.activeProject.Rate * ps.OTRate).toFixed(2))
          weeks[i].pay = parseFloat(payTotal.toFixed(2))
        } else {
          let pay = (weeks[i].totalTimes * this.state.activeProject.Rate).toFixed(2)
          let split = pay.split(".")
          if (split[1].length == 1) {
            pay += "0"
          }
          weeks[i].pay = parseFloat(pay)
        }
        i++
      }
      commit("setWeeks", weeks)
    },
    async chooseDowngradeProject({ commit }, project) {
      try {
        let res = await api.post("/projects/lockprojects", project)
        commit("setProjects", res.data)
      } catch (error) {
        console.error(error)
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
        console.log("editedFeedback", res.data)
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
        console.log("New SubId:", res.data)
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
        console.log(res.data)
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

    async updateDBTCTotals({ }) {
      try {
        let res = await api.get("/timeclock/calculatetotals")
        console.log(res.data)
      } catch (error) {
        console.error(error)
      }
    },
    async updateProjectFormats({ }) {
      try {
        debugger
        let res = await api.get("/projects/newprojectformat")
        console.log(res)
      } catch (error) {
        console.error(error)
      }
    }

    //#endregion UPDATES

  },
  modules: {

  }
})
