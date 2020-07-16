const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const gql = require("graphql-tag");
const { createApolloClient, createTransporter } = require("./utility");

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
}`;

async function handleCreateLink(req, res) {
  const { faculty_id } = req.body;
  const token = jwt.sign({ faculty_id }, process.env.JWT_SECRET);
  // const transporter = createTransporter();
  // const info = await transporter.sendMail({
  //   from: process.env.EMAIL,
  //   to:
  //     process.env.NODE_ENV === "production"
  //       ? "dantran.fcac@gmail.com"
  //       : process.env.EMAIL_TO,
  //   subject: `Your visit request is ${visit_status_new}`,
  //   html: `<p></p>`
  // });
  return res.send(token);
}

async function updateFacultyActiveStatus(req, res, options) {
  const token = req.query.token;
  // console.log(token);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);
    const apolloClient = createApolloClient();
    await apolloClient.mutate({
      mutation: UPDATE_FACULTY_ACTIVE_STATUS,
      variables: {
        faculty_id: payload.faculty_id,
        active_status: options.active_status
      }
    });
    return res.json({
      success: true,
      message: `User opted ${option.active_status ? 'in' : 'out'} successfully`
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

const handleOptIn = (req, res) => updateFacultyActiveStatus(req, res, {active_status: true});
const handleOptOut = (req, res) => updateFacultyActiveStatus(req, res, {active_status: false});

router.post('/get-link', handleCreateLink)
router.post('/opt-in', handleOptIn)
router.post('/opt-out', handleOptOut)

module.exports = router;
