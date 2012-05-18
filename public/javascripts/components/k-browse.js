(function(K) {
	K.KitBrowse = function(options) {

                var _c = K.Component({ id:'kit-browse' }, options),
			_kits = [];
		
                var $table = $('#kit-browse');
                var _kitTmpl = ['<tr data-id="{{id}}">',
		'<td class="k-kit-browse-col-image"><img src="{{src}}"/></td>',
		'<td class="k-kit-browse-col-info"><h3><a href="/{{link_to_kit}}">{{title}}</a> by {{author}}</h3><br/><h5>{{instructions}}</h5></td>',
                '</tr>'].join('');

                var _noItemsTmpl = ['<tr data-id="{{id}}">','<td colspan="2"><h5>There are no published kits.</h5></td>','</tr>'].join('');

		function _formatKit(kit) {
			var formatted = $.extend(true, {}, kit);
			
			if(typeof kit.price === 'number') {
				formatted.price = '$' + kit.price.toFixed(2);	
			}
                        
			return formatted;
		}
		
		function _appendRow($target, kit) {
			var formatted = _formatKit(kit),
				row = K.template(_kitTmpl, formatted);
			console.log(row);
                        $(row).appendTo($target).data('kit', kit);
		}
		
		function _renderKits() {
			var $tbody = $('tbody', $table).empty();
			if(!_kits.length) {
				$('tbody', $table).append(_noItemsTmpl);
			} else {
				$.each(_kits, function(i, kit) {
                            	//kit.price = parseFloat(kit.price);
                                _appendRow($tbody, kit);
                                });
			}
		}

		function _getKits() {
                	K.Data.get('/getkits', function(resp) {
				_kits = resp;
				_renderKits();
			});			
		}

		_c.oninit = function() {			
                        $('#browse-btn').bind('click',function(){_getKits()});
                        _getKits();
                };
		
		return _c.pub;
	};
})(Kitify);