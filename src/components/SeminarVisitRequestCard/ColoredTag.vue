<template>
  <a-tag :color="tagColor">{{ tag_label }}</a-tag>
</template>

<script>
const tagStyles = [
  {
    tag_labels: ["Common Curriculum", "Intro Class", "Methods Class"],
    backgroundColor: "#85C1E9" // light blue
  }, 
  {
    tag_labels: ["Major Requirement", "Capstone", "Advanced Class"],
    backgroundColor: "#7FB3D5" // dark blue
  },
  {
    tag_labels: ["Chinese Studies", "Anthropology", "Language"],
    backgroundColor: "#F1948A" // pink
  }, 
  {
    tag_labels: [
      "Arts and Humanities",
      "Literature",
      "Psychology",
      "Philosophy",
      "Liberal Arts"
    ],
    backgroundColor: "#BB8FCE" // purple
  },
  {
    tag_labels: ["PPE", "Global Affairs", "Urban Studies", "Social Sciences"],
    backgroundColor: "#73C6B6" // cyan
  },
  {
    tag_labels: ["Global Antiquity", "History", "Historical Immersion"],
    backgroundColor: "#E59866" // brown
  },
  {
    tag_labels: ["MCS", "Physical Sciences", "Economics"],
    backgroundColor: "#F8C471" // orange
  }, 
  {
    tag_labels: [
      "Environmental Studies",
      "Environmental Sciences",
      "Life Sciences"
    ],
    backgroundColor: "#7dcea0" // green
  },
]

export default {
  name: "ColoredTag",
  props: {
    tag_label: {
      type: String,
      default: ""
    },
  },
  data: function() {
    return {};
  },
  computed: {
    tagColor() {
      const tagStyle = tagStyles.find(
        tagStyle =>
          tagStyle.tag_labels.findIndex(label => this.tag_label.includes(label)) !==
          -1
      );
      return tagStyle ? tagStyle.backgroundColor : 'grey';
    }
  }
};
</script>

<style scoped>
.ant-tag {
  font-weight: bold;
  text-transform: uppercase;
  /* font-size: 10px; */
  margin: 0 5px;
  padding: 5px 10px;
}
</style>
