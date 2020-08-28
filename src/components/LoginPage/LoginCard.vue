<template>
  <a-card :bodyStyle="{ width: '20rem', padding: '40px' }">
    <h2>Log in</h2>
    <h5>Continue to Open Classroom with your Yale-NUS Staff ID</h5>
    <a-form
      layout="horizontal"
      id="components-form-demo-normal-login"
      :form="form"
    >
      <a-form-item label="Username">
        <a-input
          v-decorator="[
            'username',
            {
              rules: [
                { required: true, message: 'Please input your username!' }
              ]
            }
          ]"
          placeholder="Yale-NUS Staff ID, e.g. YNCXXX"
        >
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item label="Password">
        <a-input
          v-decorator="[
            'password',
            {
              rules: [
                { required: true, message: 'Please input your Password!' }
              ]
            }
          ]"
          type="password"
          placeholder="Password"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item
        style="display: flex; justify-content: flex-end; margin-top: 12px;"
      >
        <!-- <a class="login-form-forgot" href="">
        Forgot password
      </a> -->
        <a-alert
          v-if="showInvalidCredentials"
          :message="invalidCredentialsMessage"
          type="error"
          show-icon
        />
        <a-button
          type="primary"
          html-type="submit"
          :loading="loading"
          @click.prevent="login"
          style="width: 8rem;"
        >
          Next
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import auth from "@/auth";
export default {
  name: "LoginCard",
  data() {
    return {
      form: this.$form.createForm(this, { name: "form" }),
      loading: false,
      showInvalidCredentials: false,
      invalidCredentialsMessage: ""
    };
  },
  methods: {
    login() {
      this.form.validateFields((err, values) => {
        if (err) {
          return;
        }
        this.loading = true;
        auth
          .handleAuthentication(values.username, values.password)
          .then(resp => {
            if (resp.data.success == true) {
              this.showInvalidCredentials = false;
              this.$router.push({ path: "/" });
            } else {
              this.invalidCredentialsMessage = resp.data.message;
              this.showInvalidCredentials = true;
            }
          })
          .catch(err => {
            // this.$message.info(err.message);
            this.$notification.error({
              key: "login_error",
              message: "Error: " + err.response.message,
              description: "Please try again."
            });
          })
          .finally(() => {
            this.loading = false;
          });
      });
    }
  }
};
</script>
<style>
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login {
  width: 100%;
}
.ant-form-item-label {
  height: 32px;
}
.ant-row.ant-form-item {
  margin-bottom: 0;
}
</style>
