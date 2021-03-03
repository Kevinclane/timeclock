import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index'
import { api } from "./AxiosService"
import moment from "moment"

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    user: {},
    projects: [],
    activeProject: {},
    timeClockGroup: [],
    totalProjectTimes: {}
  },


  mutations: {
    setUser(state, user) {
      state.user = user
    },
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
    setTimeClockGroups(state, timeClockGroup) {
      state.timeClockGroup = timeClockGroup
    },
    setTotalProjectTimes(state, total) {
      state.totalProjectTimes = total
    },
    clearActiveProject(state) {
      state.activeProject = {}
      state.timeClockGroup = []
    },
    clearProjects(state) {
      state.projects = []
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
        dispatch("totalProjectTimes")
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
        commit("setActiveProject", res.data)
        dispatch("groupTimeClocks")
        dispatch("totalProjectTimes")
      } catch (error) {
        console.error(error)
      }
    },
    async deleteProject({ commit }, id) {
      try {
        debugger
        let data = await api.delete("/projects/" + id)
        router.push({ name: "dashboard" });
      } catch (error) {
        console.error(error)
      }
    },

    //#endregion -- END PROJECT STUFF --

    //#region  -- TIME CLOCK STUFF --

    async clockIn({ commit, dispatch }, obj) {
      try {
        let res = await api.post("/timeclock", obj)
        commit("addNewTimeClock", res.data)
        dispatch("groupTimeClocks")
      } catch (error) {
        console.error(error)
      }
    },
    async clockOut({ commit, dispatch }, obj) {
      try {
        let res = await api.put("/timeclock/" + obj.id + "/out", obj)
        commit("updateTimeClock", res.data)
        dispatch("groupTimeClocks")
        dispatch("totalProjectTimes")
      } catch (error) {
        console.error(error)
      }
    },
    groupTimeClocks({ commit }) {
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
      commit("setTimeClockGroups", finishedArr)
    },
    totalProjectTimes({ commit }) {
      let times = this.state.activeProject.TimeClocks;
      let i = 0;
      let total = {
        hour: 0,
        minute: 0,
        second: 0,
      };
      while (i < times.length && times[i].EndTime) {
        let start = {
          hour: parseInt(moment(times[i].StartTime).format("HH")),
          minute: parseInt(moment(times[i].StartTime).format("mm")),
          second: parseInt(moment(times[i].StartTime).format("ss")),
        };
        let end = {
          hour: parseInt(moment(times[i].EndTime).format("HH")),
          minute: parseInt(moment(times[i].EndTime).format("mm")),
          second: parseInt(moment(times[i].EndTime).format("ss")),
        };
        let diff = {
          hour: end.hour - start.hour,
          minute: end.minute - start.minute,
          second: end.second - start.second,
        };
        if (diff.second < 0) {
          diff.second += 60;
          diff.minute -= 1;
        }
        if (diff.minute < 0) {
          diff.minute += 60;
          diff.hour -= 1;
        }
        total.hour += diff.hour;
        total.minute += diff.minute;
        total.second += diff.second;
        i++;
      }
      i = 0;
      while (total.second > 59) {
        total.second -= 60;
        i++;
      }
      total.minute += i;
      i = 0;
      while (total.minute > 59) {
        total.minute -= 60;
        i++;
      }
      total.hour += i;
      commit("setTotalProjectTimes", total)
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
        commit("deleteTimeClock", res.data)
        dispatch("groupTimeClocks")
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

    //#endregion -- END DATA CLEARING --


    //#region  --MISC FUNCTIONS --



    //#endregion

  }
})
