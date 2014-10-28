$(function()
{
				$("#freshbooks").die().live("click", function(e)
				{
								e.preventDefault();
								var url = $('#freshbooks_url').val();
								var token = $('#freshbooks_apiKey').val();
								if (isBlank(url))
								{
												alert("Please Enter Freshbooks Domain Name");
												return false;
								}
								else if (new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(url))
								{
												alert("Please Enter Domain Name only");
												$("#freshbooks_url").focus();
												return false;
								}

								if (isBlank(token))
								{
												alert("Please Enter Freshbooks API Token");
												$('#freshbooks_apiKey').focus();
												return false;
								}else if(token.length !=32){
												alert("Invalid Freshbooks API Token");
												$('#freshbooks_apiKey').focus();
												return false;
								}
								else if (token.length != 32)
								{
												alert("Invalid Freshbooks API Token");
												$('#freshbooks_apiKey').focus();
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

				function isBlank(str)
				{
								return (!str || /^\s*$/.test(str));
				}

});
