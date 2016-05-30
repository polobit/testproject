;(function ($) { 
 
 var Agiletextarea  = function (e) {

   var $this    = $(this)
    var selector = $this.attr('data-target');
 }

 Agiletextarea.prototype.expand = function (e) {
  var ele = $(this);
  // Load js file and initialize expander 
   head.js("/flatfull/lib/jquery.textarea-expander.js?_=12", function() {
        $(ele).TextAreaExpander({padding: "8px 8px 1px 8px"});      
   });
 }

  $(document).on('click.bs.agiletxexpander.data-api', '[data-agileexpand="true"]', Agiletextarea.prototype.expand)

}(jQuery));