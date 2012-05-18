(function(K) {
	K.NewItem = function(options) {
		var _c = K.Component({
			id: 'newitem',
			fields: [
				{ id:'newitem-name', prop:'name', label:'Item Name', required:true },
				{ id:'newitem-quantity', prop:'quantity', label:'Quantity', validator:'positiveInteger', required:true },
				{ id:'newitem-unittype', prop:'units', label:'Units', required:false, submit:true },
				{ id:'newitem-merchanturl', prop:'merchant_url', label:'Web address', required:false, submit: true},
				{ id:'newitem-optional', prop:'optional', label:'Optional', submit: true},
				{ id:'newitem-notes', prop:'notes', label:'Notes', submit:true }
			]
		}, options);
		
		_c.oninit = function() {
			var form = K.Form.setup({
				context: '#newitem-add',
				fields: _c.options.fields,
				btns: {
					submit: '#kit-add-item-btn'
				}
			});
			
			$(form).bind('submit', function(evt, item) {
	            _c.manager.username = $('#kit').attr('data-username');
				_c.manager.slug = $('#kit').attr('data-id');
				_c.manager.token = $('#kit').attr('data-token');

				item.token = _c.manager.token;
				K.Data.save('/' + _c.manager.username + '/' + _c.manager.slug + '/items', item, function(resp) {
					if(resp && resp.success !== false) {
						form.reset();
						resp.price = parseFloat(resp.price);
						$(K).trigger('item-created', [resp]);
					}
				});
			});
		};
		
		return _c.pub;
	};
})(Kitify);