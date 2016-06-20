// Call this method through Web rules for enable push notification

function enablePushNotification()
{
  var contact=true;
    console.log("Enable push notification message is calling");
    _agile.get_email({
      success: function(data)
       {
          if(data.email)
              contact=false;
       },
      error: function(data)
      {
        console.log(data.error);
      }
    });
// if contact is not known then not showo notification
if(!contact)
    return;
regiseterServiceWorkers();
regiseterServiceWorkers();


}
   
  function regiseterServiceWorkers()
   {
      if ('serviceWorker' in navigator) 
      {
          navigator.serviceWorker.register('notification/agile-service-workers.js',{ scope: './'}).then(function (registration) 
            {
                var serviceWorker;             // Are Notifications supported in the service worker?  
                if (!('showNotification' in ServiceWorkerRegistration.prototype)) {  
                console.warn('Push Notifications aren\'t supported.');  
                return;  
              }

            // Check the current Notification permission. 
            if (Notification.permission === 'denied') {  
              console.warn('The user has blocked Push Notifications.');  
               return;  
            }

              // Check if push messaging is supported  
              if (!('PushManager' in window)) {  
                console.warn('Push messaging isn\'t supported.');  
               // return;  
              }
       
          if (registration.active) 
           {
              serviceWorker = registration.active;
              console.log('active');
           }

        registration.pushManager.getSubscription().then(
        function(pushSubscription) 
        {
          // Check if we have an existing pushSubscription
          if (pushSubscription)
           {
                 
                 console.log("You already having subscription"+pushSubscription.endpoint);
           } 
          else if (serviceWorker) 
           {
             registration.pushManager.subscribe({  userVisibleOnly: true }).then(function(sub)
              {
                  sendSubscription(sub);
               });
           }
        });

     }).catch(function (error) 
      {
        console.log("Error occured while Registering service worker for push notification"+error);
      });
  }
   else
       console.log("The current browser doesn't support service workers.");

    }
    //storing the browser id in datastore
  function sendSubscription(sub)
  {
     console.log('endpoint:'+ sub.endpoint);

     var property = {};
     if(sub.endpoint.indexOf("mozilla")>0)
        property.name = "mozilla id";
      else
        property.name = "chrome id";

     property.value = sub.endpoint.substring(sub.endpoint.lastIndexOf("/")+1);

     _agile.set_property(property, {
     success: function (data) {
          console.log("success");
      },
      error: function (data) {
          console.log("error");
      }
    });
  }