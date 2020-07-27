<template>
  <a-table :columns="columns" :data-source="seminars">
    <template slot="date" slot-scope="text">
      <div>{{ utils.date_format(text) }}</div>
    </template>
    <template slot="start" slot-scope="text">
      <div>{{ utils.time_format(text) }}</div>
    </template>
    <template slot="end" slot-scope="text">
      <div>{{ utils.time_format(text) }}</div>
    </template>
    <template slot="venue" slot-scope="text, record">
      <div style="width: 5rem;">{{ record.location.full_name }}</div>
    </template>
    <template slot="visitor_capacity" slot-scope="text, record">
      <div>{{ record.visitor_capacity || course_group.visitor_capacity }}</div>
    </template>
    <template slot="set_open" slot-scope="text, record">
      <a-switch
        :checked="record.is_open"
        checked-children="open"
        un-checked-children="closed"
        :loading="is_loading"
        @click="toggleSeminarIsOpen"
      />
    </template>
    <template slot="edit" slot-scope="text, record">
      <updateSeminarModal :seminar="record" />
    </template>
    <div slot="expandedRowRender" slot-scope="record">
      <h5>Seminar title</h5>
      <p>{{ record.title || "None" }}</p>
      <h5>Seminar description</h5>
      <p>{{ record.desc || "None" }}</p>
    </div>
  </a-table>
</template>

<script>
import utils from "@/utils";
import queries from "@/graphql/queries.gql";
import updateSeminarModal from "./updateSeminarModal";

const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    scopedSlots: { customRender: "date" }
  },
  {
    title: "Start",
    dataIndex: "start",
    key: "start",
    scopedSlots: { customRender: "start" }
  },
  {
    title: "End",
    dataIndex: "end",
    key: "end",
    scopedSlots: { customRender: "end" }
  },
  {
    title: "Venue",
    dataIndex: "venue",
    key: "venue",
    scopedSlots: { customRender: "venue" }
  },
  {
    title: "Visitor capactiy",
    dataIndex: "visitor_capacity",
    key: "visitor_capacity",
    scopedSlots: { customRender: "visitor_capacity" }
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    scopedSlots: { customRender: "set_open" }
  },
  {
    title: "Edit",
    dataIndex: "edit",
    key: "edit",
    scopedSlots: { customRender: "edit" }
  }
];

export default {
  name: "SeminarsTable",
  components: {
    updateSeminarModal
  },
  props: {
    seminars: {
      type: Array,
      default: () => []
    },
    course_group: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      columns,
      utils,
      is_loading: false
    };
  },
  methods: {
    async toggleSeminarIsOpen() {
      this.is_loading = true;
      const seminar_id = this.seminar.id;
      const current_is_open = this.seminar.is_open;
      try {
        await this.$apollo.mutate({
          mutation: queries.updateSeminarIsOpen,
          variables: {
            seminar_id,
            is_open: !current_is_open
          },
          refetchQueries: ["get_seminars_by_course_group"]
        });
        this.is_loading = false;
      } catch (err) {
        this.is_loading = false;
        this.$notification.error({
          key: "toggle_course_group_is_open_error",
          message: "Failed to update the open status of your course",
          description: "Please try again."
        });
      }
    }
  }
};
</script>

<style scoped>
.closed {
  background-color: rgba(0, 0, 0, 0.12);
}
</style>
