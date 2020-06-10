<!-- Test components with dummy props
  <incoming-requests-card v-bind="{seminar: {module_code: 'YSC3237', title: 'Introduction to Modern Calculus', start: '0900', end: '1030', date: '2020-06-08', location_code: 'Y-CR20', desc: 'loremipsum1', visitor_capacity: 5 }, requests: [{name: 'Mira Seo', status: 'pending', profilePic: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1627&q=80'}, {id: 1, name: 'Matthew Stamp A', status: 'pending', requestMessage: 'Hello! '}, {id: 2, name: 'Matthew Stamp B', status: 'accepted', requestMessage: 'testing message feature'}, {id: 3, name: 'Somone cool', status: 'declined'}]}" />
-->

<template>
  <div style="padding: 10px">
    <a-card hoverable style="width: 600px" bodyStyle="padding: 10px">
      <a-row>
        <a-col :span="4">
          <div>{{ new Date(seminar.date).toDateString().slice(0, 10) }}</div>
          <div>{{ seminar.start + " - " + seminar.end }}</div>
          <div>{{ seminar.location_code }}</div>
        </a-col>
        <a-col :span="14" style="padding-right: 10px">
          <a-row type="flex" style="align-items: center">
            <span class="module-code">{{ seminar.module_code }}</span>
            <a-icon type="clock-circle" theme="filled" class="pending" />
            <span class="request-status pending">{{
              pendingCount + " request(s) pending"
            }}</span>
          </a-row>
          <div class="seminar-title">{{ seminar.title }}</div>
          <a
            v-if="isRequestRowsOn"
            @click="handleHideRequests"
            style="font-size: 12px"
            >{{ "Hide " + requests.length + " incoming requests" }}</a
          >
          <a v-else @click="handleShowRequests" style="font-size: 12px">{{
            "Show " + requests.length + " incoming requests"
          }}</a>
        </a-col>
        <a-col :span="6">
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
      <a-row v-if="isRequestRowsOn" type="flex" style="flex-direction: column">
        <a-row
          v-for="request in requests"
          :key="request.name"
          type="flex"
          style="height: 35px"
        >
          <a-col :span="18" class="requestor">
            <div>
              <img
                class="avatar"
                :src="request.profilePic"
                style="background-color: grey"
              />
              <span>{{ request.name }}</span>
            </div>
            <div class="button-group">
              <template v-if="request.status === 'pending'">
                <a-button class="respond-button accept-button">Accept</a-button>
                <a-button class="respond-button decline-button"
                  >Decline</a-button
                >
              </template>
              <template v-else-if="request.status === 'accepted'">
                <a-button class="respond-button accepted-button"
                  >Accepted</a-button
                >
                <a-button class="respond-button decline-button"
                  >Decline</a-button
                >
              </template>
              <template v-else-if="request.status === 'declined'">
                <a-button class="respond-button accept-button">Accept</a-button>
                <a-button class="respond-button declined-button"
                  >Declined</a-button
                >
              </template>
              <template v-else />
            </div>
          </a-col>
          <a-col :span="6" class="view-message">
            <a
              v-if="request.requestMessage"
              @click="handleOpenMessageModal(request.id)"
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
          <p>{{ sender.name + ": " }}</p>
          <p>{{ sender.requestMessage }}</p>
          <a-form-model-item label="Your reply (optional)">
            <a-input v-model="replyMessage" type="textarea" />
          </a-form-model-item>
        </a-modal>
      </a-row>
    </a-card>
  </div>
</template>

<script>
export default {
  name: "incoming-requests-card",
  props: {
    seminar: Object, // assuming that seminar has fields title, module_code, time, date
    requests: Array // assuming that requests is an array of objects, each of which has the following fields: id, name, profilePic, status, and message
  },
  data: function() {
    return {
      isRequestRowsOn: true,
      isMessageModalOn: false,
      requestIdToReply: "",
      sender: "",
      replyMessage: ""
    };
  },
  computed: {
    pendingCount: function() {
      return this.requests.filter(request => request.status === "pending")
        .length;
    },
    acceptedCount: function() {
      return this.requests.filter(request => request.status === "accepted")
        .length;
    }
  },
  methods: {
    handleHideRequests() {
      this.isRequestRowsOn = false;
    },
    handleShowRequests() {
      this.isRequestRowsOn = true;
    },
    handleOpenMessageModal(id) {
      this.requestIdToReply = id;
      this.sender = this.requests.find(request => request.id === id);
      this.isMessageModalOn = true;
    },
    handleSubmitMessage() {
      this.isMessageModalOn = false;
    },
    handleCancelMessage() {
      this.replyMessage = "";
      this.requestIdToReply = "";
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
