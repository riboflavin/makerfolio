(function(K) {
	K.NewStep = function(options) {
		var _c = K.Component({
			id: 'newstep',
			fields: [
			{ id:'newstep-title', prop:'title', label:'Step Title', required:true, submit:true },
			{ id:'newstep-optional', prop:'optional',label:'Optional', required:false, submit:true },
			{ id:'newstep-thumb', prop:'thumb', required: false,  submit:true },
			{ id:'newstep-instructions', label:'Step Instructions', prop:'instructions', required:true, submit:true }
			]
		}, options);
		
		_c.oninit = function() {
	        _c.manager.username = $('#kit').attr('data-username');
			_c.manager.slug = $('#kit').attr('data-id');
			_c.manager.token = $('#kit').attr('data-token');

			var form = K.Form.setup({
				context: '#newstep',
				fields: _c.options.fields,
				btns: {
					submit: '#kit-add-step-btn'
				}
			});
			
			$(form).bind('submit', function(evt, step) {
				evt.preventDefault();
				step.token = _c.manager.token;

				K.Data.save('/' + _c.manager.username + '/' + _c.manager.slug + '/steps', step, function(resp) {
					if(resp && resp.success !== false) {
						form.reset();
						$(K).trigger('step-created', [resp]);
					}
				});
			});
		};
		
		return _c.pub;
	};
})(Kitify);