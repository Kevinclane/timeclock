<template>
  <nav class="navbar navbar-dark bg-primary container-fluid">
    <div class="row vw100 d-flex justify-content-between">
      <router-link
        class="navbar-brand col m-0 d-flex align-items-center justify-content-start"
        :to="{ name: 'home' }"
        >Home</router-link
      >
      <router-link
        v-if="$auth.isAuthenticated"
        class="navbar-brand col m-0 center-center"
        :to="{ name: 'dashboard' }"
        >Dashboard</router-link
      >
      <router-link
        v-if="$auth.isAuthenticated"
        class="navbar-brand col m-0 center-center"
        :to="{ name: 'subscriptions' }"
        >Upgrade</router-link
      >
      <router-link
        v-if="$auth.isAuthenticated && isAdmin"
        class="navbar-brand col m-0 center-center"
        :to="{ name: 'adminsubs' }"
        >Admin Subs</router-link
      >
      <span class="navbar-text col m-0 d-flex justify-content-end">
        <button
          class="btn btn-green"
          @click="login"
          v-if="!$auth.isAuthenticated"
        >
          Login
        </button>
        <button class="btn btn-danger" @click="logout" v-else>logout</button>
      </span>
      <!-- <button
        class="navbar-toggler hide-lg col-0"
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
          <li class="nav-item" :class="{ active: $route.name == 'home' }">
            <router-link :to="{ name: 'home' }" class="nav-link"
              >Home</router-link
            >
          </li>
          <li
            v-if="$auth.isAuthenticated"
            class="nav-item"
            :class="{ active: $route.name == 'dashboard' }"
          >
            <router-link :to="{ name: 'dashboard' }" class="nav-link"
              >Dashboard</router-link
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
      </div> -->
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  methods: {
    async login() {
      await this.$auth.loginWithPopup();
      this.$store.dispatch("setBearer", this.$auth.bearer);
      await this.$store.dispatch("getProfile");
    },
    async logout() {
      await this.$auth.logout({ returnTo: window.location.origin });
    },
  },
  computed: {
    isAdmin() {
      return this.$store.state.user.isAdmin;
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

