$(function()
{
				$("#freshbooks").die().live("click", function(e)
				{
								e.preventDefault();
								var url = $('#freshbooks_url').val();
								var token = $('#freshbooks_apiKey').val();
								if (isBlank(url))
								{
												// alert("Please Enter Freshbooks Domain Name");
												$("#domainerror").removeClass('hide');
												$("#freshbooks_url").focus();
												$("#freshbooks_url").keypress(function(){
																$("#domainerror").addClass('hide');
												});
												return false;
								}
								else if (new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(url))
								{
												alert("Please Enter Domain Name only");
												$("#domainerror").removeClass('hide');
												$("#freshbooks_url").focus();
												$("#freshbooks_url").keypress(function(){
																$("#domainerror").addClass('hide');
												});
												return false;
								}

								if (isBlank(token))
								{
												$("#apierror").removeClass('hide');
												$('#freshbooks_apiKey').focus();
												$("#freshbooks_apiKey").keypress(function(){
																$("#apierror").addClass('hide');
												});
												return false;
								}else if(token.length !=32){
												$("#apierror").removeClass('hide');
												$('#freshbooks_apiKey').focus();
												$("#freshbooks_apiKey").keypress(function(){
																$("#apierror").addClass('hide');
												});
												return false;
								}
								$.ajax({ url : 'core/api/freshbooks/save/' + token + '/' + url + '', async : false, success : function(data)
								{
												if (data)
												{
																console.log(data);

												}

								} });
								var location = window.location.hash;
								if (location == "#sync/freshbooks/setting")
								{
												window.location.reload();
								}
								else if (location == "#sync/freshbooks")
								{
												window.location = window.location.origin + "#sync/freshbooks/setting";
								}
								else
								{
												window.location = window.location.origin + "#sync";
								}
				});
				
	 function isBlank(str) {
				    return (!str || /^\s*$/.test(str));
				}

				function isBlank(str)
				{
								return (!str || /^\s*$/.test(str));
				}

});
