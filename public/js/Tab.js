function Tab(options) {
	this.id = options.id || null;
	this.items = options.items || [];
	this.rabbits = options.rabbits || [];
	this.selectedRabbit = null;
}

Tab.prototype = {

	addItem: function(item) {
		this.items.concat(item);
	},

	addRabbit: function(rabbitData) {
		var rabbit = new Rabbit(rabbitData);
		this.rabbits.concat(rabbit);
		return rabbit;
	},

	changeSelectedRabbit: function(rabbitID) {
		this.selectedRabbit = rabbitID;
	},

	selectItem: function() {

	}

};