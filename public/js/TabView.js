function TabView() {
	this.item = '.tab_item';
	this.addButton = '.add_user';
	this.saveRabbit = '.save_rabbit';
	this.formToAddRabbit = '#add_rabbit';
	this.addModal = '#addModal';
	this.rabbit = '.rabbit';
	this.rabbitButton = '.rabbit_itself';
	this.rabbits = '.rabbits-list';
	this.tabName = '.tab_name';
	this.colorClasses = ["success","info","warning","danger","primary"];
	this.selectedRabbitColor = this.colorClasses[0];
}

TabView.prototype = {
	makeItemsDraggable: function () {
		$(document).on('dragstart', this.item, this.handleDragStart);
		$(document).on('dragenter', this.item, this.handleDragEnter);
		$(document).on('dragover', this.item, this.handleDragOver);
		$(document).on('dragleave', this.item, this.handleDragLeave);
		$(document).on('drop', this.item, this.handleDrop);
		$(document).on('dragend', this.item, this.handleDragEnd);
	},

	makeItemsEditable: function() {
		$.fn.editable.defaults.mode = 'inline';
		var $tab = $(this.tabName);
		var tabID = $tab.attr('id').substring(4);
		$tab.editable({
                   type:  'text',
                   pk:    tabID,
                   url: '/tab/' + tabID + '/rename',  
                   title: 'Tab Name',
                   name: 'name',
                   value: $tab.text(),
                   placement: 'right'
                });
	},

	hideAddButtonIfNecessary: function() {
		if ($(this.rabbits).children().length >= 5) {
			$(this.addButton).hide();
		} else {
			$(this.addButton).show();
		}
	},

	handleDragStart: function(event) {
		$(this).css('opacity','0.4');
		dragSrcEl = this;
		event.originalEvent.dataTransfer.effectAllowed = 'move';
		event.originalEvent.dataTransfer.setData('text/html', this.innerHTML);
	},

	handleDragOver: function(event) {
		if (event.preventDefault) {
			event.preventDefault();
		}
		event.originalEvent.dataTransfer.dropEffect = 'move';
		return false;
	},

	handleDragEnter: function(event) {
		$(this).addClass('over');
	},

	handleDragLeave: function(event) {
		$(this).removeClass('over');
	},

	handleDrop: function(event) {
		if (event.stopPropogation){
			event.stopPropogation();
		}
	  // Don't do anything if dropping the same column we're dragging.
	  if (dragSrcEl != this) {
	      // Set the source column's HTML to the HTML of the column we dropped on.
	      dragSrcEl.innerHTML = this.innerHTML;
	      this.innerHTML = event.originalEvent.dataTransfer.getData('text/html');
	    }
	    return false;
	  },

	  handleDragEnd: function(event) {
	  	$(this.item).removeClass('over');
	  	$(this).css('opacity','1');
	  },

	  hideAddModal: function() {
	  	$(this.addModal).modal('hide');
	  },

	  addRabbit: function(rabbitObj) {
	  	that = this;
	  	that.hideAddModal();
	  	var newRabbit = $(this.rabbit).first().clone();
	  	newRabbit.attr('id','rabbit_' + rabbitObj.id);
	  	newRabbit.find('.rabbit_subtotal').text('$' + rabbitObj.subtotal.toFixed(2));
	  	newRabbit.find('.rabbit_name').text(rabbitObj.name);
	  	newRabbit.children('button').removeClass('btn-success').addClass('btn-' + that.colorClasses[$(that.rabbits).children().length]);
	  	newRabbit.find('.remove_rabbit').attr('href','/rabbit/' + rabbitObj.id + '/delete');
	  	newRabbit.appendTo(this.rabbits);
	  	that.hideAddButtonIfNecessary();
		},

		changeSelectedRabbitColor: function(rabbitID) {
			this.selectedRabbitColor = $('#rabbit_' + rabbitID).data('colorclass');
		},

		colorItem: function(params) {
			var item = $('*[data-id="' + params.itemID + '"]');
			item.removeClass('list-group-item-*');
			item.addClass('list-group-item-' + this.selectedRabbitColor);
			// update subtotal
			$('#rabbit_' + params.rabbit.id).find('.rabbit_subtotal').text('$' + params.rabbit.subtotal.toFixed(2));
		}

};