// import Vue from "vue";
// import Vuex from "vuex";
// import axios from "axios";
// import gql from "graphql-tag";
// import { apolloClient } from "../vue-apollo";

// Vue.use(Vuex);

// const store = new Vuex.Store({
//   state: {
//     events: [],
//     title: "My custom title",
//     profile: {
//       name: "Mira Seo",
//       id: "yncsjm",
//       email: "yncsjm@nus.edu.sg"
//     },
//     message: "Course Details",
//     seminars: []
//   },
//   getters: {
//     EVENTS: state => state.events,
//     allSeminars: state => state.seminars
//   },
//   mutations: {
//     ADD_EVENT: (state, event) => {
//       state.events.push(event);
//     },
//     updateMessage(state, message) {
//       state.obj.message = message;
//     },
//     setSeminars: (state, seminars) => (state.seminars = seminars),
//     newSeminar: (state, seminar) => state.seminars.unshift(seminar),
//     removeSeminar: (state, id) =>
//       (state.seminars = state.seminars.filter(seminar => seminar.id !== id)),
//     updateSeminar: (state, updSeminar) => {
//       const index = state.seminars.findIndex(
//         seminar => seminar.id === updSeminar.id
//       );
//       if (index !== -1) {
//         state.seminars.splice(index, 1, updSeminar);
//       }
//     }
//   },
//   actions: {
//     async fetchSeminars({ commit }) {
//       const response = await apolloClient.query({
//         query: gql`
//           query getSeminars {
//             seminartest {
//               course_title
//               seminar_id
//               location
//               id
//               archived
//               start
//               end
//               date
//             }
//           }
//         `
//       });
//       // currently commit seminartest field for testing only
//       commit("setSeminars", response.data.seminartest);
//     },
//     async addSeminar({ commit }, title) {
//       const response = await axios.post(
//         "https://jsonplaceholder.typicode.com/todos",
//         { title, completed: false }
//       );
//       commit("newSeminar", response.data);
//     },
//     async deleteSeminar({ commit }, id) {
//       await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);

//       commit("removeSeminar", id);
//     },
//     async updateSeminar({ commit }, updSeminar) {
//       const response = await axios.put(
//         `https://jsonplaceholder.typicode.com/todos/${updSeminar.id}`,
//         updSeminar
//       );
//       commit("updateSeminar", response.data);
//     }
//   }
// });

// export default store;
