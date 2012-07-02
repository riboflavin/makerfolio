var App = {
    Views: {},
    Controllers: {},
    Collections: {},
    init: function() {
        new App.Controllers.Projects();
        new App.Controllers.Attachments();
        new App.Controllers.Users();
        Backbone.history.start({pushState: true});
    }
};

$(function() {
  App.init();
});
