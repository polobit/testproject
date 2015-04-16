!function(){var a=Handlebars.template,e=Handlebars.templates=Handlebars.templates||{};e["cases-collection-template"]=a(function(a,e,n,t,l){function s(){return'\n		<div class="slate">\n            <div class="slate-content">\n                <div class="box-left">\n                    <img alt="Clipboard" src="/img/clipboard.png" />\n                </div>\n                <div class="box-right">\n                    <h3>There are no pending cases </h3>\n                    <div class="text">\n						You can add case by clicking the button below or the one on the right side of the page.\n                    </div>\n                    <a href="#" class="cases-add btn blue"><i class="icon-plus-sign"></i>  Add Case</a>\n                </div>\n            </div>\n        </div>\n		'}function i(){return'\n        <div class="data-block">\n            <div class="data-container">\n                <table class="table table-striped showCheckboxes" url="core/api/cases/bulk" id="case-list">\n				 <col width="30px"><col width="10%"><col width="30%"><col width="20%"><col width="30%"><col width="10%">\n                    <thead>\n                        <tr>\n                            <th>Owner</th>\n							<th>Title</th>\n							<th>Updated Time</th>\n                            <th>Related To</th>\n                            <th>Status</th>\n                        </tr>\n                    </thead>\n                    <tbody id="cases-model-list" style="cursor:pointer;"><!--route="cases/"-->\n                    </tbody>\n                </table>\n            </div>\n        </div>\n        '}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,a.helpers),l=l||{};var r,c="",o=this;return c+='\n<div class="row">\n    <div class="span12">\n        <div class="page-header">\n            <h1>&nbsp;Cases</h1>\n            <a href="#cases-add" class="cases-add btn right" style="top:-30px;position:relative"><i class="icon-plus-sign" /> Add Case</a>\n        </div>\n    </div>\n</div>\n<div class="row">\n    <div class="span9">\n		',r=n.unless.call(e,e&&e.length,{hash:{},inverse:o.noop,fn:o.program(1,s,l),data:l}),(r||0===r)&&(c+=r),c+="\n        ",r=n["if"].call(e,e&&e.length,{hash:{},inverse:o.noop,fn:o.program(3,i,l),data:l}),(r||0===r)&&(c+=r),c+='\n    </div>\n    <div class="span3">\n        <div class="data-block">\n            <div class="well">\n                <h3>\n                    What are Cases?\n                </h3>\n                <br />\n                <p>\n                    Track and resolve customer issues effectively with cases. Log a case when customers ask questions, report bugs, or have complaints. Keep track of the progress till resolution.</p>\n            </div>\n        </div>\n    </div>\n</div>\n\n'}),e["cases-detail-popover-template"]=a(function(a,e,n,t,l){function s(a,e){var t,l,s,r="";return r+="\n                <p><b>Related To : </b></p> \n                <div>\n				",l=n.each_with_index||a&&a.each_with_index,s={hash:{},inverse:f.noop,fn:f.programWithDepth(2,i,e,a),data:e},t=l?l.call(a,a&&a.contacts,s):v.call(a,"each_with_index",a&&a.contacts,s),(t||0===t)&&(r+=t),r+="\n                </div>\n				"}function i(a,e,t){var l,s,i,h="";return h+='\n                	<div class="span4" style="display:inline-block;margin:5px;margin-left:25px;">\n					',s=n.if_equals||a&&a.if_equals,i={hash:{},inverse:f.noop,fn:f.program(3,r,e),data:e},l=s?s.call(a,a&&a.type,"PERSON",i):v.call(a,"if_equals",a&&a.type,"PERSON",i),(l||0===l)&&(h+=l),h+="\n					",s=n.if_equals||a&&a.if_equals,i={hash:{},inverse:f.noop,fn:f.program(5,c,e),data:e},l=s?s.call(a,a&&a.type,"COMPANY",i):v.call(a,"if_equals",a&&a.type,"COMPANY",i),(l||0===l)&&(h+=l),h+="\n						",s=n.if_equals||a&&a.if_equals,i={hash:{},inverse:f.program(9,d,e),fn:f.program(7,o,e),data:e},l=s?s.call(a,a&&a.index,(l=t&&t.contacts,null==l||l===!1?l:l.length),i):v.call(a,"if_equals",a&&a.index,(l=t&&t.contacts,null==l||l===!1?l:l.length),i),(l||0===l)&&(h+=l),h+="\n						</div>\n                	</div>\n                "}function r(a,e){var t,l,s="";return s+='\n                    	<img class="thumbnail" src="'+m((t=n.gravatarurl||a&&a.gravatarurl,l={hash:{},data:e},t?t.call(a,a&&a.properties,50,l):v.call(a,"gravatarurl",a&&a.properties,50,l)))+'" width="40px" height="40px" style=" width:40px; height:40px; "/>\n                    	<div style="display:inline-block;text-overflow:ellipsis;white-space:nowrap;width:90px;overflow:hidden;">\n                        	'+m((t=n.contact_name_necessary||a&&a.contact_name_necessary,l={hash:{},data:e},t?t.call(a,a,l):v.call(a,"contact_name_necessary",a,l)))+"\n					"}function c(a,e){var t,l,s="";return s+='\n                    	<img class="thumbnail" '+m((t=n.getCompanyImage||a&&a.getCompanyImage,l={hash:{},data:e},t?t.call(a,"40",l):v.call(a,"getCompanyImage","40",l)))+' />\n                    	<div style="display:inline-block;text-overflow:ellipsis;white-space:nowrap;width:90px;overflow:hidden;">\n                        	'+m((t=n.contact_name_necessary||a&&a.contact_name_necessary,l={hash:{},data:e},t?t.call(a,a,l):v.call(a,"contact_name_necessary",a,l)))+"\n					"}function o(){return"\n						"}function d(){return"\n							,\n						"}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,a.helpers),l=l||{};var h,p,u="",v=n.helperMissing,m=this.escapeExpression,f=this,g="function";return u+='\n<div class="row-fluid" id=\'cases_detail_popover-div\'>\n    <div class="span9" style="margin-left:0px;">\n        <div>\n            <div style="line-height:20px;font-style:italic;margin-bottom:5px;">\n                ',(p=n.description)?h=p.call(e,{hash:{},data:l}):(p=e&&e.description,h=typeof p===g?p.call(e,{hash:{},data:l}):p),u+=m(h)+'\n            </div>\n            <div style="margin:5px;">\n                <p><b>Owner : </b>'+m((h=e&&e.owner,h=null==h||h===!1?h:h.name,typeof h===g?h.apply(e):h))+"</p>\n\n				",h=n["if"].call(e,e&&e.contacts,{hash:{},inverse:f.noop,fn:f.program(1,s,l),data:l}),(h||0===h)&&(u+=h),u+="\n            </div>\n        </div>\n    </div>\n</div>\n\n\n"}),e["cases-model-template"]=a(function(a,e,n,t,l){function s(a,e){var t,l,s="";return s+='\n        <img class="thumbnail" src="',(l=n.ownerPic)?t=l.call(a,{hash:{},data:e}):(l=a&&a.ownerPic,t=typeof l===g?l.call(a,{hash:{},data:e}):l),s+=y(t)+'" width="40px" height="40px" title="'+y((t=a&&a.owner,t=null==t||t===!1?t:t.name,typeof t===g?t.apply(a):t))+'" />\n	   '}function i(a,e){var t,l,s,i="";return i+='\n		<img class="thumbnail" src="'+y((l=n.defaultGravatarurl||a&&a.defaultGravatarurl,s={hash:{},data:e},l?l.call(a,50,s):w.call(a,"defaultGravatarurl",50,s)))+'" width="40px" height="40px" title="'+y((t=a&&a.owner,t=null==t||t===!1?t:t.name,typeof t===g?t.apply(a):t))+'" />\n       '}function r(a,e){var t,l,s,i="";return i+='\n			<div style="display:inline-block;">\n				',l=n.if_equals||a&&a.if_equals,s={hash:{},inverse:_.noop,fn:_.program(6,c,e),data:e},t=l?l.call(a,a&&a.type,"PERSON",s):w.call(a,"if_equals",a&&a.type,"PERSON",s),(t||0===t)&&(i+=t),i+="\n\n				",l=n.if_equals||a&&a.if_equals,s={hash:{},inverse:_.noop,fn:_.program(8,o,e),data:e},t=l?l.call(a,a&&a.type,"COMPANY",s):w.call(a,"if_equals",a&&a.type,"COMPANY",s),(t||0===t)&&(i+=t),i+="\n			</div>\n			"}function c(a,e){var t,l,s="";return s+='\n          	 	<img class="thumbnail img-inital" data-name="'+y((t=n.dataNameAvatar||a&&a.dataNameAvatar,l={hash:{},data:e},t?t.call(a,a&&a.properties,l):w.call(a,"dataNameAvatar",a&&a.properties,l)))+'" src="'+y((t=n.gravatarurl||a&&a.gravatarurl,l={hash:{},data:e},t?t.call(a,a&&a.properties,50,l):w.call(a,"gravatarurl",a&&a.properties,50,l)))+'" width="40px" height="40px" style=" width:40px; height:40px; " title="'+y((t=n.contact_name_necessary||a&&a.contact_name_necessary,l={hash:{},data:e},t?t.call(a,a,l):w.call(a,"contact_name_necessary",a,l)))+'" />\n				'}function o(a,e){var t,l,s="";return s+="\n				<img class='thumbnail' \n					"+y((t=n.getCompanyImage||a&&a.getCompanyImage,l={hash:{},data:e},t?t.call(a,"40",l):w.call(a,"getCompanyImage","40",l)))+' \n					title="'+y((t=n.contact_name_necessary||a&&a.contact_name_necessary,l={hash:{},data:e},t?t.call(a,a,l):w.call(a,"contact_name_necessary",a,l)))+'" />\n				'}function d(){return"<span>...</span>"}function h(){return'\n	<div style="border-radius:4px; border: 1px solid; background-color:red; text-align:center; color:white; font-size:0.9em; ">\n		<b>Open</b>\n	</div>\n	'}function p(){return'\n	<div style="border-radius:4px; border: 1px solid; background-color:grey; text-align:center; color:white; font-size:0.9em; ">\n		<b>Close</b>\n	</div>\n	'}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,a.helpers),l=l||{};var u,v,m,f="",g="function",y=this.escapeExpression,w=n.helperMissing,_=this;return f+='\n<td>\n    <div style="height:auto;text-overflow:ellipsis;white-space:nowrap;width:5em;overflow:hidden;">\n	   ',u=n["if"].call(e,e&&e.ownerPic,{hash:{},inverse:_.program(3,i,l),fn:_.program(1,s,l),data:l}),(u||0===u)&&(f+=u),f+='\n    </div>\n</td>\n<td data="',(v=n.id)?u=v.call(e,{hash:{},data:l}):(v=e&&e.id,u=typeof v===g?v.call(e,{hash:{},data:l}):v),f+=y(u)+'" class="data">\n		<b style="height:auto;text-overflow:ellipsis;white-space:nowrap;width:auto; max-width:20em; overflow:hidden;display:inline-block;">',(v=n.title)?u=v.call(e,{hash:{},data:l}):(v=e&&e.title,u=typeof v===g?v.call(e,{hash:{},data:l}):v),f+=y(u)+'</b>\n	<div style="height:3em; overflow:hidden; text-overflow:ellipsis; position:relative; padding-top:0.2em;">\n		',(v=n.description)?u=v.call(e,{hash:{},data:l}):(v=e&&e.description,u=typeof v===g?v.call(e,{hash:{},data:l}):v),f+=y(u)+'\n	</div>\n</td>\n<td><time class="deal-created-time" value="',(v=n.created_time)?u=v.call(e,{hash:{},data:l}):(v=e&&e.created_time,u=typeof v===g?v.call(e,{hash:{},data:l}):v),f+=y(u)+'" datetime="'+y((v=n.epochToHumanDate||e&&e.epochToHumanDate,m={hash:{},data:l},v?v.call(e,"",e&&e.created_time,m):w.call(e,"epochToHumanDate","",e&&e.created_time,m)))+'" style="border-bottom:dotted 1px #999">'+y((v=n.epochToHumanDate||e&&e.epochToHumanDate,m={hash:{},data:l},v?v.call(e,"ddd mmm dd yyyy HH:MM:ss",e&&e.created_time,m):w.call(e,"epochToHumanDate","ddd mmm dd yyyy HH:MM:ss",e&&e.created_time,m)))+'</time></td>\n<td>\n	<div style="height:auto;white-space:nowrap;width:157px;overflow:hidden;display:inline-block;">\n        	',u=n.each.call(e,e&&e.contacts,{hash:{},inverse:_.noop,fn:_.program(5,r,l),data:l}),(u||0===u)&&(f+=u),f+="\n	</div>\n       ",v=n.if_greater||e&&e.if_greater,m={hash:{},inverse:_.noop,fn:_.program(10,d,l),data:l},u=v?v.call(e,(u=e&&e.contacts,null==u||u===!1?u:u.length),"4",m):w.call(e,"if_greater",(u=e&&e.contacts,null==u||u===!1?u:u.length),"4",m),(u||0===u)&&(f+=u),f+="\n</td>\n<td>\n	",v=n.if_equals||e&&e.if_equals,m={hash:{},inverse:_.program(14,p,l),fn:_.program(12,h,l),data:l},u=v?v.call(e,e&&e.status,"OPEN",m):w.call(e,"if_equals",e&&e.status,"OPEN",m),(u||0===u)&&(f+=u),f+="\n</td>\n\n"})}();