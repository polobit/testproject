/*        <link rel="stylesheet" href="site.css">
        <link rel="stylesheet" href="build/candybar.css">
        <script src="build/candybar.js"></script>
*/
var cb;

$(function()
  {			
	console.log("In telephony.js");
	
	head.js(LIB_PATH + 'lib/candybar.js', function()
		{
		   cb = new CandyBar();
		   cb.render();		     		   
		});	    
    
    $(".contact-make-call").die().live("click", function(e)
     {
    	e.preventDefault();    	
    	console.log("In contact-make-call");
    	var name = $(this).attr('fname')+" "+$(this).attr('lname');
    	var image = $(this).attr('image');
    	var phone = $(this).attr('phone');
    	
    	console.log(phone);
    	if(phone == "" || phone == null)
        {
    	  alert(name +"'s contact number not added."); 
    	  return;
    	}
    	
    	if(!setStateActive())
		  if(!setUser(name, phone, image))    
    	    callUser();
     });    
  });


//Active candy bar UI.
function setStateActive()
{
  console.log("In setStateActive");	
  cb.setState('active'); 
  return false;
}

// Inactive candy bar UI.
function setStateInActive()
{
  console.log("In setStateInActive");	
  cb.setState('inactive'); 
  return false;
}

// Set User for call.
function setUser(name, number, pic)
{
  console.log("In setUser");  
  cb.setUser({
	          name: name, 
	          number: number, 
	          picUrl: pic
	         }); 
  return false;
}

// Clear User from call.
function clearUser()
{
  console.log("In clearUser");	
  cb.clearUser();
  return false;	
}

// Make call to user.
function callUser()
{
  console.log("In callUser");
  console.log(cb);
  cb.setState('calling');
  return false;
}

// Receive call from user.
function receiveCall()
{
  console.log("In receiveCall");	
  cb.setState('incoming');
  return false;	
}


// End call of user.
function endCall()
{
  console.log("In endCall");
  cb.endGently();
  return false;	
}
