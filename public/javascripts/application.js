var App = {
    Views: {},
    Controllers: {},
    init: function() {
        new App.Controllers.Projects();
        Backbone.history.start();
    }
};