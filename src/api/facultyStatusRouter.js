const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const gql = require("graphql-tag");
const { createApolloClient } = require("./utility");

const UPDATE_FACULTY_ACTIVE_STATUS = gql`
  mutation update_faculty_active_status(
    $faculty_id: String!
    $active_status: Boolean!
  ) {
    update_faculty(
      where: { id: { _eq: $faculty_id } }
      _set: { is_active: $active_status }
    ) {
      affected_rows
    }
  }
`;

async function handleCreateLink(req, res) {
  const { faculty_id } = req.body;
  const token = jwt.sign({ faculty_id }, process.env.JWT_SECRET);
  return res.send(token);
}

async function handleOptOut(req, res) {
  const token = req.query.token;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const apolloClient = createApolloClient();
    await apolloClient.mutate({
      mutation: UPDATE_FACULTY_ACTIVE_STATUS,
      variables: {
        faculty_id: payload.faculty_id,
        active_status: false
      }
    });
    return res.json({
      success: true,
      message: `User opted out successfully`
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

router.post("/request-link", handleCreateLink);
router.post("/opt-out", handleOptOut);

module.exports = router;
