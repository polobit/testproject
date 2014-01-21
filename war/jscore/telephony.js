/*        <link rel="stylesheet" href="site.css">
        <link rel="stylesheet" href="build/candybar.css">
        <script src="build/candybar.js"></script>

var cb;
//var dialer;

$(function()
  {			
	console.log("In telephony.js");
	
	head.js(LIB_PATH + 'lib/candybar.js',LIB_PATH + 'lib/dialpad.js',LIB_PATH + 'lib/att.phonenumber.js', function()
		{
		   cb = new CandyBar();
		   cb.render();
		   
		   
		   
		   window.dialer = new Dialpad({
		        onPress: function (key) {
		            console.log('a key was pressed', key);
		        },
		        onCallableNumber: function (number) {
		            console.log('we have a number that seems callable', number);
		        },
		        onHide: function () {
		            console.log('removed it');
		        },
		        onCall: function (number) {
		            console.log('The call button was pressed', number);
		        }
		    });

		    document.addEventListener('DOMContentLoaded', function () {
		      document.body.insertBefore(dialer.render(), document.body.firstChild);
		    }, false);

		});	   
	
	
	
	// calling render returns the rendered dialer
	// as a DOM element with all the right handlers
	//window.dialer.render();

	// OPTIONALLY: you can also add event listeners later if you prefer.
	dialer.on('call', function (number) {
	    // assuming you've created a phone object..
	    phone.dial(number);
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
    	    	    	
		  if(!setUser(name, phone, image)) 
			  {
    	        callUser();
    	        
    	        // After call receive.
    	        setStateActive()
			  }
    	
    	window.dialer.render();
     });    
    
    $(".call_end").die().live("click", function(e)
     {
    	e.preventDefault();    	
    	console.log("In call_end");

    	endCall();
    	setStateInActive()
        clearUser();    	
     });    
    
  });


//Active call candy bar UI.
function setStateActive()
{
  console.log("In setStateActive");	
  cb.setState('active'); 
  return false;
}

// Inactive call candy bar UI.
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
*/