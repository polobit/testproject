/*!
 * jQuery ClassyQR library
 * http://www.class.pm/projects/jquery/classyqr
 *
 * Copyright 2011 - 2013, Class.PM www.class.pm
 * Written by Marius Stanciu - Sergiu <marius@picozu.net>
 * Licensed under the GPL Version 3 license.
 * Version 1.1.0
 *
 */
(function(a){a.fn.extend({ClassyQR:function(e){var f={baseUrl:"https://chart.googleapis.com/chart?cht=qr&chs=",size:300,create:false,number:null,email:null,subject:null,latitude:null,longitude:null,address:null,name:null,url:null,alt:"QR Code",note:null,encoding:"UTF-8",type:"text",text:"Welcome to Agile",title:null,company:null};var d=a.extend(f,e);return this.each(function(){var c=a(this);var b=d.baseUrl+d.size+"x"+d.size+"&choe="+d.encoding+"&chl=";switch(d.type){case"contact":b=b+"BEGIN:VCARD; \nNAME:"+d.name;if(d.company!=null){b+="; \nORGANIZATION:"+d.company}if(d.title!=null){b+="; \nTITLE:"+d.title}if(d.number!=null){b+="; \nTEL:"+d.number}if(d.email!=null){b+="; \nEMAIL:"+d.email}if(d.url!=null){b+="; \nURL:"+d.url}if(d.address!=null){b+="; \nADR:"+d.address}b+="; \nEND:VCARD;";break;case"wifi":b=b+"WIFI:S:"+d.ssid+";T:"+d.auth+";P:"+d.password+";";break;case"location":b=b+"geo:"+d.latitude+","+d.longitude;break;case"call":b=b+"tel:"+d.number;break;case"email":b=b+"mailto:"+d.email+":"+d.subject+":"+d.text;break;case"sms":b=b+"smsto:"+d.number+":"+d.text;break;case"url":b=b+d.url;break;case"text":default:b=b+d.text;break}if(d.create){c.append('<img src="'+b+'" alt="'+d.alt+'" />')}else{c.attr("src",b)}})}})})(jQuery);