{
    "nodes": [
        {
            "NodeDefinition": {
                "name": "Start",
                "thumbnail": "json/nodes/images/common/Start.png",
                "icon": "json/nodes/icons/common/Start.png",
                "info": "Entry point of your campaign. Please create workflow for your campaign starting from here.",
                "help": "Start point in your campaign workflow.",
                "author": "John",
                "company": "Invox",
                "language": "en",
                "branches": "start",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Start",
                "category": "Basic",
                "ui": [
                    {
                        "label": "Entry point of your campaign. Please create workflow for your campaign starting from here.",
                        "category": "Help",
                        "componet": "label",
                        "type": "label"
                    }
                ]
            },
            "id": "PBXNODE1",
            "xPosition": 500,
            "yPosition": 10,
            "displayname": "Start",
            "JsonValues": [],
            "States": [
                {
                    "start": "PBXHWo1PHDnoJ"
                }
            ]
        },
        {
            "NodeDefinition": {
                "ui": [
                    {
                        "label": "From (Name):",
                        "category": "Info",
                        "name": "from_name",
                        "id": "from_name",
                        "title": "Enter your name.",
                        "required": "required",
                        "fieldType": "input",
                        "type": "text"
                    },
                    {
    					"label": "From (Email):",
    					"category": "Info",
    					"name": "from_email",
    					"id": "from_email",
    					"required": "required",
    					"title": "Select your email address.",
    					"url": "/core/api/account-prefs/verified-emails/all",
    					"dynamicName": "email",
    					"dynamicValue": "email",
    					"arrange_type": "prepend",
    					"fieldType": "dynamicselect",
    					"type": "verified_email",
    					"options": {
        					"Contact's Owner": "{{owner.email}}",
        					"+ Add new": "verify_email"
    					},
    					"event": "onchange",
    					"eventHandler": "openVerifyEmailModal(this)",
    					"style": {
        					"width": "77.5%",
        					"padding": "0.4em"
    					}
					},
                    {
                        "label": "To",
                        "category": "Info",
                        "name": "to_email",
                        "id": "to_email",
                        "value": "{{email}}",
                        "required": "required",
                        "title": "Enter your subscriber E-mail ID. If you are using a list, you can use {{email}}",
                        "fieldType": "input",
                        "type": "multipleEmails"
                    },
    				{
    					"label": "CC",
    					"category": "Info",
    					"name": "cc_email",
    		            "id":"cc_email",
    					"title": "Enter CC email address",
    					"fieldType": "input",
    		            "type": "multipleEmails"
    				},
    				{
    					"label": "BCC",
    					"category": "Info",
    					"name": "bcc_email",
    		            "id":"bcc_email",
    					"title": "Enter BCC email address",
    					"fieldType": "input",
    		            "type": "multipleEmails"
    				},
                    {
                        "label": "Subject",
                        "category": "Info",
                        "name": "subject",
                        "id": "subject",
                        "required": "required",
                        "title": "Enter your subject for your email.",
                        "fieldType": "input",
                        "type": "text"
                    },
                    {
                        "label": "Reply To",
                        "category": "Info",
                        "name": "replyto_email",
                        "id": "replyto_email",
                        "title": "Enter email your subscribers need to reply.",
                        "fieldType": "input",
                        "type": "email"
                    },
                    {
                        "label": "",
                        "category": "Text",
                        "name": "merge_fields",
                        "id": "merge_fields",
                        "title": "Select required merge field to insert into below Text Field.",
                        "fieldType": "merge_fields",
                        "target_type": "text_email",
                        "type": "select"
                    },
                    {
                        "label": "Text",
                        "category": "Text",
                        "name": "text_email",
                        "id": "text_email",
                        "title": "Enter text content here.",
                        "cols": "75",
                        "rows": "13",
                        "required": "required",
                        "fieldType": "textarea",
                        "type": "textarea"
                    },
                    {
                        "category": "Text",
                        "name": "button_email",
                        "id": "button_email",
                        "title": "Send test Email",
                        "required": "required",
                        "value": "Send Test Email",
                        "fieldType": "input",
                        "type": "button",
                        "class": "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary",
                        "style": {
                            "float": "right",
                            "margin-right": "3px",
                            "background": "none",
                            "border": "none",
                            "text-decoration": "underline",
                            "border-bottom": "1px solid",
                            "padding": "0px 0px 1px 0px",
                            "position": "relative",
                            "outline": "none",
                            "font-size": "11px",
                            "top": "-6px"
                        }
                    },
                    {
                        "label": "",
                        "category": "HTML",
                        "name": "merge_fields",
                        "id": "merge_fields",
                        "title": "Select required merge field to insert into below HTML Field.",
                        "fieldType": "merge_fields",
                        "target_type": "tinyMCEhtml_email",
                        "type": "select"
                    },
                    {
                        "label": "HTML Editor",
                        "category": "HTML",
                        "name": "html_email",
                        "id": "html_email",
                        "title": "Enter Your HTML message.",
                        "fieldType": "html",
                        "type": "html"
                    },
                    {
                        "category": "HTML",
                        "name": "button_email_html",
                        "id": "button_email_html",
                        "title": "Send test Email",
                        "required": "required",
                        "value": "Send Test Email",
                        "fieldType": "input",
                        "type": "button",
                        "class": "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary",
                        "style": {
                            "float": "right",
                            "margin-right": "3px",
                            "background": "none",
                            "border": "none",
                            "text-decoration": "underline",
                            "border-bottom": "1px solid",
                            "padding": "0px 0px 1px 0px",
                            "position": "relative",
                            "top": "-44px",
                            "outline": "none",
                            "font-size": "11px"
                        }
                    },
                    {
                        "label": "Track Clicks:",
                        "required": "No",
                        "category": "Settings",
                        "name": "track_clicks",
                        "title": "Enable tracking for email link clicks. Use \"Yes &amp; Push\" if you want to push contact data to your website (to enable web activity tracking)",
                        "options": {
                            "*No": "no",
                            "Yes": "yes",
                            "Yes & Push (Email only)": "yes_and_push_email_only",
                            "Yes & Push": "yes_and_push"
                        },
                        "fieldType": "select",
                        "type": "select"
                    },
                    {
                        "label": "Simply choose timezone, day and time. Agile can schedule your email delivery."
                    },
                    {
                        "label": "Time zone",
                        "required": "No",
                        "category": "Settings",
                        "value": "(GMT-06:00) Central Time (US & Canada)",
                        "name": "time_zone",
                        "title": "Select the time zone for your email delivery.",
                        "options": {
                            <%@page import="java.util.Arrays"%>
                            <%@page import="java.util.HashMap"%>
                            <%@page import="java.util.Map"%>           
                            <%@page import="java.util.TimeZone"%>
                            
                            <%  
                                String[] allTimeZones = TimeZone.getAvailableIDs();    
                                Arrays.sort(allTimeZones);  
                                
                                Map<String, String> zones = new HashMap<String, String>();
                                zones.put("ACT", "ACT (Australian Central Standard Time)");
                                zones.put("AET", "AET (Australian Eastern Standard Time)");
                                zones.put("AGT", "AGT (Argentina Standard Time)");
                                zones.put("ART", "ART (Arabia (Egypt) Standard Time)");
                                zones.put("AST", "AST (Alaska Standard Time)");
                                zones.put("Africa/Abidjan", "Africa/Abidjan");
                                zones.put("Africa/Accra", "Africa/Accra");
                                zones.put("Africa/Addis_Ababa", "Africa/Addis_Ababa");
                                zones.put("Africa/Algiers", "Africa/Algiers");
                                zones.put("Africa/Asmara", "Africa/Asmara");
                                zones.put("Africa/Asmera", "Africa/Asmera");
                                zones.put("Africa/Bamako", "Africa/Bamako");
                                zones.put("Africa/Bangui", "Africa/Bangui");
                                zones.put("Africa/Banjul", "Africa/Banjul");
                                zones.put("Africa/Bissau", "Africa/Bissau");
                                zones.put("Africa/Blantyre", "Africa/Blantyre");
                                zones.put("Africa/Brazzaville", "Africa/Brazzaville");
                                zones.put("Africa/Bujumbura", "Africa/Bujumbura");
                                zones.put("Africa/Cairo", "Africa/Cairo");
                                zones.put("Africa/Casablanca", "Africa/Casablanca");
                                zones.put("Africa/Ceuta", "Africa/Ceuta");
                                zones.put("Africa/Conakry", "Africa/Conakry");
                                zones.put("Africa/Dakar", "Africa/Dakar");
                                zones.put("Africa/Dar_es_Salaam", "Africa/Dar_es_Salaam");
                                zones.put("Africa/Djibouti", "Africa/Djibouti");
                                zones.put("Africa/Douala", "Africa/Douala");
                                zones.put("Africa/El_Aaiun", "Africa/El_Aaiun");
                                zones.put("Africa/Freetown", "Africa/Freetown");
                                zones.put("Africa/Gaborone", "Africa/Gaborone");
                                zones.put("Africa/Harare", "Africa/Harare");
                                zones.put("Africa/Johannesburg", "Africa/Johannesburg");
                                zones.put("Africa/Kampala", "Africa/Kampala");
                                zones.put("Africa/Khartoum", "Africa/Khartoum");
                                zones.put("Africa/Kigali", "Africa/Kigali");
                                zones.put("Africa/Kinshasa", "Africa/Kinshasa");
                                zones.put("Africa/Lagos", "Africa/Lagos");
                                zones.put("Africa/Libreville", "Africa/Libreville");
                                zones.put("Africa/Lome", "Africa/Lome");
                                zones.put("Africa/Luanda", "Africa/Luanda");
                                zones.put("Africa/Lubumbashi", "Africa/Lubumbashi");
                                zones.put("Africa/Lusaka", "Africa/Lusaka");
                                zones.put("Africa/Malabo", "Africa/Malabo");
                                zones.put("Africa/Maputo", "Africa/Maputo");
                                zones.put("Africa/Maseru", "Africa/Maseru");
                                zones.put("Africa/Mbabane", "Africa/Mbabane");
                                zones.put("Africa/Mogadishu", "Africa/Mogadishu");
                                zones.put("Africa/Monrovia", "Africa/Monrovia");
                                zones.put("Africa/Nairobi", "Africa/Nairobi");
                                zones.put("Africa/Ndjamena", "Africa/Ndjamena");
                                zones.put("Africa/Niamey", "Africa/Niamey");
                                zones.put("Africa/Nouakchott", "Africa/Nouakchott");
                                zones.put("Africa/Ouagadougou", "Africa/Ouagadougou");
                                zones.put("Africa/Porto-Novo", "Africa/Porto-Novo");
                                zones.put("Africa/Sao_Tome", "Africa/Sao_Tome");
                                zones.put("Africa imbuktu", "Africa imbuktu");
                                zones.put("Africa ripoli", "Africa ripoli");
                                zones.put("Africa unis", "Africa unis");
                                zones.put("Africa/Windhoek", "Africa/Windhoek");
                                zones.put("America/Adak", "America/Adak");
                                zones.put("America/Anchorage", "America/Anchorage");
                                zones.put("America/Anguilla", "America/Anguilla");
                                zones.put("America/Antigua", "America/Antigua");
                                zones.put("America/Araguaina", "America/Araguaina");
                                zones.put("America/Argentina/Buenos_Aires", "America/Argentina/Buenos_Aires");
                                zones.put("America/Argentina/Catamarca", "America/Argentina/Catamarca");
                                zones.put("America/Argentina/ComodRivadavia", "America/Argentina/ComodRivadavia");
                                zones.put("America/Argentina/Cordoba", "America/Argentina/Cordoba");
                                zones.put("America/Argentina/Jujuy", "America/Argentina/Jujuy");
                                zones.put("America/Argentina/La_Rioja", "America/Argentina/La_Rioja");
                                zones.put("America/Argentina/Mendoza", "America/Argentina/Mendoza");
                                zones.put("America/Argentina/Rio_Gallegos", "America/Argentina/Rio_Gallegos");
                                zones.put("America/Argentina/Salta", "America/Argentina/Salta");
                                zones.put("America/Argentina/San_Juan", "America/Argentina/San_Juan");
                                zones.put("America/Argentina/San_Luis", "America/Argentina/San_Luis");
                                zones.put("America/Argentina ucuman", "America/Argentina ucuman");
                                zones.put("America/Argentina/Ushuaia", "America/Argentina/Ushuaia");
                                zones.put("America/Aruba", "America/Aruba");
                                zones.put("America/Asuncion", "America/Asuncion");
                                zones.put("America/Atikokan", "America/Atikokan");
                                zones.put("America/Atka", "America/Atka");
                                zones.put("America/Bahia", "America/Bahia");
                                zones.put("America/Barbados", "America/Barbados");
                                zones.put("America/Belem", "America/Belem");
                                zones.put("America/Belize", "America/Belize");
                                zones.put("America/Blanc-Sablon", "America/Blanc-Sablon");
                                zones.put("America/Boa_Vista", "America/Boa_Vista");
                                zones.put("America/Bogota", "America/Bogota");
                                zones.put("America/Boise", "America/Boise");
                                zones.put("America/Buenos_Aires", "America/Buenos_Aires");
                                zones.put("America/Cambridge_Bay", "America/Cambridge_Bay");
                                zones.put("America/Campo_Grande", "America/Campo_Grande");
                                zones.put("America/Cancun", "America/Cancun");
                                zones.put("America/Caracas", "America/Caracas");
                                zones.put("America/Catamarca", "America/Catamarca");
                                zones.put("America/Cayenne", "America/Cayenne");
                                zones.put("America/Cayman", "America/Cayman");
                                zones.put("America/Chicago", "America/Chicago");
                                zones.put("America/Chihuahua", "America/Chihuahua");
                                zones.put("America/Coral_Harbour", "America/Coral_Harbour");
                                zones.put("America/Cordoba", "America/Cordoba");
                                zones.put("America/Costa_Rica", "America/Costa_Rica");
                                zones.put("America/Cuiaba", "America/Cuiaba");
                                zones.put("America/Curacao", "America/Curacao");
                                zones.put("America/Danmarkshavn", "America/Danmarkshavn");
                                zones.put("America/Dawson", "America/Dawson");
                                zones.put("America/Dawson_Creek", "America/Dawson_Creek");
                                zones.put("America/Denver", "America/Denver");
                                zones.put("America/Detroit", "America/Detroit");
                                zones.put("America/Dominica", "America/Dominica");
                                zones.put("America/Edmonton", "America/Edmonton");
                                zones.put("America/Eirunepe", "America/Eirunepe");
                                zones.put("America/El_Salvador", "America/El_Salvador");
                                zones.put("America/Ensenada", "America/Ensenada");
                                zones.put("America/Fort_Wayne", "America/Fort_Wayne");
                                zones.put("America/Fortaleza", "America/Fortaleza");
                                zones.put("America/Glace_Bay", "America/Glace_Bay");
                                zones.put("America/Godthab", "America/Godthab");
                                zones.put("America/Goose_Bay", "America/Goose_Bay");
                                zones.put("America/Grand_Turk", "America/Grand_Turk");
                                zones.put("America/Grenada", "America/Grenada");
                                zones.put("America/Guadeloupe", "America/Guadeloupe");
                                zones.put("America/Guatemala", "America/Guatemala");
                                zones.put("America/Guayaquil", "America/Guayaquil");
                                zones.put("America/Guyana", "America/Guyana");
                                zones.put("America/Halifax", "America/Halifax");
                                zones.put("America/Havana", "America/Havana");
                                zones.put("America/Hermosillo", "America/Hermosillo");
                                zones.put("America/Indiana/Indianapolis", "America/Indiana/Indianapolis");
                                zones.put("America/Indiana/Knox", "America/Indiana/Knox");
                                zones.put("America/Indiana/Marengo", "America/Indiana/Marengo");
                                zones.put("America/Indiana/Petersburg", "America/Indiana/Petersburg");
                                zones.put("America/Indiana ell_City", "America/Indiana ell_City");
                                zones.put("America/Indiana/Vevay", "America/Indiana/Vevay");
                                zones.put("America/Indiana/Vincennes", "America/Indiana/Vincennes");
                                zones.put("America/Indiana/Winamac", "America/Indiana/Winamac");
                                zones.put("America/Indianapolis", "America/Indianapolis");
                                zones.put("America/Inuvik", "America/Inuvik");
                                zones.put("America/Iqaluit", "America/Iqaluit");
                                zones.put("America/Jamaica", "America/Jamaica");
                                zones.put("America/Jujuy", "America/Jujuy");
                                zones.put("America/Juneau", "America/Juneau");
                                zones.put("America/Kentucky/Louisville", "America/Kentucky/Louisville");
                                zones.put("America/Kentucky/Monticello", "America/Kentucky/Monticello");
                                zones.put("America/Knox_IN", "America/Knox_IN");
                                zones.put("America/La_Paz", "America/La_Paz");
                                zones.put("America/Lima", "America/Lima");
                                zones.put("America/Los_Angeles", "America/Los_Angeles");
                                zones.put("America/Louisville", "America/Louisville");
                                zones.put("America/Maceio", "America/Maceio");
                                zones.put("America/Managua", "America/Managua");
                                zones.put("America/Manaus", "America/Manaus");
                                zones.put("America/Marigot", "America/Marigot");
                                zones.put("America/Martinique", "America/Martinique");
                                zones.put("America/Matamoros", "America/Matamoros");
                                zones.put("America/Mazatlan", "America/Mazatlan");
                                zones.put("America/Mendoza", "America/Mendoza");
                                zones.put("America/Menominee", "America/Menominee");
                                zones.put("America/Merida", "America/Merida");
                                zones.put("America/Mexico_City", "America/Mexico_City");
                                zones.put("America/Miquelon", "America/Miquelon");
                                zones.put("America/Moncton", "America/Moncton");
                                zones.put("America/Monterrey", "America/Monterrey");
                                zones.put("America/Montevideo", "America/Montevideo");
                                zones.put("America/Montreal", "America/Montreal");
                                zones.put("America/Montserrat", "America/Montserrat");
                                zones.put("America/Nassau", "America/Nassau");
                                zones.put("America/New_York", "America/New_York");
                                zones.put("America/Nipigon", "America/Nipigon");
                                zones.put("America/Nome", "America/Nome");
                                zones.put("America/Noronha", "America/Noronha");
                                zones.put("America/North_Dakota/Center", "America/North_Dakota/Center");
                                zones.put("America/North_Dakota/New_Salem", "America/North_Dakota/New_Salem");
                                zones.put("America/Ojinaga", "America/Ojinaga");
                                zones.put("America/Panama", "America/Panama");
                                zones.put("America/Pangnirtung", "America/Pangnirtung");
                                zones.put("America/Paramaribo", "America/Paramaribo");
                                zones.put("America/Phoenix", "America/Phoenix");
                                zones.put("America/Port-au-Prince", "America/Port-au-Prince");
                                zones.put("America/Port_of_Spain", "America/Port_of_Spain");
                                zones.put("America/Porto_Acre", "America/Porto_Acre");
                                zones.put("America/Porto_Velho", "America/Porto_Velho");
                                zones.put("America/Puerto_Rico", "America/Puerto_Rico");
                                zones.put("America/Rainy_River", "America/Rainy_River");
                                zones.put("America/Rankin_Inlet", "America/Rankin_Inlet");
                                zones.put("America/Recife", "America/Recife");
                                zones.put("America/Regina", "America/Regina");
                                zones.put("America/Resolute", "America/Resolute");
                                zones.put("America/Rio_Branco", "America/Rio_Branco");
                                zones.put("America/Rosario", "America/Rosario");
                                zones.put("America/Santa_Isabel", "America/Santa_Isabel");
                                zones.put("America/Santarem", "America/Santarem");
                                zones.put("America/Santiago", "America/Santiago");
                                zones.put("America/Santo_Domingo", "America/Santo_Domingo");
                                zones.put("America/Sao_Paulo", "America/Sao_Paulo");
                                zones.put("America/Scoresbysund", "America/Scoresbysund");
                                zones.put("America/Shiprock", "America/Shiprock");
                                zones.put("America/St_Barthelemy", "America/St_Barthelemy");
                                zones.put("America/St_Johns", "America/St_Johns");
                                zones.put("America/St_Kitts", "America/St_Kitts");
                                zones.put("America/St_Lucia", "America/St_Lucia");
                                zones.put("America/St_Thomas", "America/St_Thomas");
                                zones.put("America/St_Vincent", "America/St_Vincent");
                                zones.put("America/Swift_Current", "America/Swift_Current");
                                zones.put("America egucigalpa", "America egucigalpa");
                                zones.put("America hule", "America hule");
                                zones.put("America hunder_Bay", "America hunder_Bay");
                                zones.put("America ijuana", "America ijuana");
                                zones.put("America oronto", "America oronto");
                                zones.put("America ortola", "America ortola");
                                zones.put("America/Vancouver", "America/Vancouver");
                                zones.put("America/Virgin", "America/Virgin");
                                zones.put("America/Whitehorse", "America/Whitehorse");
                                zones.put("America/Winnipeg", "America/Winnipeg");
                                zones.put("America/Yakutat", "America/Yakutat");
                                zones.put("America/Yellowknife", "America/Yellowknife");
                                zones.put("Antarctica/Casey", "Antarctica/Casey");
                                zones.put("Antarctica/Davis", "Antarctica/Davis");
                                zones.put("Antarctica/DumontDUrville", "Antarctica/DumontDUrville");
                                zones.put("Antarctica/Macquarie", "Antarctica/Macquarie");
                                zones.put("Antarctica/Mawson", "Antarctica/Mawson");
                                zones.put("Antarctica/McMurdo", "Antarctica/McMurdo");
                                zones.put("Antarctica/Palmer", "Antarctica/Palmer");
                                zones.put("Antarctica/Rothera", "Antarctica/Rothera");
                                zones.put("Antarctica/South_Pole", "Antarctica/South_Pole");
                                zones.put("Antarctica/Syowa", "Antarctica/Syowa");
                                zones.put("Antarctica/Vostok", "Antarctica/Vostok");
                                zones.put("Arctic/Longyearbyen", "Arctic/Longyearbyen");
                                zones.put("Asia/Aden", "Asia/Aden");
                                zones.put("Asia/Almaty", "Asia/Almaty");
                                zones.put("Asia/Amman", "Asia/Amman");
                                zones.put("Asia/Anadyr", "Asia/Anadyr");
                                zones.put("Asia/Aqtau", "Asia/Aqtau");
                                zones.put("Asia/Aqtobe", "Asia/Aqtobe");
                                zones.put("Asia/Ashgabat", "Asia/Ashgabat");
                                zones.put("Asia/Ashkhabad", "Asia/Ashkhabad");
                                zones.put("Asia/Baghdad", "Asia/Baghdad");
                                zones.put("Asia/Bahrain", "Asia/Bahrain");
                                zones.put("Asia/Baku", "Asia/Baku");
                                zones.put("Asia/Bangkok", "Asia/Bangkok");
                                zones.put("Asia/Beirut", "Asia/Beirut");
                                zones.put("Asia/Bishkek", "Asia/Bishkek");
                                zones.put("Asia/Brunei", "Asia/Brunei");
                                zones.put("Asia/Calcutta", "Asia/Calcutta");
                                zones.put("Asia/Choibalsan", "Asia/Choibalsan");
                                zones.put("Asia/Chongqing", "Asia/Chongqing");
                                zones.put("Asia/Chungking", "Asia/Chungking");
                                zones.put("Asia/Colombo", "Asia/Colombo");
                                zones.put("Asia/Dacca", "Asia/Dacca");
                                zones.put("Asia/Damascus", "Asia/Damascus");
                                zones.put("Asia/Dhaka", "Asia/Dhaka");
                                zones.put("Asia/Dili", "Asia/Dili");
                                zones.put("Asia/Dubai", "Asia/Dubai");
                                zones.put("Asia/Dushanbe", "Asia/Dushanbe");
                                zones.put("Asia/Gaza", "Asia/Gaza");
                                zones.put("Asia/Harbin", "Asia/Harbin");
                                zones.put("Asia/Ho_Chi_Minh", "Asia/Ho_Chi_Minh");
                                zones.put("Asia/Hong_Kong", "Asia/Hong_Kong");
                                zones.put("Asia/Hovd", "Asia/Hovd");
                                zones.put("Asia/Irkutsk", "Asia/Irkutsk");
                                zones.put("Asia/Istanbul", "Asia/Istanbul");
                                zones.put("Asia/Jakarta", "Asia/Jakarta");
                                zones.put("Asia/Jayapura", "Asia/Jayapura");
                                zones.put("Asia/Jerusalem", "Asia/Jerusalem");
                                zones.put("Asia/Kabul", "Asia/Kabul");
                                zones.put("Asia/Kamchatka", "Asia/Kamchatka");
                                zones.put("Asia/Karachi", "Asia/Karachi");
                                zones.put("Asia/Kashgar", "Asia/Kashgar");
                                zones.put("Asia/Kathmandu", "Asia/Kathmandu");
                                zones.put("Asia/Katmandu", "Asia/Katmandu");
                                zones.put("Asia/Kolkata", "Asia/Kolkata");
                                zones.put("Asia/Krasnoyarsk", "Asia/Krasnoyarsk");
                                zones.put("Asia/Kuala_Lumpur", "Asia/Kuala_Lumpur");
                                zones.put("Asia/Kuching", "Asia/Kuching");
                                zones.put("Asia/Kuwait", "Asia/Kuwait");
                                zones.put("Asia/Macao", "Asia/Macao");
                                zones.put("Asia/Macau", "Asia/Macau");
                                zones.put("Asia/Magadan", "Asia/Magadan");
                                zones.put("Asia/Makassar", "Asia/Makassar");
                                zones.put("Asia/Manila", "Asia/Manila");
                                zones.put("Asia/Muscat", "Asia/Muscat");
                                zones.put("Asia/Nicosia", "Asia/Nicosia");
                                zones.put("Asia/Novokuznetsk", "Asia/Novokuznetsk");
                                zones.put("Asia/Novosibirsk", "Asia/Novosibirsk");
                                zones.put("Asia/Omsk", "Asia/Omsk");
                                zones.put("Asia/Oral", "Asia/Oral");
                                zones.put("Asia/Phnom_Penh", "Asia/Phnom_Penh");
                                zones.put("Asia/Pontianak", "Asia/Pontianak");
                                zones.put("Asia/Pyongyang", "Asia/Pyongyang");
                                zones.put("Asia/Qatar", "Asia/Qatar");
                                zones.put("Asia/Qyzylorda", "Asia/Qyzylorda");
                                zones.put("Asia/Rangoon", "Asia/Rangoon");
                                zones.put("Asia/Riyadh", "Asia/Riyadh");
                                zones.put("Asia/Riyadh87", "Asia/Riyadh87");
                                zones.put("Asia/Riyadh88", "Asia/Riyadh88");
                                zones.put("Asia/Riyadh89", "Asia/Riyadh89");
                                zones.put("Asia/Saigon", "Asia/Saigon");
                                zones.put("Asia/Sakhalin", "Asia/Sakhalin");
                                zones.put("Asia/Samarkand", "Asia/Samarkand");
                                zones.put("Asia/Seoul", "Asia/Seoul");
                                zones.put("Asia/Shanghai", "Asia/Shanghai");
                                zones.put("Asia/Singapore", "Asia/Singapore");
                                zones.put("Asia aipei", "Asia aipei");
                                zones.put("Asia ashkent", "Asia ashkent");
                                zones.put("Asia bilisi", "Asia bilisi");
                                zones.put("Asia ehran", "Asia ehran");
                                zones.put("Asia el_Aviv", "Asia el_Aviv");
                                zones.put("Asia himbu", "Asia himbu");
                                zones.put("Asia himphu", "Asia himphu");
                                zones.put("Asia okyo", "Asia okyo");
                                zones.put("Asia/Ujung_Pandang", "Asia/Ujung_Pandang");
                                zones.put("Asia/Ulaanbaatar", "Asia/Ulaanbaatar");
                                zones.put("Asia/Ulan_Bator", "Asia/Ulan_Bator");
                                zones.put("Asia/Urumqi", "Asia/Urumqi");
                                zones.put("Asia/Vientiane", "Asia/Vientiane");
                                zones.put("Asia/Vladivostok", "Asia/Vladivostok");
                                zones.put("Asia/Yakutsk", "Asia/Yakutsk");
                                zones.put("Asia/Yekaterinburg", "Asia/Yekaterinburg");
                                zones.put("Asia/Yerevan", "Asia/Yerevan");
                                zones.put("Atlantic/Azores", "Atlantic/Azores");
                                zones.put("Atlantic/Bermuda", "Atlantic/Bermuda");
                                zones.put("Atlantic/Canary", "Atlantic/Canary");
                                zones.put("Atlantic/Cape_Verde", "Atlantic/Cape_Verde");
                                zones.put("Atlantic/Faeroe", "Atlantic/Faeroe");
                                zones.put("Atlantic/Faroe", "Atlantic/Faroe");
                                zones.put("Atlantic/Jan_Mayen", "Atlantic/Jan_Mayen");
                                zones.put("Atlantic/Madeira", "Atlantic/Madeira");
                                zones.put("Atlantic/Reykjavik", "Atlantic/Reykjavik");
                                zones.put("Atlantic/South_Georgia", "Atlantic/South_Georgia");
                                zones.put("Atlantic/St_Helena", "Atlantic/St_Helena");
                                zones.put("Atlantic/Stanley", "Atlantic/Stanley");
                                zones.put("Australia/ACT", "Australia/ACT");
                                zones.put("Australia/Adelaide", "Australia/Adelaide");
                                zones.put("Australia/Brisbane", "Australia/Brisbane");
                                zones.put("Australia/Broken_Hill", "Australia/Broken_Hill");
                                zones.put("Australia/Canberra", "Australia/Canberra");
                                zones.put("Australia/Currie", "Australia/Currie");
                                zones.put("Australia/Darwin", "Australia/Darwin");
                                zones.put("Australia/Eucla", "Australia/Eucla");
                                zones.put("Australia/Hobart", "Australia/Hobart");
                                zones.put("Australia/LHI", "Australia/LHI");
                                zones.put("Australia/Lindeman", "Australia/Lindeman");
                                zones.put("Australia/Lord_Howe", "Australia/Lord_Howe");
                                zones.put("Australia/Melbourne", "Australia/Melbourne");
                                zones.put("Australia/NSW", "Australia/NSW");
                                zones.put("Australia/North", "Australia/North");
                                zones.put("Australia/Perth", "Australia/Perth");
                                zones.put("Australia/Queensland", "Australia/Queensland");
                                zones.put("Australia/South", "Australia/South");
                                zones.put("Australia/Sydney", "Australia/Sydney");
                                zones.put("Australia asmania", "Australia asmania");
                                zones.put("Australia/Victoria", "Australia/Victoria");
                                zones.put("Australia/West", "Australia/West");
                                zones.put("Australia/Yancowinna", "Australia/Yancowinna");
                                zones.put("BET", "BET (Brazil Eastern Time)");
                                zones.put("BST", "BST (Bangladesh Standard Time)");
                                zones.put("Brazil/Acre", "Brazil/Acre");
                                zones.put("Brazil/DeNoronha", "Brazil/DeNoronha");
                                zones.put("Brazil/East", "Brazil/East");
                                zones.put("Brazil/West", "Brazil/West");
                                zones.put("CAT", "CAT (Central Africa Standard Time)");
                                zones.put("CET", "CET (Central European Summer Time)");
                                zones.put("CNT", "CNT (Canada Newfoundland Time)");
                                zones.put("CST", "CST (Central Daylight Time (US))");
                                zones.put("CST6CDT", "CST6CDT (Canada(Central)/USA(Central)/Mexico)");
                                zones.put("CTT", "CTT");
                                zones.put("Canada/Atlantic", "Canada/Atlantic");
                                zones.put("Canada/Central", "Canada/Central");
                                zones.put("Canada/East-Saskatchewan", "Canada/East-Saskatchewan");
                                zones.put("Canada/Eastern", "Canada/Eastern");
                                zones.put("Canada/Mountain", "Canada/Mountain");
                                zones.put("Canada/Newfoundland", "Canada/Newfoundland");
                                zones.put("Canada/Pacific", "Canada/Pacific");
                                zones.put("Canada/Saskatchewan", "Canada/Saskatchewan");
                                zones.put("Canada/Yukon", "Canada/Yukon");
                                zones.put("Chile/Continental", "Chile/Continental");
                                zones.put("Chile/EasterIsland", "Chile/EasterIsland");
                                zones.put("Cuba", "Cuba");
                                zones.put("EAT", "EAT (East Africa Time)");
                                zones.put("ECT", "ECT (Central European Summer Time)");
                                zones.put("EET", "EET (Eastern European Time)");
                                zones.put("EST", "EST (Eastern Standard Time)");
                                zones.put("EST5EDT", "EST5EDT (Canada (Eastern))");
                                zones.put("Egypt", "Egypt");
                                zones.put("Eire", "Eire");
                                zones.put("Etc/GMT", "Etc/GMT");
                                zones.put("Etc/GMT+0", "Etc/GMT+0");
                                zones.put("Etc/GMT+1", "Etc/GMT+1");
                                zones.put("Etc/GMT+10", "Etc/GMT+10");
                                zones.put("Etc/GMT+11", "Etc/GMT+11");
                                zones.put("Etc/GMT+12", "Etc/GMT+12");
                                zones.put("Etc/GMT+2", "Etc/GMT+2");
                                zones.put("Etc/GMT+3", "Etc/GMT+3");
                                zones.put("Etc/GMT+4", "Etc/GMT+4");
                                zones.put("Etc/GMT+5", "Etc/GMT+5");
                                zones.put("Etc/GMT+6", "Etc/GMT+6");
                                zones.put("Etc/GMT+7", "Etc/GMT+7");
                                zones.put("Etc/GMT+8", "Etc/GMT+8");
                                zones.put("Etc/GMT+9", "Etc/GMT+9");
                                zones.put("Etc/GMT-0", "Etc/GMT-0");
                                zones.put("Etc/GMT-1", "Etc/GMT-1");
                                zones.put("Etc/GMT-10", "Etc/GMT-10");
                                zones.put("Etc/GMT-11", "Etc/GMT-11");
                                zones.put("Etc/GMT-12", "Etc/GMT-12");
                                zones.put("Etc/GMT-13", "Etc/GMT-13");
                                zones.put("Etc/GMT-14", "Etc/GMT-14");
                                zones.put("Etc/GMT-2", "Etc/GMT-2");
                                zones.put("Etc/GMT-3", "Etc/GMT-3");
                                zones.put("Etc/GMT-4", "Etc/GMT-4");
                                zones.put("Etc/GMT-5", "Etc/GMT-5");
                                zones.put("Etc/GMT-6", "Etc/GMT-6");
                                zones.put("Etc/GMT-7", "Etc/GMT-7");
                                zones.put("Etc/GMT-8", "Etc/GMT-8");
                                zones.put("Etc/GMT-9", "Etc/GMT-9");
                                zones.put("Etc/GMT0", "Etc/GMT0");
                                zones.put("Etc/Greenwich", "Etc/Greenwich");
                                zones.put("Etc/UCT", "Etc/UCT");
                                zones.put("Etc/UTC", "Etc/UTC");
                                zones.put("Etc/Universal", "Etc/Universal");
                                zones.put("Etc/Zulu", "Etc/Zulu");
                                zones.put("Europe/Amsterdam", "Europe/Amsterdam");
                                zones.put("Europe/Andorra", "Europe/Andorra");
                                zones.put("Europe/Athens", "Europe/Athens");
                                zones.put("Europe/Belfast", "Europe/Belfast");
                                zones.put("Europe/Belgrade", "Europe/Belgrade");
                                zones.put("Europe/Berlin", "Europe/Berlin");
                                zones.put("Europe/Bratislava", "Europe/Bratislava");
                                zones.put("Europe/Brussels", "Europe/Brussels");
                                zones.put("Europe/Bucharest", "Europe/Bucharest");
                                zones.put("Europe/Budapest", "Europe/Budapest");
                                zones.put("Europe/Chisinau", "Europe/Chisinau");
                                zones.put("Europe/Copenhagen", "Europe/Copenhagen");
                                zones.put("Europe/Dublin", "Europe/Dublin");
                                zones.put("Europe/Gibraltar", "Europe/Gibraltar");
                                zones.put("Europe/Guernsey", "Europe/Guernsey");
                                zones.put("Europe/Helsinki", "Europe/Helsinki");
                                zones.put("Europe/Isle_of_Man", "Europe/Isle_of_Man");
                                zones.put("Europe/Istanbul", "Europe/Istanbul");
                                zones.put("Europe/Jersey", "Europe/Jersey");
                                zones.put("Europe/Kaliningrad", "Europe/Kaliningrad");
                                zones.put("Europe/Kiev", "Europe/Kiev");
                                zones.put("Europe/Lisbon", "Europe/Lisbon");
                                zones.put("Europe/Ljubljana", "Europe/Ljubljana");
                                zones.put("Europe/London", "Europe/London");
                                zones.put("Europe/Luxembourg", "Europe/Luxembourg");
                                zones.put("Europe/Madrid", "Europe/Madrid");
                                zones.put("Europe/Malta", "Europe/Malta");
                                zones.put("Europe/Mariehamn", "Europe/Mariehamn");
                                zones.put("Europe/Minsk", "Europe/Minsk");
                                zones.put("Europe/Monaco", "Europe/Monaco");
                                zones.put("Europe/Moscow", "Europe/Moscow");
                                zones.put("Europe/Nicosia", "Europe/Nicosia");
                                zones.put("Europe/Oslo", "Europe/Oslo");
                                zones.put("Europe/Paris", "Europe/Paris");
                                zones.put("Europe/Podgorica", "Europe/Podgorica");
                                zones.put("Europe/Prague", "Europe/Prague");
                                zones.put("Europe/Riga", "Europe/Riga");
                                zones.put("Europe/Rome", "Europe/Rome");
                                zones.put("Europe/Samara", "Europe/Samara");
                                zones.put("Europe/San_Marino", "Europe/San_Marino");
                                zones.put("Europe/Sarajevo", "Europe/Sarajevo");
                                zones.put("Europe/Simferopol", "Europe/Simferopol");
                                zones.put("Europe/Skopje", "Europe/Skopje");
                                zones.put("Europe/Sofia", "Europe/Sofia");
                                zones.put("Europe/Stockholm", "Europe/Stockholm");
                                zones.put("Europe allinn", "Europe allinn");
                                zones.put("Europe irane", "Europe irane");
                                zones.put("Europe iraspol", "Europe iraspol");
                                zones.put("Europe/Uzhgorod", "Europe/Uzhgorod");
                                zones.put("Europe/Vaduz", "Europe/Vaduz");
                                zones.put("Europe/Vatican", "Europe/Vatican");
                                zones.put("Europe/Vienna", "Europe/Vienna");
                                zones.put("Europe/Vilnius", "Europe/Vilnius");
                                zones.put("Europe/Volgograd", "Europe/Volgograd");
                                zones.put("Europe/Warsaw", "Europe/Warsaw");
                                zones.put("Europe/Zagreb", "Europe/Zagreb");
                                zones.put("Europe/Zaporozhye", "Europe/Zaporozhye");
                                zones.put("Europe/Zurich", "Europe/Zurich");
                                zones.put("GB", "GB");
                                zones.put("GB-Eire", "GB-Eire");
                                zones.put("GMT", "GMT (Greenwich Mean Time)");
                                zones.put("GMT0", "GMT0");
                                zones.put("Greenwich", "Greenwich");
                                zones.put("HST", "HST (Hawaii Standard Time)");
                                zones.put("Hongkong", "Hongkong");
                                zones.put("IET", "IET (Indiana Eastern Standard Time)");
                                zones.put("IST", "IST (India Standard Time)");
                                zones.put("Iceland", "Iceland");
                                zones.put("Indian/Antananarivo", "Indian/Antananarivo");
                                zones.put("Indian/Chagos", "Indian/Chagos");
                                zones.put("Indian/Christmas", "Indian/Christmas");
                                zones.put("Indian/Cocos", "Indian/Cocos");
                                zones.put("Indian/Comoro", "Indian/Comoro");
                                zones.put("Indian/Kerguelen", "Indian/Kerguelen");
                                zones.put("Indian/Mahe", "Indian/Mahe");
                                zones.put("Indian/Maldives", "Indian/Maldives");
                                zones.put("Indian/Mauritius", "Indian/Mauritius");
                                zones.put("Indian/Mayotte", "Indian/Mayotte");
                                zones.put("Indian/Reunion", "Indian/Reunion");
                                zones.put("Iran", "Iran");
                                zones.put("Israel", "Israel");
                                zones.put("JST", "JST");
                                zones.put("Jamaica", "Jamaica");
                                zones.put("Japan", "Japan");
                                zones.put("Kwajalein", "Kwajalein");
                                zones.put("Libya", "Libya");
                                zones.put("MET", "MET");
                                zones.put("MIT", "MIT");
                                zones.put("MST", "MST");
                                zones.put("MST7MDT", "MST7MDT (Canada(Mountain)/USA(Mountain)/Mexico(Baja S.))");
                                zones.put("Mexico/BajaNorte", "Mexico/BajaNorte");
                                zones.put("Mexico/BajaSur", "Mexico/BajaSur");
                                zones.put("Mexico/General", "Mexico/General");
                                zones.put("Mideast/Riyadh87", "Mideast/Riyadh87");
                                zones.put("Mideast/Riyadh88", "Mideast/Riyadh88");
                                zones.put("Mideast/Riyadh89", "Mideast/Riyadh89");
                                zones.put("NET", "NET");
                                zones.put("NST", "NST (Canada (Newfoundland Standard Time))");
                                zones.put("NZ", "NZ");
                                zones.put("NZ-CHAT", "NZ-CHAT");
                                zones.put("Navajo", "Navajo");
                                zones.put("PLT", "PLT");
                                zones.put("PNT", "PNT");
                                zones.put("PRC", "PRC");
                                zones.put("PRT", "PRT");
                                zones.put("PST", "PST");
                                zones.put("PST8PDT", "PST8PDT (USA(Pacific)/Canada(Pacific and Yukon))");
                                zones.put("Pacific/Apia", "Pacific/Apia");
                                zones.put("Pacific/Auckland", "Pacific/Auckland");
                                zones.put("Pacific/Chatham", "Pacific/Chatham");
                                zones.put("Pacific/Easter", "Pacific/Easter");
                                zones.put("Pacific/Efate", "Pacific/Efate");
                                zones.put("Pacific/Enderbury", "Pacific/Enderbury");
                                zones.put("Pacific/Fakaofo", "Pacific/Fakaofo");
                                zones.put("Pacific/Fiji", "Pacific/Fiji");
                                zones.put("Pacific/Funafuti", "Pacific/Funafuti");
                                zones.put("Pacific/Galapagos", "Pacific/Galapagos");
                                zones.put("Pacific/Gambier", "Pacific/Gambier");
                                zones.put("Pacific/Guadalcanal", "Pacific/Guadalcanal");
                                zones.put("Pacific/Guam", "Pacific/Guam");
                                zones.put("Pacific/Honolulu", "Pacific/Honolulu");
                                zones.put("Pacific/Johnston", "Pacific/Johnston");
                                zones.put("Pacific/Kiritimati", "Pacific/Kiritimati");
                                zones.put("Pacific/Kosrae", "Pacific/Kosrae");
                                zones.put("Pacific/Kwajalein", "Pacific/Kwajalein");
                                zones.put("Pacific/Majuro", "Pacific/Majuro");
                                zones.put("Pacific/Marquesas", "Pacific/Marquesas");
                                zones.put("Pacific/Midway", "Pacific/Midway");
                                zones.put("Pacific/Nauru", "Pacific/Nauru");
                                zones.put("Pacific/Niue", "Pacific/Niue");
                                zones.put("Pacific/Norfolk", "Pacific/Norfolk");
                                zones.put("Pacific/Noumea", "Pacific/Noumea");
                                zones.put("Pacific/Pago_Pago", "Pacific/Pago_Pago");
                                zones.put("Pacific/Palau", "Pacific/Palau");
                                zones.put("Pacific/Pitcairn", "Pacific/Pitcairn");
                                zones.put("Pacific/Ponape", "Pacific/Ponape");
                                zones.put("Pacific/Port_Moresby", "Pacific/Port_Moresby");
                                zones.put("Pacific/Rarotonga", "Pacific/Rarotonga");
                                zones.put("Pacific/Saipan", "Pacific/Saipan");
                                zones.put("Pacific/Samoa", "Pacific/Samoa");
                                zones.put("Pacific ahiti", "Pacific ahiti");
                                zones.put("Pacific arawa", "Pacific arawa");
                                zones.put("Pacific ongatapu", "Pacific ongatapu");
                                zones.put("Pacific ruk", "Pacific ruk");
                                zones.put("Pacific/Wake", "Pacific/Wake");
                                zones.put("Pacific/Wallis", "Pacific/Wallis");
                                zones.put("Pacific/Yap", "Pacific/Yap");
                                zones.put("Poland", "Poland");
                                zones.put("Portugal", "Portugal");
                                zones.put("ROK", "ROK");
                                zones.put("SST", "SST");
                                zones.put("Singapore", "Singapore");
                                zones.put("SystemV/AST4", "SystemV/AST4");
                                zones.put("SystemV/AST4ADT", "SystemV/AST4ADT (Canada (Atlantic))");
                                zones.put("SystemV/CST6", "SystemV/CST6");
                                zones.put("SystemV/CST6CDT", "SystemV/CST6CDT (Canada(Central)/USA(Central)/Mexico)");
                                zones.put("SystemV/EST5", "SystemV/EST5");
                                zones.put("SystemV/EST5EDT", "SystemV/EST5EDT (Canada (Eastern))");
                                zones.put("SystemV/HST10", "SystemV/HST10");
                                zones.put("SystemV/MST7", "SystemV/MST7");
                                zones.put("SystemV/MST7MDT", "SystemV/MST7MDT (Canada(Mountain)/USA(Mountain)/Mexico(Baja S.))");
                                zones.put("SystemV/PST8", "SystemV/PST8");
                                zones.put("SystemV/PST8PDT", "SystemV/PST8PDT (USA(Pacific)/Canada(Pacific and Yukon))");
                                zones.put("SystemV/YST9", "SystemV/YST9");
                                zones.put("SystemV/YST9YDT", "SystemV/YST9YDT");
                                zones.put("Turkey", "Turkey");
                                zones.put("UCT", "UCT (Universal Coordinated Time)");
                                zones.put("US/Alaska", "US/Alaska");
                                zones.put("US/Aleutian", "US/Aleutian");
                                zones.put("US/Arizona", "US/Arizona");
                                zones.put("US/Central", "US/Central");
                                zones.put("US/East-Indiana", "US/East-Indiana");
                                zones.put("US/Eastern", "US/Eastern");
                                zones.put("US/Hawaii", "US/Hawaii");
                                zones.put("US/Indiana-Starke", "US/Indiana-Starke");
                                zones.put("US/Michigan", "US/Michigan");
                                zones.put("US/Mountain", "US/Mountain");
                                zones.put("US/Pacific", "US/Pacific");
                                zones.put("US/Pacific-New", "US/Pacific-New");
                                zones.put("US/Samoa", "US/Samoa");
                                zones.put("UTC", "UTC (Universal Coordinated Time)");
                                zones.put("Universal", "Universal");
                                zones.put("VST", "VST (Vietnam Standard Time)");
                                zones.put("W-SU", "W-SU (Moscow Standard Time)");
                                zones.put("WET", "WET (Western European Time)");
                                zones.put("Zulu", "Zulu");
                                
                                for(int i = 0; i < allTimeZones.length; i++)
                                {  
                                    String option = allTimeZones[i];
                                
                                    if(i == allTimeZones.length -1 )
                                        out.println("\"" + zones.get(option) +  "\":\"" + option + "\"");
                                    else
                                        out.println("\"" + zones.get(option) +  "\":\"" + option + "\",");
                                } 
                            %>
                        },
                        "fieldType": "select",
                        "type": "select"
                    },
                    {
                        "label": "On",
                        "required": "required",
                        "name": "on",
                        "id": "on",
                        "multiple": "multiple",
                        "ismultiple": "true",
                        "title": "Select the weekday for your email delivery.",
                        "options": {
                            "Any Day": "any_day",
                            "Mon-Fri": "Mon-Fri",
                            "Mon-Sat": "Mon-Sat",
                            "Sat-Sun": "Sat-Sun",
                            "Mon": "Mon",
                            "Tue": "Tue",
                            "Wed": "Wed",
                            "Thu": "Thu",
                            "Fri": "Fri",
                            "Sat": "Sat",
                            "Sun": "Sun"
                        },
                        "fieldType": "select",
                        "type": "select"
                    },
                    {
                        "label": "At",
                        "required": "required",
                        "name": "at",
                        "id": "at",
                        "multiple": "multiple",
                        "ismultiple": "true",
                        "title": "Select the time for your email delivery.",
                        "options": {
                            "Any Time": "any_time",
                            "9:00 AM": "09:00",
                            "9:30 AM": "09:30",
                            "10:00 AM": "10:00",
                            "10:30 AM": "10:30",
                            "11:00 AM": "11:00",
                            "11:30 AM": "11:30",
                            "12:00 PM": "12:00",
                            "12:30 PM": "12:30",
                            "1:00 PM": "13:00",
                            "1:30 PM": "13:30",
                            "2:00 PM": "14:00",
                            "2:30 PM": "14:30",
                            "3:00 PM": "15:00",
                            "3:30 PM": "15:30",
                            "4:00 PM": "16:00",
                            "4:30 PM": "16:30",
                            "5:00 PM": "17:00",
                            "5:30 PM": "17:30",
                            "6:00 PM": "18:00",
                            "6:30 PM": "18:30",
                            "7:00 PM": "19:00",
                            "7:30 PM": "19:30",
                            "8:00 PM": "20:00",
                            "8:30 PM": "20:30",
                            "9:00 PM": "21:00",
                            "9:30 PM": "21:30",
                            "10:00 PM": "22:00",
                            "10:30 PM": "22:30",
                            "11:00 PM": "23:00",
                            "11:30 PM": "23:30",
                            "12:00 AM": "00:01",
                            "12:30 AM": "00:30",
                            "1:00 AM": "01:00",
                            "1:30 AM": "01:30",
                            "2:00 AM": "02:00",
                            "2:30 AM": "02:30",
                            "3:00 AM": "03:00",
                            "3:30 AM": "03:30",
                            "4:00 AM": "04:00",
                            "4:30 AM": "04:30",
                            "5:00 AM": "05:00",
                            "5:30 AM": "05:30",
                            "6:00 AM": "06:00",
                            "6:30 AM": "06:30",
                            "7:00 AM": "07:00",
                            "7:30 AM": "07:30",
                            "8:00 AM": "08:00",
                            "8:30 AM": "08:30"
                        },
                        "fieldType": "select",
                        "type": "select"
                    },
                    {
                        "label": "Send email in TEXT or HTML format. You can choose from email-id and name, and optionally specify a different email-id the replies should go to.<br/><br/>You can track if the links in your email are clicked by the recepient. You can set a time when the email should be delivered to the recepient.",
                        "category": "Help",
                        "fieldType": "label",
                        "type": "label"
                    }
                ],
                "icon": "json/nodes/icons/email/sendemail.png",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.SendEmail",
                "url": "json/nodes/email/send_email.jsp",
                "info": "Send email in text or HTML format. You can choose your delivery day and time.",
                "author": "John",
                "help": "Send email in text or HTML format. You can choose your delivery day and time.",
                "category": "Email",
                "thumbnail": "json/nodes/images/email/sendemail.png",
                "name": "Send Email",
                "company": "mantra",
                "language": "en",
                "branches": "yes"
            },
            "id": "PBXHWo1PHDnoJ",
            "xPosition": 460,
            "yPosition": 144,
            "displayname": "Send Newsletter ",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Send Newsletter "
                },
                {
                    "name": "from_name",
                    "value": "Updates"
                },
                {
                    "name": "from_email",
                    "value": "{{owner.email}}"
                },
                {
                    "name": "to_email",
                    "value": "{{email}}"
                },
                {
                    "name": "cc_email",
                    "value": ""
                },
                {
                    "name": "subject",
                    "value": "Here what's happening from our end"
                },
                {
                    "name": "replyto_email",
                    "value": ""
                },
                {
                    "name": "merge_fields",
                    "value": ""
                },
                {
                    "name": "text_email",
                    "value": "\r\nText version of newsletter here."
                },
                {
                    "name": "merge_fields",
                    "value": ""
                },
                {
                    "name": "html_email",
                    "value": "<div style=\"background-color: #f2f2f2; margin: 0; padding: 0; min-height: 100%!important; width: 100%!important;\"><center>\r\n<table style=\"background-color: #f2f2f2; margin: 0px; padding: 0px; border-collapse: collapse !important; min-height: 100% !important; width: 100% !important;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td style=\"padding: 40px 20px; margin: 0; min-height: 100%!important; width: 100%!important;\" align=\"center\" valign=\"top\">\r\n<table style=\"width: 600px; border-collapse: collapse!important;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td align=\"center\" valign=\"top\"><a style=\"text-decoration: none;\" title=\"Your Logo here\" href=\"https://www.yoursite.com\" target=\"_blank\"> <img style=\"border: 0; color: #6dc6dd!important; font-family: Helvetica,Arial,sans-serif; font-size: 60px; font-weight: bold; min-height: auto!important; letter-spacing: -4px; line-height: 100%; outline: none; text-align: center; text-decoration: none;\" src=\"https://www.MYSITE.com/img/logo.png\" alt=\"Your Logo here\" /> </a></td>\r\n</tr>\r\n<tr>\r\n<td style=\"padding-top: 30px; padding-bottom: 30px;\" align=\"center\" valign=\"top\">\r\n<table style=\"background-color: #ffffff; border-collapse: separate !important; border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td style=\"padding-right: 40px; padding-left: 40px;\" align=\"center\" valign=\"top\">\r\n<table style=\"border-collapse: collapse !important; width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td align=\"center\" valign=\"top\" width=\"\">\r\n<table style=\"border-collapse: collapse !important; width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td align=\"left\" valign=\"top\" width=\"75px\">\r\n<table style=\"border-collapse: collapse !important; background-color: #6dc6dd; width: 75px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td style=\"padding: 40px 15px 5px; text-align: center; color: #ffffff; line-height: 100%; font-family: Helvetica,Arial,sans-serif; font-size: 14px; font-weight: bold;\" align=\"center\" valign=\"bottom\">Digest</td>\r\n</tr>\r\n<tr>\r\n<td style=\"padding: 5px 15px 20px; text-align: center; color: #ffffff; line-height: 100%; font-family: Helvetica,Arial,sans-serif; font-size: 40px; font-weight: bold;\" align=\"center\" valign=\"top\">1</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n<td style=\"padding-top: 40px; padding-left: 40px; color: #606060; font-family: Helvetica,Arial,sans-serif; font-size: 15px; line-height: 150%; text-align: left;\" align=\"left\" valign=\"top\">\r\n<h1 style=\"font-family: Helvetica,Arial,sans-serif; font-size: 40px; font-weight: bold; letter-spacing: -1px; line-height: 115%; margin: 0; padding: 0; text-align: left; color: #606060!important; text-decoration: none!important;\">Title</h1>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style=\"color: #606060; font-family: Helvetica,Arial,sans-serif; font-size: 15px; line-height: 150%; text-align: left; padding: 40px;\" align=\"center\" valign=\"top\">\r\n<p>Hello&nbsp;{{first_name}},</p>\r\n<p>Some introductory text</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style=\"padding-bottom: 30px;\" align=\"center\" valign=\"top\">\r\n<table style=\"border-collapse: collapse !important; width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td style=\"border-top: 2px solid #f2f2f2; padding-top: 40px; padding-right: 40px; padding-bottom: 30px; padding-left: 40px; color: #606060; font-family: Helvetica,Arial,sans-serif; font-size: 15px; line-height: 150%; text-align: left;\" align=\"center\" valign=\"top\">\r\n<h3 style=\"font-family: Helvetica,Arial,sans-serif; font-size: 18px; font-weight: bold; letter-spacing: -.5px; line-height: 115%; margin: 0; padding: 0; text-align: center; color: #606060!important; text-decoration: none!important;\">News Item 1</h3>\r\n<p>Text here.</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style=\"padding-right: 40px; padding-left: 40px;\" align=\"center\" valign=\"top\"><img style=\"border: 1px solid #c8c8c8; border-radius: 5px;\" src=\"https://www.yoursite.com/image1.png\" alt=\"insert image 1\" /></td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style=\"padding-bottom: 30px;\" align=\"center\" valign=\"top\">\r\n<table style=\"border-collapse: collapse !important; width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td style=\"border-top: 2px solid #f2f2f2; padding-top: 40px; padding-right: 40px; padding-bottom: 30px; padding-left: 40px; color: #606060; font-family: Helvetica,Arial,sans-serif; font-size: 15px; line-height: 150%; text-align: left;\" align=\"center\" valign=\"top\">\r\n<h3 style=\"font-family: Helvetica,Arial,sans-serif; font-size: 18px; font-weight: bold; letter-spacing: -.5px; line-height: 115%; margin: 0; padding: 0; text-align: center; color: #606060!important; text-decoration: none!important;\">News Item 2</h3>\r\n<p>Text here.</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style=\"padding-right: 40px; padding-left: 40px;\" align=\"center\" valign=\"top\"><img style=\"border: 1px solid #c8c8c8; border-radius: 5px;\" src=\"https://www.agilecrm.com/img/email-images/ScreenShot2013-09-02at20334PM.png\" alt=\"Triggers\" /></td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style=\"padding-bottom: 30px;\" align=\"center\" valign=\"top\">\r\n<table style=\"border-collapse: collapse !important; width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td style=\"border-top: 2px solid #f2f2f2; padding-top: 40px; padding-right: 40px; padding-bottom: 30px; padding-left: 40px; color: #606060; font-family: Helvetica,Arial,sans-serif; font-size: 15px; line-height: 150%; text-align: left;\" align=\"center\" valign=\"top\">\r\n<h3 style=\"font-family: Helvetica,Arial,sans-serif; font-size: 18px; font-weight: bold; letter-spacing: -.5px; line-height: 115%; margin: 0; padding: 0; text-align: center; color: #606060!important; text-decoration: none!important;\">News Item 3</h3>\r\n<p>Text here.</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style=\"padding-right: 40px; padding-left: 40px;\" align=\"center\" valign=\"top\"><img style=\"border: 1px solid #c8c8c8; border-radius: 5px;\" src=\"https://www.agilecrm.com/img/email-images/users.png\" alt=\"Campaign Authentication\" /></td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style=\"padding-right: 40px; padding-bottom: 40px; padding-left: 40px;\" align=\"center\" valign=\"middle\">\r\n<table style=\"background-color: #6dc6dd; border-collapse: separate!important; border-radius: 3px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td style=\"color: #ffffff; font-family: Helvetica,Arial,sans-serif; font-size: 15px; font-weight: bold; line-height: 100%; padding-top: 18px; padding-right: 15px; padding-bottom: 15px; padding-left: 15px;\" align=\"center\" valign=\"middle\"><a style=\"color: #ffffff; text-decoration: none;\" href=\"https://www.MYSITE.com/newsletter\" target=\"_blank\">C</a>all To Action</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td align=\"center\" valign=\"top\">\r\n<table style=\"border-collapse: collapse !important; width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td style=\"color: #606060; font-family: Helvetica,Arial,sans-serif; font-size: 13px; line-height: 125%;\" align=\"center\" valign=\"top\">\r\n<p style=\"margin: -5px;\"><img style=\"vertical-align: middle;\" src=\"https://www.MYSITE.com/logo.png\" alt=\"\" /> Your Caption</p>\r\n<p style=\"margin: 10px;\"><a style=\"padding: 6px; color: black; border: none;\" href=\"https://twitter.com/agile_crm\" target=\"_blank\"><img style=\"border: none;\" src=\"https://www.agilecrm.com/img/twitter-icon.png\" alt=\"twitter\" /></a> <a style=\"padding: 6px; border: none;\" href=\"https://www.facebook.com/CRM.Agile\" target=\"_blank\"><img style=\"border: none;\" src=\"https://www.agilecrm.com/img/facebook-icon.png\" alt=\"fb\" /></a> <a style=\"padding: 6px; border: none;\" href=\"https://plus.google.com/109484059291748745615/posts\" target=\"_blank\"><img style=\"border: none;\" src=\"https://www.agilecrm.com/img/googleplus-icon.png\" alt=\"gplus\" /></a></p>\r\n<p><a href=\"https://www.agilecrm.com\" target=\"_blank\">www.mysite.com</a></p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td align=\"center\" valign=\"top\">&nbsp;</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</center></div>"
                },
                {
                    "name": "track_clicks",
                    "value": "yes"
                },
                {
                    "name": "time_zone",
                    "value": "ACT"
                },
                {
                    "name": "on",
                    "value": "any_day"
                },
                {
                    "name": "at",
                    "value": "any_time"
                }
            ],
            "States": [
                {
                    "yes": "hangup"
                }
            ]
        }
    ]
}
