<template>
  <div>
    {{ text }}
    <fieldset>
      <legend>EVENT DETAILS</legend>
      <b>Title:</b>{{ event.title }} <br />
      <b>Start: </b>{{ event.start }} <br />
      <b>End: </b>{{ event.end }} <br />
      <b>ID: </b>{{ event.id }} <br />
    </fieldset>

    <fieldset>
      <b-form-group label="Select Observation Status Request">
        <b-form-radio v-model="selected" name="some-radios" value="Accepted!"
          >Accept Request</b-form-radio
        >
        <b-form-radio v-model="selected" name="some-radios" value="Declined!"
          >Decline Request</b-form-radio
        >
      </b-form-group>

      <div class="mt-3">
        Selected: <strong>{{ selected }}</strong>
      </div>

      <button @click.prevent="getFormValues()">Get values</button>
    </fieldset>
  </div>
</template>

<script>
//import {mapGetters} from "vuex";
export default {
  name: "calendarSeminarModal",
  data: () => ({
    selected: ""
  }),
  props: {
    text: String,
    event: Object
  },
  methods: {
    getFormValues() {
      this.output = this.$refs.my_input.value;
    }
  }
};
</script>

<style scoped></style>
