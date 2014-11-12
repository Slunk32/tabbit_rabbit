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
	this.removeRabbit = '.remove_rabbit';
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
		$(this).css('opacity','1');
		// Purposefully a GLOBAL variable
		dragSrcEl = this;
		event.originalEvent.dataTransfer.effectAllowed = 'move';
		event.originalEvent.dataTransfer.setData('text/html', this.outerHTML);
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
		  	$(this).removeClass('over');
	      dragSrcEl.outerHTML = this.outerHTML;
				this.outerHTML = event.originalEvent.dataTransfer.getData('text/html');
	      // var replacement = event.originalEvent.dataTransfer.getData('text/html');
	      // replacement.style.opacity = "1.0";
	      // this.outerHTML = replacement;
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

	  removeRabbitNode: function(rabbitID) {
	  	var color = this.getRabbitColor(rabbitID);
	  	$('#rabbit_' + rabbitID).remove();
	  	this.removeColor(color);
	  },

	  addRabbit: function(rabbitObj) {
	  	that = this;
	  	that.hideAddModal();
	  	// TODO: replace with template
	  	var newRabbit = $(this.rabbit).first().clone();
	  	newRabbit.attr('id','rabbit_' + rabbitObj.id);
	  	newRabbit.find('.rabbit_subtotal').text('$' + rabbitObj.subtotal.toFixed(2));
	  	newRabbit.find('.rabbit_name').text(rabbitObj.name);
	  	// set colors
	  	newRabbit.data('colorclass',that.colorClasses[$(that.rabbits).children().length]);
	  	newRabbit.children('button').removeClass('btn-success').addClass('btn-' + that.colorClasses[$(that.rabbits).children().length]);
	  	newRabbit.find('.remove_rabbit').attr('href','/rabbit/' + rabbitObj.id + '/delete');
	  	var remove = $('<li><a class="remove_rabbit" href="/rabbit/' + rabbitObj.id + '/delete">Remove</a></li>');
	  	newRabbit.find('.rabbit_dropdown').append(remove);
	  	newRabbit.appendTo(this.rabbits);
	  	that.hideAddButtonIfNecessary();
		},

		changeSelectedRabbitColor: function(rabbitID) {
			this.selectedRabbitColor = this.getRabbitColor(rabbitID);
		},

		colorItem: function(params) {
			var item = $('*[data-id="' + params.itemID + '"]');
			for (var i=0; i < this.colorClasses.length; i++) {
				item.removeClass('list-group-item-' + this.colorClasses[i]);
			}
			for (var j=0; j < params.itemObj.rabbits.length; j++) {
				var color = this.getRabbitColor(params.itemObj.rabbits[j].id);
				item.addClass('list-group-item-' + color);
			}
		},

		updateSubtotals: function(rabbits) {
			for (var i=0; i < rabbits.length; i++) {
				$('#rabbit_' + rabbits[i].id).find('.rabbit_subtotal').text('$' + rabbits[i].subtotal.toFixed(2));
			}
		},

		getRabbitColor: function(rabbit_id) {
			return $('#rabbit_' + rabbit_id).data('colorclass');
		},

		removeColor: function(color) {
			$(this.item).removeClass('list-group-item-' + color);
		}

};
