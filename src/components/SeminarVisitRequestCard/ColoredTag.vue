<template>
  <a-tag v-if="course" :color="tagColor"
    >{{ tag_label
    }}<a-icon type="close" class="close-icon" @click="handleRemoveTag"
  /></a-tag>
  <a-tag v-else :color="tagColor">{{ tag_label }}</a-tag>
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
  }
];
import queries from "@/graphql/queries.gql";
export default {
  name: "ColoredTag",
  props: {
    tag_label: {
      type: String,
      default: ""
    },
    course: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    async handleRemoveTag() {
      if (!this.course) {
        return;
      }
      this.loading = true;
      try {
        await this.$apollo.mutate({
          mutation: queries.removeTagFromCourse,
          variables: {
            tag_label: this.tag_label,
            course_id: this.course.id
          },
          refetchQueries: ["get_course_group_details"]
        });
        this.loading = false;
        this.$notification.success({
          key: "removeTag success",
          message: "Removed tag."
        });
      } catch (err) {
        this.loading = false;
        this.$notification.error({
          key: "removeTag error",
          message: `Failed to remove tag from your course.`,
          description: err
        });
      }
    }
  },
  computed: {
    tagColor() {
      const tagStyle = tagStyles.find(
        tagStyle =>
          tagStyle.tag_labels.findIndex(label =>
            this.tag_label.includes(label)
          ) !== -1
      );
      return tagStyle ? tagStyle.backgroundColor : "grey";
    }
  }
};
</script>

<style scoped>
.ant-tag {
  font-weight: bold;
  text-transform: uppercase;
  padding: 5px 10px;
}
.close-icon {
  font-size: 13px;
  bottom: 0.2em;
  position: relative;
  padding-left: 5px;
}
</style>
