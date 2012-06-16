App.Controllers.Attachments = Backbone.Router.extend({
    routes: {
        ":username/:project/attachments": "index",
        ":username/:project/attachments/:id": "index",
        ":username/:project/attachments/new": "new",
        ":username/:project/attachments/:id/delete": "delete"
    },
    
    edit: function(id) {
        var doc = new Document({ id: id });
        doc.fetch({
            success: function(model, resp) {
                new App.Views.Edit({ model: doc });
            },
            error: function() {
                new Error({ message: 'Could not find that document.' });
                window.location.hash = '#';
            }
        });
    },
    
    index: function() {
        $.getJSON('/documents', function(data) {
            if(data) {
                var documents = _(data).map(function(i) { return new Document(i); });
                new App.Views.Index({ documents: documents });
            } else {
                new Error({ message: "Error loading documents." });
            }
        });
    },
    
    newDoc: function() {
        new App.Views.Edit({ model: new Document() });
    }
});