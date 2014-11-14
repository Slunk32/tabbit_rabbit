var next_num = 0;

var addRow = function() {
	event.preventDefault();
	row = $('.item_input_cell').last();
	var new_row = row.clone();
	if (next_num === 0) {
		var last_num = parseInt(row.data('id'));
		next_num = last_num + 1;
	} else {
		next_num++;
	}
	$(new_row.find('input').get(0)).attr('name','item_'+ next_num + '[quantity]');
	$(new_row.find('input').get(1)).attr('name','item_'+ next_num + '[name]');
	$(new_row.find('input').get(1)).attr('placeholder','Item #'+ next_num);
	$(new_row.find('input').get(2)).attr('name','item_'+ next_num + '[price]');
	row.after(new_row);
};

// <div class="row">
//   <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3">
//     <input type="text" class="form-control text-right" placeholder="1" value="1" name="item_<%= index %>[quantity]" />
//   </div>
//   <div class="col-lg-9 col-md-9 col-sm-8 col-xs-6">
//     <input type="text" class="form-control" placeholder="Item #<%= index %>" value="" name="item_<%= index %>[name]" />
//   </div>
//   <div class="col-lg-2 col-md-2 col-sm-2 col-xs-3">
//     <input type="text" class="form-control" pattern="\d+(\.\d{2})?" placeholder="0.00" value="" name="item_<%= index %>[price]" />
//   </div>
// </div>

$(document).ready(function() {
  if($('#save_tab').length) {
    var parameters = {	tab: new Tab({id: $('.tab_name').data('id') }),
  										tabView: new TabView()
  									};
    var controller = new Controller(parameters);
    controller.updateTab();
    controller.bindEvents();
  } else if ($('#more_fields').length) {
  	 $('#more_fields').on('click',addRow.bind(this));
  }
});
