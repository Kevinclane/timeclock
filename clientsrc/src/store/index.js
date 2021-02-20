import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index'
import { api } from "./AxiosService"

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    user: {},
    projects: [],
    activeProject: {},
    timeClocks: []
  },


  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setProjects(state, projects) {
      state.projects = projects
    },
    setActiveProject(state, project) {
      state.activeProject = project
    },
    addNewTimeClock(state, timeClock) {
      state.timeClocks.push(timeClock)
    },
    setTimeClocks(state, timeClocks) {
      state.timeClocks = timeClocks
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
        debugger
        let res = await api.get("/projects/all")
        commit("setProjects", res.data)
        console.log(res.data)
      } catch (error) {
        console.error(error)
      }
    },
    async getActiveProject({ commit }, id) {
      try {
        let res = await api.get("/projects/" + id)
        commit("setActiveProject", res.data)
      } catch (error) {
        console.error(error)
      }
    },
    async createProject({ commit }, projectData) {
      try {
        let res = await api.post("/projects", projectData)
        console.log(res.data)
      } catch (error) {
        console.error(error)
      }
    },

    //#endregion -- END PROJECT STUFF --

    //#region  -- TIME CLOCK STUFF --

    async clockIn({ commit }, obj) {
      try {
        let res = await api.post("/timeclock", obj)
        commit("addNewTimeClock", res.data)
      } catch (error) {
        console.error(error)
      }
    },
    async clockOut({ dispatch }, obj) {
      try {
        let res = await api.put("/timeclock/" + obj.projectId + "/out", obj)
        if (res.data) {
          dispatch("getTimeClocks", obj.projectId)
        }
      } catch (error) {
        console.error(error)
      }
    },
    async getTimeClocks({ commit }, projectId) {
      try {
        debugger
        let res = await api.get("/timeclock/" + projectId)
        commit("setTimeClocks", res.data)
      } catch (error) {
        console.error(error)
      }
    }

    //#endregion -- END TIME CLOCK STUFF --

  }
})
