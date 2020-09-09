<template>
  <div>
    <a-button @click="consentModalVisible = true">View consent form</a-button>
    <a-modal v-model="consentModalVisible" width="80vw" :footer="null">
      <h2>ONLINE PARTICIPANT INFORMATION SHEET</h2>
      <p>(Study: The open classroom app)</p>
      <p>
        If you teach at Yale-NUS, we would like to inform you that some of the
        data usage and feedback will be used by the team for further research.
        By using the app, you will be consenting to participate in this study.
        Before you decide, please go through this information to understand what
        the research entails.
      </p>
      <h4>What will participation entail?</h4>
      <p>
        We are beta-testing a web-based application to help faculty find and
        book classes to visit. We will collect data on basic app usage (e.g.
        what functions you use), and feedback on the app.
      </p>
      <h4>Privacy</h4>
      <p>
        We take your privacy very seriously and have built in safeguards to make
        sure your data stays safe. All user data will be securely stored and
        usage data will be de-identified at the earliest possible stage and
        aggregated only for analytics purposes. Any feedback submitted to the
        app will also be de-identified and anonymized. All data will be saved on
        a private, secure server accessed only by the research team, and
        responses will only be used for research purposes.
      </p>
      <h4>Risks, benefits, and reimbursement</h4>
      <p>
        There are no known risks in your participation in this study, nor any
        direct benefit to you. However, the information garnered will help
        address important questions about app utility.
      </p>
      <h4>Withdrawal of consent</h4>
      <p>
        Your participation in this study is voluntary, and you are free to
        withdraw your consent and discontinue participation at any time by
        opting out as a user of the Open Classroom app. All information obtained
        from you will be kept confidential.
      </p>
      <h4>Contact details</h4>
      <p>
        If you have any concerns or questions about any aspect of this study,
        you may email one of the researchers: Mira Seo
        (mira.seo@yale-nus.edu.sg), Matthew Stamps
        (matt.stamps@yale-nus.edu.sg), or Jean Liu (jeanliu@yale-nus.edu.sg).
      </p>
      <p>
        For an independent opinion regarding the research and rights of research
        participants, you may contact a staff of the National University of
        Singapore Institutional Review Board (Dr Chan Tuck Wai, tel: +65 6516
        1234 or email: irb@nus.edu.sg).
      </p>
      <h2>ONLINE CONSENT FORM</h2>
      <ol>
        <li>
          I confirm that I have read and understood the Participant Information
          Sheet for the above study.
        </li>
        <li>
          I understand that all personal information will remain confidential
          and that all efforts will be made to ensure I cannot be identified.
        </li>
        <li>
          I agree that data gathered in this study will be stored anonymously
          and securely, and may be used for future related research studies that
          will be subject to an Institutional Review Board's approval.
        </li>
        <li>
          I understand that my participation in voluntary and that I am free to
          withdraw at any time without giving a reason (by closing the browser).
        </li>
      </ol>
      <a-checkbox
        :checked="consentChecked"
        @change="consentChecked = !consentChecked"
        style="margin-right: 5px;"
      />
      <h4 @click="consentChecked = !consentChecked" id="checkbox-desc">
        Please tick here to indicate that you understand the above clauses and
        agree to participate.
      </h4>
      <div style="display: flex; justify-content: center; margin-top: 20px;">
        <a-button
          :disabled="!consentChecked"
          key="submit"
          @click="handleSubmitConsent"
          type="primary"
          block
          style="width: 50%;"
        >
          Submit
        </a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import constants from "../utils/constants";
import queries from "../graphql/queries.gql";
import store from "@/store";
export default {
  name: "ConsentForm",
  data() {
    return {
      constants: constants,
      queries: queries,
      loggedInUser: {},
      consentModalVisible: false,
      consentChecked: false
    };
  },
  apollo: {
    loggedInUser: {
      query: queries.getFacultyById,
      variables() {
        return {
          faculty_id: store.state.loggedInUser
        };
      },
      update: data => data.faculty_by_pk
    }
  },
  methods: {
    async handleSubmitConsent() {
      try {
        await this.$apollo.mutate({
          mutation: queries.update_faculty_consent,
          variables: {
            faculty_id: this.loggedInUser.id,
            has_consented: true
          },
          refetchQueries: ["getFacultyById"]
        });
      } catch (err) {
        this.$notification.error({
          key: "consent_failure",
          message: "Failed to update your consent",
          description: err.toString()
        });
      }
      this.consentModalVisible = false;
    },
    handleCloseConsentModal() {
      this.consentChecked = false;
      this.consentModalVisible = false;
    }
  }
};
</script>
<style>
li {
  font-size: 16px;
  font-family: "Lato", sans-serif;
  color: rgba(0, 0, 0, 0.87);
}
.a-checkbox {
  font-size: 16px;
  font-family: "Lato", sans-serif;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.87);
}
#checkbox-desc {
  display: inline;
}
#checkbox-desc:hover {
  cursor: pointer;
}
</style>
