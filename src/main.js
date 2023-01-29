import { createApp } from "vue";
import { createPinia } from "pinia";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faShower,
  faCouch,
  faKitchenSet,
  faHouse,
  faStopwatch,
  faSquareCheck,
  faRefresh,
  faPlusCircle,
  faUserPlus,
  faBars,
  faMessage,
  faPaperPlane,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
library.add(
  faShower,
  faCouch,
  faKitchenSet,
  faHouse,
  faRefresh,
  faStopwatch,
  faBars,
  faSquareCheck,
  faPlusCircle,
  faUserPlus,
  faMessage,
  faPaperPlane,
  faUser
);

const app = createApp(App).use(createPinia()).use(router).use(Vue3ColorPicker);

app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
