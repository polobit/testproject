(function(f){f.tools=f.tools||{version:"1.2.5"};var j=/\[type=([a-z]+)\]/,h=/^-?[0-9]*(\.[0-9]+)?$/,c=f.tools.dateinput,a=/^([a-z0-9_\.\-\+]+)@([\da-z\.\-]+)\.([a-z\.]{2,6})$/i,g=/^(https?:\/\/)?[\da-z\.\-]+\.[a-z\.]{2,6}[#&+_\?\/\w \.\-=]*$/i,i;i=f.tools.validator={conf:{grouped:false,effect:"default",errorClass:"invalid",inputEvent:null,errorInputEvent:"keyup",formEvent:"submit",lang:"en",message:"<div/>",messageAttr:"data-message",messageClass:"error",offset:[0,0],position:"center right",singleError:false,speed:"normal"},messages:{"*":{en:"Please correct this value"}},localize:function(n,m){f.each(m,function(o,p){i.messages[o]=i.messages[o]||{};i.messages[o][n]=p})},localizeFn:function(m,n){i.messages[m]=i.messages[m]||{};f.extend(i.messages[m],n)},fn:function(n,o,m){if(f.isFunction(o)){m=o}else{if(typeof o=="string"){o={en:o}}this.messages[n.key||n]=o}var p=j.exec(n);if(p){n=e(p[1])}k.push([n,m])},addEffect:function(m,n,o){b[m]=[n,o]}};function l(o,n,q){var t=o.offset().top,p=o.offset().left,r=q.position.split(/,?\s+/),s=r[0],u=r[1];t-=n.outerHeight()-q.offset[0];p+=o.outerWidth()+q.offset[1];if(/iPad/i.test(navigator.userAgent)){t-=f(window).scrollTop()}var v=n.outerHeight()+o.outerHeight();if(s=="center"){t+=v/2}if(s=="bottom"){t+=v}var m=o.outerWidth();if(u=="center"){p-=(m+n.outerWidth())/2}if(u=="left"){p-=m}return{top:t,left:p}}function e(n){function m(){return this.getAttribute("type")==n}m.key="[type="+n+"]";return m}var k=[],b={"default":[function(m){var n=this.getConf();f.each(m,function(p,q){var o=q.input;o.addClass(n.errorClass);var r=o.data("msg.el");if(!r){r=f(n.message).addClass(n.messageClass).appendTo(document.body);o.data("msg.el",r)}r.css({visibility:"hidden"}).find("p").remove();f.each(q.messages,function(u,t){f("<p/>").html(t).appendTo(r)});if(r.outerWidth()==r.parent().width()){r.add(r.find("p")).css({display:"inline"})}var s=l(o,r,n);r.css({visibility:"visible",position:"absolute",top:s.top,left:s.left}).fadeIn(n.speed)})},function(m){var n=this.getConf();m.removeClass(n.errorClass).each(function(){var o=f(this).data("msg.el");if(o){o.css({visibility:"hidden"})}})}]};f.each("email,url,number".split(","),function(n,m){f.expr[":"][m]=function(o){return o.getAttribute("type")===m}});f.fn.oninvalid=function(m){return this[m?"bind":"trigger"]("OI",m)};i.fn(":email","Please enter a valid email address",function(n,m){if(m.indexOf("$")==0 ||m.indexOf("{")==0 ){return true}else{return !m||a.test(m)}});i.fn(":url","Please enter a valid URL",function(n,m){if(m.indexOf("$")==0){return true}else{return !m||g.test(m)}});i.fn(":number","Please enter a numeric value.",function(n,m){if(m.indexOf("$")==0){return true}else{return h.test(m)}});i.fn("[max]","Please enter a value smaller than $1",function(o,n){if(n===""||c&&o.is(":date")){return true}var m=o.attr("max");return parseFloat(n)<=parseFloat(m)?true:[m]});i.fn("[min]","Please enter a value larger than $1",function(o,m){if(m===""||c&&o.is(":date")){return true}var n=o.attr("min");return parseFloat(m)>=parseFloat(n)?true:[n]});i.fn("[required]","Please complete this mandatory field.",function(n,m){if(n.is(":checkbox")){return n.is(":checked")}return !!m});i.fn("[pattern]",function(m){var n=new RegExp("^"+m.attr("pattern")+"$");return n.test(m.val())});function d(m,r,p){var o=this,q=r.add(o);m=m.not(":button, :image, :reset, :submit");function n(x,v,t){if(!p.grouped&&x.length){return}var w;if(t===false||f.isArray(t)){w=i.messages[v.key||v]||i.messages["*"];w=w[p.lang]||i.messages["*"].en;var u=w.match(/\$\d/g);if(u&&f.isArray(t)){f.each(u,function(y){w=w.replace(this,t[y])})}}else{w=t[p.lang]||t}x.push(w)}f.extend(o,{getConf:function(){return p},getForm:function(){return r},getInputs:function(){return m},reflow:function(){m.each(function(){var t=f(this),u=t.data("msg.el");if(u){var v=l(t,u,p);u.css({top:v.top,left:v.left})}});return o},invalidate:function(t,u){if(!u){var v=[];f.each(t,function(x,y){var w=m.filter("[name='"+x+"']");if(w.length){w.trigger("OI",[y]);v.push({input:w,messages:[y]})}});t=v;u=f.Event()}u.type="onFail";q.trigger(u,[t]);if(!u.isDefaultPrevented()){b[p.effect][0].call(o,t,u)}return o},reset:function(t){t=t||m;t.removeClass(p.errorClass).each(function(){var u=f(this).data("msg.el");if(u){u.remove();f(this).data("msg.el",null)}}).unbind(p.errorInputEvent||"");return o},destroy:function(){r.unbind(p.formEvent+".V").unbind("reset.V");m.unbind(p.inputEvent+".V").unbind("change.V");return o.reset()},checkValidity:function(u,w){u=u||m;u=u.not(":disabled");if(!u.length){return true}w=w||f.Event();w.type="onBeforeValidate";q.trigger(w,[u]);if(w.isDefaultPrevented()){return w.result}var t=[];u.not(":radio:not(:checked)").each(function(){var z=[],x=f(this).data("messages",z),y=c&&x.is(":date")?"onHide.v":p.errorInputEvent+".v";x.unbind(y);f.each(k,function(){var C=this,A=C[0];if(x.filter(A).length){var B=C[1].call(o,x,x.val());if(B!==true){w.type="onBeforeFail";q.trigger(w,[x,A]);if(w.isDefaultPrevented()){return false}var D=x.attr(p.messageAttr);if(D){z=[D];return false}else{n(z,A,B)}}}});if(z.length){t.push({input:x,messages:z});x.trigger("OI",[z]);if(p.errorInputEvent){x.bind(y,function(A){o.checkValidity(x,A)})}}if(p.singleError&&t.length){return false}});var v=b[p.effect];if(!v){throw'Validator: cannot find effect "'+p.effect+'"'}if(t.length){o.invalidate(t,w);return false}else{v[1].call(o,u,w);w.type="onSuccess";q.trigger(w,[u]);u.unbind(p.errorInputEvent+".v")}return true}});f.each("onBeforeValidate,onBeforeFail,onFail,onSuccess".split(","),function(u,t){if(f.isFunction(p[t])){f(o).bind(t,p[t])}o[t]=function(v){if(v){f(o).bind(t,v)}return o}});if(p.formEvent){r.bind(p.formEvent+".V",function(t){if(!o.checkValidity(null,t)){return t.preventDefault()}})}r.bind("reset.V",function(){o.reset()});if(m[0]&&m[0].validity){m.each(function(){this.oninvalid=function(){return false}})}if(r[0]){r[0].checkValidity=o.checkValidity}if(p.inputEvent){m.bind(p.inputEvent+".V",function(t){o.checkValidity(f(this),t)})}m.filter(":checkbox, select").filter("[required]").bind("change.V",function(u){var t=f(this);if(this.checked||(t.is("select")&&f(this).val())){b[p.effect][1].call(o,t,u)}});var s=m.filter(":radio").change(function(t){o.checkValidity(s,t)});f(window).resize(function(){o.reflow()})}f.fn.validator=function(n){var m=this.data("validator");if(m){m.destroy();this.removeData("validator")}n=f.extend(true,{},i.conf,n);if(this.is("form")){return this.each(function(){var o=f(this);m=new d(o.find(":input"),o,n);o.data("validator",m)})}else{m=new d(this,this.eq(0).closest("form"),n);return this.data("validator",m)}}})(jQuery);