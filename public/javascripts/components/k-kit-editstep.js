(function(K) {
	K.EditStep = function(options) {
		var _c = K.Component({
			id:'editstep',
			fields: [
			{ id:'step-title', prop:'title', label:'Step title', required:true, submit:true},
			{ id:'step-optional', prop:'optional', required: false, submit:true},
			{ id:'step-thumb', prop:'thumb', required: false, submit:true},
			{ id:'step-instructions', label:'instructions', prop:'instructions', required:true, submit:true}
			]
		}, options);
		
		var $table;

		var _editTmpl = [
		'<tr class="k-steps-editrow" data-step="{{num}}" data-id="{{id}}">',
		'<td class="k-kit-steps-td">',
		'<div class="k-kit-step-div">',
			'<div class="k-step-ctrls">',
				'<a href="javascript:void(0)" class="k-kit-ctrls-save btn btn-small btn-primary">save</a>',
				'<a href="javascript:void(0)" class="k-kit-ctrls-cancel btn btn-small">cancel</a>',
			'</div>',
		'<input type="text" id="step-title" value="{{title}}" class="span5" required />',

		'<label for="step-optional">',
      	'<input type="checkbox" id="step-optional" value="{{optional}}" {{#optional}}checked="checked"{{/optional}}>Optional step?',
      	'</label>',
		'<div class="img-contain-placeholder"></div>',
		'<textarea id="step-instructions" length="1000" rows="4" class="span7" required>{{instructions}}</textarea>',
		'</div>',
		'</td></tr>'].join('');
		
		function _setupEdit($row) {
			var step = $row.data('step');
			//save the image uploader from being deleted; we insert it back in below
			var $stepPic = $row.find('.kit-img-container:first');
			if(step) {
				var $editRow = $(K.template(_editTmpl, step)).insertAfter($row);
				$editRow.find('.img-contain-placeholder:first').replaceWith($stepPic); 
				var form = K.Form.setup({
					context: $editRow,
					fields: _c.options.fields,
					data: step,
					btns: {
						submit: $('.k-kit-ctrls-save', $editRow)
					}
				});
				$(form).bind('submit', function(evt, edited) {
                                        edited.token = _c.manager.token;
                                        K.Data.save('/' + _c.manager.username + '/' + _c.manager.slug + '/steps/' + edited.id, edited, function(resp) {
						if(resp && resp.success !== false) {
							$editRow.remove();
							$('#instructions-additional').fadeOut('750');
							$(K).trigger('step-updated', [resp, $row]);
						}
					});
				});
			}
		}
		
		function _cancelEdit() {
			$editRow = $('.k-steps-editrow:first');
			$prevRow = $('.k-kit-step-editing:first');

			var $stepPic = $editRow.find('.kit-img-container:first');
			$stepPic.insertAfter($prevRow.find('.k-step-title-container:first'));
					
			$editRow.remove();
			$prevRow.removeClass('k-kit-step-editing');
		}

		_c.oninit = function() {
			$table = $('#kit-steps');
			
			$('#newstep-title').focus(function(){
				$('#instructions-additional').fadeIn('750');
			});

			_c.manager.username = $('#kit').attr('data-username');
			_c.manager.slug = $('#kit').attr('data-id');
			_c.manager.token = $('#kit').attr('data-token');

			$(document).on('hover', '#kit-steps tbody tr', function(evt) {
				if(!$(this).hasClass('k-steps-editrow') &&
				   !$(this).hasClass('sortablerow')) {
					if(evt.type === 'mouseenter') {
						$('.k-step-ctrls', this).show();
					} else {
						$('.k-step-ctrls', this).hide();
					}
				}
			});
						
			$('#kit-steps tbody').click(function(evt) {
				var $target = $(evt.target),
					$row = $target.parents('tr:first');

				if($target.hasClass('k-kit-ctrls-cancel')) {
					_cancelEdit();
				} else if($target.hasClass('k-kit-ctrls-edit')) {
					// clear out any existing edit rows
					_cancelEdit();									
					// hide display row
					$row.addClass('k-kit-step-editing');
					
					// setup edit row
					_setupEdit($row);
				} else if($target.hasClass('k-kit-ctrls-delete')) {
					var id = $row.attr('data-id');
					if(id) {
						K.Data.del('/' + _c.manager.username + '/' + _c.manager.slug + '/steps/' + id, { token:_c.manager.token }, function(resp) {
							$row.fadeOut(function() {
								$row.remove();
								$(K).trigger('step-deleted', [resp.id]);
							});
						});
					}
				}
			});
		};
		
		return _c.pub;
	};
})(Kitify);