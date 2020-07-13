<template>
  <div class="page">
    <a-card class="login-card">
      <div class="login-title">
        <h2>Open Classroom App</h2>
      </div>
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
            placeholder="NUS Staff ID"
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
        <a-form-item>
          <!-- <a class="login-form-forgot" href="">
          Forgot password
        </a> -->
          <a-button
            type="primary"
            html-type="submit"
            class="login-form-button"
            :loading="loading"
            @click.prevent="login"
          >
            Log in
          </a-button>
          <a-alert
            v-if="invalidCredentials"
            message="Invalid username and/or password."
            type="error"
            show-icon
          />
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import auth from "@/auth";
export default {
  name: "Login",
  // beforeCreate() {
  //   // this.form = this.$form.createForm(this, { name: "normal_login" });
  //   // this.$auth.renewTok;ens();;
  // },
  data() {
    return {
      form: this.$form.createForm(this, { name: "form" }),
      loading: false,
      invalidCredentials: false
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
              this.invalidCredentials = false;
              this.$router.push({ path: "/" });
            } else {
              this.invalidCredentials = true;
            }
            this.$emit("login-event");
          })
          .catch(err => {
            console.log("here", err);
            if (err.response.status == 401) {
              this.invalidCredentials = true;
            } else {
              this.$message.info(err.message);
            }
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
#components-form-demo-normal-login .login-form {
  /* max-width: 50px; */
  /* width: 40%; */
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
.login-card {
  box-shadow: 0 0 15px 10px rgb(0, 0, 0, 20%);
  width: 40%;
}
.login-title {
  text-align: center;
}
.page {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: white;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
