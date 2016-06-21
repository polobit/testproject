
 var registration_id=null;
 var url="https://"+domain+"-dot-sandbox-dot-agilecrmbeta.appspot.com/backend/push?id=";  
 self.addEventListener('push', function(event) 
 {
      self.registration.pushManager.getSubscription().then(function(subscription) {
        console.log("got subscription id: ", subscription.endpoint)
        registration_id=subscription.endpoint
      });
 
    event.waitUntil(  

    
      fetch(url+registration_id).then(function(response) {  
        if (response.status !== 200) {  
        // Either show a message to the user explaining the error    
        console.log('Looks like there was a problem. Status Code: ' + response.status);  
        throw new Error();  
        }

      // Examine the text in the response  
      return response.json().then(function(data) {  
        
        var title = data.title; 
        var message = data.message;  
        var icon = data.icon;  
        var url = data.link;

        return self.registration.showNotification(title, {  
          body: message,  
          icon: icon,  
          data: {
            url: url
          }  
        });  
      });  
    }).catch(function(err) {  
      console.log('Unable to retrieve data', err);

      var title = 'An error occurred';
      var message = 'We were unable to get the information for this push message';  
      var icon = 'img/design19.jpg';  
      var notificationTag = 'notification-error';  
      return self.registration.showNotification(title, {  
          body: message,  
          icon: icon,  
          tag: notificationTag  
        });  
    })  
  );  
});

// The user has clicked on the notification ...
self.addEventListener('notificationclick', function(event) {  
  console.log(event.notification.data.url);
  event.notification.close();
  // This looks to see if the current is already open and  
  // focuses if it is  
  event.waitUntil(
    clients.matchAll({  
      type: "window"  
    })
    .then(function(clientList) {  
      for (var i = 0; i < clientList.length; i++) {  
        var client = clientList[i];  
        if (client.url == '/' && 'focus' in client)  
          return client.focus();  
      }  
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);  
      }
    })
  );
});