const state = {
  courses: [
    {
      id: 1,
      title: "Literature and Humanities 1",
      instructor: "HUI, ANDREW YEUNG BUN",
      day: "Mon",
      group: "L1",
      location: "Y-CR1",
      group_size: "17"
    },
    {
      id: 2,
      title: "Literature and Humanities 2",
      instructor: "HUI, ANDREW YEUNG BUN",
      day: "Thu",
      group: "L1",
      location: "Y-CR4",
      group_size: "17"
    }
  ]
};

const getters = {
  allMyCourses: state => state.courses
};

const actions = {};

const mutations = {};

export default {
  state,
  getters,
  actions,
  mutations
};
