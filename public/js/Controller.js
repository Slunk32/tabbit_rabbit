function Controller(options) {
	this.tabView = options.tabView;
	this.tab = options.tab;
}

Controller.prototype = {
	bindEvents: function () {
		this.tabView.makeItemsEditable();
		this.tabView.makeItemsDraggable();
		this.tabView.hideAddButtonIfNecessary();
		this.makeRabbitsSelectable();
		this.makeItemsSelectable();
		$(this.tabView.addButton).on('click', this.addRabbit.bind(this));
	},

	changeSelectedRabbit: function() {
		// TODO: Refactor the next line into the view
		var rabbitID = $(event.target).parents('.rabbit').attr('id').substring(7);
		this.tabView.changeSelectedRabbitColor(rabbitID);
		this.tab.changeSelectedRabbit(rabbitID);
	},

	toggleItemSelect: function() {
		// TODO: Refactor the next line into the view
		console.log('in your item select');
		if (! this.tab.selectedRabbit) {
			console.log('select a rabbit!');
			return false;
		} else {
			var item = $(event.target);
			if (typeof item.data('id') === 'undefined') {
				item = item.parent();
			}
			console.log(item);
			console.log(item.data('id'));
			var itemID = item.data('id');
			this.tab.selectItem(itemID);
			this.tabView.colorItem(itemID);
		}
	},

	makeRabbitsSelectable: function(index) {
		$(document).on('click', this.tabView.rabbitButton, this.changeSelectedRabbit.bind(this));
	},

	makeItemsSelectable: function(index) {
		$(document).on('click', this.tabView.item, this.toggleItemSelect.bind(this));
	},

	addRabbit: function () {
		event.preventDefault();
		var that = this;
		var rabbit_info = $(this.tabView.formToAddRabbit).serialize();
		// make an ajax request to add the rabbit
		$.ajax({
			url: '/rabbit/new',
			type: 'post',
			data: rabbit_info
		})
		.done(function(res) {
			var rabbit = that.tab.addRabbit(res);
			that.tabView.addRabbit(rabbit);
		})
		.fail(function(err) {
			this.tabView.showAddRabbitErrors(err);
		});
	}
};