/*(function(K) {    
	K.ImageToolbar = function(options) {

        var _c = K.Component({ id:'kit-img-div' }, options);   

	function _setupEvents() {
        $('.kit-img-delete-button').bind('click', function (e) {
        //todo: add error stuff here too

        parent_container = $(this).parent().parent();
        e.preventDefault();

        K.Data.del('/' + _c.manager.username + '/' + _c.manager.slug + '/' + _c.manager.token + '/attachments/' + $(this).attr("data-id"), function(resp) {
        if(resp && resp.status == 'success') {
                   $('#kit-img-div').fadeOut('slow',function(){
                   $(parent_container).find('.kit-img-control').hide()
                   $(parent_container)
                        .removeClass('kit-img-full')
                        .addClass('kit-img-empty') 
                        .find('.kit-img-src')
                        .hide()
                        .attr("src",'')
                        .show()
                   $('#kit-img-div').append($(parent_container));
                   $('#kit-img-div').fadeIn('slow');
                   });
                   }
                });
            });

        $('.kit-img-magnify-button').bind('click', function (e) {
            e.preventDefault();
            var modal_url = $(this).attr('data_url');
            $('#modal-image').attr('src',modal_url);
            $('#kit-image-modal').css('margin-left',($('#kit-image-modal').outerWidth()/2)*-1);            
            $('#kit-image-modal').modal('show');
            $('#kit-image-modal').draggable({handle: ".modal-header, .modal-body"});
        });
        }
    
        _c.oninit = function() {_setupEvents();}
        return _c.pub;

        }
})(Kitify);

*/