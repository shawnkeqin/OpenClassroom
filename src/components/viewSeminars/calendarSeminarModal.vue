<template>
  <div style="padding: 10px;">
    <div v-if="!isMySeminar" style="display: flex; margin-bottom: 10px;">
      <template v-if="my_visit.visit_status === 'PENDING'">
        <div style="display: flex; align-items: center">
          <a-icon
            type="clock-circle"
            theme="filled"
            class="status-icon pending"
          />
        </div>
        <div>
          <h4 class="pending" style="margin-bottom: 0">
            Pending visit request
          </h4>
        </div>
      </template>
      <template v-if="my_visit.visit_status === 'ACCEPTED'">
        <div style="display: flex; align-items: center">
          <a-icon
            type="check-circle"
            theme="filled"
            class="status-icon accepted"
          />
        </div>
        <div>
          <h4 class="accepted" style="margin-bottom: 0">
            Accepted visit request
          </h4>
        </div>
      </template>
      <template v-if="my_visit.visit_status === 'DECLINED'">
        <div style="display: flex; align-items: center">
          <a-icon
            type="close-circle"
            theme="filled"
            class="status-icon declined"
          />
        </div>
        <div>
          <h4 class="declined" style="margin-bottom: 0">
            Declined visit request
          </h4>
        </div>
      </template>
      <template v-if="my_visit.visit_status === 'CANCELLED'">
        <div style="display: flex; align-items: center">
          <a-icon
            type="close-circle"
            theme="filled"
            class="status-icon cancelled"
          />
        </div>
        <div>
          <h4 class="cancelled" style="margin-bottom: 0">
            Cancelled visit request
          </h4>
        </div>
      </template>
    </div>
    <div
      style="display: flex; flex-direction: column; align-items: center; margin-bottom: 40px;"
    >
      <p style="margin: 3px;">
        {{ seminar.module_code }}
      </p>
      <h3>{{ course.title }}</h3>
      <div style="margin-bottom: 3px;">
        <h4 style="display: inline;">
          {{
            `${utils.date_format(seminar.date)} | ${utils.time_format(
              seminar.start
            )} - ${utils.time_format(seminar.end)}`
          }}
        </h4>
      </div>
      <h5>{{ seminar.location.full_name }}</h5>
      <h5>{{ constants.TEACHING_MODES[seminar.teaching_mode] }}</h5>
    </div>
    <div style="margin-bottom: 20px;">
      <h5>Class title</h5>
      <p>{{ seminar.title || "None" }}</p>
      <h5>Class description</h5>
      <p>{{ seminar.desc || "None" }}</p>
      <h5>Note for visitors</h5>
      <p>{{ course_group.notes || "None" }}</p>
    </div>
    <template v-if="isMySeminar">
      <div
        v-for="item in my_visitors_by_status"
        :key="item.status"
        style="margin-top: 20px;"
      >
        <template v-if="item.visitors.length">
          <template v-if="item.status === 'PENDING'">
            <h4 class="pending">
              Pending visitors
            </h4>
          </template>
          <template v-else-if="item.status === 'ACCEPTED'">
            <h4 class="accepted">
              Accepted visitors
            </h4>
          </template>
          <template v-if="item.status === 'DECLINED'">
            <h4 class="declined">
              Declined visitors
            </h4>
          </template>
          <template v-else-if="item.status === 'CANCELLED'">
            <h4 class="cancelled">
              Cancelled visitors
            </h4>
          </template>
          <div
            v-for="visit in item.visitors"
            :key="visit.id"
            style="display: flex; align-items: center; margin-bottom: 5px;"
          >
            <img
              class="avatar-small"
              :src="
                visit.visitor.profilePic ||
                  'https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png'
              "
            />
            <p style="margin: 0 5px;">
              {{ visit.visitor.name }}
            </p>
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      <div style="margin-bottom: 20px;">
        <h5>Instructor</h5>
        <div style="display: flex; align-items: center;">
          <img
            class="avatar-medium"
            :src="
              course_group.faculty.profilePic ||
                'https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png'
            "
          />
          <p style="margin: 0 5px;">
            {{ course_group.faculty.name }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import utils from "@/utils";
import constants from "@/utils/constants";
import store from "@/store";

export default {
  name: "CalendarSeminar",
  props: {
    event: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      utils,
      constants
    };
  },
  computed: {
    faculty() {
      return this.event.extendedProps.faculty;
    },
    isMySeminar() {
      return this.faculty.id === store.state.loggedInUser;
    },
    seminar() {
      return this.event.extendedProps.seminar;
    },
    course_group() {
      return this.event.extendedProps.course_group;
    },
    my_visit() {
      return this.event.extendedProps.my_visit || null;
    },
    my_visitors() {
      return this.event.extendedProps.my_visitors || [];
    },
    my_visitors_by_status() {
      return this.my_visitors.reduce(
        (acc, cur) => {
          const idx = acc.findIndex(item => item.status === cur.visit_status);
          if (idx !== -1) {
            const targetItem = acc[idx];
            targetItem.visitors.push(cur);
          }
          return acc;
        },
        [
          {
            status: "PENDING",
            visitors: []
          },
          {
            status: "ACCEPTED",
            visitors: []
          },
          {
            status: "DECLINED",
            visitors: []
          },
          {
            status: "CANCELLED",
            visitors: []
          }
        ]
      );
    },
    course() {
      return this.course_group.course;
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
