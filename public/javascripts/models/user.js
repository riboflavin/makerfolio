var User = Backbone.Model.extend({

        defaults: {
            name: '',
            age: 0,
            children: []
        },

        initialize: function(){
            alert("Welcome to this world");
        }
});