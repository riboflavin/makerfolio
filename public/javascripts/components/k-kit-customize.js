(function(K) {
	K.KitCustomize = function(options) {
		var _c = K.Component({ id:'kit-customize' }, options);
		
		var t = tinycolor;
		var set = {};
		var fonts = [ 'Acme', 'Amethysta', 'Creepster', 'Cutive', 'Engagement', 'Ewert', 'Frijole', 'Fugaz', 'Limelight', 'Mystery Quest', 'Sevillana', 'Simonetta', 'Quicksand'];
		
		//control template setup so that we can easily add new customization options
		var color_swatches = 
		['<div class="swatch_chooser_container">',
         //use array of 11 for 10 elements
		 Array(11).join('<div class="swatch_chooser"></div>'),
		 '</div>'
		 ].join('');

		var color_slider =
		['<div class="flat-slider">',
	     '<div class="colorslider red"></div>',
      	 '<div class="colorslider green"></div>',
      	 '<div class="colorslider blue"></div>',
      	 '</div>'
      	 ].join('');
		
		var default_chooser =
		['<div class="default_chooser">',
      	 '</div>'
      	 ].join('');

		var font_chooser = 
		['<div class="btn-group fontpicker">','<a class="btn btn-large fontpicker-display" href="javascript:void(0);">Font</a>',
         '<a class="btn btn-large dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);">',
         '<span class="caret"></span>',
         '</a>',
          '<ul class="dropdown-menu font-list">',
            '<li><a class="font_entry" href="javascript:void(0);" data-font="" style:"font-family: "";">Default</a></li>',
          '</ul>',
          '</div>'
		].join('');

		var controls_append = {
			'color-swatches': color_swatches,
			'color-slider': color_slider,
			'font-chooser': font_chooser, 
			'default-chooser': default_chooser
		};

		function _postKitCustomize($s) {
			var customized = {};
			id = $s.attr("id");
			customized[id] = {};

			var bcolor = $s.css("background-color");
			customized[id].background_color = t(bcolor).toHexString();
			//#000 means transparent / none; black is set at #000001 below
			if (customized[id].background_color == '#000') {customized[id].background_color = 'none';}
			if (customized[id].background_color == '#333') {customized[id].background_color = 'none';}

			var color = $s.css("color");
			customized[id].color = t(color).toHexString();
			//#000 means trasparent / none; black is set at #000001 below
			//#333 is default
			if (customized[id].color == '#000') {customized[id].color = 'none';}
			if (customized[id].color == '#333') {customized[id].color = 'none';}

			if ($s.css("background-image") && ($s.css("background-image") != 'none')) 
				{customized[id].background_image = true;}
			else 
				{customized[id].background_image = 'none';}
	
			customized[id].font_family = $s.attr("data-font");

			customized = {'customizations': customized};
			K.Data.save('/' + _c.manager.username + '/' + _c.manager.slug + '/' + _c.manager.token + '/customizations', customized, function(resp) {
			});
		}
		
		function _setupEvents() {
		$('#k-kit-customize tbody').click(function(evt) {
			var $target = $(evt.target);
			if ($target.hasClass('default_chooser')) {
				$s = $target.parents('.customize-controls').siblings('.swatch');
				$s.css('background-image','')
					.css('background-color','')
					.css('color','')
					.css('font-family','');
				$s.attr('data-font','');

				p_swatch_class = '.' + $s.attr('id').replace('k-','p-');
				$(p_swatch_class)
					.css('background-image','')
					.css('background-color','')
					.css('color','')
					.css('font-family','');

				_postKitCustomize($s);

				$d = $target.parents('.customize-controls').find('.icon-remove:first');
				$d.trigger('click');	
			}

			if ($target.hasClass('kit-img')) {
				$s = $target.parents('.customize-controls').siblings('.swatch');		

				var b = $target.attr('src');
				b = 'url(' + b + ')';
				$s.css('background-image',b);
				$s.css('background-color','none');
				$s.css('color','none');

				p_swatch_class = '.' + $s.attr('id').replace('k-','p-');
				$(p_swatch_class).css('background-image',b);
				$(p_swatch_class).css('background-color','none');
				$(p_swatch_class).css('color','none');
 				
				_postKitCustomize($s);
			}

			if ($target.hasClass('swatch_chooser')) {
				var c = $target.css('background-color');
				//not even jQuery implements null background color in a way that
				//can be reliably tested for cross-browser. so later we will assume
				//#000 is transparent. therefore, now, if swatch is black, make it
				//just a little less black. also do this for default color (#333).
				if (t(c).toHexString() == '#000') {c = '#000001';} 
				if (t(c).toHexString() == '#333') {c = '#333334';} 

				$s = $target.parents('.customize-controls').siblings('.swatch');		

				p_swatch_class = '.' + $s.attr('id').replace('k-','p-'); 				
 				if (p_swatch_class == '.p-swatch-title') {
					$s.css('color',c);
	 				$(p_swatch_class).css('color',c)
	 			}
				else {
					$s.css('background-color',c);
					$s.css('background-image','none');
					$(p_swatch_class).css('background-color',c);
					$(p_swatch_class).css('background-image','none');
				}

				_postKitCustomize($s);

				$d = $target.parents('.customize-controls').find('.icon-remove:first');
				$d.trigger('click');	
			}
			
			if ($target.hasClass('font_entry')) {
				$chooser = $target.parents('ul:first').siblings('.fontpicker-display:first');
				chooser_fontfam = $target.css('font-family')

				//change display of top element of combo box to 
				//reflect currently selected font
				$chooser.text($target.text()); 	
				$chooser.css('font-family',chooser_fontfam); 	

				$s = $chooser.parents('.controls:first').children('.swatch:first');
				//use data-font to avoid storing highly specific browser font lists in db
				$s.attr('data-font',chooser_fontfam); 	
				$s.css('font-family',chooser_fontfam);

				p_swatch_class = '.' + $s.attr('id').replace('k-','p-');
				$(p_swatch_class).css('font-family',chooser_fontfam);
				$(p_swatch_class).attr('data-font',chooser_fontfam);

				_postKitCustomize($s);
			}			
		});							
		}

		function _refreshSwatch() {
		    var red = $( ".colorslider.red" ).slider( "value" );
		    var green = $( ".colorslider.green" ).slider( "value" );
		    var blue = $( ".colorslider.blue" ).slider( "value" );
		    
			var c = tinycolor('rgb ' + red + ',' + green + ',' + blue);

		    adjust_array = [
		    t.lighten(c,0),t.lighten(c,20),t.darken(c,20),t.analogous(c)[1],
		    t.analogous(c)[2],t.triad(c)[1],t.triad(c)[2],t.tetrad(c)[1],t.tetrad(c)[2],
		    t.tetrad(c)[3],t.darken(c,255),t.lighten(c,255)
		    ];

		    $( "#k-swatch-scheme" ).css( "background-color", c.toHexString());
			$('.swatch_chooser_container').each(function(){
		    	$sc = $(this).children('.swatch_chooser');
				for (var i = 0; i < adjust_array.length; i++)
				{$sc.eq(i).css('background-color', adjust_array[i].toHexString());}
		    });
		}
    
		function _webFontSetup() {
		    WebFontConfig = {
		      google: { families: fonts },
		      active: function() { _fontpickerSetup(); },
		      inactive: function() {$('.fontpicker').remove();}
			}
		}

		function _fontpickerSetup() {		
			  var font_list = [];

			  for (i in fonts) {
			  $new_item = $('<a class="font_entry" href="javascript:void(0);">' + fonts[i] + '</a>');
			  $new_item.attr('data-font',fonts[i]);
			  $new_item.css('font-family','"' + fonts[i] + '", sans-serif');
			  $new_item = $('<li></li>').append($new_item);
			  font_list.push($new_item.get(0));
			  }
			  $('.fontpicker').children('.font-list').append($(font_list));
		}

		function _getKitCustomize() {
            K.Data.get('/' + _c.pub.username + '/' + _c.pub.slug + '/customizations', function(resp) {
            	$.each(resp,function() {
            		this.property = this.property.replace('_','-');
            		$('#' + this.element).css(this.property,this.value);
            		$('.' + this.element.replace('k-','p-')).css(this.property,this.value);
            	});
                });
		}

		function _getKitCustomize_fixed() {
            K.Data.get('/' + _c.pub.username + '/' + _c.pub.slug + '/customizations', function(resp) {
            	$.each(resp,function() {
            		this.property = this.property.replace('_','-');
            		el = this.element.replace('k-swatch-','');
            		if (el == 'app-bg') {el = '#container';} 
            		if (el == 'kit-bg') {el = '#content-inner';} 
            		if (el == 'title') {el = '#title';} 
            		if (el == 'table-items') {el = 'tr';} 
            		if (el == 'table-headers') {el = 'th';} 
            		$(el).css(this.property,this.value);
					});
            	});
		}

		_c.oninit = function() {
			_c.pub.username = $('#kit').attr('data-username');
			_c.pub.slug = $('#kit').attr('data-id');
			_c.pub.token = $('#kit').attr('data-token');
				        
		    _webFontSetup();

		    $('.customize-controls').each(function(){
				var classes = $(this).attr('class').split(" ");

				for (var i = 0; i < classes.length; i++) {
 					$(this).append(controls_append[classes[i]]);
				}
				//hack to get background chooser at end, followed by default chooser
				$(this).append($(this).children('.default_chooser'));
				$(this).append($(this).children('.kit-img-container-mini'));
			});

		    $( ".colorslider" ).slider({
		      orientation: "horizontal",
		      range: "min",
		      max: 255,
		      value: 127,
		      slide: _refreshSwatch,
		      change: _refreshSwatch
		    });

		    _refreshSwatch();
			_setupEvents();
	        if ($('#kit').hasClass('editable')) { _getKitCustomize(); }
	        else { _getKitCustomize_fixed(); }
		};

		return _c.pub;
		
	};

})(Kitify);