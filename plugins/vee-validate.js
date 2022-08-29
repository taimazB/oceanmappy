import Vue from "vue";
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import {
  required,
  email,
  confirmed
} from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "{_field_} can not be empty"
});
extend("email", {
  ...email,
  message: "Email must be valid"
});
extend("confirmed", {
  ...confirmed,
  message: "Passwords do not match"
});
extend("minPass", {
  validate(value) {
    return value.length >= 6;
  },
  message: "{_field_} must be at least 6 characters"
});
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
