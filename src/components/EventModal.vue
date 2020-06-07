<template>
  <div>
    <!--    <b-form @submit="onSubmit" @reset="onReset" v-if="show"> -->
    {{ text }}
    <fieldset>
      <legend>EVENT DETAILS</legend>
      <b>Title:</b>{{ event.title }} <br />
      <b>Start: </b>{{ event.start }} <br />
      <b>End: </b>{{ event.end }} <br />
      <b>ID: </b>{{ event.id }} <br />
    </fieldset>
    <b-form-group label="Select Observation Status Request">
      <b-form-radio v-model="selected" name="some-radios" value="Accepted!"
        >Accept Request</b-form-radio
      >
      <b-form-radio v-model="selected" name="some-radios" value="Declined!"
        >Decline Request</b-form-radio
      >
    </b-form-group>
    <b-button type="submit" variant="primary">Submit</b-button>
    <!-- </b-form>
 -->
    <div class="mt-3">
      Selected: <strong>{{ selected }}</strong>
    </div>
  </div>
</template>

<script>
//import {mapGetters} from "vuex";

export default {
  data: () => ({
    selected: ""
  }),
  props: {
    text: String,
    event: Object
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      alert(JSON.stringify(this.form));
    }
  }
};
</script>

<style scoped></style>
