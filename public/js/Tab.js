function Tab(options) {
	this.id = options.id || null;
	this.name = options.name || null;
	this.items = options.items || [];
	this.rabbits = options.rabbits || [];
	this.selectedRabbit = null;
}

Tab.prototype = {

	addItem: function(itemData) {
		var item = new Item(itemData);
		this.items.push(item);
	},

	selectItem: function(itemID) {
		console.log('selectingItem in model')
		var item = this.findWithId(this.items,itemID);
		console.log(item)
		this.selectedRabbit.toggleOwnershipOfItem(item);
		this.updateSubtotals();
		return item;
	},

	updateSubtotals: function() {
		for (var i=0; i < this.rabbits.length; i++) {
			this.rabbits[i].recalculateSubtotal();
		}
	},

	addRabbit: function(rabbitData) {
		var rabbit = new Rabbit(rabbitData);
		this.rabbits.push(rabbit);
		return rabbit;
	},

	removeRabbit: function(rabbitID) {
		var rabbit = this.findWithId(this.rabbits, rabbitID);
		for (var i=0; i < this.items.length; i++) {
			this.items[i].removeRabbit(rabbit);
		}
		rabbit.removeAllItems();
		this.rabbits.splice(this.rabbits.indexOf(rabbit),1);
		this.updateSubtotals();
		return rabbit;
	},

	changeSelectedRabbit: function(rabbitID) {
		var rabbit = this.findWithId(this.rabbits,rabbitID);
		this.selectedRabbit = rabbit;
	},

	findWithId: function(collection,id) {
		var found;
		for (var i = 0; i < collection.length; i++) {
			if (collection[i].id == id) {
				found = collection[i];
			}
		}
		return found;
	},

	parseData: function(data) {
		this.name = data.tab.name;
		for (var i=0; i < data.items.length; i++) {
			this.addItem(data.items[i]);
		}
		for (var j=0; j < data.rabbits.length; j++) {
			this.addRabbit(data.rabbits[j]);
		}
		return true;
	}

};
