var App = {
    Views: {},
    Controllers: {},
    Collections: {},
    init: function() {
        new App.Controllers.Projects();
        Backbone.history.start();
    }
};