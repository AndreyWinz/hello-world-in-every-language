$(function() {
     (function() {
         var View = Backbone.View.extend({
             'el': 'body',
             'template': _.template('<h1>Hello, World!</h1>'),
              'initialize': function() {
                 this.render();
             },
             'render': function() {
                 this.$el.html(this.template());
             }
         });
 
         new View();
     })()
 });
