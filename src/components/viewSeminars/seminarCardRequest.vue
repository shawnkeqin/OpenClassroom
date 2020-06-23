<template>
  <div style="padding: 10px 0px 10px 0px" align="left">
    <div>
      <!--    <img
        class="avatar"
        :src="instructor.profilePic"
        style="background-color: grey"
      /> -->
      <span style="padding-right: 10px">{{
        seminar.course_group.faculty.name + "'s class"
      }}</span>
      <!--    <a-tag v-for="tag in seminar.tags" :key="tag">{{ tag }}</a-tag> -->
    </div>
    <a-card hoverable style="width: auto" :bodyStyle="{ padding: '10px' }">
      <a-col :span="4">
        <div>{{ new Date(seminar.date).toDateString().slice(0, 10) }}</div>
        <div>{{ seminar.start + " - " + seminar.end }}</div>
        <div>{{ seminar.location.code }}</div>
        <div>Availability Status: {{ seminar.is_open }}</div>
      </a-col>
      <a-col :span="14" style="padding-right: 10px">
        <a-row type="flex" style="align-items: center">
          <span class="module-code">{{ seminar.module_code }}</span>
          <template v-if="requestStatus === 'pending'">
            <a-icon type="clock-circle" theme="filled" class="pending" />
            <span class="request-status pending">Request pending</span>
          </template>
          <template v-else-if="requestStatus === 'accepted'">
            <a-icon type="check-circle" theme="filled" class="accepted" />
            <span class="request-status accepted">Request accepted</span>
            <a @click="handleAddToCalendar">Add to calendar</a>
          </template>
          <template v-else-if="requestStatus === 'declined'">
            <a-icon type="close-circle" theme="filled" class="declined" />
            <span class="request-status declined">Request declined</span>
          </template>
          <template v-else />
        </a-row>
        <div class="seminar-title">{{ seminar.course_group.course.title }}</div>
        <div>{{ seminar.course_group.group_code }}</div>
        <a @click="handleOpenDescModal"
          >View course description and seminar details</a
        >
        <a-modal
          v-model="isDescModalOn"
          title="Course description and seminar details"
          @ok="handleCloseDescModal"
        >
          <template slot="footer">
            <a-button @click="handleCloseDescModal">Close</a-button>
          </template>
          <p>{{ seminar.date }}</p>
        </a-modal>
      </a-col>
      <a-col :span="6">
        <!-- <a-button block style="margin-bottom: 2px" type="primary" ghost
          >Share</a-button
        > -->
        <template v-if="!requestStatus">
          <a-popover
            v-model="isRequestPopoverOn"
            placement="bottomLeft"
            trigger="click"
          >
            <template slot="content">
              <div @click="handleRequestNow"><a>Request now</a></div>
              <div @click="handleOpenMessageModal">
                <a>Request with a message</a>
              </div>
              <a-modal v-model="isMessageModalOn" @ok="handleSubmitMessage">
                <template slot="footer">
                  <a-button key="cancel" @click="handleCancelMessage"
                    >Cancel</a-button
                  >
                  <a-button key="submit" @click="handleSubmitMessage"
                    >Submit</a-button
                  >
                </template>
                <a-form-model-item label="Your message">
                  <a-input v-model="message" type="textarea" />
                </a-form-model-item>
              </a-modal>
            </template>
            <a-button block type="primary">Request</a-button>
          </a-popover>
        </template>
        <template v-else>
          <a-button @click="handleCancelRequest" block type="primary" ghost
            >Cancel request</a-button
          >
        </template>
      </a-col>
    </a-card>
  </div>
</template>

<script>
import queries from "@/graphql/queries.gql";
import constants from "@/utils/constants";
export default {
  name: "seminarCardRequest",
  props: {
    seminar: Object
  },
  data: function() {
    return {
      requestStatus: false,
      isRequestPopoverOn: false,
      isDescModalOn: false,
      isMessageModalOn: false,
      message: ""
    };
  },
  /*  computed: {
    instructor: function() {
      return this.seminar.instructor;
    }
  }, */
  methods: {
    handleOpenDescModal() {
      this.isDescModalOn = true;
    },
    handleCloseDescModal() {
      this.isDescModalOn = false;
    },
    handleRequestNow() {
      this.isRequestPopoverOn = false;
    },
    handleOpenMessageModal() {
      this.isRequestPopoverOn = false;
      this.isMessageModalOn = true;
    },
    async handleSubmitMessage() {
      this.isMessageModalOn = false;
      const seminar_id = this.seminar.id;
      await this.$apollo.mutate({
        mutation: queries.request_visit,
        variables: {
          seminar_id,
          visitor_id: constants.TEST_FACULTY_ID
        },
        refetchQueries: ["get_my_visits"]
      });
      this.modal2Visible = false;
    },
    handleCancelMessage() {
      this.message = "";
      this.isMessageModalOn = false;
    },
    handleDeleteRequest() {},
    handleAddToCalendar() {}
  },
  computed: {
    //  isDisabled: function() {
    //    return !this.terms;
    //  }
  }
};
</script>

<style scoped>
a {
  font-size: 12px;
}
.ant-card-body {
  padding: 10px;
}
.ant-card-hoverable {
  cursor: default;
}
.avatar {
  height: 25px;
  width: 25px;
  border-radius: 50%;
  margin: 5px;
}
.module-code {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
  padding-right: 10px;
}
.seminar-title {
  font-size: 16px;
  font-weight: bold;
}
.request-status {
  font-size: 12px;
  padding-left: 5px;
  padding-right: 10px;
}
.pending {
  color: #ffb74d;
}
.accepted {
  color: #81c784;
}
.declined {
  color: #e57373;
}
</style>
