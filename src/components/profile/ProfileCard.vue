<template>
  <a-card>
    <div style="display: flex; align-items: center;">
      <div style="margin-right: 25px;">
        <a-avatar
          :size="150"
          :src="faculty.profilePic || '/avatar_default.png'"
          style="color: #004b8d;"
        />
      </div>
      <div>
        <h3>{{ faculty.name }}</h3>
        <p>{{ `Staff ID: ${faculty.id}` }}</p>
        <p>{{ faculty.email }}</p>
        <a-button @click="isUploadPicModalVisible = true"
          >Update profile picture</a-button
        >
      </div>
    </div>
    <a-modal v-model="isUploadPicModalVisible" title="Update profile picture">
      <template slot="footer">
        <a-button @click="isUploadPicModalVisible = false">Cancel</a-button>
        <a-button
          @click="confirmUploadPic"
          type="primary"
          :loading="isUpdatePicLoading"
          :disabled="isPicUploaded"
          >Confirm</a-button
        >
      </template>
      <div style="display: flex;">
        <clipper-upload v-model="uploadPic" style="margin-right: 10px;">
          <a-button type="primary">Upload from computer</a-button>
        </clipper-upload>
      </div>
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
  computed: {
    isPicUploaded() {
      return !this.uploadPic;
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
<style scoped></style>
