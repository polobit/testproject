
$(function () {
// Download the lib
	head.js(LIB_PATH + 'lib/noty/jquery.noty.js','lib/noty/layouts/top.js',LIB_PATH + 'lib/noty/themes/default.js',
       		function(){
		     noty({text: 'Welcome To Agile Crm Dashboard !!!!!!!!',layout: 'top',type: 'information'});
		
		   /*$.noty.defaults = {
				  layout: 'top',
				  theme: 'default',
				  type: 'success',
				  text: '',
				  dismissQueue: true, // If you want to use queue feature set this true
				  template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
				  animation: {
				    open: {height: 'toggle'},
				    close: {height: 'toggle'},
				    easing: 'swing',
				    speed: 500 // opening & closing animation speed
				  },
				  timeout: false, // delay for closing event. Set false for sticky notifications
				  force: false, // adds notification to the beginning of queue when set to true
				  modal: false,
				  closeWith: ['hover'], // ['click', 'button', 'hover']
				  callback: {
				    onShow: function() {},
				    afterShow: function() {},
				    onClose: function() {},
				    afterClose: function() {}
				  },
				  buttons: false // an array of buttons
				};*/
		
	   });
});

