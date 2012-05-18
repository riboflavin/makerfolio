(function(K) {
	K.InstructionsHost = function(options) {
		var _c = K.Component({ id:'kit' }, options);
		
                var $host_btns = $('input:radio[name=host]');
            		var $host_btns_parent = $('#k-host-radio-parent');

                var $location_div = $('#kit-instructions-location');
                var $kit_instructions_div = $('#kit-instructions-container');
                
                function _setupEvents() {
                $host_btns.click(function() {
                        var host_btns_checked = $('input:radio[name=host]:checked').val();
                        var k_host_status = false;
                        if (host_btns_checked == 'khost') {k_host_status = true;}
                        K.Data.save('/' + _c.pub.username + '/' + _c.pub.slug + '/' + _c.pub.token, { khost: k_host_status }, function(resp) {
			                  if(resp.success !== false){
                                        _k_host_tog(resp.kit.khost);
                                        }
                                });
                        });
                }
                
                function _k_host_tog(k_hosting) {
                k_hosting == "true" ? k_hosting = true :
                $host_btns_parent.attr('data-status',k_hosting);
                
                if(k_hosting == true) {
                  $('#ownhost').prop('checked', false);
                  $('#khost').prop('checked', true);
                  $location_div.fadeOut('500', function() {
                     $kit_instructions_div.fadeIn('500');
                  });
                }
                else
                {
                  $('#khost').prop('checked', false);
                  $('#ownhost').prop('checked', true);
                  $kit_instructions_div.fadeOut('500', function() {
                     $location_div.fadeIn('500');
                  });
                }                
                }
                
                _c.oninit = function() {
        	             	_c.pub.username = $('#' + _c.options.id).attr('data-username');
                        _c.pub.slug = $('#' + _c.options.id).attr('data-id');
                        _c.pub.token = $('#' + _c.options.id).attr('data-token');

                        _setupEvents();
                        _k_host_tog($host_btns_parent.attr('data-status'));
                };
		
		return _c.pub;
	};
})(Kitify);