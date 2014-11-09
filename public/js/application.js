$(document).ready(function() {
  // This is called after the document has loaded in its entirety
  // This guarantees that any elements we bind to will exist on the page
  // when we try to bind to them

  // See: http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
  var parameters = {	tab: new Tab({}),
  										tabView: new TabView()
  									};
  var controller = new Controller(parameters);
  controller.bindEvents();
});
