var FormsRouter = Backbone.Router.extend({
	routes : { "forms" : "formSettings" },
	formSettings : function()
	{
		console.log("forms collection template");
		
		this.formsListView = new Base_Collection_View({ url : '/core/api/forms', restKey : "forms", templateKey : "forms",
			individual_tag_name : 'tr', postRenderCallback : function(el){
				head.js(LIB_PATH + 'lib/jquery.timeago.js', function(el)
						{
							$("time.form-modified-time", el).timeago();
						});
			} })
		this.formsListView.collection.fetch();
		$("#content").html(this.formsListView.el);
	} });
