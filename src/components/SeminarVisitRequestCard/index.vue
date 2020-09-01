<template>
  <div style="width: 100%; margin-bottom: 30px">
    <div style="display: flex; align-items: center; margin: 0 0 10px 20px">
      <a-avatar
        :src="course_group.faculty.profilePic || '/avatar_default.png'"
      />
      <p style="margin: 0px 10px 0px 5px;">{{ `${faculty.name}'s class` }}</p>
      <template v-for="tag in course.tagged_as">
        <ColoredTag :key="tag.tag_label" :tag_label="tag.tag_label" />
      </template>
    </div>
    <a-tag v-for="tag in seminar.tags" :key="tag">{{ tag }}</a-tag>
    <a-card
      hoverable
      :class="seminar.group_code == 'CC' ? 'cc-card' : 'seminar-card'"
      style="padding: 0.2rem;"
    >
      <div style="display: flex; flex-direction: column;">
        <div style="margin-bottom: 5px">
          <h4
            class="date-heading"
            :class="is_past ? 'past' : 'red'"
            style="display: inline;"
          >
            {{
              `${utils.date_format(seminar.date)} from ${utils.time_format(
                seminar.start
              )}-${utils.time_format(seminar.end)} | `
            }}
          </h4>
          <h4
            :class="{ past: is_past }"
            style="display: inline; font-weight: normal; color: rgba(0, 0, 0, 0.54);"
          >
            {{ seminar.location.full_name }}
          </h4>
          <h4
            :class="{ past: is_past }"
            class="teaching-mode"
            style="display: inline; font-weight: normal; color: rgba(0, 0, 0, 0.54);"
          >
            {{ constants.TEACHING_MODES[seminar.teaching_mode] || "NA" }}
          </h4>
        </div>
        <div>
          <a-col :span="17" style="padding-right: 20px">
            <div style="margin-bottom: 5px">
              <h3
                :class="{ past: is_past }"
                style="display: inline;cursor: pointer;"
                @click="descModalVisible = true"
              >
                {{
                  seminar.group_code == "CC"
                    ? course.title + " (Lecture)"
                    : course.title
                }}
              </h3>
              <h4 :class="{ past: is_past }" style="font-weight: normal;">
                {{ seminar.module_code }}&nbsp;({{ seminar.group_code }})
              </h4>
              <h4 style="font-weight: normal; text-decoration: underline;">
                <a @click="descModalVisible = true" href="#"
                  >View course description and class details</a
                >
              </h4>
              <h4 :class="{ past: is_past, placeholder: !seminar.title }">
                {{ seminar.title || "No class title" }}
              </h4>
            </div>
            <div style="margin-bottom: 10px">
              <h4 class="truncate" :class="{ placeholder: !seminar.desc }">
                {{ seminar.desc || "No class description" }}
              </h4>
            </div>
            <a-modal v-model="descModalVisible" @ok="descModalVisible = false">
              <template slot="footer">
                <a-button @click="descModalVisible = false">Close</a-button>
              </template>
              <h4>Course description:</h4>
              <template v-if="course.desc || course_group.desc">
                <p>{{ course.desc }}</p>
                <p>{{ course_group.desc }}</p>
              </template>
              <template v-else>
                <p>-</p>
              </template>
              <h4>Class title:</h4>
              <p>{{ seminar.title || "-" }}</p>
              <h4>Class description:</h4>
              <p>{{ seminar.desc || "-" }}</p>
            </a-modal>
            <h4 class="placeholder">
              {{ "Notes for visitors: " + (course_group.notes || "None") }}
            </h4>
          </a-col>
          <a-col v-if="!is_past" :span="7">
            <div
              style="display: flex; flex-direction: column; align-items: center;"
            >
              <template v-if="seminar.group_code == 'CC'">
                <a-button
                  @click="requestModalVisible = true"
                  type="primary"
                  block
                  style="margin-bottom: 15px; "
                  disabled
                  >No request required</a-button
                >
              </template>
              <template
                v-else-if="
                  !(
                    faculty.is_active &&
                    faculty.has_consented &&
                    seminar.is_open &&
                    course_group.is_open
                  )
                "
              >
                <a-button
                  type="primary"
                  block
                  style="margin-bottom: 15px"
                  disabled
                  >Closed to visits</a-button
                >
              </template>
              <template v-else-if="!visit">
                <template
                  v-if="
                    seminar.visitor_capacity === -1 ||
                      acceptedVisitsCountForSeminar < seminar.visitor_capacity
                  "
                >
                  <RequestVisitButton
                    :seminar="seminar"
                    :has_consented="has_consented"
                  />
                </template>
                <template v-else>
                  <a-button type="primary" block disabled>Class full</a-button>
                </template>
              </template>
              <template v-else>
                <CancelVisitAndStatusWrapper
                  :visit="visit"
                  :seminar="seminar"
                  :has_consented="has_consented"
                />
              </template>
            </div>
          </a-col>
        </div>
        <div v-if="visit && isMessagesVisible" style="margin-top: 20px">
          <div>{{ "Request message: " + visit.request_msg }}</div>
          <div>{{ "Response message: " + visit.response_msg }}</div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import utils from "@/utils";
import moment from "moment";
// import queries from "@/graphql/queries.gql";
import ColoredTag from "./ColoredTag";
import CancelVisitAndStatusWrapper from "./CancelVisitAndStatusWrapper";
import RequestVisitButton from "./RequestVisitButton";
import constants from "@/utils/constants";
export default {
  name: "SeminarRequestCard",
  components: {
    ColoredTag,
    RequestVisitButton,
    CancelVisitAndStatusWrapper
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
    },
    has_consented: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      utils: utils,
      descModalVisible: false,
      constants
    };
  },
  computed: {
    course_group() {
      return this.seminar.course_group;
    },
    course() {
      return this.seminar.course_group.course;
    },
    faculty() {
      return this.seminar.course_group.faculty;
    },
    is_past() {
      return (
        moment(this.seminar.date + "T" + this.seminar.start) < moment.now()
      );
    },
    acceptedVisitsCountForSeminar() {
      return (
        this.seminar.visits_aggregate &&
        this.seminar.visits_aggregate.aggregate.count
      );
    }
  }
};
</script>

<style scoped>
.ant-card-hoverable {
  cursor: default;
}
.ant-btn span {
  font-size: 2rem;
}
.date-heading {
  font-weight: bold;
  text-transform: uppercase;
}
.teaching-mode {
  font-weight: bold;
  float: right;
}
.red {
  color: #f0284a;
}
.past {
  color: rgba(0, 0, 0, 0.37);
}
</style>
