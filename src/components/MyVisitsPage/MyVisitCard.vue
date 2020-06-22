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
  <a-card
    hoverable
    style="width: 40rem; margin-bottom: 20px"
    bodyStyle="padding: 10px"
  >
    <a-col :span="5">
      <h5>{{ utils.date_format(seminar.date) }}</h5>
      <h5>
        {{
          utils.time_format(seminar.start) +
            " - " +
            utils.time_format(seminar.end)
        }}
      </h5>
      <h5 style="padding-top: 10px">{{ seminar.location.full_name }}</h5>
    </a-col>
    <a-col :span="13" style="padding-right: 10px">
      <!-- <a-row type="flex" style="align-items: center">
        <a @click="handleAddToCalendar">Add to calendar</a>
      </a-row> -->
      <h3 style="display: inline-block; margin-bottom: 5px">{{ course.title }}</h3>
      <h5 style="display: inline-block; padding-left: 5px">{{ seminar.module_code }}</h5>
      <h4 style="margin-bottom: 5px">{{ seminar.title || 'This is seminar title' }}</h4>
      <h5 class="truncate">{{ seminar.desc || course.desc || 'This is some seminar descriptions' }}</h5>
      <a @click="isDescModalOn = true"
        >View full course description and seminar details</a
      >
      <a-modal
        v-model="isDescModalOn"
        @ok="isDescModalOn = false"
      >
        <template slot="footer">
          <a-button @click="isDescModalOn = false">Close</a-button>
        </template>
        <h4>Seminar description:</h4>
        <p>{{ seminar.desc }}</p>
        <h4>Course description:</h4>
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
