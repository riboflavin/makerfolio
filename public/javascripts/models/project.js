var Project = Backbone.Model.extend({
    initialize: function(attributes) { this.id = attributes['_id']; }
});