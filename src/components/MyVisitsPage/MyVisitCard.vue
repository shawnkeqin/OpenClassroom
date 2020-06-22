<template>
  <!-- <div> -->
  <!--     <img
        class="avatar"
        :src="instructor.profilePic"
        style="background-color: grey"
      /> -->
  <!--   <span style="padding-right: 10px">{{
        instructor.name + "'s class"
      }}</span> -->
  <!--    <a-tag v-for="tag in seminar.tags" :key="tag">{{ tag }}</a-tag> -->
  <!-- </div> -->
  <a-card hoverable style="width: 40rem; margin-bottom: 20px">
    <a-row style="margin-bottom: 5px">
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
    </a-row>
    <a-row style="margin-bottom: 20px">
      <a-col :span="17" style="padding-right: 20px">
        <a-row style="margin-bottom: 5px">
          <h3 style="display: inline">
            {{ course.title }}
          </h3>
          <p style="display: inline">
            {{ seminar.module_code }}
          </p>
          <h4>{{ seminar.title || "This is seminar title" }}</h4>
        </a-row>
        <a-row style="margin-bottom: 10px">
          <h5 class="truncate" style="margin-bottom: 0">
            {{
              seminar.desc || course.desc || "This is some seminar descriptions"
            }}
          </h5>
          <a @click="isDescModalOn = true"
            >View full course description and seminar details</a
          >
        </a-row>
        <a-modal v-model="isDescModalOn" @ok="isDescModalOn = false">
          <template slot="footer">
            <a-button @click="isDescModalOn = false">Close</a-button>
          </template>
          <h4>Seminar description:</h4>
          <p>{{ seminar.desc }}</p>
          <h4>Course description:</h4>
          <p>{{ course.desc }}</p>
        </a-modal>
        <h5>
          {{ "Notes for visitors: " + (course_group.notes || "Some notes") }}
        </h5>
      </a-col>
      <a-col :span="7" type="flex" align="bottom" style="display: inline-block">
        <a-button
          @click="isCancelRequestModalOn = true"
          type="primary"
          ghost
          block
          style="margin-bottom: 20px"
          >Cancel request</a-button
        >
        <a-modal
          v-model="isCancelRequestModalOn"
          @ok="handleCancelRequest"
          title="You are about to cancel your visit request"
        >
          <template slot="footer">
            <a-button key="cancel" @click="isCancelRequestModalOn = false"
              >Cancel</a-button
            >
            <a-button key="submit" @click="handleCancelRequest"
              >Confirm cancel request</a-button
            >
          </template>
          <h6>Your request message</h6>
          <p>{{ visit.request_msg }}</p>
          <h6>Instructor's response message</h6>
          <p>{{ visit.response_msg }}</p>
        </a-modal>
        <div style="display: flex; justify-content: center">
          <template v-if="visit.visit_status === 'PENDING'">
            <a-icon
              type="clock-circle"
              theme="filled"
              class="status-icon pending"
            />
            <h4 class="pending" style="margin-bottom: 0">
              Request pending
            </h4>
          </template>
          <template v-else-if="visit.visit_status === 'ACCEPTED'">
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
          <template v-else-if="visit.visit_status === 'DECLINED'">
            <a-icon
              type="closed-circle"
              theme="filled"
              class="status-icon declined"
            />
            <h4 class="declined" style="margin-bottom: 0">
              Request declined
            </h4>
          </template>
          <template v-else />
        </div>
      </a-col>
    </a-row>
    <a-row>
      <div>{{ "Request message: " + visit.request_msg }}</div>
      <div>{{ "Response message: " + visit.response_msg }}</div>
    </a-row>
  </a-card>
</template>

<script>
import utils from "@/utils";
import queries from "@/graphql/queries.gql";

export default {
  name: "myVisitCard",
  props: ["visit"],
  data: function() {
    return {
      utils: utils,
      isDescModalOn: false,
      isCancelRequestModalOn: false,
      seminar: {}
    };
  },
  apollo: {
    seminar() {
      const seminar_id = this.visit.seminar_id;
      return {
        query: queries.get_seminar,
        variables: {
          seminar_id
        },
        update: data => data.seminar[0]
      };
    }
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
    async handleCancelRequest() {
      const visit_id = this.visit.id;
      await this.$apollo.mutate({
        mutation: queries.delete_visit,
        variables: {
          visit_id
        },
        refetchQueries: ["get_my_visits"]
      });
      this.isCancelRequestModalOn = false;
    },
    handleAddToCalendar() {}
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
.status-icon {
  font-size: 20px;
  padding-right: 10px;
}
.request-status {
  font-size: 16px;
  font-family: "Lato", sans-serif;
  font-weight: bold;
}
</style>
