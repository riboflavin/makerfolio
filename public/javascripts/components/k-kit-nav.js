(function(K) {
	K.KitNav = function(options) {
        var _c = K.Component({ id:'kitnav', components:{} }, options);

		_c.oninit = function() {

			_c.pub.username = $('#kit').attr('data-username');
			_c.pub.slug = $('#kit').attr('data-id');
			_c.pub.token = $('#kit').attr('data-token');
		
		$('#k-kit-nav a').on('click', function(evt) {
			var $target = $(evt.target);
			var $el_new = $('#k-kit-' + $target.attr('data-section'));

			var $el_current = $('.activesection');
			if ($el_current[0] === undefined) {$el_current = $('.k-kit-section:first')}
			
			if (!$el_new.hasClass('activesection')) {
			$el_current.removeClass('activesection').fadeOut('500',function(){
				$el_new.addClass('activesection').fadeIn('500');
			});
			}
		});

		$('#k-kit-nav').find('a:first').click();
		};

		return _c.pub;		
	}
})(Kitify);