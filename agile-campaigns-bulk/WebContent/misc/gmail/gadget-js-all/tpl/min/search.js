(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['search'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		<div class=\"well well-small gadget-contact-details-tab\" style='margin:0px; border-radius:0px; background-color:white; box-shadow:none; border-bottom:0px; border-left:0px; border-right:0px;'>\n			<div class=\"show-form\" data-content=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.value)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n<!--email list -->\n				<div class=\"contact-list\">\n					<div class=\"agile-no-contact row-fluid\">\n						<div class=\"contact-list-width\" style=\"max-width:95%; display:inline-block; vertical-align:middle;\">\n							<div style=\"text-overflow: ellipsis; white-space: nowrap; overflow: hidden;\">\n								";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.value)),stack1 == null || stack1 === false ? stack1 : stack1.name), {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n							</div>\n						</div>\n						<img class=\"contact-search-waiting\" style=\"margin-left:20px; display:none; width:13px; vertical-align:middle;\" src=\"https://googleapps.agilecrm.com/img/ajax-loader-cursor.gif\"></img>\n					</div>\n			    </div>\n			</div>\n		</div>\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n									<a class=\"gadget-search-contact\" style=\"cursor:pointer; margin:0px 10px 0px 0px; text-decoration:underline; font-weight:bold;\"><i class=\"icon-search\" style=\"text-decoration:none; margin-right:5px;\"></i><span>Search</span></a><span title=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.value)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "  ("
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.value)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ")\" style=\"cursor:default;\"> "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.value)),stack1 == null || stack1 === false ? stack1 : stack1.fname)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.value)),stack1 == null || stack1 === false ? stack1 : stack1.lname)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " ("
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.value)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ") <span style=\"margin-left:10px;\">in Agile Contacts</span></span>\n								";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n									<a class=\"gadget-search-contact\" style=\"cursor:pointer; margin:0px 8px 0px 5px; text-decoration:underline; font-weight:bold;\"><i class=\"icon-search\" style=\"text-decoration:none; margin-right:5px;\"></i><span>Search</span></a><span title=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.value)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"cursor:default;\"> "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.value)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " <span style=\"margin-left:10px;\">in Agile Contacts</span></span>\n								";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<!--Search email panel -->			\n			<div class=\"well well-small gadget-contact-details-tab\" style=\"margin:0px 0px -1px 0px; box-shadow:none; border-radius:0px; background-color:white;\">\n				<div class=\"show-form\">\n					<div>\n						<div class=\"row-fluid\">\n							\n	<!-- Search mail UI area start-->\n							<div style=\"line-height:22px;\">\n								<div class=\"search-pannel-inner\">\n									\n									<div style=\"display: inline-block;vertical-align: middle;\">\n										<a class=\"gadget-search-contact search-mail-button\" style=\"cursor:pointer; margin:0px 10px 0px 0px; text-decoration:underline; font-weight:bold;\"><i class=\"icon-search\" style=\"text-decoration:none; margin-right:5px;\"></i><span>Search</span></a>\n									</div>\n									<div class=\"btn-group\" style=\"display: inline-block;vertical-align: middle;margin: 0 10px 0 0;\">\n										<select id=\"search_drop_down\" class=\"agile-mail-dropdown\" style=\"width:auto; margin:0px;\">\n											<!-- dropdown menu links -->\n											";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "	\n										</select>\n									</div>\n									<div style=\"display: inline-block;vertical-align: middle;\">\n										<span style=\"display:inline-block;\">in Agile Contacts</span>\n										<img class=\"contact-search-waiting\" style=\"margin-left:20px; display:none; width:13px;\" src=\"https://googleapps.agilecrm.com/img/ajax-loader-cursor.gif\"></img>\n										<i class=\"contact-search-status\" style=\"display:none; color:indianred; margin-left:20px;\">Contact not found</i>\n									</div>\n								</div>\n							</div>\n	<!-- Search mail UI area end-->						\n						</div>\n					</div>\n				</div>\n			</div>\n	";
  return buffer;
  }
function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "											\n												";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.name), {hash:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n											";
  return buffer;
  }
function program8(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n													<option class=\"mail-list\" data-content=\"";
  if (helper = helpers.email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" >";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " (";
  if (helper = helpers.email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ")</option>\n												";
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n													<option class=\"mail-list\" data-content=\"";
  if (helper = helpers.email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" >";
  if (helper = helpers.email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n												";
  return buffer;
  }

  stack1 = (helper = helpers.check_json_length || (depth0 && depth0.check_json_length),options={hash:{},inverse:self.program(6, program6, data),fn:self.program(1, program1, data),data:data},helper ? helper.call(depth0, depth0, "1", options) : helperMissing.call(depth0, "check_json_length", depth0, "1", options));
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });
})();