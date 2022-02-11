import ui from '../commons/ui';
import Vue from 'vue';
import App from './App/App.vue';
import { Button, Checkbox, Col, Input, Layout, message, notification, Row, Table, Tooltip } from 'ant-design-vue';

Vue.use(Button);
Vue.use(Checkbox);
Vue.use(Col);
Vue.use(Input);
Vue.use(Layout);
Vue.use(Row);
Vue.use(Table);
Vue.use(Tooltip);

Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$ui = ui;
Vue.config.productionTip = false;

document.title = ui.get('extName');

new Vue({
  el: '#index-app',
  components: {
    App,
  },
  render(h) {
    return h(App);
  },
});
