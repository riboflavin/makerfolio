(function(K) {
	K.Data = {};
	
	var _d = {};
	
	var $notice = $('.k-header-notice').hide();
	$('#kitify-ajax-img').css('display','').hide();
	var $noticetext = $('.k-header-notice-text').children('span:first');

	_d.showNotice = function(text) {
		text = text || 'Saving...'
		$noticetext.text(text);
		$('#kitify-ajax-img').show();
		$notice.addClass('k-header-notice-saving').fadeIn('750');
	};
	_d.hideNotice = function(text) {
		text = text || 'Done.'
		$noticetext.text(text);
		$notice.removeClass('k-header-notice-saving');
		setTimeout(function() {
			$notice.fadeOut('fast');
		}, 1500);
	};
	
	_d.ajax = function (url, method, data, success, error, customParams, notice) {
        // this removes nulls because they serialize as "null" not "", which will be interpreted as a string.
        if (data && typeof data === 'object') {
            $.each(data, function (p, v) {
                if (v === null) {
                    data[p] = undefined;
                }
            });
        }

        function errorFn(resp, status) {
			if(notice) {
				_d.hideNotice();
			}
            // This object gets passed through the custom error function so it can communicate back
            var errEvt = { message: true, resp: resp };
            if (error && typeof error === 'function') {
                error.call(K.Data, errEvt);
            }
            if (errEvt.message && status !== 'abort') {
				K.Message.show(resp.message || 'Something bad happened with your request.', 'error');
            }
        }

		if(notice) {
			_d.showNotice(notice);
		}

        var ajaxOpts = $.extend({
            url: url,
            type: method,
            data: data,
            dataType: 'json',
            success: function (resp) {
				if(notice) {
					_d.hideNotice();
				}
                if (resp && resp.success === false) {
                    errorFn(resp);
                } else if (success && typeof success === 'function') {
                    success.call(K.Data, resp);
                }
            },
            error: errorFn
        }, customParams);

        return $.ajax(ajaxOpts);
    };
	
	K.Data.get = function(path, success, error) {
		_d.ajax(path, 'GET', {}, success, error, null, 'Working...');
	};
	
	K.Data.save = function(path, data, success, error) {
        _d.ajax(path, 'POST', data, success, error, null, 'Saving...');
	};
	
	K.Data.del = function(path, data, success, error) {
		if(typeof data === 'function') {
			error = success;
			success = data;
		}
		_d.ajax(path, 'DELETE', data, success, error, null, 'Working...');
	};
})(Kitify);