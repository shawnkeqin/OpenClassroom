const express = require("express");
const router = express.Router();
const gql = require("graphql-tag");
const { createApolloClient } = require("./utility");

const UPDATE_COURSE_DESC = gql`
  mutation update_course_desc($module_code: String!, $desc: String!) {
    update_course(
      where: {
        module_code: { _eq: $module_code }
        semester_code: { _eq: "AY2021-1" }
      }
      _set: { desc: $desc }
    ) {
      affected_rows
    }
  }
`;

async function handleUpdateCourseDesc(req, res) {
  const courses = req.body.courses;
  try {
    const apolloClient = createApolloClient();
    await Promise.all(
      courses.map(async course => {
        await apolloClient.mutate({
          mutation: UPDATE_COURSE_DESC,
          variables: {
            module_code: course.code,
            desc: course.description
          }
        });
      })
    );
    return res.json({
      success: true,
      message: "Course descriptions updated successfully"
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

router.use("/", handleUpdateCourseDesc);

module.exports = router;
