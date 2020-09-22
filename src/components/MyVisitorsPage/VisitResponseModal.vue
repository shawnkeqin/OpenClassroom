<template>
  <div style="width: 100%">
    <a-button
      v-if="this.visit.visit_status === constants.VISIT_STATUS_PENDING"
      type="primary"
      @click="onClickRespond"
      >Respond</a-button
    >
    <a-button v-else @click="onClickRespond">Edit response</a-button>
    <a-modal v-model="visible" :title="`${this.visit.visitor.name}'s request`">
      <p>{{ visit.request_msg }}</p>
      <h5>Your response message (optional)</h5>
      <a-input
        v-model="response_msg"
        type="textarea"
        placeholder="You have not submitted a message."
      />
      <p>
        Send them an email:
        <a :href="'mailto:' + visit.visitor.email">{{ visit.visitor.email }}</a>
      </p>
      <template slot="footer">
        <div>
          <span style="float: left; color: grey;">{{ responseTime }}</span>
          <a-button
            v-if="
              visit.visit_status === constants.VISIT_STATUS_PENDING ||
                visit.visit_status === constants.VISIT_STATUS_DECLINED
            "
            class="respond-button accept-button"
            :loading="loading"
            @click="submitVisitResponse(constants.VISIT_STATUS_ACCEPTED)"
            >Accept</a-button
          >
          <a-button
            v-else-if="visit.visit_status === constants.VISIT_STATUS_ACCEPTED"
            class="respond-button accepted-button"
          >
            Accepted
          </a-button>
          <a-button
            v-if="
              visit.visit_status === constants.VISIT_STATUS_PENDING ||
                visit.visit_status === constants.VISIT_STATUS_ACCEPTED
            "
            class="respond-button decline-button"
            :loading="loading"
            @click="submitVisitResponse(constants.VISIT_STATUS_DECLINED)"
            >Decline</a-button
          >
          <a-button
            v-else-if="visit.visit_status === constants.VISIT_STATUS_DECLINED"
            class="respond-button declined-button"
          >
            Declined
          </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
import utils from "@/utils";
import constants from "@/utils/constants";
import queries from "@/graphql/queries.gql";
import moment from "moment";
export default {
  props: {
    seminar: Object,
    visit: Object
  },
  data() {
    return {
      utils: utils,
      constants: constants,
      visible: false,
      loading: false,
      response_msg: this.visit.response_msg
    };
  },
  computed: {
    responseTime() {
      return this.visit.visit_status !== constants.PENDING &&
        this.visit.time_responded
        ? `(Responded ${utils.datetime_fromnow_format(
            this.visit.time_responded
          )})`
        : `(Requested ${utils.datetime_fromnow_format(
            this.visit.time_requested
          )})`;
    }
  },
  methods: {
    onClickRespond() {
      this.visible = true;
    },
    async submitVisitResponse(new_status) {
      const visit_id = this.visit.id;
      const response_msg = this.response_msg;
      this.loading = true;
      try {
        await this.$apollo.mutate({
          mutation: queries.update_visit_response,
          variables: {
            visit_id,
            visit_status: new_status,
            time_responded: moment().format(),
            response_msg
          },
          refetchQueries: ["get_seminars_with_visits_by_time_requested"]
        });
      } catch (err) {
        this.$notification.error({
          message: "Failed to respond to the visit request",
          description: err.toString()
        });
      }
      this.loading = false;
      this.visible = false;
    }
  }
};
</script>
<style scoped>
.accept-button {
  color: #81c784;
  border-color: #81c784;
}
.decline-button {
  color: #e57373;
  border-color: #e57373;
}
.accepted-button {
  color: #ffffff;
  background-color: #81c784;
}
.declined-button {
  color: #ffffff;
  background-color: #e57373;
}
</style>
