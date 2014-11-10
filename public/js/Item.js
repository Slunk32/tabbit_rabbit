function Item(options) {
	this.id = options.id || null;
	this.name = options.name;
	this.price = options.price;
	this.rabbits = options.rabbits || [];
}

Item.prototype = {

	addRabbit: function(rabbit) {
		this.rabbits.push(rabbit);
	},

	removeRabbit: function(rabbit) {
		return this.rabbits.pop(rabbit);
	}

};