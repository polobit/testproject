#!/bin/bash

cd ../war
cat tpl/*.html > tpl/min/tpl.js
cat tpl/settings/*.html > tpl/min/settings.js
cat tpl/continue/*.html > tpl/min/continue.js
cat tpl/bulk-actions/*.html > tpl/min/bulk-actions.js
cat tpl/gmap/*.html > tpl/min/gmap.js
cat tpl/report/*.html > tpl/min/report.js
cat tpl/workflow/*.html > tpl/min/workflow.js
cat tpl/billing/*.html > tpl/min/billing.js

cat tpl/widget/twitter/*.html > tpl/min/twitter.js
cat tpl/widget/rapleaf/*.html > tpl/min/rapleaf.js
cat tpl/widget/clickdesk/*.html > tpl/min/clickdesk.js
cat tpl/widget/zendesk/*.html > tpl/min/zendesk.js
cat tpl/widget/twilio/*.html > tpl/min/twilio.js
cat tpl/widget/freshbooks/*.html > tpl/min/freshbooks.js
cat tpl/widget/stripe/*.html > tpl/min/stripe.js
cat tpl/widget/helpscout/*.html > tpl/min/helpscout.js
cat tpl/widget/xero/*.html > tpl/min/xero.js
cat tpl/widget/quickbooks/*.html > tpl/min/quickbooks.js
cat tpl/widget/facebook/*.html > tpl/min/facebook.js
cat tpl/widget/*.html > tpl/min/widget.js







cat tpl/socialsuite/*.html > tpl/min/socialsuite.js
cat tpl/admin-settings/*.html > tpl/min/admin-settings.js
cat tpl/contact-detail/*.html > tpl/min/contact-detail.js
cat tpl/contact-view/*.html > tpl/min/contact-view.js
cat tpl/contact-filter/*.html > tpl/min/contact-filter.js
cat tpl/web-rules/*.html > tpl/min/web-rules.js
cat tpl/case/*.html > tpl/min/case.js
cat tpl/document/*.html > tpl/min/document.js

cd ../util
