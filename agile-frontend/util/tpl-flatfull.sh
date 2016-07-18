cd ../WebContent
cat flatfull/tpl/*.html > tpl/min/flatfull/tpl.js
cat flatfull/tpl/settings/*.html >  tpl/min/flatfull/settings.js
cat flatfull/tpl/continue/*.html > tpl/min/flatfull/continue.js
cat flatfull/tpl/deal-detail/*.html > tpl/min/flatfull/deal-detail.js
cat flatfull/tpl/bulk-actions/*.html > tpl/min/flatfull/bulk-actions.js
cat flatfull/tpl/gmap/*.html > tpl/min/flatfull/gmap.js
cat flatfull/tpl/report/*.html > tpl/min/flatfull/report.js
cat flatfull/tpl/workflow/*.html > tpl/min/flatfull/workflow.js
cat flatfull/tpl/billing/*.html > tpl/min/flatfull/billing.js
cat flatfull/tpl/web-rules/*.html > tpl/min/flatfull/web-rules.js
cat flatfull/tpl/widget/*.html > tpl/min/flatfull/widget.js
cat flatfull/tpl/socialsuite/*.html > tpl/min/flatfull/socialsuite.js
cat flatfull/tpl/admin-settings/*.html > tpl/min/flatfull/admin-settings.js
cat flatfull/tpl/contact-detail/*.html > tpl/min/flatfull/contact-detail.js
cat flatfull/tpl/contact-view/*.html > tpl/min/flatfull/contact-view.js
cat flatfull/tpl/contact-filter/*.html > tpl/min/flatfull/contact-filter.js
cat flatfull/tpl/case/*.html > tpl/min/flatfull/case.js
cat flatfull/tpl/document/*.html > tpl/min/flatfull/document.js
cat flatfull/tpl/portlets/*.html > tpl/min/flatfull/portlets.js
cat flatfull/tpl/landingpages/*.html > tpl/min/flatfull/landingpages.js
cat flatfull/tpl/tickets/*.html > tpl/min/flatfull/tickets.js
cat flatfull/tpl/emailbuilder/*.html > tpl/min/flatfull/emailbuilder.js
cat flatfull/tpl/segmentation/*.html > tpl/min/flatfull/segmentation.js
cat flatfull/tpl/referals/*.html > tpl/min/flatfull/referals.js
cat flatfull/tpl/helpcenter/*.html  > tpl/min/flatfull/helpcenter.js
cat ../WebContent/helpcenter/helpcenter-tpl/*.html  > ../WebContent/tpl/min/flatfull/helpcenter-tpl.js

cd ../util

#Local Dev
java -jar agilelocalize.jar ../WebContent/tpl/min/flatfull ../WebContent/tpl/min en,es
#cat ../WebContent/tpl/min/flatfull/js-localize.js > ../WebContent/local
#End of Local Dev