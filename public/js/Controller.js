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
		$(this.tabView.saveRabbit).on('click', this.addRabbit.bind(this));
	},

	changeSelectedRabbit: function() {
		// TODO: Refactor the next line into the view
		var rabbitID = $(event.target).parents('.rabbit').attr('id').substring(7);
		this.tabView.changeSelectedRabbitColor(rabbitID);
		this.tab.changeSelectedRabbit(rabbitID);
	},

	toggleItemSelect: function() {
		// TODO: Refactor the next line into the view
		if (! this.tab.selectedRabbit) {
			console.log('no rabbit selected')
			return false;
		} else {
			var item = $(event.target);
			if (typeof item.data('id') === 'undefined') {
				item = item.parent();
			}
			var itemID = item.data('id');
			var itemObj = this.tab.selectItem(itemID);
			this.tabView.colorItem({'itemID': itemID, 'itemObj': itemObj});
			this.tabView.updateSubtotals(this.tab.rabbits);
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
			url: '/tab/' + that.tab.id + '/rabbit/new',
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
	},

	updateTab: function() {
		// give the tab its info including all rabbits, items, and items that belong to rabbits
		var that = this;
		$.ajax({
			url: '/tab/' + this.tab.id,
			type: 'get',
			data: {}
		})
		.done( function(res) {
			if (that.tab.parseData(res)) {
			} else {
			}
		})
	}
};
