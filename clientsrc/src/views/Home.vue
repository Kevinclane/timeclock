<template>
  <div class="home bgimg container-fluid text-white header-height">
    <div
      class="
        row
        my-5
        d-flex
        align-items-center
        justify-content-center
        home-section-min100
      "
    >
      <h1 class="col-12 text-center dynamic-header3 text-shadow">
        Time Trackers
      </h1>
      <h2 class="col-12 text-shadow">Beta version is now live!</h2>
    </div>
    <div
      class="
        row
        py-3
        bg-darker
        home-section-min30
        d-flex
        justify-content-center
        align-items-center
      "
    >
      <h4 class="col-12">Online time tracking system</h4>
      <h4 class="col-12">Track hours as a contractor or as a team</h4>
      <div class="col-12 col-lg-3" type="button" @click="signUpOrRoute">
        <h3 class="outline-success">Try it now for free!</h3>
      </div>
    </div>
    <div
      class="
        row
        home-section-min75
        d-flex
        justify-content-around
        align-items-start
        bg-secondary
      "
    >
      <div class="col-lg-4 col-10 mt-5 bg-dark rounded-large">
        <div class="row">
          <div class="col-12 border-bottom bg-primary rounded-top-large">
            <h3>Now Available:</h3>
          </div>
          <div class="col-12 d-flex justify-content-start text-left my-2">
            <ul>
              <li>Contractor version</li>
              <li>Live update of current time clocked in</li>
              <li>
                Lots of options to customize such as pay frequency,
                hourly/salary rate and more!
              </li>
              <li>Track multiple projects at a time</li>
              <li>Feedback/bug reporting for optimal user experience</li>
              <li>Generate Invoices as .DOCX</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-10 mt-5 bg-dark rounded-large">
        <div class="row">
          <div class="col-12 border-bottom bg-primary rounded-top-large">
            <h3>Coming soon:</h3>
          </div>
          <div class="col-12 d-flex justify-content-start text-left my-2">
            <ul>
              <li>Team version</li>
              <li>Live update of clock in/ out times of all employees</li>
              <li>
                Create and assign role to employees with customized permissions
              </li>
              <li>Live messaging system</li>
              <li>Website redesign</li>
              <li>Paypal direct invoice generation and sending</li>
              <li>Quickbooks integration</li>
              <li>Want something else added? Leave a suggestion here!</li>
            </ul>
          </div>
          <div class="col-12">
            <button @click="toFeedback()" class="btn btn-success my-2">
              Make a suggestion
            </button>
          </div>
        </div>
      </div>
      <div class="col-12 mobile-section"></div>
    </div>
    <footer class="row bg-dark fixed-bottom py-2">
      <div class="col-4"></div>
      <div class="col-4">Created by Kevin Lane</div>
      <div class="col-4">
        <a href="https://github.com/Kevinclane" target="_blank">
          <i class="fa fa-github text-white mx-1" aria-hidden="true"></i>
        </a>
        <a href="https://kevinclane.com/" target="_blank">
          <i class="fa fa-address-card text-white mx-1" aria-hidden="true"></i>
        </a>
        <a
          href="https://www.linkedin.com/in/kevinchristopherlane/"
          target="_blank"
        >
          <i class="fa fa-linkedin-square text-white mx-1"></i>
        </a>
      </div>
    </footer>
  </div>
</template>


<script>
import moment from "moment";
import router from "../router/index";
export default {
  name: "home",
  data() {
    return {
      test: "",
    };
  },
  async mounted() {
    if (this.$auth.isAuthenticated) {
      await this.$store.dispatch("getProfile");
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user;
    },
  },
  methods: {
    async signUpOrRoute() {
      if (this.$auth.isAuthenticated) {
        router.push({ name: "dashboard" });
      } else {
        await this.$auth.loginWithPopup();
        this.$store.dispatch("setBearer", this.$auth.bearer);
        this.$store.dispatch("getProfile");
        router.push({ name: "dashboard" });
      }
    },
    async toFeedback() {
      if (this.$auth.isAuthenticated) {
        router.push({ name: "feedback" });
      } else {
        await this.$auth.loginWithPopup();
        this.$store.dispatch("setBearer", this.$auth.bearer);
        this.$store.dispatch("getProfile");
        router.push({ name: "feedback" });
      }
    },
  },
  components: {},
};
</script>


<style scoped>
.bgimg {
  background-image: url("../assets/clockMechanics2.jpg");
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  background-position: center;
  position: fixed;
  font-family: "Gloria Hallelujah", cursive;
  margin: 0 auto;
  overflow-x: hidden;
  user-select: none;
}
.header-height {
  height: -webkit-fill-available;
}
.home-section-min100 {
  height: 100vh;
}
.home-section-min30 {
  min-height: 30vh;
}
.home-section-min75 {
  min-height: 75vh;
  height: fit-content;
}
.outline-success {
  border: 2px solid #00bc8c;
  border-radius: 5px;
}
.rounded-large {
  border-radius: 10px;
}
.rounded-top-large {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.mobile-section {
  height: 30vh;
}
@media screen and (min-width: 992px) {
  .mobile-section {
    height: 0;
  }
}
</style>