const express = require("express");
const router = express.Router();
const gql = require("graphql-tag");
const { createApolloClient, createTransporter } = require("./utility");

const GET_FACULTY_BY_ID = gql`
  query getFacultyById($faculty_id: String!) {
    faculty_by_pk(id: $faculty_id) {
      email
      id
      name
      has_consented
      notif_request_update
    }
  }
`;

const GET_SEMINAR_BY_ID = gql`
  query getSeminarById($seminar_id: Int!) {
    seminar_by_pk(id: $seminar_id) {
      id
      date
      start
      end
      title
      desc
      course_group {
        id
        course {
          id
          module_code
          title
        }
        faculty {
          id
          email
          name
          notif_new_request
        }
      }
    }
  }
`;

async function notifMiddleware(req, res, next) {
  const { seminar_id, visitor_id } = req.body.event.data.new;
  const visit_status_old =
    req.body.event.data.old && req.body.event.data.old.visit_status;
  const visit_status_new = req.body.event.data.new.visit_status;
  try {
    const apolloClient = createApolloClient();
    const visitor = (
      await apolloClient.query({
        query: GET_FACULTY_BY_ID,
        variables: {
          faculty_id: visitor_id
        }
      })
    ).data.faculty_by_pk;
    const seminar = (
      await apolloClient.query({
        query: GET_SEMINAR_BY_ID,
        variables: {
          seminar_id
        }
      })
    ).data.seminar_by_pk;
    const course = seminar.course_group.course;
    const instructor = seminar.course_group.faculty;

    req.visit = {
      visitor,
      seminar,
      course,
      instructor,
      visit_status_old,
      visit_status_new
    };
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

async function newRequestHandler(req, res) {
  const { visitor, seminar, instructor, course } = req.visit;

  if (!instructor.notif_new_request)
    return res.json({
      success: true,
      message: "No email sent because of user preference"
    });

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to:
        process.env.NODE_ENV === "production"
          ? "dantran.fcac@gmail.com" // instructor.email
          : process.env.EMAIL_TO,
      subject: `New visit request to your class`,
      html: `<p>${visitor.name} made a visit request to your class ${course.module_code} ${course.title}, ${seminar.date}.</p>
        <p>Click <a href="https://open-classroom-app-demo.herokuapp.com/my-visitors">here</a> to view it on the OpenClassroom portal.</p>`
    });

    console.log("Email sent: %s", info.messageId);
    return res.json({
      success: true,
      // message: "Email sent successfully"
      message: ""
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

async function requestStatusUpdateHandler(req, res) {
  const {
    visitor,
    seminar,
    course,
    instructor,
    visit_status_old,
    visit_status_new
  } = req.visit;

  if (!visitor.notif_request_update)
    return res.json({
      success: true,
      message: "No email sent because of user preference"
    });

  if (visit_status_old === visit_status_new)
    return res.json({
      success: true,
      message: "No changes to notify"
    });

  const visitStatusMsg =
    visit_status_new === "PENDING"
      ? `<p>your visit request to class ${course.module_code} ${course.title}, ${seminar.date}, is pending.`
      : `<p>${instructor.name} has ${visit_status_new} your visit request to class ${course.module_code} ${course.title}, ${seminar.date}.</p>`;
  const linkToPortal = `<p>Click <a href="https://open-classroom-app-demo.herokuapp.com/my-visits">here</a> to view your visit on the OpenClassroom portal.</p>`;

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to:
        process.env.NODE_ENV === "production"
          ? "dantran.fcac@gmail.com" // visitor.email
          : process.env.EMAIL_TO,
      subject: `Your visit request is ${visit_status_new}`,
      html: visitStatusMsg + linkToPortal
    });

    console.log("Email sent: %s", info.messageId);
    return res.json({
      success: true,
      message: "Email sent successfully"
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

async function requestCancelHandler(req, res) {
  const { visitor, seminar, course, instructor } = req.visit;

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to:
        process.env.NODE_ENV === "production"
          ? "dantran.fcac@gmail.com" // instructor.email
          : process.env.EMAIL_TO,
      subject: `A visit request to your class is cancelled`,
      html: `<p>${visitor.name} has cancelled the request to visit your class ${course.module_code} ${course.title}, ${seminar.date}.</p>
        <p>Click <a href="https://open-classroom-app-demo.herokuapp.com/my-visitors">here</a> to view it on the OpenClassroom portal.</p>`
    });

    console.log("Email sent: %s", info.messageId);
    return res.json({
      success: true,
      message: "Email sent successfully"
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

router.use("/", notifMiddleware)
router.post("/new-request", newRequestHandler);
router.post("/request-status-update", requestStatusUpdateHandler);
router.post("/request-cancel", requestCancelHandler)

module.exports = router;
