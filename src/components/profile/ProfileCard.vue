<template>
  <a-card>
    <div style="display: flex;">
      <div class="profile-pic-wrapper">
        <a-avatar
          :size="150"
          :src="
            faculty.profilePic ||
              'https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png'
          "
          style="color: #004b8d;"
        />

        <div class="overlay">
          <clipper-upload v-model="uploadPic">
            <div class="overlay-text"><a-icon type="camera" /></div>
          </clipper-upload>
        </div>
      </div>
      <div>
        <h3>{{ faculty.name }}</h3>
        <p>{{ `Staff ID: ${faculty.id}` }}</p>
        <p style="margin: 0">{{ faculty.email }}</p>
      </div>
    </div>
    <a-modal v-model="isUploadPicModalVisible">
      <template slot="footer">
        <a-button @click="isUploadPicModalVisible = false">Cancel</a-button>
        <a-button
          @click="confirmUploadPic"
          type="primary"
          :loading="isUpdatePicLoading"
          >Confirm</a-button
        >
      </template>
      <clipper-fixed
        :src="uploadPic"
        ref="clipper"
        bg-color="black"
        :round="true"
      ></clipper-fixed>
    </a-modal>
  </a-card>
</template>

<script>
import queries from "@/graphql/queries.gql";
import store from "@/store";
import { clipperUpload, clipperFixed } from "vuejs-clipper";

export default {
  name: "Profile",
  components: {
    clipperUpload,
    clipperFixed
  },
  data() {
    return {
      faculty: {},
      uploadPic: null,
      isUpdatePicLoading: false,
      isUploadPicModalVisible: false,
      test: process.env.VUE_APP_GRAPHQL_HTTP
    };
  },
  apollo: {
    faculty: {
      query: queries.getFacultyById,
      variables() {
        return {
          faculty_id: store.state.loggedInUser
        };
      },
      update: data => data.faculty_by_pk,
      error() {
        this.$notification.error({
          key: `fetch_faculty_data_failure`,
          message: "Failed to obtain data on your profile",
          description: "Please try again."
        });
      }
    }
  },
  watch: {
    uploadPic() {
      this.isUploadPicModalVisible = true;
    }
  },
  methods: {
    async confirmUploadPic() {
      this.isUpdatePicLoading = true;
      const canvas = this.$refs.clipper.clip();
      let newProfilePic = canvas.toDataURL("image/jpeg");
      try {
        await this.$apollo.mutate({
          mutation: queries.update_profile_pic,
          variables: {
            faculty_id: store.state.loggedInUser,
            profilePic: newProfilePic
          },
          refetchQueries: ["getFacultyById"]
        });
      } catch (err) {
        console.log(err);
        this.$notification.error({
          key: `toggle_notif_new_request_error`,
          message: "The server could not update your user profile picture",
          description: "Please try again."
        });
      }
      this.isUpdatePicLoading = false;
      this.isUploadPicModalVisible = false;
    },
    resizeImage() {}
  }
};
</script>

<style scoped>
.profile-pic-wrapper {
  margin-right: 20px;
  position: relative;
}
.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: 0.5s ease;
  background-color: black;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.profile-pic-wrapper:hover .overlay {
  opacity: 0.2;
}
.overlay-text {
  color: white;
  font-size: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
