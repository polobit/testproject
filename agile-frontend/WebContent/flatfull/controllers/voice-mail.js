var VoiceMailRouter = Backbone.Router.extend({

	routes : {
	"voicemail" : "voicemail"
	},

	voicemail : function(){

		getTemplate('settings', {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#content').html($(template_ui));	

			$('#PrefsTab .select').removeClass('select');
			$('.add-widget-prefs-tab').addClass('select');
			
			this.VoiceMailCollectionView = new Base_Collection_View({ url : 'core/api/voicemails', templateKey : "voice-mail", cursor : true, page_size : 20,
				individual_tag_name : 'tr', postRenderCallback : function(el)
				{
					includeTimeAgo(el);
				},
				appendItemCallback : function(el)
				{ 
					// To show time ago for models appended by infinite scroll
					includeTimeAgo(el);
				} });
			
			this.VoiceMailCollectionView.collection.fetch();
			console.log(this.VoiceMailCollectionView);
			$('#prefs-tabs-content').html(this.VoiceMailCollectionView.render().el);

		}, "#content");
	}
});
