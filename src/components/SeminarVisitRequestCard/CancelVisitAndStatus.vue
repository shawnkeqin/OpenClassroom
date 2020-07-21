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
          <a-button
            key="submit"
            @click="handleCancelRequest"
            :loading="isCancelling"
          >
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
    <template v-else>
      <a-button
        @click="deleteRequestModalVisible = true"
        type="primary"
        ghost
        block
        style="margin-bottom: 15px"
        :disabled="!has_consented"
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
          <a-button
            key="submit"
            @click="handleDeleteRequest"
            :loading="isCancelling"
          >
            Confirm delete request
          </a-button>
        </template>
        <p>Your are about to delete your visit request</p>
      </a-modal>
      <template v-if="visit.visit_status === 'PENDING'">
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
      </template>
    </template>
  </div>
</template>

<script>
import utils from "@/utils";
import store from "@/store";
import queries from "@/graphql/queries.gql";
import AddToCalendar from "./AddToCalendar";

export default {
  name: "CancelVisitAndStatus",
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
  data: function() {
    return {
      utils: utils,
      cancelRequestModalVisible: false,
      deleteRequestModalVisible: false,
      isCancelling: false,
      tag: this.makeTag
    };
  },
  methods: {
    async handleCancelRequest() {
      this.isCancelling = true;
      const visit_id = this.visit.id;
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
        ],
        awaitRefetchQueries: true
      });
      this.isCancelling = false;
      this.cancelRequestModalVisible = false;
    },
    async handleDeleteRequest() {
      this.isCancelling = true;
      const visit_id = this.visit.id;
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
          "searchSeminarsByFilters"
        ],
        awaitRefetchQueries: true
      });
      this.isCancelling = false;
      this.deleteRequestModalVisible = false;
    }
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
.past {
  color: rgba(0, 0, 0, 0.37);
}
</style>
