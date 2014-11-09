function Rabbit(options) {
	this.id = options.id || null;
	this.name = options.name;
	this.phone = options.phone;
	this.email = options.email;
	this.items = options.items || [];
}

Rabbit.prototype = {

	ownItem: function(item) {
		this.items.concat(item);
	}

};