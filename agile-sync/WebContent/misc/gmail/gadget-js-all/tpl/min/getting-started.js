(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['getting-started'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"well well-small agile-one-time-setup\" style=\"margin:0px; border-radius:0px; background-color:#f2f2f2; box-shadow:none; border-bottom:0px; border-left:0px; border-right:0px;\">\n <p>Associate your account - one time setup</p>\n<input id=\"user_domain\" class=\"input-medium\" placeholder=\"my domain\" style=\"vertical-align:baseline; margin-bottom:4px;\" type=\"text\" />\n<span style=\"font-weight:bold;\">.agilecrm.com</span>\n<p style=\"color:#b2b0b1;\"><small>Enter the part before \".agilecrm.com\" that you use to access your Agile CRM account.</small></p>\n<P style=\"margin:0px;\"><input type=\"button\" value=\"Associate\" onclick=agile_gadget_open_popup(\"\n\") class=\"btn btn-primary\" style=\"padding:2px 6px 2px;\">\n<span id=\"notify_user\" style=\"display:none; margin-left:20px; color:indianred;\"><i>Please enter your domain.</i></span></P>\n</div>";
  });
})();