<template>
  <div style="width: 100%">
    <a-button
      v-if="this.visit.visit_status === constants.VISIT_STATUS_PENDING"
      type="primary"
      @click="onClickRespond"
    >
      Respond
    </a-button>
    <a-button v-else @click="onClickRespond">Edit response</a-button>
    <a-modal v-model="visible" :title="`${this.visit.visitor.name}'s request`">
      <p>{{ visit.request_msg }}</p>
      <a-form :form="form">
        <a-form-item label="Your response message (optional)">
          <a-input
            v-decorator="['response_msg', {}]"
            type="textarea"
            placeholder="You have not submitted a message."
          />
        </a-form-item>
      </a-form>
      <p>
        Send them an email:
        <a :href="'mailto:' + visit.visitor.email">{{ visit.visitor.email }}</a>
      </p>
      <template slot="footer">
        <div>
          <span style="float: left;color: grey;">{{ responseTime }}</span>
          <a-button
            v-if="
              visit.visit_status === constants.VISIT_STATUS_PENDING ||
                visit.visit_status === constants.VISIT_STATUS_DECLINED
            "
            class="respond-button accept-button"
            :loading="loading"
            @click="submitVisitResponse(constants.VISIT_STATUS_ACCEPTED)"
          >
            Accept
          </a-button>
          <a-button
            v-else-if="visit.visit_status === constants.VISIT_STATUS_ACCEPTED"
            class="respond-button accepted-button"
          >
            <!-- <a-icon type="close-circle" /> -->
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
          >
            Decline
          </a-button>
          <a-button
            v-else-if="visit.visit_status === constants.VISIT_STATUS_DECLINED"
            class="respond-button declined-button"
          >
            <!-- <a-icon type="close-circle" /> -->
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
  mounted() {
    this.form.setFieldsValue({
      response_msg: this.visit.response_msg || null
    });
  },
  data() {
    return {
      utils: utils,
      constants: constants,
      visible: false,
      loading: false,
      form: this.$form.createForm(this, { name: "form" })
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
      this.loading = true;
      try {
        await this.$apollo.mutate({
          mutation: queries.update_visit_response,
          variables: {
            visit_id,
            visit_status: new_status,
            time_responded: moment().format(),
            response_msg: this.form.response_msg
          },
          update: (store, { data: { update_visit_by_pk } }) => {
            if (update_visit_by_pk) {
              setTimeout(() => {
                this.visible = false;
              }, 1000);
              this.loading = false;
            }
          },
          refetchQueries: ["get_seminars_with_visits_by_time_requested"]
        });
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.$notification.error({
          key: `reqsponse_${visit_id}_failure`,
          message: "Failed to respond to the visit request",
          description: "Please try again."
        });
      }
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
