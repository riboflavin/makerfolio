(function(K) {
	K.KitParams = function(options) {
		var _c = K.Component({ id:'kit-params' }, options);
				
		function _updateKitParams($element) {
			
             var val = $element.val();
             var kitparam = $element.attr('id').replace('kit-','');
             var data_prev_val = $element.attr('data_prev_val');
             var valid = true;
             var pass_vars = {};

             if(val != data_prev_val && valid) {
                pass_vars[kitparam] = val;
				K.Data.save('/' + _c.manager.username + '/' + _c.manager.slug + '/' + _c.manager.token, pass_vars, function(resp) {
					if(resp.success !== false){
						$element.attr('data_prev_val',$element.val());
					}
					if(resp.success == 'redirect'){
					window.location.href = '/' + _c.manager.username + '/' + resp.kit.slug + '/' + resp.kit.token;
					}
				});
			}
		}
		
		_c.oninit = function() {
			$(".k-param-input").each(function()
				{
			var $this = $(this);
			$this.attr('data_prev_val',$this.val());
			$this.blur(function() {
				_updateKitParams($this);
			}).keyup(function(evt) {
				if(evt.which === 13) {console.log(evt); _updateKitParams($this);}
			});
				});		
		}

		return _c.pub;

	}

})(Kitify);