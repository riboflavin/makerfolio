(function(K) {
	K.KitItems = function(options) {

        var _c = K.Component({ id:'kit', components:{} }, options),
		_items = [];
		
		var	$table = $('#kit-items');

		var _noItemsTmpl_fixed = '<tr class="k-kit-items-none"><td colspan="7">Start adding items above.</td></tr>';
		var _noItemsTmpl_editable = '<tr class="k-kit-items-none"><td colspan="7">Start adding items above.</td></tr>';

        var _itemTmpl_editable = 
        ['<tr data-id="{{id}}">',
		'<td class="k-kit-items-col-name">{{name}}</td>',
		'<td class="k-kit-items-col-image">',
			'<div data-ftype="item" data-id="{{id}}" class="kit-img-container-mini kit-img-empty pull-left fileupload"></div>',
		'</td>',
		'<td class="k-kit-items-col-quantity">{{quantity}} {{units}}</td>',
		'<td class="k-kit-items-col-link"><a href="{{merchant_url}}" target="_blank">{{merchant_url}}</a></td>',
		'<td class="k-kit-items-col-optional">{{optional}}</td>',
		'<td class="k-kit-items-col-notes">',
			'{{#notes}}<i class="icon-comment cursor-pointer" data-content="{{notes}}"></i>{{/notes}}',
		'</td>',
		'<td class="k-kit-items-col-controls">',
			'<div class="k-item-ctrls">',
			'<a href="javascript:void(0)" class="k-kit-ctrls-edit btn btn-small btn-primary">edit</a>',
			'<a href="javascript:void(0)" class="k-kit-ctrls-delete btn btn-small btn-danger">delete</a>',
			'</div>',
		'</td>',
		'</tr>'].join('');

		var _itemTmpl_fixed = 
		['<tr">',
		'<td class="k-kit-items-image">',
			'{{#thumb_url}}<div data-id="{{id}}" data_url="{{url}}" class="kit-img-container-mini cursor-pointer">',
			'<img class="kit-img" src="{{thumb_url}}">',
			'</img>',
         	'</div>{{/thumb_url}}',
        '</td>',
		'<td class="k-kit-items-name">',
			'{{#merchant_url}}<a href="{{merchant_url}}" target="_blank">{{/merchant_url}}',
			'{{name}}',
			'{{#merchant_url}}</a>{{/merchant_url}}',
		'</td>',
		'<td class="k-kit-items-quantity">{{quantity}} {{units}}</td>',
		'<td class="k-kit-items-notes">',
			'{{notes}}',
		'</td>',
		'</tr>'].join('');

                var _itemTmpl = _itemTmpl_fixed;
                var _noItemsTmpl = _noItemsTmpl_fixed;
      if ($('#kit').hasClass('editable')) 
                {   
                _itemTmpl = _itemTmpl_editable;
                _noItemsTmpl = _noItemsTmpl_editable;
                }

		function _formatItem(item) {
			var formatted = $.extend(true, {}, item);
			
			if(typeof item.price === 'number') {
				formatted.price = '$' + item.price.toFixed(2);	
			}                        
                item.heavy ? formatted.heavy = "Yes" : formatted.heavy = '';
                item.optional ? formatted.optional = "Yes" : formatted.optional = '';
                        
			return formatted;
		}
		
		function _appendRow($target, item) {
			var formatted = _formatItem(item),
			row = K.template(_itemTmpl, formatted);

			if ($('#kit-items').hasClass('hasoptionals')) {
				if ($('#optional_divider').get(0) === undefined) { 
			 	var $optional_divider = $('<tr id="optional_divider"><td colspan="4"><span id="divider_span">Optional items</span></td></tr>');
			 	$optional_divider.appendTo($target);
			 	}

			 	$optional_divider = $('#optional_divider');
			 	if (item.optional) {
				$(row).insertAfter($optional_divider);
			 	}
			 	else {
				$(row).insertBefore($optional_divider);		 		
			 	}
			}
			else {
			$(row).appendTo($target).data('item',item).find('.k-item-ctrls:first').hide();
			}
			
			$target.find('i').popover();
			$(K).trigger('item-row-created', item);
		}
		
		function _updateRow($row, item) {
			var formatted = _formatItem(item),
			row = K.template(_itemTmpl, formatted);
			$row.replaceWith($(row).data('item', item));
			$(K).trigger('item-row-created', item);
		}
		
		function _renderItems() {
			var $tbody = $('tbody', $table).empty();
			if(_items.length) {
				$.each(_items, function(i, item) {
					item.price = parseFloat(item.price);
	                _appendRow($tbody, item);
				});
				$table.show();
				$('.k-item-ctrls').hide();
			}
		}
		
		_c.oninit = function() {
            _c.pub.username = $('#kit').attr('data-username');
			_c.pub.slug = $('#kit').attr('data-id');
			_c.pub.token = $('#kit').attr('data-token');
						
			K.Data.get('/' + _c.pub.username + '/' + _c.pub.slug + '/items', function(resp) {
				_items = resp;
				_renderItems();
			});
			
			$(K).bind('item-created', function(evt, item) {
				$table.show();
				_appendRow($('tbody', $table), item);
			});
			
			$(K).bind('item-updated', function(evt, item, $row) {
				_updateRow($row, item);
			});
			
			$(K).bind('item-deleted', function(evt, id) {
				if(!$('tbody tr', $table).length) {
					$table.hide();
				}
			});
		};
		
		return _c.pub;
	};
})(Kitify);