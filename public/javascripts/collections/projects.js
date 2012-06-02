App.Collections.Documents = Backbone.Collection.extend({
    model: Project,
    url: '/projects'
});