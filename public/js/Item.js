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
		if (this.rabbits.indexOf(rabbit) > -1) {
			this.rabbits.splice(this.rabbits.indexOf(rabbit),1);
		}
	}

};
