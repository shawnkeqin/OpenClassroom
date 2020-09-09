<template>
  <div style="width: 100%;">
    <template v-if="visit.visit_status === 'ACCEPTED'">
      <a-button
        @click="cancelRequestModalVisible = true"
        type="primary"
        ghost
        block
        style="margin-bottom: 15px"
        :disabled="!has_consented"
        :loading="isCancelling"
      >
        Cancel request
      </a-button>
      <a-modal
        v-model="cancelRequestModalVisible"
        @ok="handleCancelRequest"
        title="Cancel visit request"
      >
        <template slot="footer">
          <a-button key="cancel" @click="cancelRequestModalVisible = false">
            Cancel
          </a-button>
          <a-button key="submit" @click="handleCancelRequest">
            Confirm cancel request
          </a-button>
        </template>
        <p>Your are about to cancel your visit request</p>
      </a-modal>
      <div style="display: flex; justify-content: center; margin-bottom: 5px;">
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
      </div>
      <AddToCalendar :seminar="seminar" />
    </template>
    <template v-else-if="visit.visit_status === 'PENDING'">
      <a-button
        @click="deleteRequestModalVisible = true"
        type="primary"
        ghost
        block
        style="margin-bottom: 15px"
        :disabled="!has_consented"
        :loading="isCancelling"
      >
        Delete request
      </a-button>
      <a-modal
        v-model="deleteRequestModalVisible"
        @ok="handleDeleteRequest"
        title="Delete visit request"
      >
        <template slot="footer">
          <a-button key="cancel" @click="deleteRequestModalVisible = false">
            Cancel
          </a-button>
          <a-button key="submit" @click="handleDeleteRequest">
            Confirm delete request
          </a-button>
        </template>
        <p>Your are about to delete your visit request</p>
      </a-modal>
      <div style="display: flex; justify-content: center">
        <a-icon
          type="clock-circle"
          theme="filled"
          class="status-icon pending"
        />
        <h4 class="pending" style="margin-bottom: 0">
          Request pending
        </h4>
      </div>
    </template>
    <template v-else-if="visit.visit_status === 'DECLINED'">
      <div style="display: flex; justify-content: center; margin-bottom: 5px;">
        <div style="display: flex; align-items: center">
          <a-icon
            type="close-circle"
            theme="filled"
            class="status-icon declined"
          />
        </div>
        <div>
          <h4 class="declined" style="margin-bottom: 3px">
            Request declined
          </h4>
          <h5 class="declined">
            {{
              visit.time_responded &&
                utils.datetime_fromnow_format(visit.time_responded)
            }}
          </h5>
        </div>
      </div>
    </template>
    <template v-else>
      <div style="display: flex; justify-content: center">
        <a-icon
          type="close-circle"
          theme="filled"
          class="status-icon cancelled"
        />
        <h4 class="cancelled" style="margin-bottom: 0px">
          Request cancelled
        </h4>
      </div>
    </template>
  </div>
</template>

<script>
import utils from "@/utils";
import store from "@/store";
import queries from "@/graphql/queries.gql";
import AddToCalendar from "./AddToCalendar";

export default {
  name: "CancelVisitAndStatusWrapper",
  components: {
    AddToCalendar
  },
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
  data() {
    return {
      utils: utils,
      cancelRequestModalVisible: false,
      deleteRequestModalVisible: false,
      isCancelling: false
    };
  },
  methods: {
    async handleCancelRequest() {
      this.cancelRequestModalVisible = false;
      this.isCancelling = true;
      const visit_id = this.visit.id;
      try {
        await this.$apollo.mutate({
          mutation: queries.cancel_visit_request,
          variables: {
            visit_id
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
        this.$notification.success({
          message: "Your visit request has been cancelled."
        });
      } catch (err) {
        this.$notification.error({
          message: "Failed to cancel your visit request",
          description: err.toString()
        });
      }
      this.isCancelling = false;
    },
    async handleDeleteRequest() {
      this.deleteRequestModalVisible = false;
      this.isCancelling = true;
      const visit_id = this.visit.id;
      try {
        await this.$apollo.mutate({
          mutation: queries.delete_visit_request,
          variables: {
            visit_id
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
        this.$notification.success({
          message: "Your visit request has been deleted."
        });
      } catch (err) {
        this.$notification.error({
          message: "Failed to delete your visit request",
          description: err.toString()
        });
      }
      this.isCancelling = false;
    }
  },
  watch: {
    isCancelling(val) {
      const visit_id = this.visit.id;
      if (val === true) {
        this.$notification.open({
          key: `cancel_${visit_id}_loading`,
          message: "Processing your changes",
          icon: <a-icon type="loading" />,
          duration: 0
        });
      } else {
        this.$notification.close(`cancel_${visit_id}_loading`);
      }
    }
  },
  beforeDestroy() {
    this.$notification.close(`cancel_${this.visit.id}_loading`); // after refetchQueries, this component will get destroyed by the parent component, so the watch for isCancelling might not execute fast enough to cloase the loading notif
  }
};
</script>

<style scoped>
.ant-card-hoverable {
  cursor: default;
}
.date-heading {
  font-weight: bold;
  text-transform: uppercase;
}
.red {
  color: #f0284a;
}
</style>
