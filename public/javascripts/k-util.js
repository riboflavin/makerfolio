(function(K) {
	K.Util = function(options) {
                $('#kit-upload-modal').modal({
  keyboard: false
})

                var _c = K.Component({ id:'util' }, options);        
    
                _c.oninit = function() {
                                
                $('#guidelines_show').click(function() {
                $('#guidelines-modal').modal('show');                         
});
/*                $("#contact_row").tooltip({placement:'right'});
                $("#instructions_row").tooltip({placement:'right'});

                $("#newitem-merchanturl").tooltip({placement:'right'});
                $("#newitem-unittype").tooltip({placement:'right'});
                $("#newitem-heavy-span").tooltip({placement:'right'});
                $("#newitem-optional-span").tooltip({placement:'right'});

*/                _placeholderCompat();
		};

		function _placeholderCompat(){    
                jQuery(function() {
                        jQuery.support.placeholder = false;
                        test = document.createElement('input');
                        if('placeholder' in test) jQuery.support.placeholder = true;
                });

                 $(function() {
                        if(!$.support.placeholder) { 
                                var active = document.activeElement;
                                $(':text').focus(function () {
                                        if ($(this).attr('placeholder') != '' && $(this).val() == $(this).attr('placeholder')) {
                                                $(this).val('').removeClass('hasPlaceholder');
                                        }
                                }).blur(function () {
                                        if ($(this).attr('placeholder') != '' && ($(this).val() == '' || $(this).val() == $(this).attr('placeholder'))) {
                                                $(this).val($(this).attr('placeholder')).addClass('hasPlaceholder');
                                        }
                                });
                                $(':text').blur();
                                $(active).focus();
                                $('form').bind('submit',function () {
                                        $(this).find('.hasPlaceholder').each(function() { $(this).val(''); });
                                });
                        }
                });
                }

                return _c.pub;
		}
})(Kitify);