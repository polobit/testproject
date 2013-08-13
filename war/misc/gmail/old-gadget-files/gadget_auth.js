 function init() {
      // Hit the server, passing in a signed request (and OpenSocial ID), to see if we know who the user is.
      osapi.http.get({
        'href' : 'https://googleapps.agilecrm.com',
        'format' : 'json',
        'authz' : 'signed'
      }).execute(handleLoadResponse);
    }

    function handleLoadResponse(data) {
      // User exists, OpenID must have occurred previously.
      if (data.content.user_exists) {
        
    	  document.getElementById('output').innerHTML = 'user exists';
    	  // User doesn't exist, need to do OpenID to match user ID to OpenID.
        
    	  // Call Agile Init here
    	  
        
      } else {
        var url_root = data.content.popup;
        // Retrieve the domain of the current user. gadgets.util.getUrlParameters()['parent'] returns a value
        // of of the form: http(s)://mail.google.com/mail/domain.com/html for Gmail (other containers are similar).
        // The example below shows a regular expression for use with Gmail. For Calendar, use this regular
        // expression instead: /calendar\/hosted\/([^\/]+)/
        var domain = gadgets.util.getUrlParameters()['parent'].match(/.+\/a\/(.+)\/html/)[1];

        var url = url_root + '?domain=' + domain;

        var button = document.createElement('a');
        button.setAttribute('href', 'javascript:void(0);');
        button.setAttribute('onclick', 'openPopup("' + url + '")');

        var text = document.createTextNode('Sign in');
        button.appendChild(text);

        document.getElementById('output').appendChild(button);
      }
    }

    function openPopup(url) {
      var popup = window.open(url, 'OpenID','height=200,width=200');

      // Check every 100 ms if the popup is closed.
      finishedInterval = setInterval(function() {
        // If the popup is closed, we've either finished OpenID, or the user closed it. Verify with the server in case the
        // user closed the popup.
        if (popup.closed) {
          
        	init();

          clearInterval(finishedInterval);
        }
      }, 100);
    }