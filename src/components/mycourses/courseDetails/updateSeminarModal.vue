<template>
  <div>
    <a-button type="danger" @click="modal2Visible = true">
      Update class
    </a-button>
    <a-modal
      v-model="modal2Visible"
      title="Update class"
      centered
      @ok="modal2Visible = false"
    >
      <template slot="footer">
        <a-button @click="modal2Visible = false">
          Cancel
        </a-button>
        <a-button primary @click="submitUpdateSeminar">
          Confirm changes
        </a-button>
      </template>
      <div>
        <h5>Date</h5>
        <a-date-picker
          v-model="edit_seminar.date"
          format="DD/MM/YYYY"
          class="input-field"
        />
      </div>
      <div>
        <a-col :span="18">
          <h5>Time</h5>
          <div style="display: flex; align-items: center;">
            <a-time-picker
              :value="moment(edit_seminar.start, 'HH:mm:ss')"
              format="HH:mm"
              placeholder="Start"
              class="input-field"
            />
            <h5 style="display: inline; margin: 5px;">to</h5>
            <a-time-picker
              :value="moment(edit_seminar.end, 'HH:mm:ss')"
              format="HH:mm"
              placeholder="End"
              class="input-field"
            />
          </div>
        </a-col>
        <a-col>
          <h5>Visitor capacity</h5>
          <a-input-number
            v-model="edit_seminar.visitor_capacity"
            class="input-field"
          />
        </a-col>
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
          >
            {{ location.full_name }}
          </a-select-option>
        </a-select>
        <h5>Seminar title (optional)</h5>
        <a-input v-model="edit_seminar.title" class="input-field" />
        <h5>Seminar description (optional)</h5>
        <a-textarea v-model="edit_seminar.desc" class="input-field" />
      </div>
    </a-modal>
  </div>
</template>
<script>
import moment from "moment";
import queries from "@/graphql/queries.gql";
export default {
  name: "updateSeminarModal",
  props: ["seminar"],
  data() {
    return {
      moment,
      locations: [],
      edit_seminar: this.seminar,
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
      await this.$apollo.mutate({
        mutation: queries.updateSeminar,
        variables: {
          seminar_id: id,
          date,
          start,
          end,
          visitor_capacity,
          location_code,
          title,
          desc
        },
        refetchQueries: ["get_seminars_by_course_group"]
      });
      this.modal2Visible = false;
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
