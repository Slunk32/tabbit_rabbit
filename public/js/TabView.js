function TabView() {
	this.item = '.tab_item';
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
	}
}