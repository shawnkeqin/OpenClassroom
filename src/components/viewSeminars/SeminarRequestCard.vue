<template>
  <div style="width: 35rem; margin-bottom: 30px">
    <div style="display: flex; align-items: center; margin: 0 0 10px 20px">
      <img
        class="avatar-medium"
        :src="
          course_group.faculty.profilePic ||
            'https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png'
        "
      />
      <p style="margin: 0 5px;">
        {{ `${course_group.faculty.name}'s class` }}
      </p>
      <template v-for="tag in course.tagged_as">
        <ColoredTag :key="tag.tag_label" :tag_label="tag.tag_label"/>
      </template>
    </div>
    <a-tag v-for="tag in seminar.tags" :key="tag">{{ tag }}</a-tag>
    <a-card hoverable :class="{ closed: !seminar.is_open }">
      <div style="display: flex; flex-direction: column;">
        <div style="margin-bottom: 5px">
          <h5 style="display: inline; font-weight: bold">
            {{ utils.date_format(seminar.date) + " | " }}
          </h5>
          <h5 style="display: inline">
            {{
              utils.time_format(seminar.start) +
                " - " +
                utils.time_format(seminar.end) +
                " | "
            }}
          </h5>
          <h6 style="display: inline">{{ seminar.location.full_name }}</h6>
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
                {{ seminar.title || "No seminar title" }}
              </h4>
            </div>
            <div style="margin-bottom: 10px">
              <h5 class='truncate' :class="{ placeholder: !seminar.desc }">
                {{ seminar.desc || "No seminar description" }}
              </h5>
              <h6>
                <a @click="descModalVisible = true" href="#"
                  >View full course description and seminar details</a
                >
              </h6>
            </div>
            <a-modal v-model="descModalVisible" @ok="descModalVisible = false">
              <template slot="footer">
                <a-button @click="descModalVisible = false">Close</a-button>
              </template>
              <h4>Seminar description:</h4>
              <p>{{ seminar.desc }}</p>
              <h4>Course description:</h4>
              <p>{{ course.desc }}</p>
            </a-modal>
            <h5>
              {{ "Notes for visitors: " + (course_group.notes || "None") }}
            </h5>
          </a-col>
          <a-col v-if="seminar.is_open" :span="7">
            <template v-if="!visit_local">
              <a-button
                @click="requestModalVisible = true"
                type="primary"
                block
                style="margin-bottom: 20px"
                >Request visit</a-button
              >
              <a-modal
                v-model="requestModalVisible"
                title="Making a vist request"
                @ok="handleSubmitRequest"
              >
                <template slot="footer">
                  <a-button key="cancel" @click="requestModalVisible = false"
                    >Cancel</a-button
                  >
                  <a-button key="submit" @click="handleSubmitRequest"
                    >Submit</a-button
                  >
                </template>
                <a-form-model-item label="Your request message (optional)">
                  <a-input v-model="request_msg" type="textarea" />
                </a-form-model-item>
              </a-modal>
            </template>
            <template v-else>
              <a-button
                @click="cancelRequestModalVisible = true"
                type="primary"
                ghost
                block
                style="margin-bottom: 20px"
                >Cancel request</a-button
              >
              <a-modal
                v-model="cancelRequestModalVisible"
                @ok="handleCancelRequest"
                title="Cancel visit request"
              >
                <template slot="footer">
                  <a-button
                    key="cancel"
                    @click="cancelRequestModalVisible = false"
                    >Cancel</a-button
                  >
                  <a-button key="submit" @click="handleCancelRequest"
                    >Confirm cancel request</a-button
                  >
                </template>
                <p>Your are about to cancel your visit request</p>
              </a-modal>
              <div style="display: flex; justify-content: center">
                <template v-if="visit_local.visit_status === 'PENDING'">
                  <a-icon
                    type="clock-circle"
                    theme="filled"
                    class="status-icon pending"
                  />
                  <h4 class="pending" style="margin-bottom: 0">
                    Request pending
                  </h4>
                </template>
                <template v-else-if="visit_local.visit_status === 'ACCEPTED'">
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
                        visit.time_responded &&
                          utils.datetime_fromnow_format(visit.time_responded)
                      }}
                    </h5>
                  </div>
                </template>
                <template v-else-if="visit_local.visit_status === 'DECLINED'">
                  <div style="display: flex; align-items: center">
                    <a-icon
                      type="close-circle"
                      theme="filled"
                      class="status-icon declined"
                    />
                  </div>
                  <div>
                    <h4 class="declined" style="margin-bottom: 3px">
                      Request accepted
                    </h4>
                    <h5 class="declined">
                      {{
                        visit.time_responded &&
                          utils.datetime_fromnow_format(visit.time_responded)
                      }}
                    </h5>
                  </div>
                </template>
              </div>
            </template>
          </a-col>
        </div>
        <div v-if="visit_local && isMessagesVisible" style="margin-top: 20px">
          <div>{{ "Request message: " + visit.request_msg }}</div>
          <div>{{ "Response message: " + visit.response_msg }}</div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import utils from "@/utils";
import constants from "@/utils/constants";
import queries from "@/graphql/queries.gql";
import ColoredTag from "./ColoredTag";

export default {
  name: "SeminarRequestCard",
  components: {
    ColoredTag
  },
  props: {
    visit: {
      type: Object,
      default: null
    },
    seminar: {
      type: Object,
      default: null
    },
    isMessagesVisible: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      utils: utils,
      visit_local: this.visit,
      descModalVisible: false,
      requestModalVisible: false,
      request_msg: "",
      cancelRequestModalVisible: false,
      tag: this.makeTag
    };
  },
  computed: {
    course_group() {
      return this.seminar.course_group;
    },
    course() {
      return this.course_group.course;
    }
  },
  methods: {
    async handleSubmitRequest() {
      if (!this.seminar.is_open) return;
      const seminar_id = this.seminar.id;
      const request_msg = this.request_msg;
      const result = await this.$apollo.mutate({
        mutation: queries.request_visit,
        variables: {
          seminar_id,
          visitor_id: constants.TEST_FACULTY_ID,
          request_msg
        },
        refetchQueries: ["get_my_visits"]
      });
      this.visit_local = result.data.insert_visit.returning[0];
      this.requestModalVisible = false;
    },
    async handleCancelRequest() {
      const visit_id = this.visit_local.id;
      await this.$apollo.mutate({
        mutation: queries.delete_visit,
        variables: {
          visit_id
        },
        refetchQueries: ["get_my_visits", "searchSeminarsByFilters"]
      });
      this.visit_local = null;
      this.cancelRequestModalVisible = false;
    }
  }
};
</script>

<style scoped>
.ant-card-hoverable {
  cursor: default;
}
.closed {
  background-color: rgba(0, 0, 0, 0.12);
}
.request-status {
  font-size: 16px;
  font-family: "Lato", sans-serif;
  font-weight: bold;
}
.placeholder {
  color: rgba(0, 0, 0, 0.37);
  font-weight: normal;
}
</style>
