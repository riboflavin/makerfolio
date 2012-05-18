(function(K) {
	K.KitOptionals = function(options) {
		var _c = K.Component({ id:'kit' }, options);
		_items = [];
		
		var $table;
                var _itemTmpl = ['<tr data-id="{{id}}">',
							 '<td class="k-kit-items-col-name">{{name}}</td>',
							 '<td class="k-kit-items-col-quantity">{{quantity}} {{units}}</td>',
							 '<td class="k-kit-items-col-controls">',
                                                         '<div class="product"><input type="hidden" class="product-title" value="{{quantity}} {{units}} - {{name}}"><input type="hidden" class="product-price" value="{{price}}">',
'<span class="googlecart-add btn btn-small cart-add-btn" tabindex="0" role="button" title="Add to cart">\n\
Add to Cart</span>',
							 '</div></td>',
							 '<td class="k-kit-items-col-notes">{{notes}}</td>',
'</tr>'].join('');

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
			$(row).appendTo($target).data('item', item);
		}
	
		function _renderItems() {
                    	var $tbody = $('tbody', $table).empty();
			$.each(_items, function(i, item) {
			item.price = parseFloat(item.price);
                        if (item.optional)
                                        {_appendRow($tbody, item);}
                        });
                }
		
		_c.oninit = function() {
                        _c.pub.username = $('#' + _c.options.id).attr('data-username');
			_c.pub.slug = $('#' + _c.options.id).attr('data-id');
			_c.pub.token = $('#' + _c.options.id).attr('data-token');
			
			$table = $('#kit-optional-items');
			
			K.Data.get('/' + _c.pub.username + '/' + _c.pub.slug + '/items', function(resp) {
				_items = resp;
				_renderItems();
			});
		};
		
		return _c.pub;
	};
})(Kitify);