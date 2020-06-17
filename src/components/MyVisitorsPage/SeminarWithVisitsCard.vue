<template>
  <div style="padding: 10px">
    <a-card hoverable style="width: auto" :bodyStyle="{ padding: '20px' }">
      <a-row>
        <a-col :span="4">
          <div class="seminar-date-and-time">
            {{ utils.date_format(seminar.date) }}
            {{
              utils.time_format(seminar.start) +
                " - " +
                utils.time_format(seminar.end)
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
          <a-row type="flex" style="align-items: center">
            <div class="seminar-title">
              {{ seminar.course_group.course.title }} (Group
              {{ seminar.group_code }})
            </div> </a-row
          ><a-row type="flex" style="align-items: center">
            Seminar title: {{ seminarTitle }}
          </a-row>
          <a-row type="flex" style="align-items: center">
            Seminar description: {{ seminarDesc }}
          </a-row>
          <a-row type="flex" style="align-items: center">
            Notes for visitors: {{ courseGroupNotes }}
          </a-row>
        </a-col>
        <a-col :span="8">
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
          <a-col :span="12" class="requestor">
            <div>
              <img
                class="avatar"
                :src="request.profilePic"
                style="background-color: grey"
              />
              <span>{{ request.visitor.name }}</span>
            </div>
          </a-col>
          <a-col :span="4">
            <div style="float: right">
              <a-tag
                v-if="request.visit_status === constants.VISIT_STATUS_PENDING"
                color="#ffb74d"
              >
                {{ constants.VISIT_STATUS_PENDING }}
              </a-tag>
              <a-tag
                v-else-if="
                  request.visit_status === constants.VISIT_STATUS_ACCEPTED
                "
                color="#81c784"
              >
                {{ constants.VISIT_STATUS_ACCEPTED }}
              </a-tag>
              <a-tag
                v-else-if="
                  request.visit_status === constants.VISIT_STATUS_DECLINED
                "
                color="#e57373"
              >
                {{ constants.VISIT_STATUS_DECLINED }}
              </a-tag>
            </div>
          </a-col>
          <a-col :span="4">
            <VisitResponseModal
              :seminar="seminar"
              :visit="request"
            ></VisitResponseModal>

            <!-- <a
              v-if="request.request_msg"
              @click="handleOpenMessageModal(request)"
              >View message</a
            > -->
          </a-col>
          <a-col :span="4">
            <div>
              <p style="text-align: center;">
                {{ responseTime(request) }}
              </p>
            </div>
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
import VisitResponseModal from "./VisitResponseModal";
import utils from "@/utils";
import constants from "@/utils/constants";
import queries from "@/graphql/queries.gql";
import moment from "moment";

export default {
  components: {
    VisitResponseModal
  },
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
      replyMessage: "",
      seminarTitle: this.seminar.title || "-",
      seminarDesc: this.seminar.desc || "-",
      courseGroupNotes: this.seminar.course_group.notes || "-"
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
    responseTime(request) {
      return request.visit_status !== constants.PENDING &&
        request.time_responded
        ? `(Responded ${utils.datetime_fromnow_format(request.time_responded)})`
        : `(Requested ${utils.datetime_fromnow_format(
            request.time_requested
          )})`;
    },
    submitVisitResponse(visit_id, new_status) {
      this.$apollo.mutate({
        mutation: queries.update_visit_status,
        variables: {
          visit_id: visit_id,
          visit_status: new_status,
          time_responded: moment().format()
        },
        update: (store, { data: { update_visit_by_pk } }) => {
          if (update_visit_by_pk) {
            // We have not initialized Apollo Cache or VueX store. Or local data. So we should get the parent component to reload.
            // this.$emit("visit-updated");
          }
        },
        refetchQueries: ["get_seminars_with_visits_by_time_requested"]
      });
    },
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
.seminar-date-and-time {
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