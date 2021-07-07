<template>
  <nav class="navbar navbar-dark bg-primary container-fluid">
    <div class="row vw100 d-flex justify-content-between">
      <router-link
        class="
          navbar-brand
          col-1
          m-0
          d-flex
          align-items-center
          justify-content-start
        "
        :to="{ name: 'home' }"
        ><i class="fa fa-2x fa-home text-dark" aria-hidden="true"></i
      ></router-link>
      <button
        class="navbar-toggler col-0 mr-3 h-100"
        type="button"
        data-toggle="collapse"
        data-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse col-12" id="navbarText">
        <ul class="navbar-nav mr-auto">
          <li
            v-if="$auth.isAuthenticated"
            class="nav-item"
            :class="{ active: $route.name == 'dashboard' }"
          >
            <router-link :to="{ name: 'dashboard' }" class="nav-link"
              >Dashboard</router-link
            >
          </li>
          <li
            v-if="$auth.isAuthenticated"
            class="nav-item"
            :class="{ active: $route.name == 'subscriptions' }"
          >
            <router-link :to="{ name: 'subscriptions' }" class="nav-link"
              >Subscriptions</router-link
            >
          </li>
          <li
            v-if="$auth.isAuthenticated"
            class="nav-item"
            :class="{ active: $route.name == 'feedback' }"
          >
            <router-link :to="{ name: 'feedback' }" class="nav-link"
              >Feedback</router-link
            >
          </li>
          <li
            v-if="$auth.isAuthenticated && isAdmin"
            class="nav-item"
            :class="{ active: $route.name == 'admin' }"
          >
            <router-link :to="{ name: 'admin' }" class="nav-link"
              >Admin</router-link
            >
          </li>
        </ul>
        <span class="navbar-text">
          <button
            class="btn btn-green"
            @click="login"
            v-if="!$auth.isAuthenticated"
          >
            Login
          </button>
          <button class="btn btn-danger" @click="logout" v-else>logout</button>
        </span>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  methods: {
    async login() {
      await this.$auth.loginWithRedirect();
      this.$store.dispatch("setBearer", this.$auth.bearer);
      console.log("AuthData: ", this.$auth);
      await this.$store.dispatch("getProfile");
    },
    async logout() {
      await this.$auth.logout({ returnTo: window.location.origin });
    },
  },
  computed: {
    isAdmin() {
      return this.$store.state.user.IsAdmin;
    },
  },
};
</script>

<style scoped>
.hide-sm {
  visibility: visible;
}
.hide-lg {
  visibility: hidden;
}
@media screen and (max-width: 768px) {
  .hide-sm {
    visibility: hidden;
  }
  .hide-lg {
    visibility: visible;
  }
}
</style>

