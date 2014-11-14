// 
//   View
//

function TaxTipView() {
	this.rabbits = '.rabbit_total';
	this.taxPercent = '#tax_percent';
	this.taxAmount = '#tax_amount';
	this.tipPercent = '#tip_percent';
	this.tipAmount = '#tip_amount';
	this.subtotal = '#subtotal';
}

TaxTipView.prototype = {

	getRabbitData: function() {
		var rabbitData = [];
		var rabbitNodes = $(this.rabbits);
		if (Object.prototype.toString.call(rabbitNodes) != '[object Array]') {
			rabbitNodes = [rabbitNodes];
		}
		for (var i=0; i<rabbitNodes.length; i++) {
			rabbitData[i] = {
				id: rabbitNodes[i].data("id"),
				subtotal: parseInt(rabbitNodes[i].data("subtotal")) / 100.0
			};
		}
		return rabbitData;
	},

	updateRabbitData: function(rabbitData) {
		var taxAndTip;
		var rabbitNodes;
		var rabbitNode;
		if (Object.prototype.toString.call( rabbitData ) != '[object Array]') {
			rabbitData = [rabbitData];
		}
		rabbitNodes = $(this.rabbits);
		for (var i=0; i<rabbitData.length; i++) {
			if (Object.prototype.toString.call( rabbitNodes) != '[object Array]') {
				rabbitNode = rabbitNodes;
			} else {
				rabbitNode = $(this.rabbits).find('*[data-id="' + rabbitData[i].id + '"]');
			}
			taxAndTip = (rabbitData[i].tax + rabbitData[i].tip).toFixed(2);
			rabbitNode.find('.tax_and_tip').text(' + $' + taxAndTip + ' = ');
			rabbitNode.find('.rabbit_after_tax_and_tip').text('$' + rabbitData[i].total.toFixed(2));
		}
	},

	updateTotalData: function(totalData) {
		var taxAndTip = (totalData.tax + totalData.tip).toFixed(2);
		$(this.subtotal).find('.tax_and_tip').text(' + $' + taxAndTip + ' = ');
		$(this.subtotal).find('.rabbit_after_tax_and_tip').text('$' + totalData.total.toFixed(2));
	},

	updateTaxAmount: function(amt) {
		$(this.taxAmount).val(amt.toFixed(2));
	},

	updateTaxPercent: function(amt) {
		$(this.taxPercent).val(amt.toFixed(2));
	},

	updateTipAmount: function(amt) {
		$(this.tipAmount).val(amt.toFixed(2));
	},

	updateTipPercent: function(amt) {
		$(this.tipPercent).val(amt.toFixed(2));
	}

};


// 
//   Model
//


function TaxTipModel() {
	this.taxAmount = 0;
	this.tipAmount = 0;
	this.taxPercent = 0;
	this.taxPercent = 0;
	this.rabbitData = {};
	this.subtotal = 0;
	this.totalData = {};
}

TaxTipModel.prototype = {

	updateTaxAmount: function() {
		this.taxAmount = this.subtotal * this.taxPercent / 100.0;
		return this.taxAmount;
	},

	updateTaxPercent: function() {
		this.taxPercent = 100 * this.taxAmount / (1.0  * this.subtotal);
		return this.taxPercent;
	},

	updateTipAmount: function() {
		this.tipAmount = this.subtotal * this.tipPercent / 100.0;
		return this.tipAmount;
	},

	updateTipPercent: function() {
		this.tipPercent = 100 * this.tipAmount / (1.0  * this.subtotal);
		return this.tipPercent;
	},

	updateRabbitData: function() {
		for (var i=0; i<this.rabbitData.length; i++) {
			this.rabbitData[i].tax = this.taxPercent * this.rabbitData[i].subtotal / 100.0;
			this.rabbitData[i].tip = this.tipPercent * this.rabbitData[i].subtotal / 100.0;
			this.rabbitData[i].total = this.rabbitData[i].tip + this.rabbitData[i].tax + this.rabbitData[i].subtotal;
		}
		return this.rabbitData;
	},

	updateTotalData: function() {
		this.totalData.tax = this.taxPercent * this.subtotal / 100.0;
		this.totalData.tip = this.tipPercent * this.subtotal / 100.0;
		this.totalData.total = this.totalData.tip + this.totalData.tax + this.subtotal;
		return this.totalData;
	}

};



// 
//   Controller
//


function TaxTipController(model, view) {
	this.model = model;
	this.view = view;
}

TaxTipController.prototype = {

	bindSMSButtons: function() {
		that = this;
		$('.rabbit_phone').on('click',function(event){ 
			event.preventDefault();
			that.sendSMS();
			event.stopPropagation();
		});
	},

	sendSMS: function() {
		that = this;
		var phoneNumber = $(event.target).data('phone') || $(event.target).parent().data('phone');
		var total = $(event.target).parents('.rabbit_total').find('.rabbit_after_tax_and_tip').text();
		var rootURL = window.location.pathname.slice(0, window.location.pathname.indexOf('total'));
		glyphNode = $(event.target);
		if (glyphNode.children().length) {
			glyphNode = glyphNode.children();
		}
		// console.log(glyphNode);
		glyphNode.removeClass('glyphicon-send').addClass('glyphicon-flash'); // change button icon to glyphicon-flash and disable it
		// todo unbind event handler
		$.ajax({ url: rootURL + 'sms',
						type: 'post',
						data: { 		 phone: phoneNumber,
												 total: total
							     }
				   })
	   .done(function(res) {
	     		console.log('success');
	     		glyphNode.removeClass('glyphicon-flash').addClass('glyphicon-ok');
	 	 }).fail(function(err) {
	     		console.log('failure');
	     		glyphNode.removeClass('glyphicon-flash').addClass('glyphicon-send');
			});
	},

	prepareModel: function() {
		this.model.subtotal = parseFloat($(this.view.subtotal).data('subtotal')) / 100.0;
		this.model.taxAmount = parseFloat($(this.view.taxAmount).val());
		this.model.taxPercent = parseFloat($(this.view.taxPercent).val());
		this.model.tipAmount = parseFloat($(this.view.tipAmount).val());
		this.model.tipPercent = parseFloat($(this.view.tipPercent).val());
		this.model.rabbitData = this.view.getRabbitData();
		this.model.updateRabbitData();
		this.model.updateTotalData();
		// console.log("Initial: Tip %: " +  this.model.tipPercent);
		// console.log("Initial: Tip #: " + this.model.tipAmount);
		// console.log("Initial: Tax %: " + this.model.taxPercent);
		// console.log("Initial: Tax #: " + this.model.taxAmount);
		// console.log("Initial Rabbit:");
		// console.log(this.model.rabbitData);
		// console.log("Initial Total:");
		// console.log(this.model.totalData);
	},

	bindEvents: function() {
		$(this.view.taxPercent).on('input', this.changedTaxPercent.bind(this));
		$(this.view.tipPercent).on('input', this.changedTipPercent.bind(this));
		$(this.view.taxAmount).on('input', this.changedTaxAmount.bind(this));
		$(this.view.tipAmount).on('input', this.changedTipAmount.bind(this));
	},

	changedTaxAmount: function() {
		// console.log('tax amount changed');
		this.model.taxAmount = parseFloat($(this.view.taxAmount).val());
		this.view.updateTaxPercent(this.model.updateTaxPercent());
		this.updateRabbitsAndTotals();
	},

	changedTipAmount: function() {
		// console.log('changing tip amounts');
		this.model.tipAmount = parseFloat($(this.view.tipAmount).val());
		this.view.updateTipPercent(this.model.updateTipPercent());
		this.updateRabbitsAndTotals();
	},

	changedTaxPercent: function() {
		// console.log('changing tax percent');
		this.model.taxPercent = parseFloat($(this.view.taxPercent).val());
		this.view.updateTaxAmount(this.model.updateTaxAmount());
		this.updateRabbitsAndTotals();
	},

	changedTipPercent: function() {
		// console.log('changing tip percent');
		this.model.tipPercent = parseFloat($(this.view.tipPercent).val());
		this.view.updateTipAmount(this.model.updateTipAmount());
		this.updateRabbitsAndTotals();
	},

	updateRabbitsAndTotals: function() {
		this.view.updateRabbitData(this.model.updateRabbitData());
		this.view.updateTotalData(this.model.updateTotalData());
		// console.log("Updated: Tip %: " +  this.model.tipPercent);
		// console.log("Updated: Tip #: " + this.model.tipAmount);
		// console.log("Updated: Tax %: " + this.model.taxPercent);
		// console.log("Updated: Tax #: " + this.model.taxAmount);
	}

};

$(document).ready(function() {
	var controller = new TaxTipController(new TaxTipModel(), new TaxTipView() );
	controller.prepareModel();
	controller.bindEvents();
	controller.bindSMSButtons();
});