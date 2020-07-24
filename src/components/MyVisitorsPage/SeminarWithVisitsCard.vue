<template>
  <div style="width: 35rem">
    <a-card hoverable style="margin-bottom: 10px">
      <div style="margin-bottom: 5px">
        <h5
          class="date-heading"
          :class="is_past ? 'past' : 'red'"
          style="display: inline;"
        >
          {{
            `${utils.date_format(seminar.date)} from ${utils.time_format(
              seminar.start
            )}-${utils.time_format(seminar.end)} | `
          }}
        </h5>
        <h6 :class="{ past: is_past }" style="display: inline;">
          {{ seminar.location.full_name }}
        </h6>
      </div>
      <div>
        <a-col :span="17" style="padding-right: 20px">
          <div style="margin-bottom: 5px">
            <h3 style="display: inline">
              {{ course.title }}
            </h3>
            <p style="display: inline">
              {{ seminar.module_code }}
            </p>
            <h4 :class="{ placeholder: !seminar.title }">
              {{ seminar.title || "No class title" }}
            </h4>
            <h5>
              {{
                "Class capacity: " +
                  acceptedCount +
                  "/" +
                  seminar.visitor_capacity
              }}
            </h5>
          </div>
        </a-col>
        <a-col :span="7">
          <div
            style="display: flex; flex-direction: column; align-items: center;"
          >
            <div
              style="display: flex; justify-content: center; margin-bottom: 10px"
            >
              <a-icon
                type="clock-circle"
                theme="filled"
                class="status-icon pending"
              />
              <h4 class="pending" style="margin-bottom: 0">
                {{ pendingCount + " request(s) pending" }}
              </h4>
            </div>
            <AddToCalendar :seminar="seminar" :isMyVisit="false" />
            <a
              v-if="isRequestRowsOn"
              @click="handleHideRequests"
              style="font-size: 12px"
              >{{ `Hide ${requests.length} incoming request(s)` }}</a
            >
            <a v-else @click="handleShowRequests" style="font-size: 12px">{{
              `Show ${requests.length} incoming request(s)`
            }}</a>
          </div>
        </a-col>
      </div>
    </a-card>
    <div v-show="isRequestRowsOn" style="margin: 0 0 25px 3rem">
      <a-card
        v-for="request in requests"
        :key="request.id"
        style="margin-bottom: 5px"
      >
        <div style="display: flex; flex-direction: column;">
          <div>
            <a-col :span="16">
              <div style="display: flex;">
                <img
                  class="avatar-medium"
                  :src="
                    request.visitor.profilePic ||
                      'https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png'
                  "
                />
                <div style="display: flex; flex-direction: column;">
                  <div>
                    <p style="display: inline;">{{ request.visitor.name }}</p>
                    <h5 style="display: inline;">
                      {{
                        ` requested a visit ${utils.datetime_fromnow_format(
                          request.time_requested
                        )}`
                      }}
                    </h5>
                  </div>
                  <VisitResponseModal :seminar="seminar" :visit="request" />
                </div>
              </div>
            </a-col>
            <a-col>
              <div style="display: flex; justify-content: center">
                <template v-if="request.visit_status === 'PENDING'">
                  <a-icon
                    type="clock-circle"
                    theme="filled"
                    class="status-icon pending"
                  />
                  <h4 class="pending" style="margin-bottom: 0">
                    Request pending
                  </h4>
                </template>
                <template v-else-if="request.visit_status === 'ACCEPTED'">
                  <div style="display: flex; align-items: center">
                    <a-icon
                      type="check-circle"
                      theme="filled"
                      class="status-icon accepted"
                    />
                  </div>
                  <div>
                    <h4 class="accepted" style="margin-bottom: 3px">
                      Request accepted
                    </h4>
                    <h5 class="accepted">
                      {{
                        request.time_responded &&
                          utils.datetime_fromnow_format(request.time_responded)
                      }}
                    </h5>
                  </div>
                </template>
                <template v-else-if="request.visit_status === 'DECLINED'">
                  <div style="display: flex; align-items: center">
                    <a-icon
                      type="close-circle"
                      theme="filled"
                      class="status-icon declined"
                    />
                  </div>
                  <div>
                    <h4 class="declined" style="margin-bottom: 3px">
                      Request declined
                    </h4>
                    <h5 class="declined">
                      {{
                        request.time_responded &&
                          utils.datetime_fromnow_format(request.time_responded)
                      }}
                    </h5>
                  </div>
                </template>
              </div>
            </a-col>
          </div>
          <div v-if="request" style="margin-top: 20px">
            <div>{{ "Request message: " + request.request_msg }}</div>
            <div>{{ "Response message: " + request.response_msg }}</div>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
import VisitResponseModal from "./VisitResponseModal";
import AddToCalendar from "@/components/SeminarVisitRequestCard/AddToCalendar";
import utils from "@/utils";
import constants from "@/utils/constants";

export default {
  components: {
    VisitResponseModal,
    AddToCalendar
  },
  props: {
    seminar: Object
  },
  data: function() {
    return {
      utils: utils,
      constants: constants,
      isRequestRowsOn: false,
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
    course_group() {
      return this.seminar.course_group;
    },
    course() {
      return this.seminar.course_group.course;
    },
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
    },
    is_past() {
      return new Date(this.seminar.date) < Date.now();
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
.date-heading {
  font-weight: bold;
  text-transform: uppercase;
}
.red {
  color: #f0284a;
}
.past {
  color: rgba(0, 0, 0, 0.37);
}
</style>
