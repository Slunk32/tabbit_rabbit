$(document).ready(function() {
  if($('#save_tab').length) {
    var parameters = {	tab: new Tab({id: $('.tab_name').data('id') }),
  										tabView: new TabView()
  									};
    var controller = new Controller(parameters);
    controller.updateTab();
    controller.bindEvents();
  }
});
