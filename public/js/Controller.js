function Controller(options) {
	this.tabView = options.tabView;
	this.tab = options.tab;
}

Controller.prototype = {
	bindEvents: function () {
		this.tabView.makeItemsDraggable();
		$(this.tabView.addButton).on('click', this.addRabbit.bind(this));
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