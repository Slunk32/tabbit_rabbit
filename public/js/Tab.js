function Tab(options) {
	this.id = options.id || null;
	this.items = options.items || [];
	this.rabbits = options.rabbits || [];
}

Tab.prototype = {

	addItem: function(item) {
		this.items.concat(item);
	},

	addRabbit: function(rabbitData) {
		var rabbit = new Rabbit(rabbitData);
		this.rabbits.concat(rabbit);
		return rabbit;
	}

};