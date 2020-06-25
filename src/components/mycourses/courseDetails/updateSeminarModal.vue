<template>
  <div>
    <a-button type="dashed" @click="modal2Visible = true">
      Update Seminar
    </a-button>
    <a-modal
      v-model="modal2Visible"
      title="Update Seminar"
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
      <!-- <div class="submit-form">
        <form @submit.prevent="submit">
          <fieldset>
            <input type="number" placeholder="id" v-model="id" />
            <input
              type="text"
              placeholder="Course Title"
              v-model="course_title"
            />
            <input type="text" placeholder="Seminar ID" v-model="seminar_id" />
            <input type="number" placeholder="id" v-model="id" />
            <input type="text" placeholder="Location" v-model="location" />
            <input type="date" placeholder="Date" v-model="date" />
            <input type="time" placeholder="Start Time" v-model="start" />
            <input type="time" placeholder="End Time" v-model="end" />
          </fieldset>
          <input class="button-primary" type="submit" value="Send" />
        </form>
      </div> -->
    </a-modal>
  </div>
</template>
<script>
import moment from "moment";
import queries from "@/graphql/queries.gql";
// import queries from "@/graphql/queries.gql";
// import gql from "graphql-tag";
//import { InMemoryCache } from "apollo-cache-inmemory";
// const UPDATE_SEMINAR = gql`
//   mutation update_seminar($id: Int!, $location: String!) {
//     update_seminartest(
//       where: { id: { _eq: $id } }
//       _set: { location: $location }
//     ) {
//       affected_rows
//     }
//   }
// `;
// const GET_MY_SEMINARS = gql`
//   query findSeminar {
//     seminartest(limit: 3) {
//       course_title
//       seminar_id
//       date
//       end
//       location
//       start
//     }
//   }
// `;
export default {
  name: "updateSeminarModal",
  props: ["seminar"],
  data() {
    return {
      moment,
      locations: [],
      // id: "",
      // location: "",
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
    // submit() {
    // const { id, location } = this.$data;
    // this.$apollo.mutate({
    //   mutation: UPDATE_SEMINAR,
    //   variables: {
    //     id,
    //     location
    //   },
    //   update: (store, { data: { update_seminartest } }) => {
    //     if (update_seminartest.affected_rows) {
    //       if (this.type === "private") {
    //         const data = store.readQuery({
    //           query: GET_MY_SEMINARS
    //         });
    //         const updateSeminar = data.id.find(t => t.id === data.id);
    //         updateSeminar.location = data.location;
    //         store.writeQuery({
    //           query: GET_MY_SEMINARS,
    //           data
    //         });
    //       }
    //     }
    //   },
    //   refetchQueries: ["findSeminar"]
    // });
    // this.id = "";
    // this.location = "";
    // }
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
