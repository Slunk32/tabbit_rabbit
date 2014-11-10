function Rabbit(options) {
	this.id = options.id || null;
	this.name = options.name || "Unnamed Rabbit";
	this.phone = options.phone_number || null;
	this.email = options.email || null;
	this.items = options.items || [];
	this.subtotal = options.subtotal || 0;
}

Rabbit.prototype = {

	toggleOwnershipOfItem: function(item) {
		if (this.items.indexOf(item) >= 0) {
			this.items.pop(item);
			item.removeRabbit(this);
		} else {
			this.items.push(item);
			item.addRabbit(this);
		}
	},

	getSubtotal: function() {
		return this.subtotal;
	},

	recalculateSubtotal: function() {
		this.subtotal = 0;
		for (var i=0; i < this.items.length; i++) {
			this.subtotal += this.items[i].price / (1.0 * (this.items[i].rabbits.length));
		}
		this.subtotal /= 100.0;
	}

};