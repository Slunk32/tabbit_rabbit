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
		$(this.tabView.formToAddExisting).on('submit', this.addExistingRabbit.bind(this));
		$(document).on('click', this.tabView.removeRabbit, this.removeRabbit.bind(this));
		$(this.tabView.saveForm).on('submit',this.saveTab.bind(this));
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
			console.log('no rabbit selected');
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

	addExistingRabbit: function () {
		event.preventDefault();
		var that = this;
		var rabbit_info = $(this.tabView.formToAddExisting).serialize();
		$.ajax({
			url: '/tab/' + that.tab.id + '/rabbit',
			type: 'put',
			data: rabbit_info
		})
		.done(function(res) {
			var rabbit = that.tab.addRabbit(res);
			that.tabView.addRabbit(rabbit);
			that.tabView.removeRabbitFromExistingSelect(rabbit.id);
		})
		.fail(function(err) {
			this.tabView.showAddRabbitErrors(err);
		});
	},

	removeRabbit: function () {
		event.preventDefault();
		var that = this;
		var rabbitNode = $(event.target).parents('.rabbit');
		var rabbitID = rabbitNode.attr('id').substring(7);
		$.ajax({
			url: '/tab/' + that.tab.id + '/rabbit/' + rabbitID,
			type: 'delete',
			data: {}
		})
		.done(function(res) {
			that.tab.removeRabbit(res.id);
			that.tabView.removeRabbitNode(res.id);
			that.tabView.addRabbitToExistingSelect(res.name, res.id);
			// var rabbitColor = 
			// for (var i=0; i < that.items.length; i++) {
			// 	that.tabView.removeColor(rabbitColor, that.items[i]);
			// }
			that.tabView.updateSubtotals(that.tab.rabbits);
		})
		.fail(function(err) {
			console.log(err);
		});
	},

	updateTab: function() {
		// give the tab its info including all rabbits, items, and items that belong to rabbits
		var that = this;
		$.ajaxSetup({ cache: false });
		$.ajax({
			url: '/tab/' + that.tab.id,
			type: 'get',
			data: {}
		})
		.done( function(res) {
			if (that.tab.parseData(res)) {
				that.colorItems();
			} else {
				console.log("local instance doesn't have server state");
			}
		});
	},

	saveTab: function() {
		console.log('saving...');
		event.preventDefault();
		var itemState = {items: this.tab.getItemState()};
		var that = this;
		$.ajax({
			url: event.target.action,
			type: 'put',
			data: itemState
		})
		.done(function(res){
			window.location.replace('/tab/' + that.tab.id + '/totals');
		})
		.fail(function(err){
			console.log(err);
		});
	},

	colorItems: function() {
		for(var i=0; i < this.tab.items.length; i++) {
			this.tabView.colorItem({'itemID': this.tab.items[i].id, 'itemObj': this.tab.items[i]});
		}
	}
};
