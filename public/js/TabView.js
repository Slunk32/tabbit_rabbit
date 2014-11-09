function TabView() {
	this.item = '.tab_item';
	this.addButton = '.add_user';
	this.formToAddRabbit = '#add_rabbit';
	this.addModal = '#addModal';
	this.rabbit = '.rabbit';
	this.rabbits = '.rabbits-list';
}

TabView.prototype = {
	makeItemsDraggable: function () {
		$(document).on('dragstart', this.item, this.handleDragStart);
		$(document).on('dragenter', this.item, this.handleDragEnter);
		$(document).on('dragover', this.item, this.handleDragOver);
		$(document).on('dragleave', this.item, this.handleDragLeave);
		$(document).on('drop', this.item, this.handleDrop);
		$(document).on('dragend', this.item, this.handleDragEnd);
	},

	handleDragStart: function(event) {
	  $(this).css('opacity','0.4');
	  dragSrcEl = this;
	  event.originalEvent.dataTransfer.effectAllowed = 'move';
	  event.originalEvent.dataTransfer.setData('text/html', this.innerHTML);
	},

	handleDragOver: function(event) {
	  if (event.preventDefault) {
	    event.preventDefault();
	  }
	  event.originalEvent.dataTransfer.dropEffect = 'move';
	  return false;
	},

	handleDragEnter: function(event) {
	  $(this).addClass('over');
	},

	handleDragLeave: function(event) {
	  $(this).removeClass('over');
	},

	handleDrop: function(event) {
	  if (event.stopPropogation){
	    event.stopPropogation();
	  }
	  // Don't do anything if dropping the same column we're dragging.
	  if (dragSrcEl != this) {
	      // Set the source column's HTML to the HTML of the column we dropped on.
	      dragSrcEl.innerHTML = this.innerHTML;
	      this.innerHTML = event.originalEvent.dataTransfer.getData('text/html');
	  }
	  return false;
	},

	handleDragEnd: function(event) {
	  $(this.item).removeClass('over');
	  $(this).css('opacity','1');
	},

	hideAddModal: function() {
		$(this.addModal).modal('hide');
	},

	addRabbit: function(rabbitObj) {
		this.hideAddModal();
		var newRabbit = $(this.rabbit).first().clone();
		newRabbit.attr('id','rabbit_' + rabbitObj.id);
		newRabbit.find('.rabbit_subtotal').text('$' + rabbitObj.subtotal.toFixed(2));
		newRabbit.find('.rabbit_name').text(rabbitObj.name);
		newRabbit.children('button').removeClass('btn-success').addClass('btn-danger');
		newRabbit.find('.remove_rabbit').attr('href','/rabbit/' + rabbitObj.id + '/delete');
		newRabbit.appendTo(this.rabbits);
		// <div class="btn-group dropup rabbit" id="rabbit_<%= rabbit.id %>">
		// 	<button type="button" class="btn btn-success"><%= rabbit.name %></button>
		// 	<button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown">
		// 		<span class="caret"></span>
		// 		<span class="sr-only">Toggle Dropdown</span>
		// 	</button>
		// 	<ul class="dropdown-menu" role="menu">
		// 		<li><a class="remove_rabbit" href="/rabbit/<%= rabbit.id %>/delete">Remove</a></li>
		// 	</ul>
		// </div>
		// $('')

	},

	showAddRabbitErrors: function(errors) {

	}
};