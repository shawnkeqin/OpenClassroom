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
        {{ `${faculty.name}'s class` }}
      </p>
      <template v-for="tag in course.tagged_as">
        <ColoredTag :key="tag.tag_label" :tag_label="tag.tag_label" />
      </template>
    </div>
    <a-tag v-for="tag in seminar.tags" :key="tag">{{ tag }}</a-tag>
    <a-card
      hoverable
      :class="seminar.group_code == 'CC' ? 'cc-card' : 'seminar-card'"
    >
      <div style="display: flex; flex-direction: column;">
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
          <!-- <h5 style="display: inline; font-weight: bold">
            {{ utils.date_format(seminar.date) + " | " }}
          </h5>
          <h5 style="display: inline">
            {{
              utils.time_format(seminar.start) +
                " - " +
                utils.time_format(seminar.end) +
                " | "
            }}
          </h5> -->
          <h6 :class="{ past: is_past }" style="display: inline;">
            {{ seminar.location.full_name }}
          </h6>
          <h6
            :class="{ past: is_past }"
            class="teaching-mode"
            style="display: inline;"
          >
            {{
              constants.TEACHING_MODES[seminar.course_group.teaching_mode] ||
                "NA"
            }}
          </h6>
        </div>
        <div>
          <a-col :span="17" style="padding-right: 20px">
            <div style="margin-bottom: 5px">
              <h3 :class="{ past: is_past }" style="display: inline">
                {{
                  seminar.group_code == "CC"
                    ? course.title + " (Lecture)"
                    : course.title
                }}
              </h3>
              <p :class="{ past: is_past }" style="display: inline">
                {{ seminar.module_code }}
              </p>
              <h4 :class="{ past: is_past, placeholder: !seminar.title }">
                {{ seminar.title || "No class title" }}
              </h4>
            </div>
            <div style="margin-bottom: 10px">
              <h5 class="truncate" :class="{ placeholder: !seminar.desc }">
                {{ seminar.desc || "No class description" }}
              </h5>
              <h6>
                <a @click="descModalVisible = true" href="#"
                  >View full course description and class details</a
                >
              </h6>
            </div>
            <a-modal v-model="descModalVisible" @ok="descModalVisible = false">
              <template slot="footer">
                <a-button @click="descModalVisible = false">Close</a-button>
              </template>
              <h4>Class description:</h4>
              <p>{{ seminar.desc }}</p>
              <h4>Course description:</h4>
              <p>{{ course.desc }}</p>
            </a-modal>
            <h5>
              {{ "Notes for visitors: " + (course_group.notes || "None") }}
            </h5>
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
                  @click="requestModalVisible = true"
                  type="primary"
                  block
                  style="margin-bottom: 15px"
                  disabled
                  >Closed to visits</a-button
                >
              </template>
              <template v-else-if="!visit || visit.is_cancelled">
                <RequestVisitButton
                  :seminar="seminar"
                  :has_consented="has_consented"
                />
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
        <!-- <div v-if="visit_local && isMessagesVisible" style="margin-top: 20px">
          <div>{{ "Request message: " + visit_local.request_msg }}</div>
          <div>{{ "Response message: " + visit_local.response_msg }}</div>
        </div> -->
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
    // visits: {
    //   type: Array,
    //   default: () => []
    // },
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
    // visit_local() {
    //   return this.visits.find(visit => !visit.is_cancelled)
    // },
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
      return new Date(this.seminar.date) < Date.now();
    }
  }
};
</script>

<style scoped>
.cc-card {
}
.ant-card-hoverable {
  cursor: default;
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
