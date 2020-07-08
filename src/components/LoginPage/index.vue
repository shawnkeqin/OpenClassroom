<template>
  <div>
    <a-form
      id="components-form-demo-normal-login"
      :form="form"
      class="login-form"
    >
      <a-form-item>
        <a-input
          v-decorator="[
            'username',
            {
              rules: [
                { required: true, message: 'Please input your username!' }
              ]
            }
          ]"
          placeholder="Username"
        >
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
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
          message="Invalid username and/or password."
          type="error"
          show-icon
        />
      </a-form-item>
    </a-form>
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
    // handleLoginEvent(data) {
    // this.$router.push("/");
    //window.location.href = data.state.target || "/";
    // },
    // handleSubmit(e) {
    //   e.preventDefault();
    //   this.form.validateFields((err, values) => {
    //     if (!err) {
    //       console.log("Received values of form: ", values);
    //     }
    //     window.location.href = "http://localhost:8080/#/profile";
    //   });
    // },
    login() {
      this.form.validateFields((err, values) => {
        if (err) {
          // console.log("Form err:", values);
        }
        this.loading = true;
        auth
          .handleAuthentication(values.username, values.password)
          .then(resp => {
            if (resp.data.success) {
              setTimeout(() => {
                this.loading = false;
                this.invalidCredentials = false;
                this.$router.push({ path: "/" });
              }, 1000);
            } else {
              this.loading = false;
              this.invalidCredentials = true;
            }
          })
          .catch();
      });
    },
    logout() {
      // this.$auth.logOut();
      //   this.$router.push({ path: "/login" });
    }
  }
};
</script>
<style>
#components-form-demo-normal-login .login-form {
  max-width: 50px;
  width: 40%;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
