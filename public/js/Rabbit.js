function Rabbit(options) {
	this.id = options.id || null;
	this.name = options.name;
	this.phone = options.phone;
	this.email = options.email;
	this.items = options.items || [];
	this.subtotal = options.subtotal || 0;
}

Rabbit.prototype = {

	ownItem: function(item) {
		this.items.concat(item);
	}

};