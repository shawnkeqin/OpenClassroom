<template>
  <div>
    <template v-if="$apollo.loading">
      <a-skeleton active />
    </template>
    <template v-else>
      <div
        style="display: flex; justify-content: space-between; flex-wrap: wrap;"
      >
        <div style="margin: 0 20px 20px 0;">
          <a-card style="width: 20rem">
            <div style="margin-bottom: 20px;">
              <h2>{{ course ? course.title : "" }}</h2>
              <h3>
                {{ course_group.course.module_code }}&nbsp;({{
                  course_group.group_code
                }})
              </h3>
            </div>
            <div
              style="display: flex; align-items: center; margin-bottom: 20px;"
            >
              <p style="margin: 0 10px 0 0">
                {{ `Toggle here to open/close this course to all visitors` }}
              </p>
              <div style="display: flex; align-items: center;">
                <a-switch
                  :checked="course_group.is_open"
                  checked-children="open"
                  un-checked-children="closed"
                  :loading="isToggleCourseGroupLoading"
                  @click="toggleCourseGroupIsOpen"
                  style="margin-right: 5px"
                />
                <a-tooltip
                  title="Closing/opening this course will automatically close/open all of its classes."
                >
                  <a-icon
                    type="exclamation-circle"
                    theme="filled"
                    class="pending"
                  />
                </a-tooltip>
              </div>
            </div>
            <template v-for="tag in course.tagged_as">
              <ColoredTag
                style="margin-bottom:5px"
                :key="tag.tag_label"
                :tag_label="tag.tag_label"
                :course="course"
              />
            </template>
            <template>
              <a-select
                mode="tags"
                style="width: 100%; margin-top: 20px"
                showArrow
                size="large"
                placeholder="Add existing tags or create your own"
                v-model="selectedTags"
              >
                <a-select-option v-for="tag in tags" :key="tag.label">
                  {{ tag.label }}
                </a-select-option>
              </a-select>
            </template>
            <h5 style="margin-top: 10px">
              Please use existing tags if applicable.
            </h5>
            <a-button
              :loading="isAddTagsLoading"
              type="primary"
              style="width: 8rem; margin-top: 10px;"
              @click="addTags"
              icon="tags"
              >Add tags</a-button
            >
          </a-card>
        </div>
        <div>
          <a-card style="width: 30rem;" :bodyStyle="{ padding: 0 }">
            <a-collapse v-model="activeKey" :bordered="false">
              <a-collapse-panel
                key="1"
                style="background-color: rgb(256, 256, 256)"
              >
                <template slot="header">
                  <h4 style="margin: 0;">Course description</h4>
                </template>
                <p>{{ course && (course.desc || "Nil") }}</p>
                <h5 style="margin: 0; margin-right: 10px;">
                  Additional Description (only visible to your course group)
                </h5>
                <p>{{ course_group.course_group_desc || "-" }}</p>
                <updateCourseGroupDescModal :course_group="course_group" />
              </a-collapse-panel>
              <a-collapse-panel
                key="2"
                style="background-color: rgb(256, 256, 256)"
              >
                <template slot="header">
                  <h4 style="margin: 0;">Course syllabus</h4>
                </template>
                <p>{{ course_group.syllabus || "-" }}</p>
                <updateCourseGroupSyllabusModal :course_group="course_group" />
              </a-collapse-panel>
              <a-collapse-panel
                key="3"
                style="background-color: rgb(256, 256, 256)"
              >
                <template slot="header">
                  <h4 style="margin: 0;">Notes for visitors</h4>
                </template>
                <p>{{ course && (course.notes || "-") }}</p>
                <updateCourseGroupNotesModal :course_group="course_group" />
              </a-collapse-panel>
            </a-collapse>
          </a-card>
        </div>
      </div>
      <div style="padding-top: 40px">
        <h2>Upcoming classes</h2>
        <div class="list-of-seminars">
          <SeminarsTable :seminars="seminars" :course_group="course_group" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import queries from "@/graphql/queries.gql";
import constants from "@/utils/constants";
import updateCourseGroupDescModal from "./updateCourseGroupDescModal";
import updateCourseGroupNotesModal from "./updateCourseGroupNotesModal";
import updateCourseGroupSyllabusModal from "./updateCourseGroupSyllabusModal";
import SeminarsTable from "./SeminarsTable";
import ColoredTag from "../../SeminarVisitRequestCard/ColoredTag";
import utils from "@/utils";
// import updateCourseGroupScheduleDescModal from "./updateCourseGroupScheduleDescModal";

export default {
  name: "courseDetails",
  components: {
    SeminarsTable,
    updateCourseGroupDescModal,
    updateCourseGroupNotesModal,
    updateCourseGroupSyllabusModal,
    ColoredTag
    // updateCourseGroupScheduleDescModal
  },
  data() {
    return {
      constants,
      id: this.$route.params.id,
      activeKey: ["1", "2", "3"],
      seminars: [],
      course_group: {},
      isToggleCourseGroupLoading: false,
      isAddTagsLoading: false,
      selectedTags: [],
      error: ""
    };
  },
  apollo: {
    tags() {
      return {
        query: queries.getTags,
        update: data => data.tag,
        error(err) {
          this.error = err;
        }
      };
    },
    seminars() {
      const course_group_id = this.id;
      const date_lower_bound = new Date(Date.now())
        .toLocaleDateString("en-GB", { timeZone: "Asia/Singapore" })
        .split("/")
        .reverse()
        .join("-");
      return {
        query: queries.get_seminars_by_course_group,
        variables: {
          course_group_id,
          date_lower_bound
        },
        fetchPolicy: "cache-and-network",
        update: data => data.seminar,
        error(err) {
          this.error = err;
        }
      };
    },
    course_group() {
      const course_group_id = this.id;
      return {
        query: queries.get_course_group_details,
        variables: {
          course_group_id
        },
        update: data => data.course_group[0],
        error(err) {
          this.error = err;
        }
      };
    }
  },
  computed: {
    course() {
      return this.course_group ? this.course_group.course : null;
    }
  },
  methods: {
    async addTags() {
      if (!this.selectedTags || !utils.isNonEmptyArray(this.selectedTags)) {
        return;
      }
      const tag_insert_input = this.selectedTags.map(label => {
        return {
          label,
          tagged_as: {
            data: [
              {
                module_code: this.course ? this.course.module_code : "",
                semester_code: this.course ? this.course.semester_code : ""
              }
            ],
            on_conflict: {
              constraint: "tagged_as_pkey",
              update_columns: ["module_code", "semester_code"]
            }
          }
        };
      });
      this.isAddTagsLoading = true;
      try {
        await this.$apollo.mutate({
          mutation: queries.insertTags,
          variables: {
            tags: tag_insert_input
          },
          refetchQueries: ["get_course_group_details", "getTags"]
        });
        this.$notification.success({
          message: "Tags added"
        });
        this.selectedTags = [];
      } catch (err) {
        this.$notification.error({
          message: "Failed to add tags to your course",
          description: err.toString()
        });
      }
      this.isAddTagsLoading = false;
    },
    async toggleCourseGroupIsOpen() {
      this.isToggleCourseGroupLoading = true;
      const course_group_id = this.id;
      const current_is_open = this.course_group.is_open;
      try {
        await this.$apollo.mutate({
          mutation: queries.update_course_group_and_seminars_is_open,
          variables: {
            course_group_id,
            is_open: !current_is_open
          },
          refetchQueries: [
            "get_course_group_details",
            "get_seminars_by_course_group"
          ]
        });
      } catch (err) {
        this.$notification.error({
          message: "Failed to update the open status of your course",
          description: err.toString()
        });
      }
      this.isToggleCourseGroupLoading = false;
    }
  },
  watch: {
    error(err) {
      this.$notification.error({
        message: "Failed to obtain data from database",
        description: err.toString(),
        duration: 0
      });
    }
  }
};
</script>

<style scoped>
.list-of-moduledesc {
  justify-content: center;
}
.moduleDesc-item {
  margin: 0 10px;
}
.list-of-seminars {
  justify-content: center;
  margin-bottom: 80px;
}
.seminar-item {
  margin: 0 10px;
}
</style>
