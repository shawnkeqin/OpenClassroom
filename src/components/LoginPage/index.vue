<template>
  <div>
    <a-form
      v-if="!isAuthenticated"
      id="components-form-demo-normal-login"
      :form="form"
      class="login-form"
      @submit="handleLoginEvent"
    >
      <a-form-item>
        <a-input
          v-decorator="[
            'userName',
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
        <a class="login-form-forgot" href="">
          Forgot password
        </a>
        <a-button
          type="primary"
          html-type="submit"
          class="login-form-button"
          @click.prevent="login"
        >
          Log in
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
    // this.$auth.renewTokens();
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
        window.location.href = "http://localhost:8080/#/profile";
      });
    },
    login() {
      this.$auth.login();
      // this.$router.push({ path: "/" });
    },
    logout() {
      this.$auth.logOut();
      //   this.$router.push({ path: "/login" });
    },
    handleLoginEvent(data) {
      this.isAuthenticated = data.loggedIn;
      this.profile = data.profile;
    }
  },
  data() {
    return {
      isAuthenticated: false,
      profile: {}
    };
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
