<template>
  <div style="width: 100%;">
    <a-button
      @click="requestModalVisible = true"
      type="primary"
      block
      style="margin-bottom: 15px"
      :disabled="!has_consented"
      >Request visit</a-button
    >
    <a-modal
      v-model="requestModalVisible"
      title="Making a vist request"
      @ok="handleSubmitRequest"
    >
      <template slot="footer">
        <a-button key="cancel" @click="requestModalVisible = false"
          >Cancel</a-button
        >
        <a-button type="primary" key="submit" @click="handleSubmitRequest"
          >Submit</a-button
        >
      </template>
      <div v-if="myVisitsOnTheSameDay.length || mySeminarsOnTheSameDay.length">
        <div v-if="myVisitsOnTheSameDay.length" style="margin-bottom: 1rem;">
          <h4>
            {{ `You have upcoming visits on the same day ${seminar.date}` }}
          </h4>
          <div v-for="visit in myVisitsOnTheSameDay" :key="visit.id">
            <h5>
              {{
                `${visit.seminar.course_group.course.module_code} ${
                  visit.seminar.course_group.course.title
                } | ${utils.time_format(
                  visit.seminar.start
                )}-${utils.time_format(visit.seminar.end)}`
              }}
            </h5>
          </div>
        </div>
        <div v-if="mySeminarsOnTheSameDay.length" style="margin-bottom: 1rem;">
          <h4>{{ `You have classes on the same day ${seminar.date}` }}</h4>
          <div v-for="seminar in mySeminarsOnTheSameDay" :key="seminar.id">
            <h5>
              {{
                `${seminar.course_group.course.module_code} ${
                  seminar.course_group.course.title
                } | ${utils.time_format(seminar.start)}-${utils.time_format(
                  seminar.end
                )}`
              }}
            </h5>
          </div>
        </div>
        <p>
          {{
            `The class that you intend to request a visit to takes place from ${utils.time_format(
              seminar.start
            )}-${utils.time_format(seminar.end)}`
          }}
        </p>
      </div>
      <a-form-model-item label="Your request message (optional)">
        <a-input v-model="request_msg" type="textarea" />
      </a-form-model-item>
    </a-modal>
  </div>
</template>

<script>
import utils from "@/utils";
import store from "@/store";
import queries from "@/graphql/queries.gql";

export default {
  name: "RequestVisitButton",
  props: {
    seminar: {
      type: Object,
      default: null
    },
    has_consented: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      utils,
      isRequesting: false,
      requestModalVisible: false,
      request_msg: "",
      myVisitsOnTheSameDay: [],
      mySeminarsOnTheSameDay: []
    };
  },
  apollo: {
    myVisitsOnTheSameDay: {
      query: queries.get_my_visits_by_date,
      variables() {
        return {
          visitor_id: store.state.loggedInUser,
          date: this.seminar.date
        };
      },
      update: data => data.visit,
      error() {
        this.$notification.error({
          key: `server_error`,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    mySeminarsOnTheSameDay: {
      query: queries.get_my_seminars_by_date,
      variables() {
        return {
          faculty_id: store.state.loggedInUser,
          date: this.seminar.date
        };
      },
      update: data => data.seminar,
      error() {
        this.$notification.error({
          key: `server_error`,
          message: "Server error",
          description: "Please try again."
        });
      }
    }
  },
  methods: {
    async handleSubmitRequest() {
      this.requestModalVisible = false;
      this.isRequesting = true;
      if (!this.seminar.is_open) return;
      const seminar_id = this.seminar.id;
      const request_msg = this.request_msg;
      try {
        await this.$apollo.mutate({
          mutation: queries.create_visit_request,
          variables: {
            seminar_id,
            visitor_id: store.state.loggedInUser,
            request_msg
          },
          refetchQueries: [
            {
              query: queries.get_my_visits,
              variables: {
                visitor_id: store.state.loggedInUser
              }
            },
            "searchSeminarsByFilters",
            "searchSeminarsByFiltersWithTags",
            "searchOpenSeminarsByFilters",
            "searchOpenSeminarsByFiltersWithTags",
            "get_my_visits_by_date"
          ],
          awaitRefetchQueries: true
        });
        this.isRequesting = false;
        this.$notification.success({
          key: `request_${seminar_id}_success`,
          message: "Your visit request has been sent."
        });
      } catch (err) {
        this.isRequesting = false;
        this.$notification.error({
          key: `request_${seminar_id}_failure`,
          message: "Failed to make a new request" + err,
          description: "Please try again."
        });
      }
    }
  },
  watch: {
    isRequesting(val) {
      const seminar_id = this.seminar.id;
      if (val) {
        this.$notification.open({
          key: `request_${seminar_id}_loading`,
          message: "Processing your visit request",
          icon: <a-icon type="loading" />,
          duration: 0
        });
      } else {
        this.$notification.close(`request_${seminar_id}_loading`);
      }
    }
  },
  beforeDestroy() {
    this.$notification.close(`request_${this.seminar.id}_loading`); // after refetchQueries, this component will get destroyed by the parent component, so the watch for isCancelling might not execute fast enough to cloase the loading notif
  }
};
</script>
