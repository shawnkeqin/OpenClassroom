<template>
  <div style="width: 100%;">
    <a-button
      @click="requestModalVisible = true"
      type="primary"
      block
      style="margin-bottom: 15px"
      :disabled="!has_consented"
      :loading="isRequesting"
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
        <a-button key="submit" @click="handleSubmitRequest">Submit</a-button>
      </template>
      <a-form-model-item label="Your request message (optional)">
        <a-input v-model="request_msg" type="textarea" />
      </a-form-model-item>
    </a-modal>
  </div>
</template>

<script>
import store from "@/store";
import queries from "@/graphql/queries.gql";

export default {
  name: "RequestVisitButton",
  props: {
    visit: {
      type: Object,
      default: null
    },
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
      isRequesting: false,
      requestModalVisible: false,
      request_msg: "",
    };
  },
  methods: {
    async handleSubmitRequest() {
      this.requestModalVisible = false;
      this.isRequesting = true;
      if (!this.seminar.is_open) return;
      const seminar_id = this.seminar.id;
      // const seminar = this.seminar;
      const request_msg = this.request_msg;
      try {
        await this.$apollo.mutate({
          mutation: queries.create_visit_request,
          variables: {
            seminar_id,
            visitor_id: store.state.loggedInUser,
            request_msg
          },
          // update: (cache, { data: { insert_visit } }) => {
          //   console.log(insert_visit);
          //   const query = {
          //     query: queries.get_my_visits,
          //     variables: {
          //       visitor_id: store.state.loggedInUser
          //     }
          //   }
          //   const new_visit = insert_visit.returning[0];
          //   const data = cache.readQuery(query);
          //   data.visit.push({
          //     ...new_visit,
          //     visitor_id: store.state.loggedInUser,
          //     seminar
          //   });
          //   cache.writeQuery({
          //     ...query,
          //     data
          //   })
          // },
          refetchQueries: [
            {
              query: queries.get_my_visits,
              variables: {
                visitor_id: store.state.loggedInUser
              }
            },
            "searchSeminarsByFilters",
            // "searchSeminarsByFiltersWithTags"
          ],
          awaitRefetchQueries: true
        });
        this.isRequesting = false;
        this.$notification.success({
          key: `request_${seminar_id}_success`,
          message: "Your visit request has been sent."
        })
      } catch (err) {
        this.$notification.error({
          key: `request_${seminar_id}_failure`,
          message: "Failed to make a new request",
          description: "Please try again."
        })
      }
    }
  },
  watch: {
    isRequesting(val) {
      const seminar_id = this.seminar_id;
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
    this.$notification.close(`request_${this.seminar_id}_loading`); // after refetchQueries, this component will get destroyed by the parent component, so the watch for isCancelling might not execute fast enough to cloase the loading notif
  }
};
</script>