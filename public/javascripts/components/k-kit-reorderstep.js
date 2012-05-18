(function(K) {
	K.KitReorderStep = function(options) {
		var _c = K.Component({ id:'kit' }, options);
		
		var $reorder_btn = $('#kit-reorder-btn');
                var $save_btn = $('#kit-reorder-save-btn');
                var $cancel_btn = $('#kit-reorder-cancel-btn');

                var $reorder_ctrls = $('#kit-reorder-ctrls');
                var $step_container = $('#kit-steps tbody');
 
                /*general comments: the way this works is that you have two ways
                to sort; you can do it by changing the numbers in input boxes on
                each row, or by dragging and dropping them (sortable). there are
                therefore 3 possible sources for step info: the data-step attribute,
                the position, and what's in the input box. generally the way it works
                is that when you hit "save", the position of the rows is what controls.
                data-step is then updated, sent to server, and rows are sorted
                again (hopefully to the same order) based on response.
                */               

                function _sortRowsByDataStep() {
                rows = $step_container.children('tr').get();
                rows.sort(function(a,b){
                        var a_val = $(a).attr('data-step');
                        var b_val = $(b).attr('data-step');
                        if (a_val>b_val){return 1;}
                        if (a_val<b_val){return -1;}
                        return 0;
                });
                $.each(rows, function(i,item) {
                $step_container.append(item);
                });
                }

                function _updateDataStepAttribute(row_data) {
                        $.each(row_data, function(k,v){
                        var num = k;
                        var id = v;      
                        var $step = $step_container.children('tr[data-id=\"'+v+'\"]');
                        $step.attr('data-step',k);
                        $step.find('.k-kit-step-num:first').text(k + ') ');
                        });
                }

                function _endSort() {
                        $step_container.sortable("disable");
                        $step_container.children('tr').removeClass('sortablerow');
                        $('.k-kit-reordering').removeClass('k-kit-reordering');
                        $reorder_btn.show();
                        $reorder_ctrls.addClass('hide');
                }

                function _updateInputBoxesByPosition() {
                        $('.k-kit-step-num').each(function(){
                        var step = $(this).parents('tr:first').index() + 1;
                        var $reorder_box = $(this).siblings(".k-kit-step-order-edit")
                        $reorder_box.val(step);
                        });        
                }

                function _updateRowPos($row, pos) {
                
                var $tbody = $row.parents('tbody:first');
                var step_rows = $tbody.children('tr').length;

                //get new_pos within range 1 to number of rows
                var new_pos = Math.max(Math.min(step_rows,pos),1);
                var current_pos = $row.index() + 1;
                
                var $anchor = $tbody.children('tr').eq(new_pos - 1);
                if (current_pos > new_pos) {$row = $row.insertBefore($anchor);}
                else if (new_pos > current_pos) {$row = $row.insertAfter($anchor);}
                }        

                function _setupEvents() {
                $('#kit-reorder-ctrls').addClass('hide');         
                
                $reorder_btn.click(function() {
                        //show reorder controls
                        $reorder_btn.hide();
                        $reorder_ctrls.removeClass('hide');
                        $('#kit-steps tr').addClass('k-kit-reordering');

                        //cancel any outstanding edits
                        $('.k-steps-editrow').remove();
                        $('.k-kit-step-editing').removeClass('k-kit-step-editing');

                        //make sortable
                        $step_container.sortable({
                        revert: true,
                        helper: 'original',
                        opacity: 0.5,
                        update: function() {_updateInputBoxesByPosition();}
                        });
                        $step_container.sortable("enable");
                        $step_container.children('tr').addClass('sortablerow');

                        _updateInputBoxesByPosition();
                });

                $save_btn.click(function() { 
                        $('.k-kit-step-order-edit').each(function(){
                        _updateRowPos($(this).parents('tr:first'),$(this).val());
                        });
                
                        var sorted = {};

                        //sorted elements: go through the tr elements and make data-step equal
                        //to order in DOM. jQuery guarantees .each will cycle through
                        //elements in DOM order, so .each should work here
                        $step_container.children('tr').each(function(i){
                                $(this).attr('data-step', i + 1);
                                sorted[i] = {
                                  id: $(this).attr('data-id'),      
                                  order: $(this).attr('data-step')
                                }
                        });

                        K.Data.save('/' + _c.pub.username + '/' + _c.pub.slug + '/' + _c.pub.token + '/steps/reorder', {order: sorted}, function(resp) {
                                if (resp && resp.success) {
                                _updateDataStepAttribute(resp['order']);
                                _sortRowsByDataStep();
                                _endSort();
                                }
                                });
                });

                $cancel_btn.click(function() {
                        _endSort();
                });
                };
                                
                _c.oninit = function() {
        	        //figure out how to centralize this functionality
                        _c.pub.username = $('#' + _c.options.id).attr('data-username');
                        _c.pub.slug = $('#' + _c.options.id).attr('data-id');
                        _c.pub.token = $('#' + _c.options.id).attr('data-token');

                	_setupEvents();
	       };

               return _c.pub;
       };       
})(Kitify);