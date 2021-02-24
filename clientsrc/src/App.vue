<template>
  <div id="app">
    <navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from "./components/Navbar";
import { onAuth } from "@bcwdev/auth0-vue";
export default {
  name: "App",
  async beforeCreate() {
    try {
      await onAuth();
      if (this.$auth.isAuthenticated) {
        this.$store.dispatch("setBearer", this.$auth.bearer);
        this.$store.dispatch("getProfile");
      }
    } catch (err) {
      this.$router.push({ name: "home" });
    }
  },
  components: {
    Navbar,
  },
};
</script>


<style lang="scss">
// @import "./assets/_variables.scss";
// @import "bootstrap";
// @import "./assets/_overrides.scss";
@import "./assets/bootstrap.css";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.bold {
  font-weight: bold;
}
.flex-end {
  justify-content: flex-end;
}
.btn-submit {
  position: absolute;
  bottom: 2vh;
  right: 2vw;
}
.btn-cancel {
  position: absolute;
  bottom: 2vh;
  left: 2vw;
}
.project-card {
  max-width: 20rem;
}
.border-top-5 {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
* {
  font-family: "Montserrat", sans-serif;
}
a:hover {
  text-decoration: none;
}
.card-height {
  height: 15rem;
}
.border-times {
  border: green solid 1px;
}
.bg-darker {
  background-color: #222222;
}
</style>
