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
    <a-card hoverable style="width: 600px" bodyStyle="padding: 10px">
      <a-col :span="4">
        <div>{{ seminar.date }}</div>
        <div>{{ seminar.start + " - " + seminar.end }}</div>
        <div>{{ seminar.location_code }}</div>
      </a-col>
      <a-col :span="14" style="padding-right: 10px">
        <a-row type="flex" style="align-items: center">
          <span class="module-code">{{ seminar.module_code }}</span>
          <template v-if="visit.visit_status === 'PENDING'">
            <a-icon type="clock-circle" theme="filled" class="pending" />
            <span class="request-status pending">Request pending</span>
          </template>
          <template v-else-if="visit.visit_status === 'accepted'">
            <a-icon type="check-circle" theme="filled" class="accepted" />
            <span class="request-status accepted">Request accepted</span>
            <a @click="handleAddToCalendar">Add to calendar</a>
          </template>
          <template v-else-if="visit.visit_status === 'declined'">
            <a-icon type="close-circle" theme="filled" class="declined" />
            <span class="request-status declined">Request declined</span>
          </template>
          <template v-else />
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
      <a-col :span="6">
        <a-button block style="margin-bottom: 2px" type="primary" ghost
          >Share</a-button
        >
        <template v-if="!visit.visit_status">
          <a-popover
            v-model="isRequestPopoverOn"
            placement="bottomLeft"
            trigger="click"
          >
            <template slot="content">
              <div @click="handleRequestNow"><a>Request now</a></div>
              <div @click="handleOpenMessageModal">
                <a>Request with a message</a>
              </div>
              <a-modal v-model="isMessageModalOn" @ok="handleSubmitMessage">
                <template slot="footer">
                  <a-button key="cancel" @click="handleCancelMessage"
                    >Cancel</a-button
                  >
                  <a-button key="submit" @click="handleSubmitMessage"
                    >Submit</a-button
                  >
                </template>
                <a-form-model-item label="Your message">
                  <a-input v-model="message" type="textarea" />
                </a-form-model-item>
              </a-modal>
            </template>
            <a-button block type="primary">Request</a-button>
          </a-popover>
        </template>
        <template v-else>
          <a-button @click="handleCancelRequest" block type="primary" ghost
            >Cancel request</a-button
          >
        </template>
      </a-col>
    </a-card>
  </div>
</template>

<script>
import gql from "graphql-tag";

export default {
  name: "seminarCardRequest",
  props:
    //   seminar: Object, // assuming that seminar has fields module_code, title, date, start, end, location_code, is_open, desc, instructor
    //  requestStatus: String,
    ["visit"],
  data: function() {
    return {
      isRequestPopoverOn: false,
      isDescModalOn: false,
      isMessageModalOn: false,
      message: "",
      seminar: {},
      course: {}
    };
  },
  async created() {
    const seminar_id = this.visit.seminar_id;
    const seminarResponse = await this.$apollo.query({
      query: gql`
        query getSeminar($seminar_id: Int!) {
          seminar(where: { id: { _eq: $seminar_id } }) {
            title
            start
            location_code
            module_code
            date
            desc
            end
            id
          }
        }
      `,
      variables: {
        seminar_id
      }
    });
    this.seminar = seminarResponse.data.seminar[0];
    const module_code = this.seminar.module_code;
    console.log(this.seminar);
    console.log(module_code);
    console.log('test');
    const courseResponse = await this.$apollo.query({
      query: gql`
        query MyQuery($module_code: String!) {
          course(where: { module_code: { _eq: $module_code } }) {
            desc
            id
            module_brief_link
            title
          }
        }
      `,
      variables: {
        module_code
      }
    });
    this.course = courseResponse.data.course[0];
    console.log(courseResponse);
  },
  methods: {
    handleRequestNow() {
      this.isRequestPopoverOn = false;
    },
    handleOpenMessageModal() {
      this.isRequestPopoverOn = false;
      this.isMessageModalOn = true;
    },
    handleSubmitMessage() {
      this.isMessageModalOn = false;
    },
    handleCancelMessage() {
      this.message = "";
      this.isMessageModalOn = false;
    },
    handleDeleteRequest() {},
    handleAddToCalendar() {},
    handleCancelRequest() {}
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
