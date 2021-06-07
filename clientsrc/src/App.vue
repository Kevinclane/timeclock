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
  border-radius: 5px;
}
.bg-darker {
  background-color: #222222;
}
.text-black {
  color: black;
}
input {
  border-radius: 5px;
}
select {
  border-radius: 5px;
}
.btn-green {
  background-color: green;
}
.border-left-green {
  border-left: green solid 1px;
}
.center-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.vw100 {
  width: 100vw;
}
.bg-midnight {
  background-color: midnightblue;
}
.border-black-1 {
  border: 1px solid black;
}
.text-red {
  color: red;
}
.text-darker {
  color: #222222;
}
.text-green {
  color: green;
}
body {
  font-size: medium;
}
@media screen and (max-width: 992px) {
  body {
    font-size: xx-small;
  }
}
button {
  height: 2.5rem;
}
@media screen and (max-width: 992px) {
  button {
    height: 2rem;
  }
}
.border-bottom-black {
  border-bottom: 2px solid black;
}
.dynamic-header {
  font-size: 2rem;
}
@media screen and (min-width: 992px) {
  .dynamic-header {
    font-size: 3rem;
  }
}
.dynamic-header2 {
  font-size: 1rem;
}
@media screen and (min-width: 992px) {
  .dynamic-header2 {
    font-size: 2rem;
  }
}
.dynamic-header3 {
  font-size: 3rem;
}
@media screen and (min-width: 992px) {
  .dynamic-header3 {
    font-size: 7rem;
  }
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
