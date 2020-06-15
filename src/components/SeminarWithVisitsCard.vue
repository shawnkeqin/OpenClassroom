<template>
  <div style="padding: 10px">
    <a-card hoverable style="width: auto" :bodyStyle="{ padding: '20px' }">
      <a-row>
        <a-col :span="4">
          <div>{{ utils.date_format(seminar.date) }}</div>
          <div>
            {{
              utils.time_format(seminar.start) +
                " - " +
                utils.time_format(seminar.start)
            }}
          </div>
          <div>{{ seminar.location.full_name }}</div>
        </a-col>
        <a-col :span="12" style="padding-right: 10px">
          <a-row type="flex" style="align-items: center">
            <span class="module-code">{{ seminar.module_code }}</span>
            <a-icon type="clock-circle" theme="filled" class="pending" />
            <span class="request-status pending">{{
              pendingCount + " request(s) pending"
            }}</span>
          </a-row>
          <div class="seminar-title">
            {{ seminar.course_group.course.title }}
          </div>
        </a-col>
        <a-col :span="8">
          <a-button block type="primary" style="margin-bottom: 2px"
            >Go to course</a-button
          >
          <div style="text-align: center">
            {{
              "Seminar capacity: " +
                acceptedCount +
                "/" +
                seminar.visitor_capacity
            }}
          </div>
        </a-col>
      </a-row>
      <a
        v-if="isRequestRowsOn"
        @click="handleHideRequests"
        style="font-size: 12px"
        >{{ "Hide " + requests.length + " incoming requests" }}</a
      >
      <a v-else @click="handleShowRequests" style="font-size: 12px">{{
        "Show " + requests.length + " incoming requests"
      }}</a>
      <a-row v-if="isRequestRowsOn" type="flex" style="flex-direction: column">
        <a-row
          v-for="request in requests"
          :key="request.id"
          type="flex"
          style="height: 35px"
        >
          <a-col :span="16" class="requestor">
            <div>
              <img
                class="avatar"
                :src="request.profilePic"
                style="background-color: grey"
              />
              <span>{{ request.visitor.name }}</span>
            </div>
            <div class="button-group">
              <template
                v-if="request.visit_status === constants.VISIT_STATUS_PENDING"
              >
                <a-button class="respond-button accept-button">Accept</a-button>
                <a-button class="respond-button decline-button"
                  >Decline</a-button
                >
              </template>
              <template
                v-else-if="
                  request.visit_status === constants.VISIT_STATUS_ACCEPTED
                "
              >
                <a-button class="respond-button accepted-button"
                  >Accepted</a-button
                >
                <a-button class="respond-button decline-button"
                  >Decline</a-button
                >
              </template>
              <template
                v-else-if="request.status === constants.VISIT_STATUS_DECLINED"
              >
                <a-button class="respond-button accept-button">Accept</a-button>
                <a-button class="respond-button declined-button"
                  >Declined</a-button
                >
              </template>
              <template v-else />
            </div>
          </a-col>
          <a-col :span="4" class="view-message">{{
            `(${utils.datetime_fromnow_format(request.time_requested)})`
          }}</a-col>
          <a-col :span="4" class="view-message">
            <a
              v-if="request.request_msg"
              @click="handleOpenMessageModal(request)"
              >View message</a
            >
          </a-col>
        </a-row>
        <a-modal v-model="isMessageModalOn" @ok="handleSubmitMessage">
          <template slot="footer">
            <a-button key="cancel" @click="handleCancelMessage"
              >Cancel</a-button
            >
            <a-button key="submit" @click="handleSubmitMessage"
              >Submit</a-button
            >
          </template>
          <div v-if="requestInMessageModal">
            <p>{{ requestInMessageModal.visitor.name || "" + ": " }}</p>
            <p>{{ requestInMessageModal.request_msg || "" }}</p>
          </div>
          <a-form-model-item label="Your reply (optional)">
            <a-input v-model="replyMessage" type="textarea" />
          </a-form-model-item>
        </a-modal>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import utils from "../utils";
import constants from "../utils/constants";
export default {
  props: {
    seminar: Object
  },
  data: function() {
    return {
      utils: utils,
      constants: constants,
      isRequestRowsOn: true,
      isMessageModalOn: false,
      requestInMessageModal: null,
      sender: "",
      replyMessage: ""
    };
  },
  computed: {
    requests() {
      return this.seminar.visits;
    },
    pendingCount() {
      return this.requests.filter(
        request => request.visit_status === constants.VISIT_STATUS_PENDING
      ).length;
    },
    acceptedCount() {
      return this.requests.filter(
        request => request.visit_status === constants.VISIT_STATUS_ACCEPTED
      ).length;
    }
  },
  methods: {
    handleHideRequests() {
      this.isRequestRowsOn = false;
    },
    handleShowRequests() {
      this.isRequestRowsOn = true;
    },
    handleOpenMessageModal(request) {
      this.requestInMessageModal = request;
      this.isMessageModalOn = true;
    },
    handleSubmitMessage() {
      this.isMessageModalOn = false;
    },
    handleCancelMessage() {
      this.replyMessage = "";
      this.requestInMessageModal = null;
      this.isMessageModalOn = false;
    }
  }
};
</script>

<style scoped>
.ant-card-body {
  padding: 10px;
}
.ant-card-hoverable {
  cursor: default;
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
.requestor {
  display: flex;
  align-items: center;
}
.avatar {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  margin: 5px;
}
.button-group {
  display: flex;
  justify-content: center;
  position: absolute;
  right: 0px;
}
.respond-button {
  padding: 0px;
  margin: 2px;
  width: 80px;
  height: 28px;
}
.accept-button {
  color: #81c784;
  border-color: #81c784;
}
.decline-button {
  color: #e57373;
  border-color: #e57373;
}
.accepted-button {
  color: #ffffff;
  background-color: #81c784;
}
.declined-button {
  color: #ffffff;
  background-color: #e57373;
}
.view-message {
  display: flex;
  align-items: center;
  justify-content: center;
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
