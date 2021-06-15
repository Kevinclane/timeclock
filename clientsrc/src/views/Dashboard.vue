<template>
  <div v-if="loading">
    <div class="spinner-border text-primary mt-5" role="status">
      <span class="visually-hidden"></span>
    </div>
  </div>
  <div v-else class="container-fluid text-light">
    <div class="row">
      <div class="col-3 col-lg-2 h-100 bg-primary border-top side-bar">
        <div class="my-3" type="button" @click="setTab('projects')">
          Projects
        </div>
        <div class="my-3" type="button" @click="setTab('profile')">Profile</div>
      </div>
      <div class="col-9 col-lg-10">
        <div class="row my-3">
          <div class="col">
            <!--PROJECT MODAL-->
            <div v-if="showProjectForm" class="backdrop">
              <new-project-form-modal
                class="modal-content container"
                @closeModal="toggleProjectForm"
              />
            </div>
            <!--END PROJECT MODAL-->
          </div>
        </div>
        <div v-if="selectedTab == 'projects'" class="row">
          <div
            class="
              col-lg-4 col-md-5 col-10
              offset-1 offset-md-0 offset-lg-0
              mb-2
            "
          >
            <div
              class="
                card
                border-primary
                mb-3
                project-card
                card-height
                d-flex
                justify-content-center
              "
              type="button"
              @click="toggleProjectForm"
            >
              <i class="fas fa-5x fa-plus"></i>
            </div>
          </div>
          <project-card
            v-for="project in projects"
            :key="project.id"
            :project="project"
          />
        </div>
        <div v-if="selectedTab == 'profile'" class="row">
          <div class="col-lg-4 col-12">
            <img
              class="border-r-50 img-size"
              :src="`${user.Picture}`"
              alt="profile picture"
            />
            <div v-if="!showUploadPhoto">
              <i
                class="fa fa-camera"
                type="button"
                @click="selectPhoto()"
                aria-hidden="true"
              >
                Upload</i
              >
            </div>
            <input v-if="showUploadPhoto" type="file" @change="uploadPhoto" />
            <button
              class="btn btn-sm btn-danger"
              v-if="showUploadPhoto"
              @click="selectPhoto()"
            >
              Cancel
            </button>
            <div class="row my-4">
              <div class="col-10 offset-1 bg-secondary rounded">
                <div class="row">
                  <div class="col-12 py-2">
                    Plan: {{ user.Subscription.SubStatus }}
                  </div>
                  <div v-if="activeSub" class="col-12">
                    <div class="row">
                      <div class="col-12 py-2">
                        Frequency: {{ user.Plan.Frequency }}
                      </div>
                      <div class="col-12 py-2">
                        Status: {{ user.PPSubData.status }}
                      </div>
                      <div class="col-12 py-2">
                        Next Charge:
                        {{ nextBill }}
                      </div>
                      <div class="col-12 py-2">
                        Charge Amount: ${{ user.Plan.Price }}
                      </div>
                    </div>
                  </div>
                  <div v-else class="col-12 py-2"></div>
                  <div class="col-12 py-2">
                    <button class="btn btn-sm btn-green" @click="toSubView()">
                      Update Subscription
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-7 col-10 offset-1 offset-lg-0">
            <div class="row bg-dark text-light box-shadow-245">
              <div class="col-12 text-center bg-primary py-3 mb-2">
                Contact Info
              </div>
              <div class="col-12">
                <div v-if="showEditContact" class="row">
                  <div class="col-3 my-1">First Name:</div>
                  <input
                    class="col-8 my-1"
                    type="text"
                    v-model="user.FirstName"
                  />
                  <div class="col-3 my-1">Last Name:</div>
                  <input
                    class="col-8 my-1"
                    type="text"
                    v-model="user.LastName"
                  />
                  <div class="col-3 my-1">Phone:</div>
                  <input class="col-8 my-1" type="text" v-model="user.Phone" />
                  <div class="col-3 my-1">Website:</div>
                  <input
                    class="col-8 my-1"
                    type="text"
                    v-model="user.Website"
                  />
                  <div class="col-3 my-1">LinkedIn:</div>
                  <input
                    class="col-8 my-1"
                    type="text"
                    v-model="user.LinkedIn"
                  />
                  <div class="col-12 my-2 d-flex justify-content-around">
                    <button
                      class="btn btn-danger"
                      @click="toggleShowEditContact()"
                    >
                      Cancel
                    </button>
                    <button class="btn btn-green" @click="updateContactInfo()">
                      Save
                    </button>
                  </div>
                </div>
                <div v-else class="row text-left">
                  <div class="col-3">First Name:</div>
                  <div class="col-8 limit-length">{{ user.FirstName }}</div>
                  <div class="col-3">Last Name:</div>
                  <div class="col-8 limit-length">{{ user.LastName }}</div>
                  <div class="col-3">Phone:</div>
                  <div class="col-8 limit-length">{{ user.Phone }}</div>
                  <div class="col-3">Website:</div>
                  <div class="col-8 limit-length">{{ user.Website }}</div>
                  <div class="col-3">LinkedIn:</div>
                  <div class="col-8 limit-length">{{ user.LinkedIn }}</div>
                  <div
                    class="col-12 text-center mt-3 mb-1"
                    type="button"
                    @click="toggleShowEditContact()"
                  >
                    <i class="fas fa-pen"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="row bg-dark text-light my-5 box-shadow-245">
              <div class="col-12 text-center bg-primary py-3 mb-2">
                Business Info
              </div>
              <div class="col-12">
                <div v-if="showEditBusiness" class="row">
                  <div class="col-3 my-1">Business Name:</div>
                  <input
                    class="col-8 my-1"
                    type="text"
                    v-model="user.BusinessName"
                  />
                  <div class="col-3 my-1">Business Phone:</div>
                  <input
                    class="col-8 my-1"
                    type="text"
                    v-model="user.BusinessPhone"
                  />
                  <div class="col-3 my-1">Business Address:</div>
                  <input
                    class="col-8 my-1"
                    type="text"
                    v-model="user.BusinessAddress"
                  />
                  <div class="col-3 my-1">Business Website:</div>
                  <input
                    class="col-8 my-1"
                    type="text"
                    v-model="user.BusinessWebsite"
                  />
                  <div class="col-12 my-2 d-flex justify-content-around">
                    <button
                      class="btn btn-danger"
                      @click="toggleShowEditBusiness()"
                    >
                      Cancel
                    </button>
                    <button class="btn btn-green" @click="updateBusinessInfo()">
                      Save
                    </button>
                  </div>
                </div>
                <div v-else class="row text-left">
                  <div class="col-3">Business Name:</div>
                  <div class="col-8 limit-length">
                    {{ user.BusinessName }}
                  </div>
                  <div class="col-3">Business Phone:</div>
                  <div class="col-8 limit-length">
                    {{ user.BusinessPhone }}
                  </div>
                  <div class="col-3">Business Address:</div>
                  <div class="col-8 limit-length">
                    {{ user.BusinessAddress }}
                  </div>
                  <div class="col-3">BusinessWebsite:</div>
                  <div class="col-8 limit-length">
                    {{ user.BusinessWebsite }}
                  </div>
                  <div
                    class="col-12 text-center mt-3 mb-1"
                    type="button"
                    @click="toggleShowEditBusiness()"
                  >
                    <i class="fas fa-pen"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
import moment from "moment";
import NewProjectFormModal from "../components/modals/NewProjectFormModal.vue";
import ProjectCard from "../components/Cards/ProjectCardComponent.vue";
export default {
  name: "Dashboard",
  data() {
    return {
      showProjectForm: false,
      showUploadPhoto: false,
      showEditContact: false,
      showEditBusiness: false,
      loading: true,
      selectedTab: "projects",
      newImg: "",
    };
  },
  async mounted() {
    await this.$store.dispatch("getProjects");
    if (!this.$store.state.user) {
      await this.getProfile();
    }
    this.loading = false;
  },
  beforeDestroy() {
    this.$store.dispatch("clearProjects");
  },
  methods: {
    toggleProjectForm() {
      if (!this.showProjectForm && this.projectLimit) {
        swal({
          title: "Please subscribe to add more projects",
          text: "Would you like to upgrade?",
          icon: "info",
          buttons: ["No thanks", "Yes please!"],
        }).then((confirm) => {
          if (confirm) {
            this.$router.push({ name: "subscriptions" });
          }
        });
      } else {
        this.showProjectForm = !this.showProjectForm;
      }
    },
    toggleShowEditContact() {
      this.showEditContact = !this.showEditContact;
    },
    toggleShowEditBusiness() {
      this.showEditBusiness = !this.showEditBusiness;
    },
    getProfile() {
      this.$store.dispatch("getProfile");
    },
    setTab(tab) {
      this.selectedTab = tab;
    },
    selectPhoto() {
      this.showUploadPhoto = !this.showUploadPhoto;
    },
    async uploadPhoto(event) {
      await this.fileToDataURL(event, this.dispatchPic);
    },
    dispatchPic(img) {
      this.$store.dispatch("uploadProfilePicture", img);
      this.selectPhoto();
    },
    fileToDataURL(event, dispatchPic) {
      if (
        event.target.files[0]["type"] === "image/jpeg" ||
        event.target.files[0]["type"] === "image/png"
      ) {
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          function () {
            dispatchPic(reader.result);
          },
          false
        );
        reader.readAsDataURL(event.target.files[0]);
      } else {
        swal({
          text: "Selected file must be .jpeg or .png",
        });
      }
    },
    updateContactInfo() {
      this.$store.dispatch("updateContactInfo", {
        FirstName: this.user.FirstName,
        LastName: this.user.LastName,
        Phone: this.user.Phone,
        Website: this.user.Website,
        LinkedIn: this.user.LinkedIn,
      });
      this.toggleShowEditContact();
    },
    updateBusinessInfo() {
      this.$store.dispatch("updateBusinessInfo", {
        BusinessName: this.user.BusinessName,
        BusinessPhone: this.user.BusinessPhone,
        BusinessAddress: this.user.BusinessAddress,
        BusinessWebsite: this.user.BusinessWebsite,
      });
      this.toggleShowEditBusiness();
    },
    toSubView() {
      this.$router.push({ name: "subscriptions" });
    },
  },
  computed: {
    projects() {
      return this.$store.state.projects;
    },
    timeClocks() {
      return this.$store.state.timeClocks;
    },
    activeSub() {
      let status = this.$store.state.user.Subscription.SubStatus;
      if (status != "Free") {
        return true;
      } else return false;
    },
    projectLimit() {
      let status = this.$store.state.user.Subscription.SubStatus;
      let projects = this.$store.state.projects;
      if (projects.length > 0 && status == "Free") {
        return true;
      } else return false;
    },
    user() {
      return this.$store.state.user;
    },
    nextBill() {
      return moment(
        this.$store.state.user.PPSubData.billing_info.next_billing_time
      ).format("MM/DD/YYYY");
    },
  },
  components: { NewProjectFormModal, ProjectCard },
};
</script>
<style scoped>
.modal-content {
  position: fixed;
  padding: 2rem;
  top: 20vh;
  left: 10vw;
  right: 10vw;
  z-index: 100;
  border-radius: 20px;
  background-color: rgba(171, 180, 187, 0.95);
  max-height: 80vh;
  max-width: 80vw;
}
.backdrop {
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
}
@media screen and (min-width: 992px) {
  .modal-content {
    max-width: 40vw;
  }
}
.side-bar {
  min-height: 100vh;
}
.border-r-50 {
  border-radius: 50%;
}
.img-size {
  height: 50px;
  width: 50px;
}
@media screen and (min-width: 992px) {
  .img-size {
    height: 150px;
    width: 150px;
  }
}
.dynamic-d-flex {
  display: block;
}
@media screen and (min-width: 992px) {
  .dynamic-d-flex {
    display: flex;
  }
}
.limit-length {
  overflow: hidden;
  text-overflow: ellipsis;
}
input {
  height: 2rem;
}
</style>