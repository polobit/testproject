var Ticket_Utils = {

	dateDiff: function(date_future, date_now){

		// get total seconds between the times
		var delta = Math.abs(date_future - date_now) / 1000;

		// calculate (and subtract) whole days
		var days = Math.floor(delta / 86400);
		delta -= days * 86400;

		// calculate (and subtract) whole hours
		var hours = Math.floor(delta / 3600) % 24;
		delta -= hours * 3600;

		var txt = (days > 0) ? (days + ' day' + (days > 1 ? 's' : '') + ' ') : '';

		txt += (hours > 0) ? (hours + ' hr' + (hours > 1 ? 's' : '')) : '';

		return txt.trim();
	},

	resetModalSettings: function($ele){

		if($ele)
			$ele.modal('hide');

		var $body = $('body');

		if($body.hasClass('modal-open')){
			$body.removeClass('modal-open').animate({scrollTop: 0}, "slow");
			$body.css('padding-right', '');
		}
	}
};