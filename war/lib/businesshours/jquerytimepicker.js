!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){function b(a){if(a.minTime&&(a.minTime=r(a.minTime)),a.maxTime&&(a.maxTime=r(a.maxTime)),a.durationTime&&"function"!=typeof a.durationTime&&(a.durationTime=r(a.durationTime)),a.disableTimeRanges.length>0){for(var b in a.disableTimeRanges)a.disableTimeRanges[b]=[r(a.disableTimeRanges[b][0]),r(a.disableTimeRanges[b][1])];a.disableTimeRanges=a.disableTimeRanges.sort(function(a,b){return a[0]-b[0]});for(var b=a.disableTimeRanges.length-1;b>0;b--)a.disableTimeRanges[b][0]<=a.disableTimeRanges[b-1][1]&&(a.disableTimeRanges[b-1]=[Math.min(a.disableTimeRanges[b][0],a.disableTimeRanges[b-1][0]),Math.max(a.disableTimeRanges[b][1],a.disableTimeRanges[b-1][1])],a.disableTimeRanges.splice(b,1))}return a}function c(b){var c=b.data("timepicker-settings"),d=b.data("timepicker-list");d&&d.length&&(d.remove(),b.data("timepicker-list",!1)),d=a("<ul />",{"class":"ui-timepicker-list"});var e=a("<div />",{"class":"ui-timepicker-wrapper",tabindex:-1});e.css({display:"none",position:"absolute"}).append(d),c.className&&e.addClass(c.className),null===c.minTime&&null===c.durationTime||!c.showDuration||e.addClass("ui-timepicker-with-duration");var g=c.minTime;"function"==typeof c.durationTime?g=r(c.durationTime()):null!==c.durationTime&&(g=c.durationTime);var i=null!==c.minTime?c.minTime:0,j=null!==c.maxTime?c.maxTime:i+u-1;i>=j&&(j+=u),j===u-1&&-1!==c.timeFormat.indexOf("H")&&(j=u);for(var k=c.disableTimeRanges,l=0,m=k.length,n=i;j>=n;n+=60*c.step){var s=n,t=a("<li />");if(t.data("time",86400>=s?s:s%86400),t.text(q(s,c.timeFormat)),(null!==c.minTime||null!==c.durationTime)&&c.showDuration){var v=a("<span />");v.addClass("ui-timepicker-duration"),v.text(" ("+p(n-g)+")"),t.append(v)}m>l&&(s>=k[l][1]&&(l+=1),k[l]&&s>=k[l][0]&&s<k[l][1]&&t.addClass("ui-timepicker-disabled")),d.append(t)}e.data("timepicker-input",b),b.data("timepicker-list",e);var w=c.appendTo;"string"==typeof w?w=a(w):"function"==typeof w&&(w=w(b)),w.append(e),h(b,d),d.on("click","li",function(){b.off("focus.timepicker"),b.on("focus.timepicker-ie-hack",function(){b.off("focus.timepicker-ie-hack"),b.on("focus.timepicker",x.show)}),f(b)||b[0].focus(),d.find("li").removeClass("ui-timepicker-selected"),a(this).addClass("ui-timepicker-selected"),o(b)&&(b.trigger("hideTimepicker"),e.hide())})}function d(){return new Date(1970,1,1,0,0,0)}function e(b){var c=a(b.target),d=c.closest(".ui-timepicker-input");0===d.length&&0===c.closest(".ui-timepicker-wrapper").length&&(x.hide(),a(document).unbind(".ui-timepicker"))}function f(a){var b=a.data("timepicker-settings");return(window.navigator.msMaxTouchPoints||"ontouchstart"in document)&&b.disableTouchKeyboard}function g(b,c,d){if(!d&&0!==d)return!1;var e=b.data("timepicker-settings"),f=!1,g=30*e.step;return c.find("li").each(function(b,c){var e=a(c),h=e.data("time")-d;return Math.abs(h)<g||h==g?(f=e,!1):void 0}),f}function h(a,b){b.find("li").removeClass("ui-timepicker-selected");var c=r(j(a));if(null!==c){var d=g(a,b,c);if(d){var e=d.offset().top-b.offset().top;(e+d.outerHeight()>b.outerHeight()||0>e)&&b.scrollTop(b.scrollTop()+d.position().top-d.outerHeight()),d.addClass("ui-timepicker-selected")}}}function i(){if(""!==this.value){var b=a(this),c=b.data("timepicker-list");if(!c||!c.is(":visible")){var d=r(this.value);if(null===d)return b.trigger("timeFormatError"),void 0;var e=b.data("timepicker-settings"),f=!1;if(null!==e.minTime&&d<e.minTime?f=!0:null!==e.maxTime&&d>e.maxTime&&(f=!0),a.each(e.disableTimeRanges,function(){return d>=this[0]&&d<this[1]?(f=!0,!1):void 0}),e.forceRoundTime){var g=d%(60*e.step);g>=30*e.step?d+=60*e.step-g:d-=g}var h=q(d,e.timeFormat);f?k(b,h,"error")&&b.trigger("timeRangeError"):k(b,h)}}}function j(a){return a.is("input")?a.val():a.data("ui-timepicker-value")}function k(a,b,c){return a.is("input")&&a.val(b),a.data("ui-timepicker-value")!=b?(a.data("ui-timepicker-value",b),"select"==c?a.trigger("selectTime").trigger("changeTime").trigger("change"):"error"!=c&&a.trigger("changeTime"),!0):(a.trigger("selectTime"),!1)}function l(b){var c=a(this),d=c.data("timepicker-list");if(!d||!d.is(":visible")){if(40!=b.keyCode)return m(b,c);f(c)||c.focus()}switch(b.keyCode){case 13:return o(c)&&x.hide.apply(this),b.preventDefault(),!1;case 38:var e=d.find(".ui-timepicker-selected");return e.length?e.is(":first-child")||(e.removeClass("ui-timepicker-selected"),e.prev().addClass("ui-timepicker-selected"),e.prev().position().top<e.outerHeight()&&d.scrollTop(d.scrollTop()-e.outerHeight())):(d.find("li").each(function(b,c){return a(c).position().top>0?(e=a(c),!1):void 0}),e.addClass("ui-timepicker-selected")),!1;case 40:return e=d.find(".ui-timepicker-selected"),0===e.length?(d.find("li").each(function(b,c){return a(c).position().top>0?(e=a(c),!1):void 0}),e.addClass("ui-timepicker-selected")):e.is(":last-child")||(e.removeClass("ui-timepicker-selected"),e.next().addClass("ui-timepicker-selected"),e.next().position().top+2*e.outerHeight()>d.outerHeight()&&d.scrollTop(d.scrollTop()+e.outerHeight())),!1;case 27:d.find("li").removeClass("ui-timepicker-selected"),x.hide();break;case 9:x.hide();break;default:return m(b,c)}}function m(a,b){return!b.data("timepicker-settings").disableTextInput||a.ctrlKey||a.altKey||a.metaKey||2!=a.keyCode&&8!=a.keyCode&&a.keyCode<46}function n(b){var c=a(this),d=c.data("timepicker-list");if(!d||!d.is(":visible"))return!0;if(!c.data("timepicker-settings").typeaheadHighlight)return d.find("li").removeClass("ui-timepicker-selected"),!0;switch(b.keyCode){case 96:case 97:case 98:case 99:case 100:case 101:case 102:case 103:case 104:case 105:case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:case 65:case 77:case 80:case 186:case 8:case 46:h(c,d);break;default:return}}function o(a){var b=a.data("timepicker-settings"),c=a.data("timepicker-list"),d=null,e=c.find(".ui-timepicker-selected");if(e.hasClass("ui-timepicker-disabled"))return!1;if(e.length?d=e.data("time"):j(a)&&(d=r(j(a)),h(a,c)),null!==d){var f=q(d,b.timeFormat);k(a,f,"select")}return!0}function p(a){var b,c=Math.round(a/60);if(Math.abs(c)<60)b=[c,w.mins];else if(60==c)b=["1",w.hr];else{var d=(c/60).toFixed(1);"."!=w.decimal&&(d=d.replace(".",w.decimal)),b=[d,w.hrs]}return b.join(" ")}function q(a,b){if(null!==a){for(var c,d,e=new Date(t.valueOf()+1e3*a),f="",g=0;g<b.length;g++)switch(d=b.charAt(g)){case"a":f+=e.getHours()>11?"pm":"am";break;case"A":f+=e.getHours()>11?"PM":"AM";break;case"g":c=e.getHours()%12,f+=0===c?"12":c;break;case"G":f+=e.getHours();break;case"h":c=e.getHours()%12,0!==c&&10>c&&(c="0"+c),f+=0===c?"12":c;break;case"H":c=e.getHours(),a===u&&(c=24),f+=c>9?c:"0"+c;break;case"i":var h=e.getMinutes();f+=h>9?h:"0"+h;break;case"s":a=e.getSeconds(),f+=a>9?a:"0"+a;break;default:f+=d}return f}}function r(a){if(""===a)return null;if(!a||a+0==a)return a;"object"==typeof a&&(a=a.getHours()+":"+s(a.getMinutes())+":"+s(a.getSeconds())),a=a.toLowerCase(),new Date(0);var b;if(-1===a.indexOf(":")?(b=a.match(/^([0-9]):?([0-5][0-9])?:?([0-5][0-9])?\s*([pa]?)m?$/),b||(b=a.match(/^([0-2][0-9]):?([0-5][0-9])?:?([0-5][0-9])?\s*([pa]?)m?$/))):b=a.match(/^(\d{1,2})(?::([0-5][0-9]))?(?::([0-5][0-9]))?\s*([pa]?)m?$/),!b)return null;var c,d=parseInt(1*b[1],10);c=b[4]?12==d?"p"==b[4]?12:0:d+("p"==b[4]?12:0):d;var e=1*b[2]||0,f=1*b[3]||0;return 3600*c+60*e+f}function s(a){return("0"+a).slice(-2)}var t=d(),u=86400,v={className:null,minTime:null,maxTime:null,durationTime:null,step:30,showDuration:!1,timeFormat:"g:ia",scrollDefaultNow:!1,scrollDefaultTime:!1,selectOnBlur:!1,disableTouchKeyboard:!1,forceRoundTime:!1,appendTo:"body",disableTimeRanges:[],closeOnWindowScroll:!1,disableTextInput:!1,typeaheadHighlight:!0},w={decimal:".",mins:"mins",hr:"hr",hrs:"hrs"},x={init:function(c){return this.each(function(){var d=a(this);if("SELECT"==d[0].tagName){for(var e={type:"text",value:d.val()},f=d[0].attributes,g=0;g<f.length;g++)e[f[g].nodeName]=f[g].nodeValue;var h=a("<input />",e);d.replaceWith(h),d=h}var j=[];for(key in v)d.data(key)&&(j[key]=d.data(key));var k=a.extend({},v,j,c);k.lang&&(w=a.extend(w,k.lang)),k=b(k),d.data("timepicker-settings",k),d.prop("autocomplete","off"),d.on("click.timepicker focus.timepicker",x.show),d.on("change.timepicker",i),d.on("keydown.timepicker",l),d.on("keyup.timepicker",n),d.addClass("ui-timepicker-input"),i.call(d.get(0))})},show:function(b){b&&b.preventDefault();var d=a(this),h=d.data("timepicker-settings");f(d)&&d.blur();var i=d.data("timepicker-list");if(!d.prop("readonly")&&(i&&0!==i.length&&"function"!=typeof h.durationTime||(c(d),i=d.data("timepicker-list")),!i.is(":visible"))){x.hide(),i.show(),d.offset().top+d.outerHeight(!0)+i.outerHeight()>a(window).height()+a(window).scrollTop()?i.offset({left:d.offset().left+parseInt(i.css("marginLeft").replace("px",""),10),top:d.offset().top-i.outerHeight()+parseInt(i.css("marginTop").replace("px",""),10)}):i.offset({left:d.offset().left+parseInt(i.css("marginLeft").replace("px",""),10),top:d.offset().top+d.outerHeight()+parseInt(i.css("marginTop").replace("px",""),10)});var k=i.find(".ui-timepicker-selected");if(k.length||(j(d)?k=g(d,i,r(j(d))):h.scrollDefaultNow?k=g(d,i,r(new Date)):h.scrollDefaultTime!==!1&&(k=g(d,i,r(h.scrollDefaultTime)))),k&&k.length){var l=i.scrollTop()+k.position().top-k.outerHeight();i.scrollTop(l)}else i.scrollTop(0);a(document).on("touchstart.ui-timepicker mousedown.ui-timepicker",e),h.closeOnWindowScroll&&a(document).on("scroll.ui-timepicker",e),d.trigger("showTimepicker")}},hide:function(){a(".ui-timepicker-wrapper:visible").each(function(){var b=a(this),c=b.data("timepicker-input"),d=c.data("timepicker-settings");d&&d.selectOnBlur&&o(c),b.hide(),c.trigger("hideTimepicker")})},option:function(c,d){var e=this,f=e.data("timepicker-settings"),g=e.data("timepicker-list");if("object"==typeof c)f=a.extend(f,c);else if("string"==typeof c&&"undefined"!=typeof d)f[c]=d;else if("string"==typeof c)return f[c];return f=b(f),e.data("timepicker-settings",f),g&&(g.remove(),e.data("timepicker-list",!1)),e},getSecondsFromMidnight:function(){return r(j(this))},getTime:function(a){var b=this,c=j(b);return c?(a||(a=new Date),a.setHours(0,0,0,0),new Date(a.valueOf()+1e3*r(c))):null},setTime:function(a){var b=this,c=q(r(a),b.data("timepicker-settings").timeFormat);k(b,c),b.data("timepicker-list")&&h(b,b.data("timepicker-list"))},remove:function(){var a=this;a.hasClass("ui-timepicker-input")&&(a.removeAttr("autocomplete","off"),a.removeClass("ui-timepicker-input"),a.removeData("timepicker-settings"),a.off(".timepicker"),a.data("timepicker-list")&&a.data("timepicker-list").remove(),a.removeData("timepicker-list"))}};a.fn.timepicker=function(b){return x[b]?x[b].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof b&&b?(a.error("Method "+b+" does not exist on jQuery.timepicker"),void 0):x.init.apply(this,arguments)}});