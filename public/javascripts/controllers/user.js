App.Controllers.Users = Backbone.Router.extend({
    routes: {
        ":username/": "index",
        ":username/edit": "update"
    },
    
    create: function() {
        new App.Views.Project.Edit({ model: new Project() });
    },

    index: function(username) {
        $('#app-content-content').data('username',username);

        var projects = new App.Collections.Projects();
        projects.url = '/' + username + '/json';
        projects.fetch({
            success: function() {
                new App.Views.Project.Index({ collection: projects });
            },
            error: function() {
                new Error({ message: "Error loading documents." });
            }
        });
    },
    
    edit: function(username, id) {
        var project = new Project({ username: username, id: id });
        project.fetch({
            success: function(model, resp) {
                new App.Views.Project.Edit({ model: project });
            },
            error: function() {
                new Error({ message: 'Could not find that project.' });
                window.location.hash = '#';
            }
        });
    },

    delete: function(username, id) {
        var project = new Project({ username: username, id: id });
        project.destroy({
            success: function(model, resp) {
            },
            error: function() {
                new Error({ message: 'Could not find that project.' });
                window.location.hash = '#';
            }
        });
    }
});