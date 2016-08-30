 var registration_id=null; 
 self.addEventListener('push', function(event) 
 {
    var url="/push?id="; 
    url = event.currentTarget.location.href.split("/n")[0]+url;
    event.waitUntil(  
        self.registration.pushManager.getSubscription().then(function(subscription) {
              console.log("got subscription id: ", subscription.endpoint)
              registration_id=subscription.endpoint.substring(subscription.endpoint.lastIndexOf("/")+1)
           
    
     return fetch(url+registration_id).then(function(response) {  
        if (response.status !== 200) {  
        // Either show a message to the user explaining the error    
        console.log('Looks like there was a problem. Status Code: ' + response.status);  
        throw new Error();  
        }

      // Examine the text in the response  
      return response.json().then(function(dataJSON) {  
        
        var title = dataJSON.notification_title; 
        var message = dataJSON.notification_message;  
        var icon = dataJSON.notification_icon;  
        var url = dataJSON.notification_url;

        return self.registration.showNotification(title, {  
          body: message,  
          icon: icon,  
          data: {
            url: url
          }  
        });  
      }).catch(function(err) {  
          console.log('Unable to retrieve data in json format', err); 
      })  
      });
    }).catch(function(err) {  
      console.log('Unable to retrieve data', err); 
    })  
  );  
});

// The user has clicked on the notification ...
self.addEventListener('notificationclick', function(event) {
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