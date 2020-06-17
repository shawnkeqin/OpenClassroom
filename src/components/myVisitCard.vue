<template>
  <div style="padding: 10px">
    <div>
      <!--     <img
        class="avatar"
        :src="instructor.profilePic"
        style="background-color: grey"
      /> -->
      <!--   <span style="padding-right: 10px">{{
        instructor.name + "'s class"
      }}</span> -->
      <!--    <a-tag v-for="tag in seminar.tags" :key="tag">{{ tag }}</a-tag> -->
    </div>
    <a-card hoverable style="width: 800px" bodyStyle="padding: 10px">
      <a-col :span="4">
        <div>{{ utils.date_format(seminar.date) }}</div>
        <div>
          {{
            utils.time_format(seminar.start) +
              " - " +
              utils.time_format(seminar.end)
          }}
        </div>
        <div>{{ seminar.location.full_name }}</div>
      </a-col>
      <a-col :span="14" style="padding-right: 10px">
        <a-row type="flex" style="align-items: center">
          <span class="module-code">{{ seminar.module_code }}</span>
          <a @click="handleAddToCalendar">Add to calendar</a>
        </a-row>
        <div class="seminar-title">{{ course.title }}</div>
        <a @click="isDescModalOn = true"
          >View course description and seminar details</a
        >
        <a-modal
          v-model="isDescModalOn"
          title="Course description and seminar details"
          @ok="isDescModalOn = false"
        >
          <template slot="footer">
            <a-button @click="isDescModalOn = false">Close</a-button>
          </template>
          <p>{{ course.desc }}</p>
        </a-modal>
      </a-col>
      <a-col :span="6" type="flex" align="middle">
        <a-button
          @click="isCancelRequestModalOn = true"
          block
          type="primary"
          ghost
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
        <div>
          <template v-if="visit.visit_status === 'PENDING'">
            <a-icon type="clock-circle" theme="filled" class="pending" />
            <span class="request-status pending">Request pending</span>
          </template>
          <template v-else-if="visit.visit_status === 'ACCEPTED'">
            <a-icon type="check-circle" theme="filled" class="accepted" />
            <span class="request-status accepted">Request accepted</span>
          </template>
          <template v-else-if="visit.visit_status === 'DECLINED'">
            <a-icon type="close-circle" theme="filled" class="declined" />
            <span class="request-status declined">Request declined</span>
          </template>
          <template v-else />
        </div>
      </a-col>
    </a-card>
  </div>
</template>

<script>
import utils from "../utils";
import queries from "../graphql/queries.gql";

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
    course() {
      return this.seminar.course_group.course;
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
