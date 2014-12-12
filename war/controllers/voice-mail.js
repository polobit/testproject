var VoiceMailRouter = Backbone.Router.extend({

	routes : {
	"voicemail" : "voicemail"
	},

	voicemail : function(){
		$("#content").html(getTemplate("settings"), {});
		$('#PrefsTab .active').removeClass('active');
		$('.add-widget-prefs-tab').addClass('active');
		
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
//		alert("In voice mail");
		
	}
});
