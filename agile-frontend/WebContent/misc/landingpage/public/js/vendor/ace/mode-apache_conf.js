ace.define("ace/mode/apache_conf_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,n){"use strict";var r=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,s=function(){this.$rules={start:[{token:["punctuation.definition.comment.apacheconf","comment.line.hash.ini","comment.line.hash.ini"],regex:"^((?:\\s)*)(#)(.*$)"},{token:["punctuation.definition.tag.apacheconf","entity.tag.apacheconf","text","string.value.apacheconf","punctuation.definition.tag.apacheconf"],regex:"(<)(Proxy|ProxyMatch|IfVersion|Directory|DirectoryMatch|Files|FilesMatch|IfDefine|IfModule|Limit|LimitExcept|Location|LocationMatch|VirtualHost)(?:(\\s)(.+?))?(>)"},{token:["punctuation.definition.tag.apacheconf","entity.tag.apacheconf","punctuation.definition.tag.apacheconf"],regex:"(</)(Proxy|ProxyMatch|IfVersion|Directory|DirectoryMatch|Files|FilesMatch|IfDefine|IfModule|Limit|LimitExcept|Location|LocationMatch|VirtualHost)(>)"},{token:["keyword.alias.apacheconf","text","string.regexp.apacheconf","text","string.replacement.apacheconf","text"],regex:"(Rewrite(?:Rule|Cond))(\\s+)(.+?)(\\s+)(.+?)($|\\s)"},{token:["keyword.alias.apacheconf","text","entity.status.apacheconf","text","string.regexp.apacheconf","text","string.path.apacheconf","text"],regex:"(RedirectMatch)(?:(\\s+)(\\d\\d\\d|permanent|temp|seeother|gone))?(\\s+)(.+?)(\\s+)(?:(.+?)($|\\s))?"},{token:["keyword.alias.apacheconf","text","entity.status.apacheconf","text","string.path.apacheconf","text","string.path.apacheconf","text"],regex:"(Redirect)(?:(\\s+)(\\d\\d\\d|permanent|temp|seeother|gone))?(\\s+)(.+?)(\\s+)(?:(.+?)($|\\s))?"},{token:["keyword.alias.apacheconf","text","string.regexp.apacheconf","text","string.path.apacheconf","text"],regex:"(ScriptAliasMatch|AliasMatch)(\\s+)(.+?)(\\s+)(?:(.+?)(\\s))?"},{token:["keyword.alias.apacheconf","text","string.path.apacheconf","text","string.path.apacheconf","text"],regex:"(RedirectPermanent|RedirectTemp|ScriptAlias|Alias)(\\s+)(.+?)(\\s+)(?:(.+?)($|\\s))?"},{token:"keyword.core.apacheconf",regex:"\\b(?:AcceptPathInfo|AccessFileName|AddDefaultCharset|AddOutputFilterByType|AllowEncodedSlashes|AllowOverride|AuthName|AuthType|CGIMapExtension|ContentDigest|DefaultType|DocumentRoot|EnableMMAP|EnableSendfile|ErrorDocument|ErrorLog|FileETag|ForceType|HostnameLookups|IdentityCheck|Include|KeepAlive|KeepAliveTimeout|LimitInternalRecursion|LimitRequestBody|LimitRequestFields|LimitRequestFieldSize|LimitRequestLine|LimitXMLRequestBody|LogLevel|MaxKeepAliveRequests|NameVirtualHost|Options|Require|RLimitCPU|RLimitMEM|RLimitNPROC|Satisfy|ScriptInterpreterSource|ServerAdmin|ServerAlias|ServerName|ServerPath|ServerRoot|ServerSignature|ServerTokens|SetHandler|SetInputFilter|SetOutputFilter|TimeOut|TraceEnable|UseCanonicalName)\\b"},{token:"keyword.mpm.apacheconf",regex:"\\b(?:AcceptMutex|AssignUserID|BS2000Account|ChildPerUserID|CoreDumpDirectory|EnableExceptionHook|Group|Listen|ListenBacklog|LockFile|MaxClients|MaxMemFree|MaxRequestsPerChild|MaxRequestsPerThread|MaxSpareServers|MaxSpareThreads|MaxThreads|MaxThreadsPerChild|MinSpareServers|MinSpareThreads|NumServers|PidFile|ReceiveBufferSize|ScoreBoardFile|SendBufferSize|ServerLimit|StartServers|StartThreads|ThreadLimit|ThreadsPerChild|ThreadStackSize|User|Win32DisableAcceptEx)\\b"},{token:"keyword.access.apacheconf",regex:"\\b(?:Allow|Deny|Order)\\b"},{token:"keyword.actions.apacheconf",regex:"\\b(?:Action|Script)\\b"},{token:"keyword.alias.apacheconf",regex:"\\b(?:Alias|AliasMatch|Redirect|RedirectMatch|RedirectPermanent|RedirectTemp|ScriptAlias|ScriptAliasMatch)\\b"},{token:"keyword.auth.apacheconf",regex:"\\b(?:AuthAuthoritative|AuthGroupFile|AuthUserFile)\\b"},{token:"keyword.auth_anon.apacheconf",regex:"\\b(?:Anonymous|Anonymous_Authoritative|Anonymous_LogEmail|Anonymous_MustGiveEmail|Anonymous_NoUserID|Anonymous_VerifyEmail)\\b"},{token:"keyword.auth_dbm.apacheconf",regex:"\\b(?:AuthDBMAuthoritative|AuthDBMGroupFile|AuthDBMType|AuthDBMUserFile)\\b"},{token:"keyword.auth_digest.apacheconf",regex:"\\b(?:AuthDigestAlgorithm|AuthDigestDomain|AuthDigestFile|AuthDigestGroupFile|AuthDigestNcCheck|AuthDigestNonceFormat|AuthDigestNonceLifetime|AuthDigestQop|AuthDigestShmemSize)\\b"},{token:"keyword.auth_ldap.apacheconf",regex:"\\b(?:AuthLDAPAuthoritative|AuthLDAPBindDN|AuthLDAPBindPassword|AuthLDAPCharsetConfig|AuthLDAPCompareDNOnServer|AuthLDAPDereferenceAliases|AuthLDAPEnabled|AuthLDAPFrontPageHack|AuthLDAPGroupAttribute|AuthLDAPGroupAttributeIsDN|AuthLDAPRemoteUserIsDN|AuthLDAPUrl)\\b"},{token:"keyword.autoindex.apacheconf",regex:"\\b(?:AddAlt|AddAltByEncoding|AddAltByType|AddDescription|AddIcon|AddIconByEncoding|AddIconByType|DefaultIcon|HeaderName|IndexIgnore|IndexOptions|IndexOrderDefault|ReadmeName)\\b"},{token:"keyword.cache.apacheconf",regex:"\\b(?:CacheDefaultExpire|CacheDisable|CacheEnable|CacheForceCompletion|CacheIgnoreCacheControl|CacheIgnoreHeaders|CacheIgnoreNoLastMod|CacheLastModifiedFactor|CacheMaxExpire)\\b"},{token:"keyword.cern_meta.apacheconf",regex:"\\b(?:MetaDir|MetaFiles|MetaSuffix)\\b"},{token:"keyword.cgi.apacheconf",regex:"\\b(?:ScriptLog|ScriptLogBuffer|ScriptLogLength)\\b"},{token:"keyword.cgid.apacheconf",regex:"\\b(?:ScriptLog|ScriptLogBuffer|ScriptLogLength|ScriptSock)\\b"},{token:"keyword.charset_lite.apacheconf",regex:"\\b(?:CharsetDefault|CharsetOptions|CharsetSourceEnc)\\b"},{token:"keyword.dav.apacheconf",regex:"\\b(?:Dav|DavDepthInfinity|DavMinTimeout|DavLockDB)\\b"},{token:"keyword.deflate.apacheconf",regex:"\\b(?:DeflateBufferSize|DeflateCompressionLevel|DeflateFilterNote|DeflateMemLevel|DeflateWindowSize)\\b"},{token:"keyword.dir.apacheconf",regex:"\\b(?:DirectoryIndex|DirectorySlash)\\b"},{token:"keyword.disk_cache.apacheconf",regex:"\\b(?:CacheDirLength|CacheDirLevels|CacheExpiryCheck|CacheGcClean|CacheGcDaily|CacheGcInterval|CacheGcMemUsage|CacheGcUnused|CacheMaxFileSize|CacheMinFileSize|CacheRoot|CacheSize|CacheTimeMargin)\\b"},{token:"keyword.dumpio.apacheconf",regex:"\\b(?:DumpIOInput|DumpIOOutput)\\b"},{token:"keyword.env.apacheconf",regex:"\\b(?:PassEnv|SetEnv|UnsetEnv)\\b"},{token:"keyword.expires.apacheconf",regex:"\\b(?:ExpiresActive|ExpiresByType|ExpiresDefault)\\b"},{token:"keyword.ext_filter.apacheconf",regex:"\\b(?:ExtFilterDefine|ExtFilterOptions)\\b"},{token:"keyword.file_cache.apacheconf",regex:"\\b(?:CacheFile|MMapFile)\\b"},{token:"keyword.headers.apacheconf",regex:"\\b(?:Header|RequestHeader)\\b"},{token:"keyword.imap.apacheconf",regex:"\\b(?:ImapBase|ImapDefault|ImapMenu)\\b"},{token:"keyword.include.apacheconf",regex:"\\b(?:SSIEndTag|SSIErrorMsg|SSIStartTag|SSITimeFormat|SSIUndefinedEcho|XBitHack)\\b"},{token:"keyword.isapi.apacheconf",regex:"\\b(?:ISAPIAppendLogToErrors|ISAPIAppendLogToQuery|ISAPICacheFile|ISAPIFakeAsync|ISAPILogNotSupported|ISAPIReadAheadBuffer)\\b"},{token:"keyword.ldap.apacheconf",regex:"\\b(?:LDAPCacheEntries|LDAPCacheTTL|LDAPConnectionTimeout|LDAPOpCacheEntries|LDAPOpCacheTTL|LDAPSharedCacheFile|LDAPSharedCacheSize|LDAPTrustedCA|LDAPTrustedCAType)\\b"},{token:"keyword.log.apacheconf",regex:"\\b(?:BufferedLogs|CookieLog|CustomLog|LogFormat|TransferLog|ForensicLog)\\b"},{token:"keyword.mem_cache.apacheconf",regex:"\\b(?:MCacheMaxObjectCount|MCacheMaxObjectSize|MCacheMaxStreamingBuffer|MCacheMinObjectSize|MCacheRemovalAlgorithm|MCacheSize)\\b"},{token:"keyword.mime.apacheconf",regex:"\\b(?:AddCharset|AddEncoding|AddHandler|AddInputFilter|AddLanguage|AddOutputFilter|AddType|DefaultLanguage|ModMimeUsePathInfo|MultiviewsMatch|RemoveCharset|RemoveEncoding|RemoveHandler|RemoveInputFilter|RemoveLanguage|RemoveOutputFilter|RemoveType|TypesConfig)\\b"},{token:"keyword.misc.apacheconf",regex:"\\b(?:ProtocolEcho|Example|AddModuleInfo|MimeMagicFile|CheckSpelling|ExtendedStatus|SuexecUserGroup|UserDir)\\b"},{token:"keyword.negotiation.apacheconf",regex:"\\b(?:CacheNegotiatedDocs|ForceLanguagePriority|LanguagePriority)\\b"},{token:"keyword.nw_ssl.apacheconf",regex:"\\b(?:NWSSLTrustedCerts|NWSSLUpgradeable|SecureListen)\\b"},{token:"keyword.proxy.apacheconf",regex:"\\b(?:AllowCONNECT|NoProxy|ProxyBadHeader|ProxyBlock|ProxyDomain|ProxyErrorOverride|ProxyFtpDirCharset|ProxyIOBufferSize|ProxyMaxForwards|ProxyPass|ProxyPassReverse|ProxyPreserveHost|ProxyReceiveBufferSize|ProxyRemote|ProxyRemoteMatch|ProxyRequests|ProxyTimeout|ProxyVia)\\b"},{token:"keyword.rewrite.apacheconf",regex:"\\b(?:RewriteBase|RewriteCond|RewriteEngine|RewriteLock|RewriteLog|RewriteLogLevel|RewriteMap|RewriteOptions|RewriteRule)\\b"},{token:"keyword.setenvif.apacheconf",regex:"\\b(?:BrowserMatch|BrowserMatchNoCase|SetEnvIf|SetEnvIfNoCase)\\b"},{token:"keyword.so.apacheconf",regex:"\\b(?:LoadFile|LoadModule)\\b"},{token:"keyword.ssl.apacheconf",regex:"\\b(?:SSLCACertificateFile|SSLCACertificatePath|SSLCARevocationFile|SSLCARevocationPath|SSLCertificateChainFile|SSLCertificateFile|SSLCertificateKeyFile|SSLCipherSuite|SSLEngine|SSLMutex|SSLOptions|SSLPassPhraseDialog|SSLProtocol|SSLProxyCACertificateFile|SSLProxyCACertificatePath|SSLProxyCARevocationFile|SSLProxyCARevocationPath|SSLProxyCipherSuite|SSLProxyEngine|SSLProxyMachineCertificateFile|SSLProxyMachineCertificatePath|SSLProxyProtocol|SSLProxyVerify|SSLProxyVerifyDepth|SSLRandomSeed|SSLRequire|SSLRequireSSL|SSLSessionCache|SSLSessionCacheTimeout|SSLUserName|SSLVerifyClient|SSLVerifyDepth)\\b"},{token:"keyword.usertrack.apacheconf",regex:"\\b(?:CookieDomain|CookieExpires|CookieName|CookieStyle|CookieTracking)\\b"},{token:"keyword.vhost_alias.apacheconf",regex:"\\b(?:VirtualDocumentRoot|VirtualDocumentRootIP|VirtualScriptAlias|VirtualScriptAliasIP)\\b"},{token:["keyword.php.apacheconf","text","entity.property.apacheconf","text","string.value.apacheconf","text"],regex:"\\b(php_value|php_flag)\\b(?:(\\s+)(.+?)(?:(\\s+)(.+?))?)?(\\s)"},{token:["punctuation.variable.apacheconf","variable.env.apacheconf","variable.misc.apacheconf","punctuation.variable.apacheconf"],regex:"(%\\{)(?:(HTTP_USER_AGENT|HTTP_REFERER|HTTP_COOKIE|HTTP_FORWARDED|HTTP_HOST|HTTP_PROXY_CONNECTION|HTTP_ACCEPT|REMOTE_ADDR|REMOTE_HOST|REMOTE_PORT|REMOTE_USER|REMOTE_IDENT|REQUEST_METHOD|SCRIPT_FILENAME|PATH_INFO|QUERY_STRING|AUTH_TYPE|DOCUMENT_ROOT|SERVER_ADMIN|SERVER_NAME|SERVER_ADDR|SERVER_PORT|SERVER_PROTOCOL|SERVER_SOFTWARE|TIME_YEAR|TIME_MON|TIME_DAY|TIME_HOUR|TIME_MIN|TIME_SEC|TIME_WDAY|TIME|API_VERSION|THE_REQUEST|REQUEST_URI|REQUEST_FILENAME|IS_SUBREQ|HTTPS)|(.*?))(\\})"},{token:["entity.mime-type.apacheconf","text"],regex:"\\b((?:text|image|application|video|audio)/.+?)(\\s)"},{token:"entity.helper.apacheconf",regex:"\\b(?:from|unset|set|on|off)\\b",caseInsensitive:!0},{token:"constant.integer.apacheconf",regex:"\\b\\d+\\b"},{token:["text","punctuation.definition.flag.apacheconf","string.flag.apacheconf","punctuation.definition.flag.apacheconf","text"],regex:"(\\s)(\\[)(.*?)(\\])(\\s)"}]},this.normalizeRules()};s.metaData={fileTypes:["conf","CONF","htaccess","HTACCESS","htgroups","HTGROUPS","htpasswd","HTPASSWD",".htaccess",".HTACCESS",".htgroups",".HTGROUPS",".htpasswd",".HTPASSWD"],name:"Apache Conf",scopeName:"source.apacheconf"},r.inherits(s,i),t.ApacheConfHighlightRules=s}),ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(e,t,n){"use strict";var r=e("../../lib/oop"),i=e("../../range").Range,s=e("./fold_mode").FoldMode,o=t.FoldMode=function(e){e&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+e.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+e.end)))};r.inherits(o,s),function(){this.foldingStartMarker=/(\{|\[)[^\}\]]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/,this.getFoldWidgetRange=function(e,t,n,r){var i=e.getLine(n),s=i.match(this.foldingStartMarker);if(s){var o=s.index;if(s[1])return this.openingBracketBlock(e,s[1],n,o);var u=e.getCommentFoldRange(n,o+s[0].length,1);return u&&!u.isMultiLine()&&(r?u=this.getSectionRange(e,n):t!="all"&&(u=null)),u}if(t==="markbegin")return;var s=i.match(this.foldingStopMarker);if(s){var o=s.index+s[0].length;return s[1]?this.closingBracketBlock(e,s[1],n,o):e.getCommentFoldRange(n,o,-1)}},this.getSectionRange=function(e,t){var n=e.getLine(t),r=n.search(/\S/),s=t,o=n.length;t+=1;var u=t,a=e.getLength();while(++t<a){n=e.getLine(t);var f=n.search(/\S/);if(f===-1)continue;if(r>f)break;var l=this.getFoldWidgetRange(e,"all",t);if(l){if(l.start.row<=s)break;if(l.isMultiLine())t=l.end.row;else if(r==f)break}u=t}return new i(s,o,u,e.getLine(u).length)}}.call(o.prototype)}),ace.define("ace/mode/apache_conf",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/apache_conf_highlight_rules","ace/mode/folding/cstyle"],function(e,t,n){"use strict";var r=e("../lib/oop"),i=e("./text").Mode,s=e("./apache_conf_highlight_rules").ApacheConfHighlightRules,o=e("./folding/cstyle").FoldMode,u=function(){this.HighlightRules=s,this.foldingRules=new o};r.inherits(u,i),function(){this.lineCommentStart="#",this.$id="ace/mode/apache_conf"}.call(u.prototype),t.Mode=u})