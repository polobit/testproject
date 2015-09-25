var VoiceMailRouter = Backbone.Router.extend({

	routes : {
	"voicemail" : "voicemail"
	},

	voicemail : function(){
		var that = this;
		getTemplate('settings', {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#content').html($(template_ui));	

			$('#PrefsTab .select').removeClass('select');
			$('.add-widget-prefs-tab').addClass('select');
			
			that.VoiceMailCollectionView = new Base_Collection_View({ url : 'core/api/voicemails', templateKey : "voice-mail", cursor : true, page_size : 20,
				individual_tag_name : 'tr', postRenderCallback : function(el)
				{
					includeTimeAgo(el);
				},
				appendItemCallback : function(el)
				{ 
					// To show time ago for models appended by infinite scroll
					includeTimeAgo(el);
				} });
			
			that.VoiceMailCollectionView.collection.fetch();
			console.log(that.VoiceMailCollectionView);
			$('#prefs-tabs-content').html(that.VoiceMailCollectionView.render().el);

		}, "#content");
	}
});
