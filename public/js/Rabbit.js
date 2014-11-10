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
		if ($.inArray(item, this.items)) {
			this.items.pop(item);
		} else {
			this.items.push(item);
			this.recalculateSubtotal();
		}
	},

	getSubtotal: function() {
		return this.subtotal;
	},

	recalculateSubtotal: function() {
		this.subtotal = 0;
		for (var i=0; i < this.items.length; i++) {
			this.subtotal += this.items[i].price;
		}
	}

};