(function(K) {
	var _m = {
		duration: 5000,
		timeout: null
	};
	
	_m.clearMessage = function() {
		if(_m.timeout) {
			clearTimeout(_m.timeout);
			_m.timeout = null;
		}
		$('.k-message').remove();
                
	};
	
	_m.showMessage = function(message, type, duration) {
		if(typeof type === 'number') {
			duration = type;
			type = '';
		}
		duration = duration || _m.duration;
		
		if((type != 'info') && (type != 'success') && (type != 'warning') && (type != 'error')){
			type = '';
		}
		
		var $msg = $('<div class="k-message k-shadow alert alert-block alert-error block-message" />').html(message).prependTo('#container');
		if(type) {
			$msg.addClass(type);
		}
		var $close = $('<a href="javascript:void(0)" class="close">&times;</a>').prependTo($msg).click(function() {
			_m.clearMessage();
		});
		$msg.css('top','-200px');
		$msg.animate({top: '40px'},800)
		_m.timeout = setTimeout(function() {
			$msg.animate({top: '-200px'},800,'', function() {
				_m.clearMessage();
			});
		}, duration);
	};
	
	K.Message = {
		clear: _m.clearMessage,
		show: _m.showMessage
	};
})(Kitify);