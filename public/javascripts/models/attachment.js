var Attachment = Backbone.Model.extend({
        
        defaults: {
            name: '',
            age: 0,
            children: []
        },

        initialize: function(){
            alert("Welcome to this world");
        }

    // url : function() {
    //   var base = 'documents';
    //   if (this.isNew()) return base;
    //   return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
    // }
});