(function(K) {
	K.KitImage = function(options) {
        var _c = K.Component({ id:'kit', components:{} }, options);
		var _pics = [];

		var _emptyPicTmpl =
        ['<a class="btn btn-small btn-success upload-trigger"><i class="icon-plus-sign"></i></a>',
        '<div class="popup-loader hide k-shadow">',
            '<a class="close">×</a>',
            '<span class="fileinput-button">',
            '<input type="file" name="files" multiple="false"></input>',
            '<div class="progressbar progress progress-striped active">',
            '<div style="width:0%;" class="bar"></div>',
            '</div>',
            '</span>',
         '</div>'
        ].join('');

        var _picTmpl = 
        ['<img class="kit-img" src={{thumb_url}}></img>',
         '<div class="kit-img-control">',
		 '<i data_id="{{att_id}}" rel="nofollow" class="icon-remove cursor-pointer"></i>',
		 '<i data_url="{{url}}" class="icon-zoom-in cursor-pointer"></i>',
         '</div>'
        ].join('');

        function _fillContainer($container,pic) {
            if(pic.url || pic.thumb_url)
                {
            var $ready_img = $(K.template(_picTmpl, pic));
            $container.removeClass('kit-img-empty')
                      .empty()
                      .append($ready_img);
            _setupToolbar();
                }
            else
                {_resetContainer($container);}
        }

        function _resetContainer($container) {             
             $container
                .empty()
                .append($(_emptyPicTmpl))
                .addClass('kit-img-empty');
 
             if ($container.parent().attr('#kit-img-div'))
             {$container.appendTo($container.parent());}
             
             var ftype = $container.attr('data-ftype');
             var ps_id = $container.attr('data-id');
             upload_options_type = $.extend({},upload_options,
                 {formData: {type: ftype, ps_id: ps_id}})
             
             $upload_anchor = $container.find('.fileinput-button:first');
             $upload_anchor.fileupload('destroy');
             $upload_anchor.fileupload(upload_options_type);

             $trigger = $container.find('.upload-trigger:first');
             $trigger.on('click',function(){
                $loader = $container.find('.popup-loader:first');
                $loader.toggleClass('hide');  
                $('.popup-loader').not($loader).addClass('hide');
             });

             $close = $container.find('.close:first');
             $close.on('click',function(){
                $loader = $container.find('.popup-loader:first');
                $loader.toggleClass('hide');  
                $('.popup-loader').not($loader).addClass('hide');
             });
        }

		function _deletePic(id, $container) {
        K.Data.del('/' + _c.pub.username + '/' + _c.pub.slug + '/' + _c.pub.token + '/attachments/' + id, 
            function(resp) {
        if(resp && resp.success) 
        	{_resetContainer($container);}
        else 
            {Kitify.Message.show(data['result']['message'], 'error');}
    	});
    	}
		
		function _magnifyPic(url, $container) {
            $('#modal-image').attr('src',url);
            $('#kit-image-modal').css('margin-left',($('#kit-image-modal').outerWidth()/2)*-1).modal('show');            
		}

        var upload_options = {
            url: (window.location.href).replace(location.hash,"").replace("#","") + '/attachments/',
            autoUpload: true,
            type: 'POST',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: '3000000',
            sequentialUploads: true,
            singleFileUploads: true,
            timeout: '30000',

            add: function(e, data) {
            $o = $(this).data('fileupload').options;
            file = data.originalFiles[0];

            if (!($o.acceptFileTypes.test(file.type) ||
                    $o.acceptFileTypes.test(file.name))) {
                file.error = 'acceptFileTypes';
                e.data.fileupload._trigger('fail', e, data);
            }
            if ($o.maxFileSize &&
                    file.size > $o.maxFileSize) {
                file.error = 'maxFileSize';
                e.data.fileupload._trigger('fail', e, data);
            }
            else {data.submit();}
            },

            fail: function (e, data) {
            $o = $(this).data('fileupload').options;
            if (data.originalFiles[0].error == 'maxFileSize')
                {Kitify.Message.show('Sorry, this file is too big. The maximum upload size is ' + (($o.maxFileSize)/1000000).toFixed(1) + ' megabytes.', 'error');}
            if (data.originalFiles[0].error == 'acceptFileTypes')
                {Kitify.Message.show('Sorry, this type of file isn\'t allowed.', 'error');}
            else if (data.errorThrown == 'timeout')
                {Kitify.Message.show('Sorry, the server took too long to respond. Please try again; uploading a smaller file might help.', 'error');}
            else {Kitify.Message.show('There was an error uploading your file.', 'error');}

                $target = $(e.target);
                $target = $($target.get(0));
                done = parseInt(0);
                $target.parents('[class*="kit-img-container"]:first').find(".bar:first").css('width',done + '%');

            
                setTimeout(function() {
                    $('.k-header-notice').removeClass('k-header-notice-saving').fadeOut('750');
                }, 1500);
            },
            
            send: function(e, data){
                console.log(data);
                //test to see if using iframe transport - if so, don't use progress bar
                if (data.dataType.substr(0, 6) == 'iframe') {
                    $('.k-header-notice-text').children('span:first').text('Working...');
                    $('.k-header-notice').addClass('k-header-notice-saving').fadeIn('750');
                    $('#kitify-ajax-img').show();
                    $('.progress').css('visibility','hidden');

                    $target = $(e.target);
                    $target = $($target.get(0));
                    $target.parents('[class*="kit-img-container"]:first').find(".bar:first").css('width','100%');
                }
            },

            progress: function(e, data){
                $target = $(e.target);
                $target = $($target.get(0));
                done = parseInt(100 * e.loaded / e.total);
                $target.parents('[class*="kit-img-container"]:first').find(".bar:first").css('width',done + '%');
            },
            
            done: function(e, data){
                setTimeout(function() {
                    $('.k-header-notice').removeClass('k-header-notice-saving').fadeOut('750');
                }, 1500);
                $target = $(e.target);
                $container = $($target.parents('[class*="kit-img-container"]:first').get(0));
                if(data['result']['success'])
                {_fillContainer($container,data['result']['attachments']);}
                else
                {
                    Kitify.Message.show(data['result']['message'], 'error');
                    $target.parents('[class*="kit-img-container"]:first').find(".bar:first").css('width','0%');
                }               
            }                      
        }

		function _setupToolbar() {
            $('.kit-img-control').unbind();
            $('.kit-img-control').on('click',function(e) {
                var $target = $(e.target);       
                var $target_container = $target.parents('.kit-img-container:first'); 
                if ($target_container[0] === undefined)
                   {$target_container = $target.parents('.kit-img-container-mini:first');}
                _toolbar($target, $target_container);
            });

            if (!$('#kit').hasClass('editable')) {
                $('.kit-img-control').remove();
                $('.kit-img-container-mini').click(function(){
                    _magnifyPic($(this).attr('data_url'))
                });
                $('.kit-img-container').click(function(){
                    _magnifyPic($(this).attr('data_url'))
                });
            }
		}

        function _toolbar($button, $container) {
                if($button.hasClass('icon-remove')) {
                    _deletePic($button.attr('data_id'), $container);
                } else if($button.hasClass('icon-zoom-in')) {
                    _magnifyPic($button.attr('data_url'));
                }
        }

		_c.oninit = function() {
			_c.pub.username = $('#kit').attr('data-username');
			_c.pub.slug = $('#kit').attr('data-id');
			_c.pub.token = $('#kit').attr('data-token');
				        
            $('.kit-img-empty').each(function(){
                _resetContainer($(this));
            });


            K.Data.get('/' + _c.pub.username + '/' + _c.pub.slug + '/attachments', function(resp) {
                    $.each(resp['attachments'], function(i, pic) {
                    var $container = $("#kit-img-div").children('.kit-img-empty:first');
                    _fillContainer($container,pic);
                    _setupToolbar();
                });
            });

            $(K).bind('step-row-created', function(evt, step) {
                _resetContainer($('#step-img-upload'));

                $step_row = $('#kit-steps').find('tr[data-id="'+step.id+'"]');
                $container = $step_row.find('.kit-img-container:first');
                _fillContainer($container,step);
            });

            $(K).bind('item-row-created', function(evt, item) {
                _resetContainer($('#item-img-upload'));
 
                $item_row = $('#kit-items').find('tr[data-id="'+item.id+'"]');
                $container = $item_row.find('.kit-img-container-mini:first');
                _fillContainer($container,item);
            });
            }
		
       return _c.pub;
	}
})(Kitify);