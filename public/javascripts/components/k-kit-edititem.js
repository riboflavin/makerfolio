(function(K) {
	K.EditItem = function(options) {
		var _c = K.Component({
			id:'edititem',
			fields: [
				{ id:'item-name', prop:'name', label:'Item name', required:true, submit:true },
				{ id:'item-quantity', prop:'quantity',label:'Quantity', required:true, submit:true },
				{ id:'item-units', prop:'units',label:'Units', required: false,  submit:true },
				{ id:'item-merchanturl', label:'Web address', prop:'merchant_url', required:false, submit:true },
				{ id:'item-heavy', label:'Heavy', prop:'heavy', required:false,  submit:true },
				{ id:'item-optional', label:'Optional', prop:'optional', required:false,  submit:true },
				{ id:'item-notes', label:'Notes', prop:'notes', submit:true }
			]
		}, options);
		
		var $table,
			$ctrls;
		
		var _editTmpl = [
		'<tr class="k-items-editrow">',
		'<td class="k-kit-items-col-name">',
		'<input type="text" id="item-name" value="{{name}}" class="span2" required /></td>',
		'<td class="k-kit-items-col-image">',
			'<div class="img-contain-placeholder"></div>',
		'</td>',
		'<td class="k-kit-items-col-number"><input id="item-quantity" value="{{quantity}}" class="span1" required /><input id="item-units" value="{{units}}" class="span1" /></td>',
		'<td class="k-kit-items-col-link"><input type="url" id="item-merchanturl" value="{{merchant_url}}" class="required span2"/></td>',
		'<td class="k-kit-items-col-optional"><input type="checkbox" id="item-optional" value="{{optional}}" {{#optional}}checked="checked"{{/optional}}/></td>',
		'</td>',
		'<td class="k-kit-items-col-notes">',
		'<input type="text" id="item-notes" value="{{notes}}" class="span1" />',
		'</td>',
		'<td class="k-kit-items-col-controls">',
			'<div class="k-item-ctrls">',
			'<a href="javascript:void(0)" class="k-kit-ctrls-save btn btn-small btn-primary">save</a>',
			'<a href="javascript:void(0)" class="k-kit-ctrls-cancel btn btn-small">cancel</a>',
			'</div>',
		'</td>',
		'</tr>'].join('');
		
		function _setupEdit($row) {
			var item = $row.data('item');
			//save the image uploader from being deleted; we insert it back in below
			var $itemPic = $row.find('.kit-img-container-mini:first');
			if(item) {
				var $editRow = $(K.template(_editTmpl, item)).insertAfter($row);
				$editRow.find('.img-contain-placeholder:first').replaceWith($itemPic); 
				var form = K.Form.setup({
					context: $editRow,
					fields: _c.options.fields,
					data: item,
					btns: {
						submit: $('.k-kit-ctrls-save', $editRow)
					}
				});
				$(form).bind('submit', function(evt, edited) {
                                        edited.token = _c.manager.token;
                                        K.Data.save('/' + _c.manager.username + '/' + _c.manager.slug + '/items/' + edited.id, edited, function(resp) {
						if(resp && resp.success !== false) {
							resp.price = parseFloat(resp.price);
							$editRow.remove();
							$(K).trigger('item-updated', [resp, $row]);
						}
					});
				});
			}
		}
		
		function _cancelEdit() {
			$editRow = $('.k-items-editrow:first');
			$prevRow = $('.k-kit-item-editing:first');

			var $itemPic = $editRow.find('.kit-img-container-mini:first');
			$itemPic.appendTo($prevRow.find('.k-kit-items-col-image'));
					
			$editRow.remove();
			$prevRow.removeClass('k-kit-item-editing');
		}

		_c.oninit = function() {
			$table = $('#kit-steps');
												
			_c.manager.username = $('#kit').attr('data-username');
			_c.manager.slug = $('#kit').attr('data-id');
			_c.manager.token = $('#kit').attr('data-token');
			
			$(document).on('hover', '#kit-items tbody tr', function(evt) {
				if(!$(this).hasClass('k-items-editrow')) {
					if(evt.type === 'mouseenter') {
						$('.k-item-ctrls', this).show();
					} else {
						$('.k-item-ctrls', this).hide();
					}
				}
			});
						
			$('#kit-items tbody').click(function(evt) {
				var $target = $(evt.target),
					$row = $target.parents('tr:first');
				
				 if($target.hasClass('k-kit-ctrls-cancel')) {
					_cancelEdit();
				} else if($target.hasClass('k-kit-ctrls-edit')) {
					// clear out any existing edit rows
					_cancelEdit();		
					// hide display row
					$row.addClass('k-kit-item-editing');
					
					// setup edit row
					_setupEdit($row);
				} else if($target.hasClass('k-kit-ctrls-delete')) {
					var id = $row.attr('data-id');
					if(id) {
						K.Data.del('/' + _c.manager.username + '/' + _c.manager.slug + '/items/' + id, { token:_c.manager.token }, function(resp) {
							$row.fadeOut(function() {
								$row.remove();
								$(K).trigger('item-deleted', [resp.id]);
							});
						});
					}
				}
			});
		};
		
		return _c.pub;
	};
})(Kitify);