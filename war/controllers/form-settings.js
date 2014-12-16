var FormsRouter = Backbone.Router.extend({
	routes : { "forms" : "formSettings" },
	formSettings : function()
	{
		console.log("forms collection template");
		
		this.formsListView = new Base_Collection_View({ url : '/core/api/forms', restKey : "forms", templateKey : "forms",
			individual_tag_name : 'tr' })
		$("#content").html(this.formsListView.el);

		var forms = this.formsListView.collection.fetch().responseText;

		if (forms)
		{
			forms = JSON.parse(forms);

			for ( var j = 0; j < forms.length; j++)
			{
				var form = forms[j];

				var formView = new Base_Model_View({ template : "forms" });
				$("#forms-model-list").append(formView.el);
			}
		}
	} });
