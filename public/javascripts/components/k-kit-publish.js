(function(K) {
	K.KitPublish = function(options) {
		var _c = K.Component({ id:'kit' }, options);
		
                var $publish_btn = $('#kit-pub-btn');
                var $delete_btn = $('#kit-delete-btn');
                var $del_confirm = $('#del_confirm');
                var $instead_of_del = $('#unpub_insteadof_delete_btn');
                var $cancel_deletion = $('#cancel_deletion');

                function _setupEvents() {
                $cancel_deletion.click(function() {
                $('#delete-modal').modal('hide');            
                });

                $instead_of_del.click(function() {
                $publish_btn.click();
                $('#delete-modal').modal('hide');            
                });
                
                $delete_btn.click(function() {
                $('#delete-modal').modal('show');            
                });

                $del_confirm.click(function() {
                K.Data.del('/' + _c.manager.username + '/' + _c.manager.slug + '/' + _c.manager.token, '', function(resp) {
                        if(resp.success && resp.success != false) {
                                $('#delete-modal').modal('hide');            
                                $('#post-delete-modal').modal('show');            
                        }
                        });
                });

                $publish_btn.click(function() {
                $publish_btn.attr('data-status') == 'unpublished' ? next_state = 'waiting' : next_state = 'unpublished';
                        K.Data.save('/' + _c.pub.username + '/' + _c.pub.slug + '/' + _c.pub.token, { published: next_state }, function(resp) {
			if(resp.success !== false){
                                _publish_kit_tog(resp.kit.published);
                                        }
                                });
                        });
                }
                
                function _publish_kit_tog(p_status) {
                $publish_btn.attr('data-status',p_status);
                switch(p_status){
                    
                default:
                break;

                case 'published':
                $publish_btn.text('Cancel sales');
                $publish_btn.removeClass('btn-success').addClass('btn-error');
                $('#kit-pub-warn').removeClass('hide');
                $('.unpub_suggestion').removeClass('hide');

                $('#k-kit-selling-text').removeClass('hide');
                $('#k-kit-notselling-text').addClass('hide');
                break;
                
                case 'waiting':
                $publish_btn.text('Cancel review');
                $publish_btn.removeClass('btn-success').addClass('btn-error');
                $('#kit-pub-warn').removeClass('hide');
                $('.unpub_suggestion').removeClass('hide');

                $('#k-kit-selling-text').addClass('hide');
                $('#k-kit-notselling-text').removeClass('hide');
                break;
                
                case 'unpublished':
                $publish_btn.text('Sell this kit with Kitify');
                $publish_btn.removeClass('btn-error').addClass('btn-success');
                $('#kit-pub-warn').addClass('hide');
                $('.unpub_suggestion').addClass('hide');

                $('#k-kit-selling-text').addClass('hide');
                $('#k-kit-notselling-text').removeClass('hide');
                break;
                }
                                
                }
                
                _c.oninit = function() {
        	        //figure out how to centralize this functionality
                        _c.pub.username = $('#' + _c.options.id).attr('data-username');
                        _c.pub.slug = $('#' + _c.options.id).attr('data-id');
                        _c.pub.token = $('#' + _c.options.id).attr('data-token');

                	_setupEvents();
                        _publish_kit_tog($publish_btn.attr('data-status'));
                };
		
		return _c.pub;
	};
})(Kitify);