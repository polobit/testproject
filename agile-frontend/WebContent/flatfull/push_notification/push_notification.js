// Call this method through Web rules for enable push notification

function enablePushNotification(){
  regiseterServiceWorkers();
}

//Registerng Service Workers for Push Notification   
function regiseterServiceWorkers()  {
   if ('serviceWorker' in navigator) 
      {
        navigator.serviceWorker.register('notification/agile-service-workers.js',{ scope: './notification/'}).then(function (registration) 
          {
              var serviceWorker; 
              // Are Notifications supported in the service worker?  
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
          else
           {
             registration.pushManager.subscribe({  userVisibleOnly: true }).then(function(sub)
              {
                  sendPushNotificationSubscription(sub);
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
   
  //Create or update contact if visitors click on allow notification

  function sendPushNotificationSubscription(subscription)
  {
    //Fetching email id form cookies
     var email=agile_guid.get_email();

     //Getting browser id for push notification
     browser_id = subscription.endpoint.substring(subscription.endpoint.lastIndexOf("/")+1)

     if(subscription.endpoint.indexOf("mozilla")>0)
        browser_id = "mozilla" + browser_id;
      else
        browser_id = "chrome" + browser_id;

     var params = "browserId=" +encodeURIComponent(browser_id);

     var properties = [];

     var property = {};

     property.name = "email";

     property.value = email;

     properties.push(property);

     var model = {};

     // Get utm params from cookie
     var utm_params_from_cookie = agile_getUtmParamsAsProperties();

     // Add properties to model
     model.properties = properties;

       // Save utm params in contact properties
     if(utm_params_from_cookie && utm_params_from_cookie.size != 0)
     {
      try
      {
        // Merge with properties array
        properties.push.apply(properties, utm_params_from_cookie);
      }
      catch(err)
      {
        console.debug("Error occured while pushing utm params " + err);
      }
    }

    params = params+ "&contact={0}".format(encodeURIComponent(JSON.stringify(model)));

     if(email != null || email != undefined)
        params = params + "&email=" + encodeURIComponent(email);

     var agile_url = agile_id.getURL() + "/contacts/push-notification?&id=" + agile_id.get() + "&" + params;

     agile_json(agile_url);
           
  }

  ///Get push notification browser id from browser

  function agile_getPushNotificationBrowserId(callback){
    try
    {
      var browser_id="";
      navigator.serviceWorker.register('notification/agile-service-workers.js',{ scope: './notification/'}).then(function (registration) 
        {

          registration.pushManager.getSubscription().then(
          function(subscription) 
          { 
             browser_id = subscription.endpoint.substring(subscription.endpoint.lastIndexOf("/")+1)

             if(subscription.endpoint.indexOf("mozilla")>0)
                 browser_id = "mozilla" + browser_id;
             else
               browser_id = "chrome" + browser_id;

            console.log(browser_id);
             callback(browser_id);
          });
        });

     }
      catch(err)
      {
        console.log(err);
        callback("");
      }

  }