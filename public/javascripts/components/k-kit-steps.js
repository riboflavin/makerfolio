(function(K) {
	K.KitSteps = function(options) {

        var _c = K.Component({ id:'kit', components:{} }, options),
		_steps = [];
		
		var $table = $('#step-div');

        var _stepTmpl_editable = 
        ['<tr data-id="{{id}}" data-step="{{num}}">',
		'<td class="k-kit-steps-td">',
		'<div class="k-kit-step-div">',
			'<div class="k-step-ctrls">',
				'<a href="javascript:void(0)" class="k-kit-ctrls-edit btn btn-small btn-primary">edit</a>',
				'<a href="javascript:void(0)" class="k-kit-ctrls-delete btn btn-small btn-danger">delete</a>',
			'</div>',
			'<div class="k-step-title-container">',
				'<input class="k-kit-step-order-edit span1" value="{{num}}"></input>',
				'<p class="k-kit-step-num">{{num}}) </p>',
				'<p class="k-kit-step-title">{{optional}}{{title}}</p>',
			'</div>',
			'<div data-ftype="step" data-id="{{id}}" class="kit-img-container kit-img-empty pull-left fileupload"></div>',
			'<p class="k-kit-step-instructions">{{instructions}}</p>',
		'</div>',
		'</td></tr>'
		].join('');

		var _stepTmpl_fixed = 
		['<tr data-id="{{id}}" data-step="{{num}}">',
		'<td class="k-kit-steps-td-fixed">',
		'<div class="k-kit-step-div">',
			'<div class="k-step-title-container-fixed">',
				'<p class="k-kit-step-num">{{num}}) </p>',
				'<p class="k-kit-step-title">{{#optional}}{{optional}}{{/optional}} {{title}}</p>',
			'</div>',
		'{{#thumb_url}}<div data-id="{{id}}" data_url="{{url}}" class="kit-img-container-max kit-img-container cursor-pointer">',
			'<img class="k-kit-step-img" src="{{thumb_url}}">',
			'</img>',
         	'</div>{{/thumb_url}}',
		'<p class="k-kit-step-instructions">{{instructions}}</p>',
		'</div>',
		'</td></tr>'
		].join('');

        var _stepTmpl = _stepTmpl_fixed;
        if ($('#kit').hasClass('editable')) {_stepTmpl = _stepTmpl_editable;}

		function _formatStep(step) {
			var formatted = $.extend(true, {}, step);

			step.optional ? formatted.optional = "(Optional) " : formatted.optional = '';
			formatted.num = parseInt(step.num);
         
			return formatted;
		}
		
		function _appendRow($target, step) {
			var formatted = _formatStep(step),
			row = K.template(_stepTmpl, formatted);
			$(row).appendTo($target).data('step', step).find('.k-step-ctrls:first').hide();
			$(K).trigger('step-row-created', step);
		}
		
		function _updateRow($row, step) {
			var formatted = _formatStep(step),
			row = K.template(_stepTmpl, formatted);
			$row.replaceWith($(row).data('step', step));
			$(K).trigger('step-row-created', step);
		}
		
		function _renderSteps(_steps) {
			var $tbody = $('tbody', $table).empty();
			if(_steps.length) {
				$.each(_steps, function(i, step) {
                _appendRow($tbody, step);
				});
			$table.show();
			}
		}
		
		_c.oninit = function() {
            _c.pub.username = $('#kit').attr('data-username');
			_c.pub.slug = $('#kit').attr('data-id');
			_c.pub.token = $('#kit').attr('data-token');
						
			K.Data.get('/' + _c.pub.username + '/' + _c.pub.slug + '/steps', function(resp) {
				_renderSteps(resp);
				$('.k-step-ctrls').hide();
			});
			
			$(K).bind('step-created', function(evt, step) {
				$table.show();
				_appendRow($('tbody', $table), step);
			});
			
			$(K).bind('step-updated', function(evt, step, $row) {
				_updateRow($row, step);
			});
			
			$(K).bind('step-deleted', function(evt, id) {
				if(!$('tbody tr', $table).length) {
					$table.hide();
				}
			});
		};
		
		return _c.pub;
	};
})(Kitify);