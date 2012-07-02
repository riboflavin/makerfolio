if (!App.Views.Project || typeof App.Views.Project === "undefined") App.Views.Project = {}

App.Views.Project.Index = Backbone.View.extend({

    initialize: function() {
        this.projects = this.options.projects;
        this.render();
    },
    
    render: function() {
        $(this.el).html(JST.project_collection({ collection: this.collection }));    
    	$(this.el).appendTo($('#app-content-content'));
    }
});