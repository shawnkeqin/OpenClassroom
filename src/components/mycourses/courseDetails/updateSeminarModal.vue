<template>
  <div>
    <a-icon type="edit" @click="modal2Visible = true" />
    <a-modal
      v-model="modal2Visible"
      title="Edit class details"
      centered
      @ok="modal2Visible = false"
    >
      <template slot="footer">
        <a-button @click="modal2Visible = false">Cancel</a-button>
        <a-button primary @click="submitUpdateSeminar"
          >Confirm changes</a-button
        >
      </template>
      <div>
        <h5>Class title (optional)</h5>
        <a-input v-model="edit_seminar.title" class="input-field" />
        <h5>Class description (optional)</h5>
        <a-textarea v-model="edit_seminar.desc" class="input-field" />
        <h5>Date</h5>
        <a-date-picker
          v-model="edit_seminar.date"
          format="DD/MM/YYYY"
          class="input-field"
        />
      </div>
      <div>
        <h5>Time</h5>
        <div style="display: flex; align-items: center;">
          <a-time-picker
            placeholder="Start"
            class="input-field"
            :minute-step="30"
            use12-hours
            format="h:mm A"
            v-model="edit_seminar.start"
            valueFormat="HH:mm"
          />
          <h5 style="display: inline; margin: 5px;">to</h5>
          <a-time-picker
            placeholder="End"
            class="input-field"
            :minute-step="30"
            use12-hours
            format="h:mm A"
            v-model="edit_seminar.end"
            valueFormat="HH:mm"
          />
        </div>
      </div>
      <div>
        <a-tooltip
          title="Please be aware of social distancing and classroom limitations for F2F courses"
          placement="right"
        >
          <h5>Visitor capacity</h5>
          <a-select
            v-model="edit_seminar.visitor_capacity"
            style="width: 120px;"
          >
            <a-select-option
              v-for="option in visitor_capacity_options"
              :key="option"
              :value="option"
              >{{ option === -1 ? "Unlimited" : option }}</a-select-option
            >
          </a-select>
        </a-tooltip>
      </div>
      <div>
        <h5>Venue</h5>
        <a-select
          v-model="edit_seminar.location_code"
          class="input-field"
          style="width: 100%;"
        >
          <a-select-option
            v-for="location in locations"
            :key="location.code"
            :value="location.code"
            >{{ location.full_name }}</a-select-option
          >
        </a-select>
      </div>
    </a-modal>
  </div>
</template>
<script>
import moment from "moment";
import queries from "@/graphql/queries.gql";
const visitor_capacity_options = [1, 2, 3, 4, 5, 6, -1];
export default {
  name: "updateSeminarModal",
  props: ["seminar"],
  data() {
    return {
      moment,
      visitor_capacity_options,
      locations: [],
      edit_seminar: Object.assign(this.seminar, {
        start: moment(this.seminar.start, "HH:mm:ss"),
        end: moment(this.seminar.end, "HH:mm:ss")
      }),
      modal2Visible: false
    };
  },
  apollo: {
    locations() {
      return {
        query: queries.getLocations,
        update: data => data.location
      };
    }
  },
  methods: {
    async submitUpdateSeminar() {
      const {
        id,
        date,
        start,
        end,
        visitor_capacity,
        location_code,
        title,
        desc
      } = this.edit_seminar;
      try {
        await this.$apollo.mutate({
          mutation: queries.updateSeminar,
          variables: {
            seminar_id: id,
            date,
            start: start.format("HH:mm:ss"),
            end: end.format("HH:mm:ss"),
            visitor_capacity,
            location_code,
            title,
            desc
          },
          refetchQueries: ["get_seminars_by_course_group"]
        });
        this.modal2Visible = false;
      } catch (err) {
        this.modal2Visible = false;
        this.$notification.error({
          key: "update_class_error",
          message: "Failed to update course group description",
          description: "Please try again."
        });
      }
    }
  }
};
</script>
<style scoped>
form {
  width: 50%;
}
.input-field {
  margin-bottom: 10px;
}
.submit-form {
  display: flex;
  justify-content: center;
}
</style>
