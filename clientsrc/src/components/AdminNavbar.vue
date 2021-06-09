<template>
  <div class="container-fluid">
    <div class="row text-light d-flex justify-content-between mt-3">
      <div class="col-2 rounded-top bg-dark mx-1 py-2 dropdown">
        <div type="button" class="dropbtn">Feedback</div>
        <div class="dropdown-content">
          <div type="button" @click="setView('Bugs')">Bugs</div>
          <div type="button" @click="setView('Suggestions')">Suggestions</div>
          <div type="button" @click="setView('Feedback')">Feedback</div>
        </div>
      </div>
      <div class="col-2 rounded-top bg-dark mx-1 py-2 dropdown">
        <div type="button" class="dropbtn">Subs</div>
        <div class="dropdown-content">
          <div type="button" @click="setView('EditPlans')">Edit Plans</div>
          <div type="button" @click="setView('Subscriptions')">
            Subscriptions
          </div>
        </div>
      </div>
      <div class="col-2 rounded-top bg-dark mx-1 py-2"></div>
      <div class="col-2 rounded-top bg-dark mx-1 py-2"></div>
      <div class="col-2 rounded-top bg-dark mx-1 py-2"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminNavbar",
  methods: {
    setView(view) {
      this.$emit("setView", view);
    },
  },
};
</script>

<style scoped>
/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  width: fit-content;
  padding: 1rem;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  color: black;
}

/* Change color of dropdown links on hover */
.dropdown-content div:hover {
  background-color: #ddd;
}

.dropdown-content div {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: flex;
  flex-direction: column;
}
</style>