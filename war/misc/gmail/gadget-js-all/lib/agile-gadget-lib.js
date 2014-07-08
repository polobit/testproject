/*! lib/handlebars/base.js */
var Handlebars={};Handlebars.VERSION="1.0.beta.6";Handlebars.helpers={};Handlebars.partials={};Handlebars.registerHelper=function(b,c,a){if(a){c.not=a}this.helpers[b]=c};Handlebars.registerPartial=function(a,b){this.partials[a]=b};Handlebars.registerHelper("helperMissing",function(a){if(arguments.length===2){return undefined}else{throw new Error("Could not find property '"+a+"'")}});var toString=Object.prototype.toString,functionType="[object Function]";Handlebars.registerHelper("blockHelperMissing",function(f,d){var a=d.inverse||function(){},h=d.fn;var c="";var g=toString.call(f);if(g===functionType){f=f.call(this)}if(f===true){return h(this)}else{if(f===false||f==null){return a(this)}else{if(g==="[object Array]"){if(f.length>0){for(var e=0,b=f.length;e<b;e++){c=c+h(f[e])}}else{c=a(this)}return c}else{return h(f)}}}});Handlebars.registerHelper("each",function(f,d){var g=d.fn,a=d.inverse;var c="";if(f&&f.length>0){for(var e=0,b=f.length;e<b;e++){c=c+g(f[e])}}else{c=a(this)}return c});Handlebars.registerHelper("if",function(b,a){var c=toString.call(b);if(c===functionType){b=b.call(this)}if(!b||Handlebars.Utils.isEmpty(b)){return a.inverse(this)}else{return a.fn(this)}});Handlebars.registerHelper("unless",function(c,b){var d=b.fn,a=b.inverse;b.fn=a;b.inverse=d;return Handlebars.helpers["if"].call(this,c,b)});Handlebars.registerHelper("with",function(b,a){return a.fn(b)});Handlebars.registerHelper("log",function(a){Handlebars.log(a)});var handlebars=(function(){var f={trace:function c(){},yy:{},symbols_:{error:2,root:3,program:4,EOF:5,statements:6,simpleInverse:7,statement:8,openInverse:9,closeBlock:10,openBlock:11,mustache:12,partial:13,CONTENT:14,COMMENT:15,OPEN_BLOCK:16,inMustache:17,CLOSE:18,OPEN_INVERSE:19,OPEN_ENDBLOCK:20,path:21,OPEN:22,OPEN_UNESCAPED:23,OPEN_PARTIAL:24,params:25,hash:26,param:27,STRING:28,INTEGER:29,BOOLEAN:30,hashSegments:31,hashSegment:32,ID:33,EQUALS:34,pathSegments:35,SEP:36,"$accept":0,"$end":1},terminals_:{2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",28:"STRING",29:"INTEGER",30:"BOOLEAN",33:"ID",34:"EQUALS",36:"SEP"},productions_:[0,[3,2],[4,3],[4,1],[4,0],[6,1],[6,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[7,2],[17,3],[17,2],[17,2],[17,1],[25,2],[25,1],[27,1],[27,1],[27,1],[27,1],[26,1],[31,2],[31,1],[32,3],[32,3],[32,3],[32,3],[21,1],[35,3],[35,1]],performAction:function b(g,j,k,n,m,i,l){var h=i.length-1;switch(m){case 1:return i[h-1];break;case 2:this.$=new n.ProgramNode(i[h-2],i[h]);break;case 3:this.$=new n.ProgramNode(i[h]);break;case 4:this.$=new n.ProgramNode([]);break;case 5:this.$=[i[h]];break;case 6:i[h-1].push(i[h]);this.$=i[h-1];break;case 7:this.$=new n.InverseNode(i[h-2],i[h-1],i[h]);break;case 8:this.$=new n.BlockNode(i[h-2],i[h-1],i[h]);break;case 9:this.$=i[h];break;case 10:this.$=i[h];break;case 11:this.$=new n.ContentNode(i[h]);break;case 12:this.$=new n.CommentNode(i[h]);break;case 13:this.$=new n.MustacheNode(i[h-1][0],i[h-1][1]);break;case 14:this.$=new n.MustacheNode(i[h-1][0],i[h-1][1]);break;case 15:this.$=i[h-1];break;case 16:this.$=new n.MustacheNode(i[h-1][0],i[h-1][1]);break;case 17:this.$=new n.MustacheNode(i[h-1][0],i[h-1][1],true);break;case 18:this.$=new n.PartialNode(i[h-1]);break;case 19:this.$=new n.PartialNode(i[h-2],i[h-1]);break;case 20:break;case 21:this.$=[[i[h-2]].concat(i[h-1]),i[h]];break;case 22:this.$=[[i[h-1]].concat(i[h]),null];break;case 23:this.$=[[i[h-1]],i[h]];break;case 24:this.$=[[i[h]],null];break;case 25:i[h-1].push(i[h]);this.$=i[h-1];break;case 26:this.$=[i[h]];break;case 27:this.$=i[h];break;case 28:this.$=new n.StringNode(i[h]);break;case 29:this.$=new n.IntegerNode(i[h]);break;case 30:this.$=new n.BooleanNode(i[h]);break;case 31:this.$=new n.HashNode(i[h]);break;case 32:i[h-1].push(i[h]);this.$=i[h-1];break;case 33:this.$=[i[h]];break;case 34:this.$=[i[h-2],i[h]];break;case 35:this.$=[i[h-2],new n.StringNode(i[h])];break;case 36:this.$=[i[h-2],new n.IntegerNode(i[h])];break;case 37:this.$=[i[h-2],new n.BooleanNode(i[h])];break;case 38:this.$=new n.IdNode(i[h]);break;case 39:i[h-2].push(i[h]);this.$=i[h-2];break;case 40:this.$=[i[h]];break}},table:[{3:1,4:2,5:[2,4],6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{1:[3]},{5:[1,16]},{5:[2,3],7:17,8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,19],20:[2,3],22:[1,13],23:[1,14],24:[1,15]},{5:[2,5],14:[2,5],15:[2,5],16:[2,5],19:[2,5],20:[2,5],22:[2,5],23:[2,5],24:[2,5]},{4:20,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{4:21,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{17:22,21:23,33:[1,25],35:24},{17:26,21:23,33:[1,25],35:24},{17:27,21:23,33:[1,25],35:24},{17:28,21:23,33:[1,25],35:24},{21:29,33:[1,25],35:24},{1:[2,1]},{6:30,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{5:[2,6],14:[2,6],15:[2,6],16:[2,6],19:[2,6],20:[2,6],22:[2,6],23:[2,6],24:[2,6]},{17:22,18:[1,31],21:23,33:[1,25],35:24},{10:32,20:[1,33]},{10:34,20:[1,33]},{18:[1,35]},{18:[2,24],21:40,25:36,26:37,27:38,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,38],28:[2,38],29:[2,38],30:[2,38],33:[2,38],36:[1,46]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],36:[2,40]},{18:[1,47]},{18:[1,48]},{18:[1,49]},{18:[1,50],21:51,33:[1,25],35:24},{5:[2,2],8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,2],22:[1,13],23:[1,14],24:[1,15]},{14:[2,20],15:[2,20],16:[2,20],19:[2,20],22:[2,20],23:[2,20],24:[2,20]},{5:[2,7],14:[2,7],15:[2,7],16:[2,7],19:[2,7],20:[2,7],22:[2,7],23:[2,7],24:[2,7]},{21:52,33:[1,25],35:24},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]},{18:[2,22],21:40,26:53,27:54,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,23]},{18:[2,26],28:[2,26],29:[2,26],30:[2,26],33:[2,26]},{18:[2,31],32:55,33:[1,56]},{18:[2,27],28:[2,27],29:[2,27],30:[2,27],33:[2,27]},{18:[2,28],28:[2,28],29:[2,28],30:[2,28],33:[2,28]},{18:[2,29],28:[2,29],29:[2,29],30:[2,29],33:[2,29]},{18:[2,30],28:[2,30],29:[2,30],30:[2,30],33:[2,30]},{18:[2,33],33:[2,33]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],34:[1,57],36:[2,40]},{33:[1,58]},{14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]},{5:[2,17],14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]},{18:[1,59]},{18:[1,60]},{18:[2,21]},{18:[2,25],28:[2,25],29:[2,25],30:[2,25],33:[2,25]},{18:[2,32],33:[2,32]},{34:[1,57]},{21:61,28:[1,62],29:[1,63],30:[1,64],33:[1,25],35:24},{18:[2,39],28:[2,39],29:[2,39],30:[2,39],33:[2,39],36:[2,39]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]},{18:[2,34],33:[2,34]},{18:[2,35],33:[2,35]},{18:[2,36],33:[2,36]},{18:[2,37],33:[2,37]}],defaultActions:{16:[2,1],37:[2,23],53:[2,21]},parseError:function d(h,g){throw new Error(h)},parse:function e(o){var x=this,l=[0],G=[null],s=[],H=this.table,h="",q=0,E=0,j=0,n=2,u=1;this.lexer.setInput(o);this.lexer.yy=this.yy;this.yy.lexer=this.lexer;if(typeof this.lexer.yylloc=="undefined"){this.lexer.yylloc={}}var i=this.lexer.yylloc;s.push(i);if(typeof this.yy.parseError==="function"){this.parseError=this.yy.parseError}function w(p){l.length=l.length-2*p;G.length=G.length-p;s.length=s.length-p}function v(){var p;p=x.lexer.lex()||1;if(typeof p!=="number"){p=x.symbols_[p]||p}return p}var D,z,k,C,I,t,B={},y,F,g,m;while(true){k=l[l.length-1];if(this.defaultActions[k]){C=this.defaultActions[k]}else{if(D==null){D=v()}C=H[k]&&H[k][D]}if(typeof C==="undefined"||!C.length||!C[0]){if(!j){m=[];for(y in H[k]){if(this.terminals_[y]&&y>2){m.push("'"+this.terminals_[y]+"'")}}var A="";if(this.lexer.showPosition){A="Parse error on line "+(q+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+m.join(", ")+", got '"+this.terminals_[D]+"'"}else{A="Parse error on line "+(q+1)+": Unexpected "+(D==1?"end of input":"'"+(this.terminals_[D]||D)+"'")}this.parseError(A,{text:this.lexer.match,token:this.terminals_[D]||D,line:this.lexer.yylineno,loc:i,expected:m})}}if(C[0] instanceof Array&&C.length>1){throw new Error("Parse Error: multiple actions possible at state: "+k+", token: "+D)}switch(C[0]){case 1:l.push(D);G.push(this.lexer.yytext);s.push(this.lexer.yylloc);l.push(C[1]);D=null;if(!z){E=this.lexer.yyleng;h=this.lexer.yytext;q=this.lexer.yylineno;i=this.lexer.yylloc;if(j>0){j--}}else{D=z;z=null}break;case 2:F=this.productions_[C[1]][1];B.$=G[G.length-F];B._$={first_line:s[s.length-(F||1)].first_line,last_line:s[s.length-1].last_line,first_column:s[s.length-(F||1)].first_column,last_column:s[s.length-1].last_column};t=this.performAction.call(B,h,E,q,this.yy,C[1],G,s);if(typeof t!=="undefined"){return t}if(F){l=l.slice(0,-1*F*2);G=G.slice(0,-1*F);s=s.slice(0,-1*F)}l.push(this.productions_[C[1]][0]);G.push(B.$);s.push(B._$);g=H[l[l.length-2]][l[l.length-1]];l.push(g);break;case 3:return true}}return true}};var a=(function(){var j=({EOF:1,parseError:function l(o,n){if(this.yy.parseError){this.yy.parseError(o,n)}else{throw new Error(o)}},setInput:function(n){this._input=n;this._more=this._less=this.done=false;this.yylineno=this.yyleng=0;this.yytext=this.matched=this.match="";this.conditionStack=["INITIAL"];this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0};return this},input:function(){var o=this._input[0];this.yytext+=o;this.yyleng++;this.match+=o;this.matched+=o;var n=o.match(/\n/);if(n){this.yylineno++}this._input=this._input.slice(1);return o},unput:function(n){this._input=n+this._input;return this},more:function(){this._more=true;return this},pastInput:function(){var n=this.matched.substr(0,this.matched.length-this.match.length);return(n.length>20?"...":"")+n.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var n=this.match;if(n.length<20){n+=this._input.substr(0,20-n.length)}return(n.substr(0,20)+(n.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var n=this.pastInput();var o=new Array(n.length+1).join("-");return n+this.upcomingInput()+"\n"+o+"^"},next:function(){if(this.done){return this.EOF}if(!this._input){this.done=true}var r,p,o,n;if(!this._more){this.yytext="";this.match=""}var s=this._currentRules();for(var q=0;q<s.length;q++){p=this._input.match(this.rules[s[q]]);if(p){n=p[0].match(/\n.*/g);if(n){this.yylineno+=n.length}this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:n?n[n.length-1].length-1:this.yylloc.last_column+p[0].length};this.yytext+=p[0];this.match+=p[0];this.matches=p;this.yyleng=this.yytext.length;this._more=false;this._input=this._input.slice(p[0].length);this.matched+=p[0];r=this.performAction.call(this,this.yy,this,s[q],this.conditionStack[this.conditionStack.length-1]);if(r){return r}else{return}}}if(this._input===""){return this.EOF}else{this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}},lex:function g(){var n=this.next();if(typeof n!=="undefined"){return n}else{return this.lex()}},begin:function h(n){this.conditionStack.push(n)},popState:function m(){return this.conditionStack.pop()},_currentRules:function k(){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules},topState:function(){return this.conditionStack[this.conditionStack.length-2]},pushState:function h(n){this.begin(n)}});j.performAction=function i(r,o,q,n){var p=n;switch(q){case 0:if(o.yytext.slice(-1)!=="\\"){this.begin("mu")}if(o.yytext.slice(-1)==="\\"){o.yytext=o.yytext.substr(0,o.yyleng-1),this.begin("emu")}if(o.yytext){return 14}break;case 1:return 14;break;case 2:this.popState();return 14;break;case 3:return 24;break;case 4:return 16;break;case 5:return 20;break;case 6:return 19;break;case 7:return 19;break;case 8:return 23;break;case 9:return 23;break;case 10:o.yytext=o.yytext.substr(3,o.yyleng-5);this.popState();return 15;break;case 11:return 22;break;case 12:return 34;break;case 13:return 33;break;case 14:return 33;break;case 15:return 36;break;case 16:break;case 17:this.popState();return 18;break;case 18:this.popState();return 18;break;case 19:o.yytext=o.yytext.substr(1,o.yyleng-2).replace(/\\"/g,'"');return 28;break;case 20:return 30;break;case 21:return 30;break;case 22:return 29;break;case 23:return 33;break;case 24:o.yytext=o.yytext.substr(1,o.yyleng-2);return 33;break;case 25:return"INVALID";break;case 26:return 5;break}};j.rules=[/^[^\x00]*?(?=(\{\{))/,/^[^\x00]+/,/^[^\x00]{2,}?(?=(\{\{))/,/^\{\{>/,/^\{\{#/,/^\{\{\//,/^\{\{\^/,/^\{\{\s*else\b/,/^\{\{\{/,/^\{\{&/,/^\{\{![\s\S]*?\}\}/,/^\{\{/,/^=/,/^\.(?=[} ])/,/^\.\./,/^[\/.]/,/^\s+/,/^\}\}\}/,/^\}\}/,/^"(\\["]|[^"])*"/,/^true(?=[}\s])/,/^false(?=[}\s])/,/^[0-9]+(?=[}\s])/,/^[a-zA-Z0-9_$-]+(?=[=}\s\/.])/,/^\[[^\]]*\]/,/^./,/^$/];j.conditions={mu:{rules:[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],inclusive:false},emu:{rules:[2],inclusive:false},INITIAL:{rules:[0,1,26],inclusive:true}};return j})();f.lexer=a;return f})();if(typeof require!=="undefined"&&typeof exports!=="undefined"){exports.parser=handlebars;exports.parse=function(){return handlebars.parse.apply(handlebars,arguments)};exports.main=function commonjsMain(a){if(!a[1]){throw new Error("Usage: "+a[0]+" FILE")}if(typeof process!=="undefined"){var c=require("fs").readFileSync(require("path").join(process.cwd(),a[1]),"utf8")}else{var b=require("file").path(require("file").cwd());var c=b.join(a[1]).read({charset:"utf-8"})}return exports.parser.parse(c)};if(typeof module!=="undefined"&&require.main===module){exports.main(typeof process!=="undefined"?process.argv.slice(1):require("system").args)}}Handlebars.Parser=handlebars;Handlebars.parse=function(a){Handlebars.Parser.yy=Handlebars.AST;return Handlebars.Parser.parse(a)};Handlebars.print=function(a){return new Handlebars.PrintVisitor().accept(a)};Handlebars.logger={DEBUG:0,INFO:1,WARN:2,ERROR:3,level:3,log:function(b,a){}};Handlebars.log=function(b,a){Handlebars.logger.log(b,a)};(function(){Handlebars.AST={};Handlebars.AST.ProgramNode=function(c,b){this.type="program";this.statements=c;if(b){this.inverse=new Handlebars.AST.ProgramNode(b)}};Handlebars.AST.MustacheNode=function(d,c,b){this.type="mustache";this.id=d[0];this.params=d.slice(1);this.hash=c;this.escaped=!b};Handlebars.AST.PartialNode=function(c,b){this.type="partial";this.id=c;this.context=b};var a=function(b,c){if(b.original!==c.original){throw new Handlebars.Exception(b.original+" doesn't match "+c.original)}};Handlebars.AST.BlockNode=function(c,b,d){a(c.id,d);this.type="block";this.mustache=c;this.program=b};Handlebars.AST.InverseNode=function(c,b,d){a(c.id,d);this.type="inverse";this.mustache=c;this.program=b};Handlebars.AST.ContentNode=function(b){this.type="content";this.string=b};Handlebars.AST.HashNode=function(b){this.type="hash";this.pairs=b};Handlebars.AST.IdNode=function(f){this.type="ID";this.original=f.join(".");var d=[],g=0;for(var e=0,b=f.length;e<b;e++){var c=f[e];if(c===".."){g++}else{if(c==="."||c==="this"){this.isScoped=true}else{d.push(c)}}}this.parts=d;this.string=d.join(".");this.depth=g;this.isSimple=(d.length===1)&&(g===0)};Handlebars.AST.StringNode=function(b){this.type="STRING";this.string=b};Handlebars.AST.IntegerNode=function(b){this.type="INTEGER";this.integer=b};Handlebars.AST.BooleanNode=function(b){this.type="BOOLEAN";this.bool=b};Handlebars.AST.CommentNode=function(b){this.type="comment";this.comment=b}})();Handlebars.Exception=function(b){var a=Error.prototype.constructor.apply(this,arguments);for(var c in a){if(a.hasOwnProperty(c)){this[c]=a[c]}}this.message=a.message};Handlebars.Exception.prototype=new Error;Handlebars.SafeString=function(a){this.string=a};Handlebars.SafeString.prototype.toString=function(){return this.string.toString()};(function(){var c={"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"};var d=/&(?!\w+;)|[<>"'`]/g;var b=/[&<>"'`]/;var a=function(e){return c[e]||"&amp;"};Handlebars.Utils={escapeExpression:function(e){if(e instanceof Handlebars.SafeString){return e.toString()}else{if(e==null||e===false){return""}}if(!b.test(e)){return e}return e.replace(d,a)},isEmpty:function(e){if(typeof e==="undefined"){return true}else{if(e===null){return true}else{if(e===false){return true}else{if(Object.prototype.toString.call(e)==="[object Array]"&&e.length===0){return true}else{return false}}}}}}})();Handlebars.Compiler=function(){};Handlebars.JavaScriptCompiler=function(){};(function(f,e){f.OPCODE_MAP={appendContent:1,getContext:2,lookupWithHelpers:3,lookup:4,append:5,invokeMustache:6,appendEscaped:7,pushString:8,truthyOrFallback:9,functionOrFallback:10,invokeProgram:11,invokePartial:12,push:13,assignToHash:15,pushStringParam:16};f.MULTI_PARAM_OPCODES={appendContent:1,getContext:1,lookupWithHelpers:2,lookup:1,invokeMustache:3,pushString:1,truthyOrFallback:1,functionOrFallback:1,invokeProgram:3,invokePartial:1,push:1,assignToHash:1,pushStringParam:1};f.DISASSEMBLE_MAP={};for(var h in f.OPCODE_MAP){var g=f.OPCODE_MAP[h];f.DISASSEMBLE_MAP[g]=h}f.multiParamSize=function(i){return f.MULTI_PARAM_OPCODES[f.DISASSEMBLE_MAP[i]]};f.prototype={compiler:f,disassemble:function(){var t=this.opcodes,r,n;var q=[],v,m,w;for(var s=0,o=t.length;s<o;s++){r=t[s];if(r==="DECLARE"){m=t[++s];w=t[++s];q.push("DECLARE "+m+" = "+w)}else{v=f.DISASSEMBLE_MAP[r];var u=f.multiParamSize(r);var k=[];for(var p=0;p<u;p++){n=t[++s];if(typeof n==="string"){n='"'+n.replace("\n","\\n")+'"'}k.push(n)}v=v+" "+k.join(" ");q.push(v)}}return q.join("\n")},guid:0,compile:function(i,k){this.children=[];this.depths={list:[]};this.options=k;var l=this.options.knownHelpers;this.options.knownHelpers={helperMissing:true,blockHelperMissing:true,each:true,"if":true,unless:true,"with":true,log:true};if(l){for(var j in l){this.options.knownHelpers[j]=l[j]}}return this.program(i)},accept:function(i){return this[i.type](i)},program:function(m){var k=m.statements,o;this.opcodes=[];for(var n=0,j=k.length;n<j;n++){o=k[n];this[o.type](o)}this.isSimple=j===1;this.depths.list=this.depths.list.sort(function(l,i){return l-i});return this},compileProgram:function(m){var j=new this.compiler().compile(m,this.options);var n=this.guid++;this.usePartial=this.usePartial||j.usePartial;this.children[n]=j;for(var o=0,k=j.depths.list.length;o<k;o++){depth=j.depths.list[o];if(depth<2){continue}else{this.addDepth(depth-1)}}return n},block:function(o){var l=o.mustache;var n,p,j,k;var m=this.setupStackForMustache(l);var i=this.compileProgram(o.program);if(o.program.inverse){k=this.compileProgram(o.program.inverse);this.declare("inverse",k)}this.opcode("invokeProgram",i,m.length,!!l.hash);this.declare("inverse",null);this.opcode("append")},inverse:function(k){var j=this.setupStackForMustache(k.mustache);var i=this.compileProgram(k.program);this.declare("inverse",i);this.opcode("invokeProgram",null,j.length,!!k.mustache.hash);this.declare("inverse",null);this.opcode("append")},hash:function(n){var m=n.pairs,p,o;this.opcode("push","{}");for(var k=0,j=m.length;k<j;k++){p=m[k];o=p[1];this.accept(o);this.opcode("assignToHash",p[0])}},partial:function(i){var j=i.id;this.usePartial=true;if(i.context){this.ID(i.context)}else{this.opcode("push","depth0")}this.opcode("invokePartial",j.original);this.opcode("append")},content:function(i){this.opcode("appendContent",i.string)},mustache:function(i){var j=this.setupStackForMustache(i);this.opcode("invokeMustache",j.length,i.id.original,!!i.hash);if(i.escaped&&!this.options.noEscape){this.opcode("appendEscaped")}else{this.opcode("append")}},ID:function(m){this.addDepth(m.depth);this.opcode("getContext",m.depth);this.opcode("lookupWithHelpers",m.parts[0]||null,m.isScoped||false);for(var k=1,j=m.parts.length;k<j;k++){this.opcode("lookup",m.parts[k])}},STRING:function(i){this.opcode("pushString",i.string)},INTEGER:function(i){this.opcode("push",i.integer)},BOOLEAN:function(i){this.opcode("push",i.bool)},comment:function(){},pushParams:function(l){var j=l.length,k;while(j--){k=l[j];if(this.options.stringParams){if(k.depth){this.addDepth(k.depth)}this.opcode("getContext",k.depth||0);this.opcode("pushStringParam",k.string)}else{this[k.type](k)}}},opcode:function(i,l,k,j){this.opcodes.push(f.OPCODE_MAP[i]);if(l!==undefined){this.opcodes.push(l)}if(k!==undefined){this.opcodes.push(k)}if(j!==undefined){this.opcodes.push(j)}},declare:function(i,j){this.opcodes.push("DECLARE");this.opcodes.push(i);this.opcodes.push(j)},addDepth:function(i){if(i===0){return}if(!this.depths[i]){this.depths[i]=true;this.depths.list.push(i)}},setupStackForMustache:function(i){var j=i.params;this.pushParams(j);if(i.hash){this.hash(i.hash)}this.ID(i.id);return j}};e.prototype={nameLookup:function(k,i,j){if(/^[0-9]+$/.test(i)){return k+"["+i+"]"}else{if(e.isValidJavaScriptVariableName(i)){return k+"."+i}else{return k+"['"+i+"']"}}},appendToBuffer:function(i){if(this.environment.isSimple){return"return "+i+";"}else{return"buffer += "+i+";"}},initializeBuffer:function(){return this.quotedString("")},namespace:"Handlebars",compile:function(i,j,l,k){this.environment=i;this.options=j||{};this.name=this.environment.name;this.isChild=!!l;this.context=l||{programs:[],aliases:{self:"this"},registers:{list:[]}};this.preamble();this.stackSlot=0;this.stackVars=[];this.compileChildren(i,j);var n=i.opcodes,m;this.i=0;for(b=n.length;this.i<b;this.i++){m=this.nextOpcode(0);if(m[0]==="DECLARE"){this.i=this.i+2;this[m[1]]=m[2]}else{this.i=this.i+m[1].length;this[m[0]].apply(this,m[1])}}return this.createFunctionContext(k)},nextOpcode:function(r){var o=this.environment.opcodes,m=o[this.i+r],l,p;var q,i;if(m==="DECLARE"){l=o[this.i+1];p=o[this.i+2];return["DECLARE",l,p]}else{l=f.DISASSEMBLE_MAP[m];q=f.multiParamSize(m);i=[];for(var k=0;k<q;k++){i.push(o[this.i+k+1+r])}return[l,i]}},eat:function(i){this.i=this.i+i.length},preamble:function(){var i=[];this.useRegister("foundHelper");if(!this.isChild){var j=this.namespace;var k="helpers = helpers || "+j+".helpers;";if(this.environment.usePartial){k=k+" partials = partials || "+j+".partials;"}i.push(k)}else{i.push("")}if(!this.environment.isSimple){i.push(", buffer = "+this.initializeBuffer())}else{i.push("")}this.lastContext=0;this.source=i},createFunctionContext:function(p){var q=this.stackVars;if(!this.isChild){q=q.concat(this.context.registers.list)}if(q.length>0){this.source[1]=this.source[1]+", "+q.join(", ")}if(!this.isChild){var k=[];for(var o in this.context.aliases){this.source[1]=this.source[1]+", "+o+"="+this.context.aliases[o]}}if(this.source[1]){this.source[1]="var "+this.source[1].substring(2)+";"}if(!this.isChild){this.source[1]+="\n"+this.context.programs.join("\n")+"\n"}if(!this.environment.isSimple){this.source.push("return buffer;")}var r=this.isChild?["depth0","data"]:["Handlebars","depth0","helpers","partials","data"];for(var n=0,j=this.environment.depths.list.length;n<j;n++){r.push("depth"+this.environment.depths.list[n])}if(p){r.push(this.source.join("\n  "));return Function.apply(this,r)}else{var m="function "+(this.name||"")+"("+r.join(",")+") {\n  "+this.source.join("\n  ")+"}";Handlebars.log(Handlebars.logger.DEBUG,m+"\n\n");return m}},appendContent:function(i){this.source.push(this.appendToBuffer(this.quotedString(i)))},append:function(){var i=this.popStack();this.source.push("if("+i+" || "+i+" === 0) { "+this.appendToBuffer(i)+" }");if(this.environment.isSimple){this.source.push("else { "+this.appendToBuffer("''")+" }")}},appendEscaped:function(){var j=this.nextOpcode(1),i="";this.context.aliases.escapeExpression="this.escapeExpression";if(j[0]==="appendContent"){i=" + "+this.quotedString(j[1][0]);this.eat(j)}this.source.push(this.appendToBuffer("escapeExpression("+this.popStack()+")"+i))},getContext:function(i){if(this.lastContext!==i){this.lastContext=i}},lookupWithHelpers:function(k,l){if(k){var i=this.nextStack();this.usingKnownHelper=false;var j;if(!l&&this.options.knownHelpers[k]){j=i+" = "+this.nameLookup("helpers",k,"helper");this.usingKnownHelper=true}else{if(l||this.options.knownHelpersOnly){j=i+" = "+this.nameLookup("depth"+this.lastContext,k,"context")}else{this.register("foundHelper",this.nameLookup("helpers",k,"helper"));j=i+" = foundHelper || "+this.nameLookup("depth"+this.lastContext,k,"context")}}j+=";";this.source.push(j)}else{this.pushStack("depth"+this.lastContext)}},lookup:function(j){var i=this.topStack();this.source.push(i+" = ("+i+" === null || "+i+" === undefined || "+i+" === false ? "+i+" : "+this.nameLookup(i,j,"context")+");")},pushStringParam:function(i){this.pushStack("depth"+this.lastContext);this.pushString(i)},pushString:function(i){this.pushStack(this.quotedString(i))},push:function(i){this.pushStack(i)},invokeMustache:function(k,j,i){this.populateParams(k,this.quotedString(j),"{}",null,i,function(l,n,m){if(!this.usingKnownHelper){this.context.aliases.helperMissing="helpers.helperMissing";this.context.aliases.undef="void 0";this.source.push("else if("+m+"=== undef) { "+l+" = helperMissing.call("+n+"); }");if(l!==m){this.source.push("else { "+l+" = "+m+"; }")}}})},invokeProgram:function(k,l,j){var i=this.programExpression(this.inverse);var m=this.programExpression(k);this.populateParams(l,null,m,i,j,function(n,p,o){if(!this.usingKnownHelper){this.context.aliases.blockHelperMissing="helpers.blockHelperMissing";this.source.push("else { "+n+" = blockHelperMissing.call("+p+"); }")}})},populateParams:function(p,k,t,q,x,w){var l=x||this.options.stringParams||q||this.options.data;var j=this.popStack(),v;var n=[],m,o,u;if(l){this.register("tmp1",t);u="tmp1"}else{u="{ hash: {} }"}if(l){var s=(x?this.popStack():"{}");this.source.push("tmp1.hash = "+s+";")}if(this.options.stringParams){this.source.push("tmp1.contexts = [];")}for(var r=0;r<p;r++){m=this.popStack();n.push(m);if(this.options.stringParams){this.source.push("tmp1.contexts.push("+this.popStack()+");")}}if(q){this.source.push("tmp1.fn = tmp1;");this.source.push("tmp1.inverse = "+q+";")}if(this.options.data){this.source.push("tmp1.data = data;")}n.push(u);this.populateCall(n,j,k||j,w,t!=="{}")},populateCall:function(n,j,k,q,o){var m=["depth0"].concat(n).join(", ");var i=["depth0"].concat(k).concat(n).join(", ");var p=this.nextStack();if(this.usingKnownHelper){this.source.push(p+" = "+j+".call("+m+");")}else{this.context.aliases.functionType='"function"';var l=o?"foundHelper && ":"";this.source.push("if("+l+"typeof "+j+" === functionType) { "+p+" = "+j+".call("+m+"); }")}q.call(this,p,i,j);this.usingKnownHelper=false},invokePartial:function(i){params=[this.nameLookup("partials",i,"partial"),"'"+i+"'",this.popStack(),"helpers","partials"];if(this.options.data){params.push("data")}this.pushStack("self.invokePartial("+params.join(", ")+");")},assignToHash:function(i){var j=this.popStack();var k=this.topStack();this.source.push(k+"['"+i+"'] = "+j+";")},compiler:e,compileChildren:function(j,n){var p=j.children,r,q;for(var o=0,k=p.length;o<k;o++){r=p[o];q=new this.compiler();this.context.programs.push("");var m=this.context.programs.length;r.index=m;r.name="program"+m;this.context.programs[m]=q.compile(r,n,this.context)}},programExpression:function(k){if(k==null){return"self.noop"}var p=this.environment.children[k],o=p.depths.list;var n=[p.index,p.name,"data"];for(var m=0,j=o.length;m<j;m++){depth=o[m];if(depth===1){n.push("depth0")}else{n.push("depth"+(depth-1))}}if(o.length===0){return"self.program("+n.join(", ")+")"}else{n.shift();return"self.programWithDepth("+n.join(", ")+")"}},register:function(i,j){this.useRegister(i);this.source.push(i+" = "+j+";")},useRegister:function(i){if(!this.context.registers[i]){this.context.registers[i]=true;this.context.registers.list.push(i)}},pushStack:function(i){this.source.push(this.nextStack()+" = "+i+";");return"stack"+this.stackSlot},nextStack:function(){this.stackSlot++;if(this.stackSlot>this.stackVars.length){this.stackVars.push("stack"+this.stackSlot)}return"stack"+this.stackSlot},popStack:function(){return"stack"+this.stackSlot--},topStack:function(){return"stack"+this.stackSlot},quotedString:function(i){return'"'+i.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r")+'"'}};var a=("break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield").split(" ");var d=e.RESERVED_WORDS={};for(var c=0,b=a.length;c<b;c++){d[a[c]]=true}e.isValidJavaScriptVariableName=function(i){if(!e.RESERVED_WORDS[i]&&/^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(i)){return true}return false}})(Handlebars.Compiler,Handlebars.JavaScriptCompiler);Handlebars.precompile=function(d,c){c=c||{};var b=Handlebars.parse(d);var a=new Handlebars.Compiler().compile(b,c);return new Handlebars.JavaScriptCompiler().compile(a,c)};Handlebars.compile=function(b,a){a=a||{};var d;function c(){var g=Handlebars.parse(b);var f=new Handlebars.Compiler().compile(g,a);var e=new Handlebars.JavaScriptCompiler().compile(f,a,undefined,true);return Handlebars.template(e)}return function(f,e){if(!d){d=c()}return d.call(this,f,e)}};Handlebars.VM={template:function(a){var b={escapeExpression:Handlebars.Utils.escapeExpression,invokePartial:Handlebars.VM.invokePartial,programs:[],program:function(d,e,f){var c=this.programs[d];if(f){return Handlebars.VM.program(e,f)}else{if(c){return c}else{c=this.programs[d]=Handlebars.VM.program(e);return c}}},programWithDepth:Handlebars.VM.programWithDepth,noop:Handlebars.VM.noop};return function(d,c){c=c||{};return a.call(b,Handlebars,d,c.helpers,c.partials,c.data)}},programWithDepth:function(b,d,c){var a=Array.prototype.slice.call(arguments,2);return function(f,e){e=e||{};return b.apply(this,[f,e.data||d].concat(a))}},program:function(a,b){return function(d,c){c=c||{};return a(d,c.data||b)}},noop:function(){return""},invokePartial:function(a,b,d,e,c,f){options={helpers:e,partials:c,data:f};if(a===undefined){throw new Handlebars.Exception("The partial "+b+" could not be found")}else{if(a instanceof Function){return a(d,options)}else{if(!Handlebars.compile){throw new Handlebars.Exception("The partial "+b+" could not be compiled when running in runtime-only mode")}else{c[b]=Handlebars.compile(a);return c[b](d,options)}}}}};Handlebars.template=Handlebars.VM.template;// We store one template compiled - if repetitive templates are called, we save time on compilations
var Handlebars_Compiled_Templates = {};

/**
 * Loads the template (script element with its id attribute as templateName
 * appended with "-template". For example if the templateName is "tasks", then
 * the script element id should be as "tasks-template") from html document body.
 * 
 * Compiles the loaded template using handlebars and replaces the context
 * related property names (which are under mustache like {{name}}) in the
 * template, with their associated values, on calling the context with the
 * compiled template.
 * 
 * @method getTemplate
 * @param {String}
 *            templateName name of the tempate to be loaded
 * @param {Object}
 *            context json object to call with the compiled template
 * @param {String}
 *            download verifies whether the template is found or not
 * @returns compiled html with the context
 */
function getTemplate(templateName, context, download)
{

	// Check if it is (compiled template) present in templates
	if (Handlebars_Compiled_Templates[templateName])
		return Handlebars_Compiled_Templates[templateName](context);
	else
		Handlebars_Compiled_Templates = {};

	// Check if source is available in body
	var source = $('#' + templateName + "-template").html();
	if (source)
	{

		var template = Handlebars.compile(source);

		// Store it in template
		Handlebars_Compiled_Templates[templateName] = template;

		// de("template");
		return template(context);
	}

	// Check if the download is explicitly set to no
	if (download == 'no')
	{
		console.log("Not found " + templateName);
		return;
	}

	// Download
	var templateHTML = '';

	// If starts with settings
	/**
	 * If the template is not found in document body, then download the template
	 * synchronously (stops other browser actions) by verifying the starting
	 * name of the given templateName, if it is down-loaded append it to the
	 * document body. And call the function (getTemplate) again by setting the
	 * download parameter to "no"
	 */
	if (templateName.indexOf("settings") == 0)
	{
		templateHTML = downloadSynchronously("tpl/min/settings.js");
	}
	if (templateName.indexOf("admin-settings") == 0)
	{
		templateHTML = downloadSynchronously("tpl/min/admin-settings.js");
	}
	if (templateName.indexOf("continue") == 0)
	{
		templateHTML = downloadSynchronously("tpl/min/continue.js");
	}
	if (templateName.indexOf("all-domain") == 0)
	{
		templateHTML = downloadSynchronously("tpl/min/admin.js");
	}
	if (templateHTML)
	{
		// console.log("Adding " + templateHTML);
		$('body').append($(templateHTML));
	}

	return getTemplate(templateName, context, 'no');
}

/**
 * Downloads the template synchronously (stops other browsing actions) from the
 * given url and returns it
 * 
 * @param {String}
 *            url location to download the template
 * @returns down-loaded template content
 */
function downloadSynchronously(url)
{

	var urlContent;
	jQuery.ajax({ url : url, dataType : 'html', success : function(result)
	{
		urlContent = result;
	}, async : false });

	return urlContent;
}

/**
 * Iterates the given "items", to find a match with the given "name", if found
 * returns the value of its value attribute
 * 
 * @param {Object}
 *            items array of json objects
 * @param {String}
 *            name to get the value (of value atribute)
 * @returns value of the matched object
 */
function getPropertyValue(items, name)
{
	if (items == undefined)
		return;

	for ( var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
			return items[i].value;
	}
}

/**
 * Returns contact property based on the name of the property
 * 
 * @param items :
 *            porperties in contact object
 * @param name :
 *            name of the property
 * @returns
 */
function getProperty(items, name)
{
	if (items == undefined)
		return;

	for ( var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
			return items[i];
	}
}

/**
 * Returns contact property based on its property name and subtype
 */
function getPropertyValueBySubtype(items, name, subtype)
{
	if (items == undefined)
		return;

	for ( var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name && items[i].subtype == subtype)
			return items[i].value;
	}
}

/**
 * Returns contact property based on the sub type (LINKEDIN, TWITTER, URL, SKYPE
 * etc..) of the property
 * 
 * @param items :
 *            properties list
 * @param name :
 *            name of the property
 * @param type :
 *            type of the property
 * @param subtype :
 *            subtype of property
 * @returns
 */
function getPropertyValueBytype(items, name, type, subtype)
{
	if (items == undefined)
		return;

	// Iterates though each property object and compares each property by name
	// and its type
	for ( var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
		{
			if (type && type == items[i].type)
			{
				if (subtype && subtype == items[i].subtype)
					return items[i].value;
			}

			if (subtype && subtype == items[i].subtype)
			{
				return items[i].value;
			}
		}
	}
}

/**
 * Returns list of custom properties. used to fill custom data in fields in
 * continue contact
 * 
 * @param items
 * @returns
 */
function getContactCustomProperties(items)
{
	if (items == undefined)
		return items;

	var fields = [];
	for ( var i = 0; i < items.length; i++)
	{
		if (items[i].type == "CUSTOM" && items[i].name != "image")
		{
			fields.push(items[i]);
		}
	}
	return fields;
}

/**
 * Turns the first letter of the given string to upper-case and the remaining to
 * lower-case (EMaiL to Email).
 * 
 * @param {String}
 *            value to convert as ucfirst
 * @returns converted string
 */
function ucfirst(value)
{
	return (value && typeof value === 'string') ? (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) : '';

}

/**
 * Creates titles from strings. Replaces underscore with spaces and capitalize
 * first word of string.
 * 
 * @param value
 * @returns
 */
function titleFromEnums(value)
{
	if (!value)
		return;

	var str = value.replace(/_/g, ' ');

	return ucfirst(str.toLowerCase());
}

/**
 * Counts total number of attributes in a json object
 * 
 * @param obj
 * @returns {Number}
 */
function countJsonProperties(obj)
{
	var prop;
	var propCount = 0;

	for (prop in obj)
	{
		propCount++;
	}
	return propCount;
}

/**
 * Get the current contact property
 * 
 * @param value
 * @returns {String}
 */
function getCurrentContactProperty(value)
{
	if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
	{
		var contact_properties = App_Contacts.contactDetailView.model.get('properties')
		console.log(App_Contacts.contactDetailView.model.toJSON());
		return getPropertyValue(contact_properties, value);
	}
}

function getCount(collection)
{
	console.log(collection);
	if (collection[0] && collection[0].count && (collection[0].count != -1))
		return "(" + collection[0].count + " Total)";
	else
		return "(" + collection.length + " Total)";	
}
$(function()
{

	/**
	 * Helper function to return the value of a property matched with the given
	 * name from the array of properties
	 * 
	 * @method getPropertyValue
	 * @param {Object}
	 *            items array of objects
	 * @param {String}
	 *            name to get matched object value
	 * @returns value of the matched object
	 */
	Handlebars.registerHelper('getPropertyValue', function(items, name)
	{
		return getPropertyValue(items, name);
	});

	/**
	 * Helper function to return the value of property based on sub-type of the
	 * property
	 */
	Handlebars.registerHelper('getPropertyValueBySubtype', function(items, name, subtype)
	{
		return getPropertyValueBySubtype(items, name, subtype);
	});

	/**
	 * Helper function to return the value of property based on type of the
	 * property
	 */
	Handlebars.registerHelper('getPropertyValueBytype', function(items, name, type, subtype)
	{
		return getPropertyValueBytype(items, name, type, subtype);
	});

	/**
	 * Returns twitter handle based on the twitter url of the profile. Accepts
	 * string URL and splits at last "/" and returns handle.
	 */
	Handlebars.registerHelper('getTwitterHandleByURL', function(value)
	{

		if (value.indexOf("https://twitter.com/") != -1)
			return value;

		value = value.substring(value.lastIndexOf("/") + 1);
		console.log(value);

		return value;
	});

	/**
	 * 
	 */
	Handlebars.registerHelper('getContactCustomProperties', function(items, options)
	{
		var fields = getContactCustomProperties(items);
		if (fields.length == 0)
			return options.inverse(fields);

		return options.fn(fields);

	});
	
	
	/**
	 * Returns custom fields without few fields like LINKEDIN or TWITTER or title fields
	 */
	Handlebars.registerHelper('getContactCustomPropertiesExclusively', function(items, options)
	{
		var exclude_by_subtype = ["LINKEDIN", "TWITTER"];
		var exclude_by_name = ["title"];
		
		var fields = getContactCustomProperties(items);
		var exclusive_fields = [];
		
		for(var i =0 ; i < fields.length ; i++)
		{
			if(jQuery.inArray(fields[i].name, exclude_by_name) != -1 || (fields[i].subtype && jQuery.inArray(fields[i].subtype, exclude_by_subtype) != -1))
			{
				continue;
			}
			exclusive_fields.push(fields[i]);
		}

		if (exclusive_fields.length == 0)
			return options.inverse(exclusive_fields);

		return options.fn(exclusive_fields);
	});

	Handlebars.registerHelper('urlEncode', function(url, key, data)
	{

		var startChar = "&";
		if (url.indexOf("?") != -1)
			startChar = "&";

		var encodedUrl = url + startChar + key + "=" + escape(JSON.stringify(data));
		// console.log(encodedUrl.length + " " + encodedUrl);
		return encodedUrl;
	});

	/**
	 * Helper function to return image for an entity (contact). Checks for
	 * existing image, if not found checks for an image using the email of the
	 * entity, if again failed to found returns a default image link.
	 * 
	 * @method gravatarurl
	 * @param {Object}
	 *            items array of objects
	 * @param {Number}
	 *            width to specify the width of the image
	 * @returns image link
	 * 
	 */
	Handlebars.registerHelper('gravatarurl', function(items, width)
	{

		if (items == undefined)
			return;

		// Checks if properties already has an image, to return it
		var agent_image = getPropertyValue(items, "image");
		if (agent_image)
			return agent_image;

		// Default image
		var img = DEFAULT_GRAVATAR_url;

		var email = getPropertyValue(items, "email");
		if (email)
		{
			return 'https://secure.gravatar.com/avatar/' + Agile_MD5(email) + '.jpg?s=' + width + "&d=" + escape(img);
		}

		return 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + "&d=" + escape(img);

	});

	Handlebars.registerHelper('defaultGravatarurl', function(width)
	{
		// Default image
		var img = DEFAULT_GRAVATAR_url;

		return 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + "&d=" + escape(img);
	});

	Handlebars.registerHelper('emailGravatarurl', function(width, email)
	{
		// Default image
		var img = DEFAULT_GRAVATAR_url;

		if (email)
		{
			return 'https://secure.gravatar.com/avatar/' + Agile_MD5(email) + '.jpg?s=' + width + "&d=" + escape(img);
		}

		return 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + "&d=" + escape(img);
	});

	/**
	 * Helper function to return icons based on given name
	 * 
	 * @method icons
	 * @param {String}
	 *            item name to get icon
	 * @returns icon name
	 */
	Handlebars.registerHelper('icons', function(item)
	{
		item = item.toLowerCase();
		if (item == "email")
			return "icon-envelope-alt";
		if (item == "phone")
			return "icon-headphones";
		if (item == "url")
			return "icon-home";
		if (item == "call")
			return "icon-phone-sign";
		if (item == "follow_up")
			return "icon-signout";
		if (item == "meeting")
			return "icon-group";
		if (item == "milestone")
			return "icon-cog";
		if (item == "send")
			return "icon-reply";
		if (item == "tweet")
			return "icon-share-alt";

	});

	Handlebars.registerHelper('eachkeys', function(context, options)
	{
		var fn = options.fn, inverse = options.inverse;
		var ret = "";

		var empty = true;
		for (key in context)
		{
			empty = false;
			break;
		}

		if (!empty)
		{
			for (key in context)
			{
				ret = ret + fn({ 'key' : key, 'value' : context[key] });
			}
		}
		else
		{
			ret = inverse(this);
		}
		return ret;
	});

	/**
	 * Turns the first letter of the given string to upper-case and the
	 * remaining to lower-case (EMaiL to Email).
	 * 
	 * @method ucfirst
	 * @param {String}
	 *            value to convert as ucfirst
	 * @returns converted string
	 */
	Handlebars.registerHelper('ucfirst', function(value)
	{
		return (value && typeof value === 'string') ? (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) : '';
	});

	/**
	 * Returns Contact short name
	 */
	Handlebars.registerHelper('contactShortName', function()
	{
		if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
		{

			var contact_properties = App_Contacts.contactDetailView.model.get('properties');

			if (App_Contacts.contactDetailView.model.get('type') == 'PERSON')
			{
				for ( var i = 0; i < contact_properties.length; i++)
				{

					if (contact_properties[i].name == "last_name")
						return contact_properties[i].value;
					else if (contact_properties[i].name == "first_name")
						return contact_properties[i].value;
				}
				return "Contact";
			}
			else
			{
				for ( var i = 0; i < contact_properties.length; i++)
				{
					if (contact_properties[i].name == "name")
						return contact_properties[i].value;
				}
				return "Company";
			}
		}
	});

	/**
	 * Returns workflow name surrounded by quotations if exists, otherwise this
	 */
	Handlebars.registerHelper('workflowName', function()
	{
		if (App_Workflows.workflow_model)
		{
			var workflowName = App_Workflows.workflow_model.get("name");
			return "\'" + workflowName + "\'";
		}

		return "this";
	});

	/**
	 * 
	 * @method task_property
	 * @param {String}
	 *            change property value in view
	 * @returns converted string
	 */
	Handlebars.registerHelper('task_property', function(value)
	{

		if (value == "FOLLOW_UP")
			return "Follow Up";
		else
			return ucfirst(value);

	});

	// Tip on using Gravar with JS:
	// http://www.deluxeblogtips.com/2010/04/get-gravatar-using-only-javascript.html
	/**
	 * Helper function to generate a html string as desired to show-up the
	 * tags-view
	 * 
	 * @method tagslist
	 * @param {Object}
	 *            tags array containing all tags
	 */
	Handlebars.registerHelper('tagslist', function(tags)
	{

		console.log(tags);
		var json = {};

		// Store tags in a json, starting letter as key
		for ( var i = 0; i < tags.length; i++)
		{

			var tag = tags[i].tag;
			// console.log(tag);
			var start = tag.charAt(0).toUpperCase();

			var array = new Array();

			// see if it is already present
			if (json[start] != undefined)
			{
				array = json[start];
			}

			array.push(tag);
			json[start] = array;

		}

		// To sort tags in case-insensitive order i.e. keys in json object
		var keys = Object.keys(json);
		keys.sort();

		// Sorts it based on characters and then draws it
		var html = "";

		for ( var i in keys)
		{

			var array = json[keys[i]];

			html += "<div class='tag-element'><div class='tag-key'>" + keys[i] + "</div> ";

			html += "<div class='tag-values'>";

			for ( var i = 0; i < array.length; i++)
			{
				var hrefTag = "#tags/" + array[i];

				html += ('<a href=\"' + hrefTag + '\" >' + array[i] + '</a> ');
			}
			html += "</div></div>";

		}

		return html;
	});
	
	Handlebars.registerHelper('setupTags', function(tags) {
		
		console.log(tags);
		var json = {};

		var keys = [];
		// Store tags in a json, starting letter as key
		for ( var i = 0; i < tags.length; i++)
		{
			var tag = tags[i].tag;
			var key = tag.charAt(0).toUpperCase();
			console.log(jQuery.inArray( key, keys ) + "key = : " + key);
			// console.log(tag);
			if(jQuery.inArray( key, keys ) == -1)
				keys.push(key);
		}

		// To sort tags in case-insensitive order i.e. keys in json object
		keys.sort();
		console.log(keys);
		var html = "";
		for ( var i in keys)
		{
			html += "<div class='tag-element' style='margin-right:10px'><div class='tag-key'>"+keys[i]+"</div><div class='tag-values' tag-alphabet=\""+keys[i]+"\"></div></div>";
		}
		console.log(html);
		return new Handlebars.SafeString(html);
	});

	// To show milestones as columns in deals
	Handlebars.registerHelper('deals_by_milestones', function(data)
	{
		var html = "";
		var count = Object.keys(data).length;
		$.each(data, function(key, value)
		{
			if(count == 1 && key == "")
			{
				html += '<div class="slate" style="padding:5px 2px;"><div class="slate-content" style="text-align:center;"><h3>You have no milestones defined</h3></div></div>';
			}
			else
			{
				html += "<div class='milestone-column'><p class='milestone-heading'><b>" + key + "</b></p><ul class='milestones' milestone='" + key + "'>";
				for ( var i in value)
				{
					html += "<li id='" + value[i].id + "'>" + getTemplate("opportunities-grid-view", value[i]) + "</li>";
				}
				html += "</ul></div>";
			}
		});
		return html;
	});
	
	// To show milestones as sortable list
	Handlebars.registerHelper('milestone_ul', function(data)
	{
		var html = "<ul class='milestone-value-list tagsinput' style='padding:1px;list-style:none;'>";
		if(data)
		{
			var milestones = data.split(",");
			for (var i in milestones)
			{
				html += "<li data='" + milestones[i] + "'><div><span>" + milestones[i] + "</span><a class='milestone-delete right' href='#'>&times</a></div></li>";
			}
		}
		html += "</ul>";
		return html;
	});

	/**
	 * Helper function to return date string from epoch time
	 */
	Handlebars.registerHelper('epochToHumanDate', function(format, date)
	{

		if (!format)
			format = "mmm dd yyyy HH:MM:ss";

		if (!date)
			return;

		
		if ((date / 100000000000) > 1)
		{
			console.log(new Date(parseInt(date)).format(format));
			return new Date(parseInt(date)).format(format, 0);
		}
		// date form milliseconds
		var d = new Date(parseInt(date) * 1000).format(format);

		return d

		// return $.datepicker.formatDate(format , new Date( parseInt(date) *
		// 1000));
	});

	/**
	 * Helper function to return task date (MM dd, ex: Jan 10 ) from epoch time
	 */
	Handlebars.registerHelper('epochToTaskDate', function(date)
	{

		var intMonth, intDay;

		// Verifies whether date is in milliseconds, then
		// no need to multiply with 1000
		if ((date / 100000000000) > 1)
		{
			intMonth = new Date(date).getMonth();
			intDay = new Date(date).getDate();
		}
		else
		{
			intMonth = new Date(parseInt(date) * 1000).getMonth();
			intDay = new Date(parseInt(date) * 1000).getDate();
		}
		var monthArray = [
				"Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"
		];

		return (monthArray[intMonth] + " " + intDay);
	});

	/**
	 * Helper function to return task color based on it's priority
	 */
	Handlebars.registerHelper('task_label_color', function(priority)
	{
		if (priority == 'HIGH')
			return 'important';

		if (priority == 'NORMAL')
			return 'info';

		if (priority == 'LOW')
			return 'success';
	});

	/**
	 * Helper function to return date (Jan 10, 2012) from epoch time (users
	 * table)
	 * 
	 * @param {Object}
	 *            info_json json object containing information about
	 *            createdtime, last logged in time etc..
	 * @param {String}
	 *            date_type specifies the type of date to return (created or
	 *            logged in)
	 */
	Handlebars.registerHelper('epochToDate', function(info_json, date_type)
	{

		var obj = JSON.parse(info_json);

		if (!obj[date_type])
			return "-"
		var intMonth = new Date(parseInt(obj[date_type]) * 1000).getMonth();
		var intDay = new Date(parseInt(obj[date_type]) * 1000).getDate();
		var intYear = new Date(parseInt(obj[date_type]) * 1000).getFullYear();

		var monthArray = [
				"Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"
		];

		return (monthArray[intMonth] + " " + intDay + ", " + intYear);
	});

	/**
	 * Returns currency symbol based on the currency value (deals)
	 */
    Handlebars.registerHelper('currencySymbol', function()
    {
        var value =  ((CURRENT_USER_PREFS.currency != null) ? CURRENT_USER_PREFS.currency : "USD-$");
		var symbol = ((value.length < 4) ? "$" : value.substring(4, value.length));
		return symbol;
    });

	/**
	 * Calculates the "pipeline" for deals based on their value and probability
	 * (value * probability)
	 * 
	 * @param {Number}
	 *            value of the deal
	 * @param {Number}
	 *            probability of the deal
	 */
	Handlebars.registerHelper('calculatePipeline', function(value, probability)
	{

		var pipeline = parseInt(value) * parseInt(probability) / 100;
		return pipeline;
	});

	/**
	 * Returns required log (time or message) from logs (campaign logs)
	 */
	Handlebars.registerHelper('getRequiredLog', function(log_array_string, name)
	{
		var logArray = JSON.parse(log_array_string);
		if (name == "t")
		{
			var readableTime = new Date(logArray[0][name] * 1000);
			return readableTime;
		}
		return logArray[0][name];
	});

	/**
	 * Returns table headings for custom contacts list view
	 */
	Handlebars.registerHelper('contactTableHeadings', function(item)
	{

		var el = "";
		$.each(App_Contacts.contactViewModel[item], function(index, element)
		{

			element = element.replace("_", " ")

			el = el.concat('<th>' + ucfirst(element) + '</th>');

		});

		return new Handlebars.SafeString(el);
	});

	/**
	 * Returns table headings for reports custom contacts list view
	 */
	Handlebars.registerHelper('reportsContactTableHeadings', function(item)
	{

		var el = "";
		$.each(REPORT[item], function(index, element)
		{

			if (element.indexOf("properties_") != -1)
				element = element.split("properties_")[1];

			element = element.replace("_", " ")

			el = el.concat('<th>' + ucfirst(element) + '</th>');

		});

		return new Handlebars.SafeString(el);
	});

	/**
	 * Helper function, which executes different templates (entity related)
	 * based on entity type. Here "this" reffers the current entity object.
	 * (used in timeline)
	 * 
	 */
	Handlebars.registerHelper('if_entity', function(item, options)
	{

		if (this.entity_type == item)
		{
			return options.fn(this);
		}
		if (!this.entity && this[item] != undefined)
		{
			return options.fn(this);
		}
	});

	/**
	 * Returns trigger type, by removing underscore and converting into
	 * lowercase, excluding first letter.
	 */
	Handlebars.registerHelper('titleFromEnums', function(value)
	{
		if (!value)
			return;

		var str = value.replace(/_/g, ' ');
		return ucfirst(str.toLowerCase());

	});

	Handlebars.registerHelper('triggerType', function(value)
	{
		if (value == 'ADD_SCORE')
			return value.replace('ADD_SCORE', 'Score (>=)');

		return titleFromEnums(value);
	});

	/**
	 * Returns notification type,by replacing 'has been' with underscore and
	 * converting into lowercase.
	 */
	Handlebars.registerHelper('if_notification_type', function()
	{

		// Makes 'CONTACT CREATED' To 'COMPANY CREATED'
		if (this.type == "COMPANY")
		{
			var arr = this.notification.split('_');
			var temp = ucfirst(arr[0].replace('CONTACT', 'COMPANY')) + " " + ucfirst(arr[1]);
			return " - " + temp;
		}

		// Replaces '_' with ' '
		var str = this.notification.replace(/_/, ' ');

		switch (str) {
		case "IS BROWSING":
			return str.toLowerCase() + " " + this.custom_value;

		case "CLICKED LINK":
			var customJSON = JSON.parse(this.custom_value);
			return str.toLowerCase() + " " + customJSON.url_clicked + " " + " of campaign " + "\"" + customJSON.workflow_name + "\"";

		case "OPENED EMAIL":
			var customJSON = JSON.parse(this.custom_value);
			
			if(customJSON.email_opened ===  "workflow")
				return str.toLowerCase() + " " + " of campaign " + "\"" + customJSON.workflow_name + "\"";
			
			return str.toLowerCase() + " with subject " + "\"" + customJSON.email_subject + "\"";

		case "CONTACT ADDED":
			return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);

		case "CONTACT DELETED":
			return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);

		case "DEAL CREATED":
			return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);

		case "DEAL CLOSED":
			return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);

		case "TAG ADDED":
			return " - " + "\"" + this.custom_value + "\" " + str.toLowerCase().split(' ')[0] + " has been " + str.toLowerCase().split(' ')[1];

		case "TAG DELETED":
			return " - " + "\"" + this.custom_value + "\" " + str.toLowerCase().split(' ')[0] + " has been " + str.toLowerCase().split(' ')[1];

		default:
			return str.toLowerCase();
		}
	});

	/**
	 * Converts Epoch Time to Human readable date of default format.Used for
	 * campaign-logs.
	 */
	Handlebars.registerHelper('epochToLogDate', function(logTime)
	{
		return new Date(logTime * 1000);
	});

	/**
	 * Returns country name from country code.
	 */
	Handlebars.registerHelper('getCountryName', function(countrycode)
	{
		// retrieves country name from code using country-from-code.js
		return getCode(countrycode);
	});

	/**
	 * Replace '+' symbols with space.Used in notification.
	 */
	Handlebars.registerHelper('replace_plus_symbol', function(name)
	{

		return name.replace(/\+/, ' ');
	});

	/**
	 * Removes forward slash. Makes A/B to AB. Used in contact-detail-campaigns
	 */
	Handlebars.registerHelper('removeSlash', function(value)
	{
		if (value == 'A/B')
			return value.replace(/\//, '');

		return value;
	});

	/**
	 * Displays all the properties of a contact in its detail view, excluding
	 * the function parameters (fname, lname, company etc..)
	 */
	Handlebars
			.registerHelper(
					'if_property',
					function(fname, lname, company, title, image, email, phone, website, address, options)
					{

						if (this.name != fname && this.name != lname && this.name != company && this.name != title && this.name != image && this.name != email && this.name != phone && this.name != website && this.name != address)
							return options.fn(this);
					});

	/**
	 * Counts the existence of property name which occurred multiple times.
	 */
	Handlebars.registerHelper('property_is_exists', function(name, properties, options)
	{

		if (getPropertyValue(properties, name))
			return options.fn(this);
		return options.inverse(this);
	});

	/*
	 * To add comma in between the elements.
	 */
	Handlebars.registerHelper('comma_in_between_property', function(value1, value2, properties, options)
	{

		if (getPropertyValue(properties, value1) && getPropertyValue(properties, value2))
			return ",";
	});

	Handlebars.registerHelper('property_subtype_is_exists', function(name, subtype, properties, options)
	{

		if (getPropertyValueBySubtype(properties, name, subtype))
			return options.fn(this);
		return options.inverse(this);
	});

	/**
	 * Displays multiple times occurred properties of a contact in its detail
	 * view in single entity
	 */
	Handlebars.registerHelper('multiple_Property_Element', function(name, properties, options)
	{

		var matching_properties_list = agile_crm_get_contact_properties_list(name)
		if (matching_properties_list.length > 0)
			return options.fn(matching_properties_list);
	});

	/**
	 * Converts address as comma seprated values and returns as handlebars safe
	 * string.
	 */
	Handlebars
			.registerHelper(
					'address_Element',
					function(properties)
					{
						var properties_count = 0;
						console.log("_____________________________________________________________");
						for ( var i = 0, l = properties.length; i < l; i++)
						{
							
							if (properties[i].name == "address")
							{
								var el = '<div style="display: inline-block; vertical-align: top;text-align:right;margin-top:0px" class="span3"><span><strong style="color:gray">Address</strong></span></div>';
								
								var address = {};
								try
								{
									address = JSON.parse(properties[i].value);
								}
								catch(err)
								{
									address['address'] = properties[i].value;									
								}

								// Gets properties (keys) count of given json
								// object
								var count = countJsonProperties(address);

								if(properties_count != 0)
							
									 el = el
                                     .concat('<div style="display:inline;padding-right: 10px;display: inline-block;padding-bottom: 2px; line-height: 20px;" class="span9 contact-detail-entity-list"><div style="padding-top:3px;"><span>');
								else
								el = el
                                .concat('<div style="display:inline;padding-right: 10px;display: inline-block;padding-bottom: 2px; line-height: 20px;" class="span9"><div><span>');
								
								$.each(address, function(key, val)
								{
									if (--count == 0)
									{
										el = el.concat(val + ".");
										return;
									}
									el = el.concat(val + ", ");
								});

								if (properties[i].subtype)
									el = el.concat(" <span class='label'>" + properties[i].subtype + "</span>");
								el = el.concat('</span></div></div>');
								return new Handlebars.SafeString(el);
							}
							else if(properties[i].name == "phone" || properties[i].name == "email")
							{
								++properties_count;
							}
						}
					});

	// To show related to contacts for contacts as well as companies
	Handlebars.registerHelper('related_to_contacts', function(data, options)
	{
		var el = "";
		var count = data.length;
		$.each(data, function(key, value)
		{
			var html = getTemplate("related-to-contacts", value);
			if (--count == 0)
			{
				el = el.concat(html);
				return;
			}
			el = el.concat(html + ", ");
		});
		return new Handlebars.SafeString(el);
	});

	// To show only one related to contacts or companies in deals
	Handlebars.registerHelper('related_to_one', function(data, options)
	{
		// return "<span>" + getTemplate("related-to-contacts", data[0]) +
		// "</span>";
		var el = "";
		var count = data.length;
		$.each(data, function(key, value)
		{
			if (key <= 3)
			{
				var html = getTemplate("related-to-contacts", value);
				if (--count == 0 || key == 3)
				{
					el = el.concat(html);
					return;
				}
				el = el.concat(html + ", ");
			}

		});
		return new Handlebars.SafeString(el);

	});

	/**
	 * To represent a number with commas in deals
	 */
	Handlebars.registerHelper('numberWithCommas', function(value)
	{
		if (value)
			return value.toFixed(2).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",").replace('.00', '');
	});

	/**
	 * Converts reports/view field element as comma seprated values and returns
	 * as handlebars safe string.
	 */
	Handlebars.registerHelper('field_Element', function(properties)
	{
		var el = "";
		var count = properties.length;

		$.each(properties, function(key, value)
		{

			if (value.indexOf("properties_") != -1)
				value = value.split("properties_")[1];
			else if (value.indexOf("custom_") != -1)
				value = value.split("custom_")[1];
			else if (value.indexOf("CUSTOM_") != -1)
				value = value.split("CUSTOM_")[1];
			else if (value == "created_time")
				value = "Created Date";
			else if (value == "updated_time")
				value = "Updated Date";

			value = value.replace("_", " ");

			if (--count == 0)
			{
				el = el.concat(value);
				return;
			}
			el = el.concat(value + ", ");
		});

		return new Handlebars.SafeString(el);
	});

	/**
	 * Converts string to JSON
	 */
	Handlebars.registerHelper('stringToJSON', function(object, key, options)
	{
		if (key)
		{
			try
			{
				object[key] = JSON.parse(object[key]);
			}
			finally
			{
				return options.fn(object[key]);
			}
		}

		try
		{
			return options.fn(JSON.parse(object));
		}
		catch (err)
		{
			return options.fn(object);
		}
	});

	/**
	 * Checks the existence of property name and prints value
	 */
	Handlebars.registerHelper('if_propertyName', function(pname, options)
	{
		for ( var i = 0; i < this.properties.length; i++)
		{
			if (this.properties[i].name == pname)
				return options.fn(this.properties[i]);
		}
		return options.inverse(this);
	});

	/*
	 * Gets company image from a contact object.
	 * 
	 * --If image uploaded, returns that ( the frame size requested ). --Else if
	 * url present, fetch icon from the url via Google S2 service (frame
	 * size=32x32) --Else return img/company.png ( the frame size requested ).
	 * 
	 * --CSS for frame is adjusted when fetching from url ( default padding =
	 * 4px , now 4+adjust ). --'onError' is an attribute (js function) fired
	 * when image fails to download, maybe due to remote servers being down It
	 * defaults to img/company.png which should be present in server as static
	 * file
	 * 
	 * Usage: e.g. <img {{getCompanyImage "40" "display:inline"}} class="..."
	 * ... >
	 * 
	 * This helper sets src,onError & style attribute. "40" is full frame size
	 * requested. Additional styles like "display:inline;" or "display:block;"
	 * can be specified in 2nd param.
	 * 
	 * @author Chandan
	 */
	Handlebars
			.registerHelper(
					'getCompanyImage',
					function(frame_size, additional_style)
					{

						var full_size = parseInt(frame_size); // size
						// requested,full
						// frame
						var size_diff = 4 + ((full_size - 32) / 2); // calculating
						// padding,
						// for small
						// favicon
						// 16x16 as
						// 32x32,
						// fill rest frame with padding

						// default when we can't find image uploaded or url to
						// fetch from
						var default_return = "src='img/company.png' style='width:" + full_size + "px; height=" + full_size + "px;" + additional_style + "'";

						// when the image from uploaded one or favicon can't be
						// fetched, then show company.png, adjust CSS ( if style
						// broken by favicon ).
						var error_fxn = "";

						for ( var i = 0; i < this.properties.length; i++)
						{
							if (this.properties[i].name == "image")
							{
								default_return = "src='" + this.properties[i].value + "' style='width:" + full_size + "px; height=" + full_size + "px;" + additional_style + ";'";
								// found uploaded image, break, no need to
								// lookup url

								error_fxn = "this.src='img/company.png'; this.onerror=null;";
								// no need to resize, company.png is of good
								// quality & can be scaled to this size

								break;
							}
							if (this.properties[i].name == "url")
							{
								default_return = "src='https://www.google.com/s2/favicons?domain=" + this.properties[i].value + "' " + "style='width:32px; height:32px; padding:" + size_diff + "px; " + additional_style + " ;'";
								// favicon fetch -- Google S2 Service, 32x32,
								// rest padding added

								error_fxn = "this.src='img/company.png'; " + "$(this).css('width','" + frame_size + "px'); $(this).css('height','" + frame_size + "px');" + "$(this).css('padding','4px'); this.onerror=null;";
								// resize needed as favicon is 16x16 & scaled to
								// just 32x32, company.png is adjusted on error
							}
						}
						// return safe string so that our html is not escaped
						return new Handlebars.SafeString(default_return + " onError=\"" + error_fxn + "\"");
					});

	/**
	 * Get appropriate link i.e. protocol://whatever.xxx. If no protocol
	 * present, assume http
	 */
	Handlebars.registerHelper('getHyperlinkFromURL', function(url)
	{

		if (url.match(/((http[s]|ftp|file):\/\/)/) != null)
			return url;
		return 'http://' + url;
	});

	// Get Count
	Handlebars.registerHelper('count', function()
	{
		return getCount(this);
	});
	
	Handlebars.registerHelper('contacts_count', function(){
		if (this[0] && this[0].count && (this[0].count != -1))
		{
			if(this[0].count > 9999 && readCookie('contact_filter'))
				return "(" + this[0].count + "+ Total)";
			
			return "(" + this[0].count + " Total)";
		}
		else
			return "(" + this.length + " Total)";
	})

	/**
	 * Converts string to JSON
	 */
	Handlebars.registerHelper('stringToJSON', function(object, key, options)
			{
				if (key)
				{
					try
					{
						object[key] = JSON.parse(object[key]);
						return options.fn(object[key]);
					}
					catch (err)
					{
						return options.fn(object[key]);
					}
				}

				return options.fn(JSON.parse(object));
			});

	/**
	 * Convert string to lower case
	 */
	Handlebars.registerHelper('toLowerCase', function(value)
	{
		if (!value)
			return;
		return value.toLowerCase();
	});

	/**
	 * Convert string to lower case
	 */
	Handlebars.registerHelper('toUpperCase', function(value)
	{
		if (!value)
			return;
		return value.toUpperCase();
	});

	/**
	 * Executes template, based on contact type (person or company)
	 */
	Handlebars.registerHelper('if_contact_type', function(ctype, options)
	{
		if (this.type == ctype)
		{
			return options.fn(this);
		}
	});

	/**
	 * Returns modified message for timeline logs
	 */
	Handlebars.registerHelper('tl_log_string', function(string)
	{

		return string.replace("Sending email From:", "Email sent From:");
	});

	/**
	 * Returns "Lead Score" of a contact, when it is greater than zero only
	 */
	Handlebars.registerHelper('lead_score', function(value)
	{
		if (this.lead_score > 0)
			return this.lead_score;
		else
			return "";
	});

	/**
	 * Returns task completion status (Since boolean false is not getting
	 * printed, converted it into string and returned.)
	 */
	Handlebars.registerHelper('task_status', function(status)
	{
		if (status)
			return true;

		// Return false as string as the template can not print boolean false
		return "false";

	});

	/**
	 * Compares the arguments (value and target) and executes the template based
	 * on the result (used in contacts typeahead)
	 */
	Handlebars.registerHelper('if_equals', function(value, target, options)
	{

		console.log("typeof target: " + typeof target + " target: " + target);
		console.log("typeof value: " + typeof value + " value: " + value);
		/*
		 * typeof is used beacuse !target returns true if it is empty string,
		 * when string is empty it should not go undefined
		 */
		if ((typeof target === "undefined") || (typeof value === "undefined"))
			return options.inverse(this);

		if (value.toString().trim() == target.toString().trim())
			return options.fn(this);
		else
			return options.inverse(this);
	});

	/**
	 * Compares the arguments (value and target) and executes the template based
	 * on the result (used in contacts typeahead)
	 */
	Handlebars.registerHelper('if_greater', function(value, target, options)
	{
		if (parseInt(target) > value)
			return options.inverse(this);
		else
			return options.fn(this);
	});
	

	/**
	 * Compares the arguments (value and target) and executes the template based
	 * on the result (used in contacts typeahead)
	 */
	Handlebars.registerHelper('if_less_than', function(value, target, options)
	{
		if (target < value)
			return options.inverse(this);
		else
			return options.fn(this);
	});

	Handlebars.registerHelper('campaigns_heading', function(value, options)
	{
		var val = 0;
		if (value && value[0] && value[0].count)
			val = value[0].count;

		if (val <= 20)
			return "Workflows";

		return "(" + val + " Total)";
	});

	/**
	 * Adds Custom Fields to forms, where this helper function is called
	 */
	Handlebars.registerHelper('show_custom_fields', function(custom_fields, properties)
	{

		var el = show_custom_fields_helper(custom_fields, properties);
		return new Handlebars.SafeString(fill_custom_field_values($(el), properties));

	});

	Handlebars.registerHelper('is_link', function(value, options)
	{

		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

		if (value.search(exp) != -1)
			return options.fn(this);
		else
			return options.inverse(this);
	});

	Handlebars.registerHelper('show_link_in_statement', function(value)
	{

		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

		try
		{
			value = value.replace(exp, "<a href='$1' target='_blank' class='cd_hyperlink'>$1</a>");
			return new Handlebars.SafeString(value);
		}
		catch (err)
		{
			return value;
		}

	});

	/**
	 * Returns table headings for custom contacts list view
	 */
	Handlebars.registerHelper('displayPlan', function(value)
	{

		return ucfirst(value).replaceAll("_", " ");

	});

	Handlebars.registerHelper('getCurrentContactProperty', function(value)
	{
		if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
		{
			var contact_properties = App_Contacts.contactDetailView.model.get('properties')
			console.log(App_Contacts.contactDetailView.model.toJSON());
			return getPropertyValue(contact_properties, value);
		}
	});

	Handlebars.registerHelper('safe_string', function(data)
	{

		data = data.replace(/\n/, "<br/>");
		return new Handlebars.SafeString(data);
	});

	Handlebars.registerHelper('string_to_date', function(format, date)
	{

		return new Date(date).format(format);
	});

	Handlebars.registerHelper('isArray', function(data, options)
	{
		if (isArray(data))
			return options.fn(this);
		return options.inverse(this);
	});

	Handlebars.registerHelper('is_string', function(data, options)
	{
		if (typeof data == "string")
			return options.fn(this);
		return options.inverse(this);

	});

	Handlebars.registerHelper("bindData", function(data)
	{

		return JSON.stringify(data);
	});

	Handlebars.registerHelper("getCurrentUserPrefs", function(options)
	{
		if (CURRENT_USER_PREFS)
			;
		return options.fn(CURRENT_USER_PREFS);
	});

	Handlebars.registerHelper("getCurrentDomain", function(options)
	{
		var url = window.location.host;

		var exp = /(\.)/;

		if (url.search(exp) >= 0)
			return url.split(exp)[0];

		return " ";
	});

	// Gets date in given range
	Handlebars.registerHelper('date-range', function(from_date_string, no_of_days, options)
	{
		var from_date = Date.parse(from_date_string);
		var to_date = Date.today().add({ days : parseInt(no_of_days) });
		return to_date.toString('MMMM d, yyyy') + " - " + from_date.toString('MMMM d, yyyy');

	});

	Handlebars.registerHelper("extractEmail", function(content, options)
	{

		console.log(content);

		return options.fn(content.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)[0]);
	});

	Handlebars.registerHelper('getCurrentContactPropertyBlock', function(value, options)
	{
		if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
		{
			var contact_properties = App_Contacts.contactDetailView.model.get('properties')
			console.log(App_Contacts.contactDetailView.model.toJSON());
			return options.fn(getPropertyValue(contact_properties, value));
		}
	});

	Handlebars.registerHelper('isDuplicateContactProperty', function(properties, key, options)
	{
		if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
		{
			var contact_properties = App_Contacts.contactDetailView.model.get('properties')
			var currentContactEntity = getPropertyValue(contact_properties, key);
			var contactEntity = getPropertyValue(properties, key);

			if (!currentContactEntity || !contactEntity)
			{
				currentContactEntity = getPropertyValue(contact_properties, "first_name") + " " + getPropertyValue(contact_properties, "last_name");
				contactEntity = getPropertyValue(properties, "first_name") + " " + getPropertyValue(properties, "last_name");
			}

			if (currentContactEntity == contactEntity)
				return options.fn(this);

			return options.inverse(this)
		}
	});

	Handlebars.registerHelper('containString', function(value, target, options)
	{
		if (target.search(value) != -1)
			return options.fn(this);

		return options.inverse(this);
	});

	Handlebars.registerHelper('numeric_operation', function(operand1, operand2, operator)
	{

		var operators = "/*-+";

		if (operators.indexOf(operator) == -1)
			return "";

		if (operator == "+")
			return operand1 + operand2;

		if (operator == "-")
			return operand1 - operand2;

		if (operator == "*")
			return operand1 * operand2;

		if (operator == "/")
			return operand1 / operand2;
	});

	Handlebars.registerHelper('check_length', function(content, length, options)
	{

		if (parseInt(content.length) > parseInt(length))
			return options.fn(this);

		return options.inverse(this);
	});

	Handlebars.registerHelper('check_json_length', function(content, length, options)
	{
		var json_length = 0;
		for ( var prop in content)
		{
			json_length++;
		}
		
		if (json_length == parseInt(length))
		{
			for ( var prop in content)
			{
				return options.fn({ property : prop, value : content[prop], last : true});
			}
		}

		return options.inverse(content);
	});
	
	Handlebars.registerHelper('iterate_json', function(context, options)
	{
		var result = "";
		var count = 0;
		var length = 0;
		for ( var prop in context)
		{
			length++;
		}

		for ( var prop in context)
		{
			count++;
			if (count == length)
				result = result + options.fn({ property : prop, value : context[prop], last : true });
			else
				result = result + options.fn({ property : prop, value : context[prop], last : false });

		}

		console.log(result);
		return result;
	});

	Handlebars.registerHelper('get_social_icon', function(name)
	{
		if (!name)
			return;

		var icon_json = { "TWITTER" : "icon-twitter-sign", "LINKEDIN" : "icon-linkedin-sign", "URL" : "icon-globe", "GOOGLE-PLUS" : "icon-google-plus-sign",
			"FACEBOOK" : "icon-facebook-sign", "GITHUB" : "icon-github", "FEED" : "icon-rss", "XING" : "icon-xing-sign", "SKYPE" : "icon-skype",
			"YOUTUBE" : "icon-youtube", "FLICKR" : "icon-flickr" };

		name = name.trim();

		if (icon_json[name])
			return icon_json[name];

		return "icon-globe";

	});

	Handlebars.registerHelper("each_with_index", function(array, options)
	{
		var buffer = "";
		for ( var i = 0, j = array.length; i < j; i++)
		{
			var item = array[i];

			// stick an index property onto the item, starting with 1, may make
			// configurable later
			item.index = i + 1;

			console.log(item);
			// show the inside of the block
			buffer += options.fn(item);
		}

		// return the finished buffer
		return buffer;

	});

	Handlebars.registerHelper('if_json', function(context, options)
	{

		try
		{
			var json = $.parseJSON(context);

			if (typeof json === 'object')
				return options.fn(this);
			return options.inverse(this);
		}
		catch (err)
		{
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper('add_tag', function(tag)
	{
		addTagAgile(tag);
	});

	Handlebars.registerHelper('set_up_dashboard_padcontent', function(key)
	{
		return new Handlebars.SafeString(getTemplate("empty-collection-model", CONTENT_JSON.dashboard[key]));
	});

	/**
	 * Removes surrounded square brackets
	 */
	Handlebars.registerHelper('removeSquareBrackets', function(value)
	{
		return value.replace(/[\[\]]+/, '');
	});

	/**
	 * Shows list of triggers separated by comma
	 */
	Handlebars.registerHelper('toLinkTrigger', function(context, options)
	{
		var ret = "";
		for ( var i = 0, j = context.length; i < j; i++)
		{
			ret = ret + options.fn(context[i]);

			// Avoid comma appending to last element
			if (i < j - 1)
			{
				ret = ret + ", ";
			}
			;
		}
		return ret;
	});

	// Gets minutes from milli seconds
	Handlebars.registerHelper('millSecondsToMinutes', function(timeInMill)
	{
		if (isNaN(timeInMill))
			return;
		var sec = timeInMill / 1000;
		var min = Math.floor(sec / 60);

		if (min < 1)
			return Math.ceil(sec) + " secs";

		var remainingSec = Math.ceil(sec % 60);

		return min + " mins, " + remainingSec + " secs";
	});

	Handlebars.registerHelper('if_overflow', function(content, div_height, options)
	{

		if (!content)
			return;

		console.log($('#Linkedin').width());
		content = content.trim();
		var element = $("<div style='width:" + $('#Linkedin').width() + "px;" + "word-break:normal;word-wrap:break-word;display:none;'>" + content + "</div>");

		$("#content").append(element);

		console.log(element.height() + " " + parseInt(div_height))
		if (element.height() > parseInt(div_height))
			return options.fn(this);
		return options.inverse(this);
	});

	/**
	 * To set up star rating in contacts listing
	 */
	Handlebars.registerHelper('setupRating', function(value)
	{

		var element = "";
		for ( var i = 0; i < 5; i++)
		{
			if (i < parseInt(value))
			{
				element = element.concat('<li style="display: inline;"><img src="img/star-on.png" alt="' + i + '"></li>');
				continue;
			}
			element = element.concat('<li style="display: inline;"><img src="img/star-off.png" alt="' + i + '"></li>');
		}
		return new Handlebars.SafeString(element);
	});

	/**
	 * Builds options to be shown in the table heading of CSV import. Also tries
	 * to match headings in select field
	 */
	Handlebars.registerHelper('setupCSVUploadOptions', function(key, context)
	{
		// console.log(context.toJSON());
		var template = $(getTemplate('csv_upload_options', context));

		// Replaces _ with spaces
		key = key.replace("_", " ");

		var isFound = false;

		// Iterates to create various combinations and check with the header
		for ( var i = 0; i < key.length - 3; i++)
		{
			template.find('option').each(function(index, element)
			{
				if ($(element).val().toLowerCase().indexOf(key) != -1)
				{
					isFound = true;
					$(element).attr("selected", true);
					return false;
				}
				else if ($(element).val().toLowerCase().indexOf(key.substr(0, key.length - i).toLowerCase()) != -1)
				{
					isFound = true;
					$(element).attr("selected", true);
					return false;
				}

			});
			if (isFound)
				break;
		}

		return new Handlebars.SafeString($('<div>').html(template).html());
	});

	/**
	 * Converts total seconds into hours, minutes and seconds. For e.g. 3600
	 * secs - 1hr 0 mins 0secs
	 */
	Handlebars.registerHelper('convertSecondsToHour', function(totalSec)
	{
		var hours = parseInt(totalSec / 3600) % 24;
		var minutes = parseInt(totalSec / 60) % 60;
		var seconds = totalSec % 60;

		// show only seconds if hours and mins are zero
		if (hours == 0 && minutes == 0)
			return (seconds + "s");

		// show mins and secs if hours are zero.
		if (hours == 0)
			return (minutes + "m ") + (seconds + "s");

		var result = (hours + "h ") + (minutes + "m ") + (seconds +"s");
		return result;
	});

	/**
	 * To check and return value of original referrer
	 */
	Handlebars.registerHelper('checkOriginalRef', function(original_ref)
	{

		if (!getCurrentContactProperty(original_ref))
			return "unknown";

		var url = getCurrentContactProperty(original_ref);
		url = url.split('/');
		url = (url[0] + '//' + url[2]);
		return new Handlebars.SafeString(
				'<a style="text-decoration: none" target="_blank" href="' + getCurrentContactProperty(original_ref) + '">' + url + '</a>');
	});

	/**
	 * To check google url and key words
	 */
	Handlebars.registerHelper('queryWords', function(original_ref)
	{
		if (getCurrentContactProperty(original_ref))
		{
			var turl = getCurrentContactProperty(original_ref);
			var rurl = 'www.google.';
			var uurl = turl.split('/');
			uurl = uurl[2];
			uurl = uurl.slice(0, 11);
			if (uurl === rurl)
			{
				turl = turl.split("&q=");
				turl = turl[1].split("+").join(" ");
				return new Handlebars.SafeString('( Keyword : ' + turl + ' )');
			}
			else
				return;
		}
	});

	/**
	 * Returns contact full name if last-name exists, otherwise only first_name
	 * for contact type PERSON. It returns company name for other contact type.
	 * 
	 */
	Handlebars.registerHelper('contact_name', function(properties, type)
	{

		if (type === 'PERSON')
		{
			for ( var i = 0; i < properties.length; i++)
			{

				// if last-name exists, return full name.
				if (properties[i].name === "last_name")
					return (getPropertyValue(properties, "first_name") + " " + properties[i].value);

				else if (properties[i].name === "first_name")
					return properties[i].value;
			}

			return "Contact";
		}

		// COMPANY type
		for ( var i = 0; i < properties.length; i++)
		{
			if (properties[i].name === "name")
				return properties[i].value;
		}
		return "Company";
	});
	
	/**
	 * Returns full name of contact. Use this when empty value is not acceptable.
	 * Takes care that, even when no names are defined, returns email(necessary for PERSON) or Company <id>.
	 * Calls function getContactName defined in agile-typeahead.js. Also typeahead uses this fxn to append values as tags.
	 */
	Handlebars.registerHelper('contact_name_necessary',function(contact)
	{
		return getContactName(contact);
	});
	
	/**
	 * To check if string is blank
	 */
	Handlebars.registerHelper('is_blank', function(value, options){
		value = value.trim();

		if(value == "")
			return options.fn(value);
		else
			return options.inverse(value);
	})
	
	/**
	 * Iterate through list of values (not json)
	 */
	Handlebars.registerHelper("each_with_index1", function(array, options)
			{
				console.log(array);
				var buffer = "";
				for ( var i = 0, j = array.length; i < j; i++)
				{
					var item = {};
					item["value"] = array[i];

					console.log(item);
					// stick an index property onto the item, starting with 1, may make
					// configurable later
					item["index"] = i + 1;

					console.log(item);
					// show the inside of the block
					buffer += options.fn(item);
				}

				// return the finished buffer
				return buffer;

			});
	
	/**
	 * Identifies EMAIL_SENT campaign-log string and splits the log string based on 
	 * '_aGiLeCrM' delimiter into To, From, Subject and Body.
	 * 
	 **/
	Handlebars.registerHelper("if_email_sent",function(object,key,options){
		
		// delimiter for campaign send-email log
		var _AGILE_CRM_DELIMITER = "_aGiLeCrM";
		
		// if log_type is EMAIL_SENT
		if(object[key] === "EMAIL_SENT")
		{
			// Splits logs message
			var email_fields = object["message"].split(_AGILE_CRM_DELIMITER, 4);
			
			// Json to apply for handlebar template
			var json = {};
			
			if(email_fields === undefined)
				return options.inverse(object);
			
			// Iterates inorder to insert each field into json
			for(var i=0;i<email_fields.length;i++)
			{
				// Splits based on colon. E.g "To: naresh@agilecrm.com"
				var arrcolon = email_fields[i].split(":");
				
				// Inserts LHS of colon as key. E.g., To
				var key = arrcolon[0];
				key=key.trim(); // if key starts with space, it can't accessible
				
				// Inserts RHS of colon as value. E.g., naresh@agilecrm.com
				var value = arrcolon.slice(1).join(":"); // join the remaining string based on colon, 
				                                        //only first occurence of colon is needed
				value = value.trim();
				
				json[key] = value;
			}
			
			// inserts time into json
			json.time = object["time"];

			// apply customized json to template.
			return options.fn(json);
		}	
		
		// if not EMAIL_SENT log, goto else in the template
		return options.inverse(object);
		
	});
	
	
	Handlebars.registerHelper('remove_spaces', function(value) {
		  return value.replace( / +/g, '');
		  
		 });
	
	
	/**
	 * Returns campaignStatus object from contact campaignStatus array having 
	 * same campaign-id. It is used to get start and completed time from array.
	 ***/
	Handlebars.registerHelper('if_same_campaign',function(object,data,options){
		
		var campaignStatusArray = object[data];
		
		// if campaignStatus key doesn't exist return.
		if (data === undefined || campaignStatusArray === undefined)
			return;
		
		for (var i=0, len = campaignStatusArray.length; i < len; i++)
			{
			   var current_campaign_id = campaignStatusArray[i].campaign_id;

			   // compares campaign-id of each element of array with 
			   // object's campaign-id
			   if (object.campaign_id === current_campaign_id)
			   {
				   // if equal, execute template current json
				   return options.fn(campaignStatusArray[i]);
			   }
			}
			
	});
	
	/**
	 * Returns campaign-id from one of the active subscribers collection.
	 **/
	Handlebars.registerHelper('get_campaign_id', function(object){
		
		if (object === undefined || object[0] === undefined)
			return;
		
		return object[0].campaign_id;

	});
	
	/**
	 * Returns other active campaigns in campaign-active subscribers.
	 **/
	Handlebars.registerHelper('if_other_active_campaigns',function(object,data,options){

		if (object === undefined || object[data] === undefined)
			return;
		
		var other_campaigns = {};
		var other_active_campaigns = [];
		var other_completed_campaigns=[];
		var campaignStatusArray = object[data];
		
		for (var i=0, len = campaignStatusArray.length; i < len; i++)
		{
			// neglect same campaign
			if (campaignStatusArray[i].campaign_id === object.campaign_id)
				continue;
			
			// push all other active campaigns
			if (campaignStatusArray[i].status.indexOf('ACTIVE') !== -1)
				other_active_campaigns.push(campaignStatusArray[i])
				
			// push all done campaigns
			if (campaignStatusArray[i].status.indexOf('DONE') !== -1)
				other_completed_campaigns.push(campaignStatusArray[i]);
		}
		
		other_campaigns["active"] = other_active_campaigns;
		other_campaigns["done"] = other_completed_campaigns;
		
		return options.fn(other_campaigns);
		
	});
	
     /**
      * Returns Contact Model from contactDetailView collection.
      * 
      **/
	Handlebars.registerHelper('contact_model',function(options){
		
		if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
		{
			
			// To show Active Campaigns list immediately after campaign assigned.
			if(CONTACT_ASSIGNED_TO_CAMPAIGN)
			{	
				CONTACT_ASSIGNED_TO_CAMPAIGN = false;
			
				// fetches updated contact json
				var contact_json = $.ajax(
					 {
					 type: 'GET',
					 url: '/core/api/contacts/'+ App_Contacts.contactDetailView.model.get('id'),
					 async:	false, 
					 dataType: 'json'
					 }).responseText;
			
				// Updates Contact Detail model
				App_Contacts.contactDetailView.model.set(JSON.parse(contact_json));
            
				return options.fn(JSON.parse(contact_json));
			}
			
			// if simply Campaigns tab clicked, use current collection
			return options.fn(App_Contacts.contactDetailView.model.toJSON());
		}
	});
	
	/**
	 * Returns json object of active and done subscribers from contact object's
	 * campaignStatus.
	 **/
	Handlebars.registerHelper('contact_campaigns',function(object, data,options){
		
		// if campaignStatus is not defined, return
		if (object === undefined || object[data] === undefined)
			return;

		// Temporary json to insert active and completed campaigns
		var campaigns = {};
		
		var active_campaigns = [];
		var completed_campaigns=[];
		
		// campaignStatus object of contact
		var campaignStatusArray = object[data];
		
		for (var i=0, len = campaignStatusArray.length; i < len; i++)
		{
			// push all active campaigns
			if (campaignStatusArray[i].status.indexOf('ACTIVE') !== -1)
				active_campaigns.push(campaignStatusArray[i])
				
			// push all done campaigns
			if (campaignStatusArray[i].status.indexOf('DONE') !== -1)
				completed_campaigns.push(campaignStatusArray[i]);
		}
		
		campaigns["active"] = active_campaigns;
		campaigns["done"] =  completed_campaigns;
		
		// apply obtained campaigns context within 
	    //contact_campaigns block
		return options.fn(campaigns);
	});
	
	/**
	 * Verifies given urls length and returns options hash based on 
	 * restricted count value.
	 * 
	 **/
	Handlebars.registerHelper("if_more_urls",function(url_json, url_json_length,options){
		var RESTRICT_URLS_COUNT = 3;
		var temp_urls_array = [];
		var context_json={};
	
		// If length is less than restricted, compile 
		// else block with given url_json
		if(url_json_length < RESTRICT_URLS_COUNT)
			return options.inverse(url_json);
		
		// Insert urls until restricted count reached
		for(var i=0; i< url_json.length; i++)
			{
				if(i === RESTRICT_URLS_COUNT)
					break;
				
				temp_urls_array.push(url_json[i]);
			}
			
		context_json.urls = temp_urls_array;
		
		// More remained
		context_json.more = url_json_length - RESTRICT_URLS_COUNT;
		
		return options.fn(context_json);
		
	});
	
});
/**
 * Loading spinner shown while loading
 */
var LOADING_HTML = '<img class="loading" style="padding-right:5px" src= "img/21-0.gif"></img>';

/**
 * Loading images shown which contacts are being fetched on page scroll
 */
var LOADING_ON_CURSOR = '<img class="loading" style="padding-right:5px" src= "img/ajax-loader-cursor.gif"></img>';

/**
 * Default image shown for contacts if image is not available
 */
var DEFAULT_GRAVATAR_url = "https://da4o37ei6ybbh.cloudfront.net/css/images/pic.png";

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for ( var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}

	return vars;
}

/**
 * Creates a select fields with the options fetched from the url specified,
 * fetches the collection from the url and creates a select element and appends
 * to the selectId sent, it takes the template to fill the values and also takes
 * a callback to deserialize the select field if form is being edited
 * 
 * @param selectId
 *            to append the options
 * @param url
 *            To fetch collection
 * @param parseKey
 *            parses the collection
 * @param callback
 *            to process select field after being created
 * @param template
 *            Template to create options
 */
function fillSelect(selectId, url, parseKey, callback, template, isUlDropdown, el, defaultSelectOption)
{
	// Fetch Collection from URL
	var collection_def = Backbone.Collection.extend({ url : url,
	/*
	 * parse : function(response) {
	 * 
	 * if (response && response[parseKey]) return response[parseKey];
	 * 
	 * return response; }
	 */
	});

	// Prepend Loading
	$loading = $(LOADING_HTML);
	$("#" + selectId).after(LOADING_HTML);

	// Creates a collection and fetches the data from the url set in collection
	var collection = new collection_def();

	// On successful fetch of collection loading symbol is removed and options
	// template is populated and appended in the selectId sent to the function
	collection.fetch({ success : function()
	{

		// Remove loading
		$('.loading').remove();

		// Delete prev options if any by verifying whether ul drop down or
		// select drop down
		if (isUlDropdown)
			$("#" + selectId, el).empty();
		else
		{
			if (!defaultSelectOption)
				defaultSelectOption = "Select...";

			$("#" + selectId, el).empty().append('<option class="default-select" value="">' + defaultSelectOption + '</option>');
		}

		// Iterates though each model in the collection and
		// populates the template using handlebars
		$.each(collection.toJSON(), function(index, model)
		{
			// Convert template into HTML
			var modelTemplate = Handlebars.compile(template);
			var optionsHTML = modelTemplate(model);
			$("#" + selectId, el).append(optionsHTML);
		});

		// If callback is present, it is called to deserialize
		// the select field
		if (callback && typeof (callback) === "function")
		{
			// execute the callback, passing parameters as
			// necessary
			callback();
		}
	}

	});
}

// Fill selects with tokenized data
/**
 * fillTokenizedSelect if similar to fillSelect, but data is not fetched it is
 * sent to the function which creates options based on the array of values sent.
 * It also includes callback function to deseriazlie
 * 
 * @param selectId
 *            to To append options
 * @param array
 *            list of values to be used to create options
 * @param callback
 *            function to be called after select if created
 */
function fillTokenizedSelect(selectId, array, callback)
{
	$("#" + selectId).empty().append('<option value="">Select...</option>');

	// Iterates though each element in array and creates a options to select
	// field and
	// appends to the id sent
	$.each(array, function(index, element)
	{
		$("#" + selectId).append('<option value=' + '"' + element + '">' + element + '</option>');
	});

	// If callback exists it is called after select field is created
	if (callback && typeof (callback) === "function")
	{
		// execute the callback, passing parameters as necessary
		callback();
	}
}

/**
 * Fills milestore in to dorpdown
 * 
 * @param ulId
 * @param array
 */
function fillMilestones(ulId, array)
{
	$("#" + ulId).empty();
	$.each(array, function(index, element)
	{
		$("#" + ulId).append('<a href="#"><li value=' + '"' + element + '">' + element + '</li></a>');
	});
}
function btnDropDown(contact_id, workflow_id)
{

}

/**
 * Removes the specified property from the contact
 */
function delete_contact_property(contact, propertyName)
{

	// Iterates through the properties of the contact, finds the property with
	// the name specified and removes the property from the contact
	for ( var index = 0; index < contact.properties.length; index++)
	{
		if (contact.properties[index].name == propertyName)
		{
			contact.properties.splice(index, 1);
			--index;
		}
	}
	return contact;
}

// Delete contact tag
/**
 * Removes a tag from the contact, tag name is to be specified to remove the tag
 */
function delete_contact_tag(contact, tagName)
{

	// Iterates though tags in the contact and removes the tag which matches the
	// tag name parameter of the function
	$.each(contact.tagsWithTime, function(index, tagObject)
	{
		if (tagObject.tag == tagName)
		{
			// Tag should be removed from tags also,
			// or deleted tag will be added again
			contact.tags.splice(index, 1);
			contact.tagsWithTime.splice(index, 1);
			return false;
		}
		contact.tags.push(tagObject.tag);
	});

	return contact;
}

/**
 * Adds a new tag to contact
 */
function add_contact_tags(contact, newTags)
{
	for ( var index = 0; index < newTags.length; index++)
	{
		contact.tags.push(newTags[index])
	}
	return contact;
}

/**
 * Creates a property json object
 * 
 * @param name
 * @param id
 * @param type
 */
function property_JSON(name, id, type)
{
	var json = {};

	if (type == undefined)
		json.type = "SYSTEM";
	else
		json.type = type;

	json.name = name;

	var elem = $('#' + id), elem_type = elem.attr('type'), elem_value;

	if (elem_type == 'checkbox')
		elem_value = elem.is(':checked') ? 'on' : 'off';
	else
		elem_value = elem.val();

	json.value = elem_value;
	return json;
}

// Sends post request using backbone model to given url. It is a generic
// function, can be called to save entity to database
function saveEntity(object, url, callback)
{
	var model = new Backbone.Model();
	model.url = url;
	model.save(object, { success : function(data)
	{
		if (callback && typeof (callback) === "function")
		{
			// execute the callback, passing parameters as necessary
			callback(data);
		}
	} });
}

/**
 * Returns GMT time.
 * 
 * @param date
 * @returns
 */
function getGMTTimeFromDate(date)
{
	var current_sys_date = new Date();
	console.log(new Date().getHours());
	console.log(new Date().getMinutes());
	console.log(new Date().getSeconds());
	console.log(date.getYear() + "," + date.getMonth() + "," + date.getDate())
	date = (new Date(date.getFullYear(), date.getMonth(), date.getDate(), current_sys_date.getHours(), current_sys_date.getMinutes(), current_sys_date
			.getSeconds(), current_sys_date.getMilliseconds()));

	console.log(date.getTime() + date.getTimezoneOffset());

	// Adding offset to date returns GMT time
	return date.getTime() + date.getTimezoneOffset();
}

/**
 * Returns local epoch time based form GMT time
 * 
 * @param time_in_milliseconds
 * @returns {Number}
 */
function getLocalTimeFromGMTMilliseconds(time_in_milliseconds)
{
	var date = new Date(parseInt(time_in_milliseconds));

	// Subtracting epoch offset from epoch time;
	return date.getTime() - date.getTimezoneOffset();
}

/**
 * Adds tag to 'OUR' domain.
 * 
 * @param tag
 */
function addTagAgile(tag)
{
	// Checks if tag is already available.
	if (checkTagAgile(tag))
		return;

	// Adds tag
	_agile.add_tag(tag, function(data)
	{
		Agile_Contact = data;
		if (!checkTagAgile(tag))
			Agile_Contact.tags.push(tag)
		set_profile_noty();
	});
}

// Checks if tag exists
function checkTagAgile(tag)
{

	console.log(Agile_Contact);
	if (Agile_Contact && Agile_Contact.tags)
		return Agile_Contact.tags.indexOf(tag) > -1;

	return false;
}
/**
 * md5.js deals with implementing the md5 cryptographic hash function 
 * which takes arbitrary-sized data and output a fixed-length (16) hash value.
 */
var Agile_MD5 = function (string) {

        function RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        function AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function F(x, y, z) {
            return (x & y) | ((~x) & z);
        }

        function G(x, y, z) {
            return (x & z) | (y & (~z));
        }

        function H(x, y, z) {
            return (x ^ y ^ z);
        }

        function I(x, y, z) {
            return (y ^ (x | (~z)));
        }

        function FF(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function GG(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function HH(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function II(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };

        function WordToHex(lValue) {
            var WordToHexValue = "",
                WordToHexValue_temp = "",
                lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        };

        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7,
            S12 = 12,
            S13 = 17,
            S14 = 22;
        var S21 = 5,
            S22 = 9,
            S23 = 14,
            S24 = 20;
        var S31 = 4,
            S32 = 11,
            S33 = 16,
            S34 = 23;
        var S41 = 6,
            S42 = 10,
            S43 = 15,
            S44 = 21;

        string = Utf8Encode(string);

        x = ConvertToWordArray(string);

        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;

        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }

        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

        return temp.toLowerCase();
    };!function(a){a(function(){a.support.transition=(function(){var b=(function(){var e=document.createElement("bootstrap"),d={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd",transition:"transitionend"},c;for(c in d){if(e.style[c]!==undefined){return d[c]}}}());return b&&{end:b}})()})}(window.jQuery);!function(c){var b='[data-dismiss="alert"]',a=function(d){c(d).on("click",b,this.close)};a.prototype.close=function(i){var h=c(this),f=h.attr("data-target"),g;if(!f){f=h.attr("href");f=f&&f.replace(/.*(?=#[^\s]*$)/,"")}g=c(f);i&&i.preventDefault();g.length||(g=h.hasClass("alert")?h:h.parent());g.trigger(i=c.Event("close"));if(i.isDefaultPrevented()){return}g.removeClass("in");function d(){g.trigger("closed").remove()}c.support.transition&&g.hasClass("fade")?g.on(c.support.transition.end,d):d()};c.fn.alert=function(d){return this.each(function(){var f=c(this),e=f.data("alert");if(!e){f.data("alert",(e=new a(this)))}if(typeof d=="string"){e[d].call(f)}})};c.fn.alert.Constructor=a;c(function(){c("body").on("click.alert.data-api",b,a.prototype.close)})}(window.jQuery);!function(b){var a=function(d,c){this.$element=b(d);this.options=b.extend({},b.fn.button.defaults,c)};a.prototype.setState=function(f){var h="disabled",c=this.$element,e=c.data(),g=c.is("input")?"val":"html";f=f+"Text";e.resetText||c.data("resetText",c[g]());c[g](e[f]||this.options[f]);setTimeout(function(){f=="loadingText"?c.addClass(h).attr(h,h):c.removeClass(h).removeAttr(h)},0)};a.prototype.toggle=function(){var c=this.$element.parent('[data-toggle="buttons-radio"]');c&&c.find(".active").removeClass("active");this.$element.toggleClass("active")};b.fn.button=function(c){return this.each(function(){var f=b(this),e=f.data("button"),d=typeof c=="object"&&c;if(!e){f.data("button",(e=new a(this,d)))}if(c=="toggle"){e.toggle()}else{if(c){e.setState(c)}}})};b.fn.button.defaults={loadingText:"loading..."};b.fn.button.Constructor=a;b(function(){b("body").on("click.button.data-api","[data-toggle^=button]",function(d){var c=b(d.target);if(!c.hasClass("btn")){c=c.closest(".btn")}c.button("toggle")})})}(window.jQuery);!function(a){var b=function(d,c){this.$element=a(d);this.options=c;this.options.slide&&this.slide(this.options.slide);this.options.pause=="hover"&&this.$element.on("mouseenter",a.proxy(this.pause,this)).on("mouseleave",a.proxy(this.cycle,this))};b.prototype={cycle:function(c){if(!c){this.paused=false}this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval));return this},to:function(g){var c=this.$element.find(".active"),d=c.parent().children(),e=d.index(c),f=this;if(g>(d.length-1)||g<0){return}if(this.sliding){return this.$element.one("slid",function(){f.to(g)})}if(e==g){return this.pause().cycle()}return this.slide(g>e?"next":"prev",a(d[g]))},pause:function(c){if(!c){this.paused=true}clearInterval(this.interval);this.interval=null;return this},next:function(){if(this.sliding){return}return this.slide("next")},prev:function(){if(this.sliding){return}return this.slide("prev")},slide:function(j,d){var l=this.$element.find(".active"),c=d||l[j](),i=this.interval,k=j=="next"?"left":"right",f=j=="next"?"first":"last",g=this,h=a.Event("slide");this.sliding=true;i&&this.pause();c=c.length?c:this.$element.find(".item")[f]();if(c.hasClass("active")){return}if(a.support.transition&&this.$element.hasClass("slide")){this.$element.trigger(h);if(h.isDefaultPrevented()){return}c.addClass(j);c[0].offsetWidth;l.addClass(k);c.addClass(k);this.$element.one(a.support.transition.end,function(){c.removeClass([j,k].join(" ")).addClass("active");l.removeClass(["active",k].join(" "));g.sliding=false;setTimeout(function(){g.$element.trigger("slid")},0)})}else{this.$element.trigger(h);if(h.isDefaultPrevented()){return}l.removeClass("active");c.addClass("active");this.sliding=false;this.$element.trigger("slid")}i&&this.cycle();return this}};a.fn.carousel=function(c){return this.each(function(){var f=a(this),e=f.data("carousel"),d=a.extend({},a.fn.carousel.defaults,typeof c=="object"&&c);if(!e){f.data("carousel",(e=new b(this,d)))}if(typeof c=="number"){e.to(c)}else{if(typeof c=="string"||(c=d.slide)){e[c]()}else{if(d.interval){e.cycle()}}}})};a.fn.carousel.defaults={interval:5000,pause:"hover"};a.fn.carousel.Constructor=b;a(function(){a("body").on("click.carousel.data-api","[data-slide]",function(h){var g=a(this),d,c=a(g.attr("data-target")||(d=g.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,"")),f=!c.data("modal")&&a.extend({},c.data(),g.data());c.carousel(f);h.preventDefault()})})}(window.jQuery);!function(a){var b=function(d,c){this.$element=a(d);this.options=a.extend({},a.fn.collapse.defaults,c);if(this.options.parent){this.$parent=a(this.options.parent)}this.options.toggle&&this.toggle()};b.prototype={constructor:b,dimension:function(){var c=this.$element.hasClass("width");return c?"width":"height"},show:function(){var f,c,e,d;if(this.transitioning){return}f=this.dimension();c=a.camelCase(["scroll",f].join("-"));e=this.$parent&&this.$parent.find("> .accordion-group > .in");if(e&&e.length){d=e.data("collapse");if(d&&d.transitioning){return}e.collapse("hide");d||e.data("collapse",null)}this.$element[f](0);this.transition("addClass",a.Event("show"),"shown");this.$element[f](this.$element[0][c])},hide:function(){var c;if(this.transitioning){return}c=this.dimension();this.reset(this.$element[c]());this.transition("removeClass",a.Event("hide"),"hidden");this.$element[c](0)},reset:function(c){var d=this.dimension();this.$element.removeClass("collapse")[d](c||"auto")[0].offsetWidth;this.$element[c!==null?"addClass":"removeClass"]("collapse");return this},transition:function(g,d,e){var f=this,c=function(){if(d.type=="show"){f.reset()}f.transitioning=0;f.$element.trigger(e)};this.$element.trigger(d);if(d.isDefaultPrevented()){return}this.transitioning=1;this.$element[g]("in");a.support.transition&&this.$element.hasClass("collapse")?this.$element.one(a.support.transition.end,c):c()},toggle:function(){this[this.$element.hasClass("in")?"hide":"show"]()}};a.fn.collapse=function(c){return this.each(function(){var f=a(this),e=f.data("collapse"),d=typeof c=="object"&&c;if(!e){f.data("collapse",(e=new b(this,d)))}if(typeof c=="string"){e[c]()}})};a.fn.collapse.defaults={toggle:true};a.fn.collapse.Constructor=b;a(function(){a("body").on("click.collapse.data-api","[data-toggle=collapse]",function(h){var g=a(this),c,f=g.attr("data-target")||h.preventDefault()||(c=g.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,""),d=a(f).data("collapse")?"toggle":g.data();a(f).collapse(d)})})}(window.jQuery);!function(d){var b='[data-toggle="dropdown"]',a=function(f){var e=d(f).on("click.dropdown.data-api",this.toggle);d("html").on("click.dropdown.data-api",function(){e.parent().removeClass("open")})};a.prototype={constructor:a,toggle:function(j){var i=d(this),h,f,g;if(i.is(".disabled, :disabled")){return}f=i.attr("data-target");if(!f){f=i.attr("href");f=f&&f.replace(/.*(?=#[^\s]*$)/,"")}h=d(f);h.length||(h=i.parent());g=h.hasClass("open");c();if(!g){h.toggleClass("open")}return false}};function c(){d(b).parent().removeClass("open")}d.fn.dropdown=function(e){return this.each(function(){var g=d(this),f=g.data("dropdown");if(!f){g.data("dropdown",(f=new a(this)))}if(typeof e=="string"){f[e].call(g)}})};d.fn.dropdown.Constructor=a;d(function(){d("html").on("click.dropdown.data-api",c);d("body").on("click.dropdown",".dropdown form",function(f){f.stopPropagation()}).on("click.dropdown.data-api",b,a.prototype.toggle)})}(window.jQuery);!function(e){var a=function(i,h){this.options=h;this.$element=e(i).delegate('[data-dismiss="modal"]',"click.dismiss.modal",e.proxy(this.hide,this))};a.prototype={constructor:a,toggle:function(){return this[!this.isShown?"show":"hide"]()},show:function(){var h=this,i=e.Event("show");this.$element.trigger(i);if(this.isShown||i.isDefaultPrevented()){return}e("body").addClass("modal-open");this.isShown=true;d.call(this);c.call(this,function(){var j=e.support.transition&&h.$element.hasClass("fade");if(!h.$element.parent().length){h.$element.appendTo(document.body)}h.$element.show();if(j){h.$element[0].offsetWidth}h.$element.addClass("in");j?h.$element.one(e.support.transition.end,function(){h.$element.trigger("shown")}):h.$element.trigger("shown")})},hide:function(i){i&&i.preventDefault();var h=this;i=e.Event("hide");this.$element.trigger(i);if(!this.isShown||i.isDefaultPrevented()){return}this.isShown=false;e("body").removeClass("modal-open");d.call(this);this.$element.removeClass("in");e.support.transition&&this.$element.hasClass("fade")?g.call(this):f.call(this)}};function g(){var h=this,i=setTimeout(function(){h.$element.off(e.support.transition.end);f.call(h)},500);this.$element.one(e.support.transition.end,function(){clearTimeout(i);f.call(h)})}function f(h){this.$element.hide().trigger("hidden");c.call(this)}function c(k){var j=this,i=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var h=e.support.transition&&i;this.$backdrop=e('<div class="modal-backdrop '+i+'" />').appendTo(document.body);if(this.options.backdrop!="static"){this.$backdrop.click(e.proxy(this.hide,this))}if(h){this.$backdrop[0].offsetWidth}this.$backdrop.addClass("in");h?this.$backdrop.one(e.support.transition.end,k):k()}else{if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");e.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(e.support.transition.end,e.proxy(b,this)):b.call(this)}else{if(k){k()}}}}function b(){this.$backdrop.remove();this.$backdrop=null}function d(){var h=this;if(this.isShown&&this.options.keyboard){e(document).on("keyup.dismiss.modal",function(i){i.which==27&&h.hide()})}else{if(!this.isShown){e(document).off("keyup.dismiss.modal")}}}e.fn.modal=function(h){return this.each(function(){var k=e(this),j=k.data("modal"),i=e.extend({},e.fn.modal.defaults,k.data(),typeof h=="object"&&h);if(!j){k.data("modal",(j=new a(this,i)))}if(typeof h=="string"){j[h]()}else{if(i.show){j.show()}}})};e.fn.modal.defaults={backdrop:true,keyboard:true,show:true};e.fn.modal.Constructor=a;e(function(){e("body").on("click.modal.data-api",'[data-toggle="modal"]',function(l){var k=e(this),i,h=e(k.attr("data-target")||(i=k.attr("href"))&&i.replace(/.*(?=#[^\s]+$)/,"")),j=h.data("modal")?"toggle":e.extend({},h.data(),k.data());l.preventDefault();h.modal(j)})})}(window.jQuery);!function(b){var a=function(d,c){this.init("tooltip",d,c)};a.prototype={constructor:a,init:function(f,e,d){var g,c;this.type=f;this.$element=b(e);this.options=this.getOptions(d);this.enabled=true;if(this.options.trigger!="manual"){g=this.options.trigger=="hover"?"mouseenter":"focus";c=this.options.trigger=="hover"?"mouseleave":"blur";this.$element.on(g,this.options.selector,b.proxy(this.enter,this));this.$element.on(c,this.options.selector,b.proxy(this.leave,this))}this.options.selector?(this._options=b.extend({},this.options,{trigger:"manual",selector:""})):this.fixTitle()},getOptions:function(c){c=b.extend({},b.fn[this.type].defaults,c,this.$element.data());if(c.delay&&typeof c.delay=="number"){c.delay={show:c.delay,hide:c.delay}}return c},enter:function(d){var c=b(d.currentTarget)[this.type](this._options).data(this.type);if(!c.options.delay||!c.options.delay.show){return c.show()}clearTimeout(this.timeout);c.hoverState="in";this.timeout=setTimeout(function(){if(c.hoverState=="in"){c.show()}},c.options.delay.show)},leave:function(d){var c=b(d.currentTarget)[this.type](this._options).data(this.type);if(this.timeout){clearTimeout(this.timeout)}if(!c.options.delay||!c.options.delay.hide){return c.hide()}c.hoverState="out";this.timeout=setTimeout(function(){if(c.hoverState=="out"){c.hide()}},c.options.delay.hide)},show:function(){var g,c,i,e,h,d,f;if(this.hasContent()&&this.enabled){g=this.tip();this.setContent();if(this.options.animation){g.addClass("fade")}d=typeof this.options.placement=="function"?this.options.placement.call(this,g[0],this.$element[0]):this.options.placement;c=/in/.test(d);g.remove().css({top:0,left:0,display:"block"}).appendTo(c?this.$element:document.body);i=this.getPosition(c);e=g[0].offsetWidth;h=g[0].offsetHeight;switch(c?d.split(" ")[1]:d){case"bottom":f={top:i.top+i.height,left:i.left+i.width/2-e/2};break;case"top":f={top:i.top-h,left:i.left+i.width/2-e/2};break;case"left":f={top:i.top+i.height/2-h/2,left:i.left-e};break;case"right":f={top:i.top+i.height/2-h/2,left:i.left+i.width};break}g.css(f).addClass(d).addClass("in")}},isHTML:function(c){return typeof c!="string"||(c.charAt(0)==="<"&&c.charAt(c.length-1)===">"&&c.length>=3)||/^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(c)},setContent:function(){var d=this.tip(),c=this.getTitle();d.find(".tooltip-inner")[this.isHTML(c)?"html":"text"](c);d.removeClass("fade in top bottom left right")},hide:function(){var c=this,d=this.tip();d.removeClass("in");function e(){var f=setTimeout(function(){d.off(b.support.transition.end).remove()},500);d.one(b.support.transition.end,function(){clearTimeout(f);d.remove()})}b.support.transition&&this.$tip.hasClass("fade")?e():d.remove()},fixTitle:function(){var c=this.$element;if(c.attr("title")||typeof(c.attr("data-original-title"))!="string"){c.attr("data-original-title",c.attr("title")||"").removeAttr("title")}},hasContent:function(){return this.getTitle()},getPosition:function(c){return b.extend({},(c?{top:0,left:0}:this.$element.offset()),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight})},getTitle:function(){var e,c=this.$element,d=this.options;e=c.attr("data-original-title")||(typeof d.title=="function"?d.title.call(c[0]):d.title);return e},tip:function(){return this.$tip=this.$tip||b(this.options.template)},validate:function(){if(!this.$element[0].parentNode){this.hide();this.$element=null;this.options=null}},enable:function(){this.enabled=true},disable:function(){this.enabled=false},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(){this[this.tip().hasClass("in")?"hide":"show"]()}};b.fn.tooltip=function(c){return this.each(function(){var f=b(this),e=f.data("tooltip"),d=typeof c=="object"&&c;if(!e){f.data("tooltip",(e=new a(this,d)))}if(typeof c=="string"){e[c]()}})};b.fn.tooltip.Constructor=a;b.fn.tooltip.defaults={animation:true,placement:"top",selector:false,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover",title:"",delay:0}}(window.jQuery);!function(b){var a=function(d,c){this.init("popover",d,c)};a.prototype=b.extend({},b.fn.tooltip.Constructor.prototype,{constructor:a,setContent:function(){var e=this.tip(),d=this.getTitle(),c=this.getContent();e.find(".popover-title")[this.isHTML(d)?"html":"text"](d);e.find(".popover-content > *")[this.isHTML(c)?"html":"text"](c);e.removeClass("fade top bottom left right in")},hasContent:function(){return this.getTitle()||this.getContent()},getContent:function(){var d,c=this.$element,e=this.options;d=c.attr("data-content")||(typeof e.content=="function"?e.content.call(c[0]):e.content);return d},tip:function(){if(!this.$tip){this.$tip=b(this.options.template)}return this.$tip}});b.fn.popover=function(c){return this.each(function(){var f=b(this),e=f.data("popover"),d=typeof c=="object"&&c;if(!e){f.data("popover",(e=new a(this,d)))}if(typeof c=="string"){e[c]()}})};b.fn.popover.Constructor=a;b.fn.popover.defaults=b.extend({},b.fn.tooltip.defaults,{placement:"right",content:"",template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'})}(window.jQuery);!function(b){function a(f,e){var g=b.proxy(this.process,this),c=b(f).is("body")?b(window):b(f),d;this.options=b.extend({},b.fn.scrollspy.defaults,e);this.$scrollElement=c.on("scroll.scroll.data-api",g);this.selector=(this.options.target||((d=b(f).attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""))||"")+" .nav li > a";this.$body=b("body");this.refresh();this.process()}a.prototype={constructor:a,refresh:function(){var c=this,d;this.offsets=b([]);this.targets=b([]);d=this.$body.find(this.selector).map(function(){var f=b(this),e=f.data("target")||f.attr("href"),g=/^#\w/.test(e)&&b(e);return(g&&e.length&&[[g.position().top,e]])||null}).sort(function(f,e){return f[0]-e[0]}).each(function(){c.offsets.push(this[0]);c.targets.push(this[1])})},process:function(){var h=this.$scrollElement.scrollTop()+this.options.offset,e=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,g=e-this.$scrollElement.height(),f=this.offsets,c=this.targets,j=this.activeTarget,d;if(h>=g){return j!=(d=c.last()[0])&&this.activate(d)}for(d=f.length;d--;){j!=c[d]&&h>=f[d]&&(!f[d+1]||h<=f[d+1])&&this.activate(c[d])}},activate:function(e){var d,c;this.activeTarget=e;b(this.selector).parent(".active").removeClass("active");c=this.selector+'[data-target="'+e+'"],'+this.selector+'[href="'+e+'"]';d=b(c).parent("li").addClass("active");if(d.parent(".dropdown-menu")){d=d.closest("li.dropdown").addClass("active")}d.trigger("activate")}};b.fn.scrollspy=function(c){return this.each(function(){var f=b(this),e=f.data("scrollspy"),d=typeof c=="object"&&c;if(!e){f.data("scrollspy",(e=new a(this,d)))}if(typeof c=="string"){e[c]()}})};b.fn.scrollspy.Constructor=a;b.fn.scrollspy.defaults={offset:10};b(function(){b('[data-spy="scroll"]').each(function(){var c=b(this);c.scrollspy(c.data())})})}(window.jQuery);!function(b){var a=function(c){this.element=b(c)};a.prototype={constructor:a,show:function(){var i=this.element,f=i.closest("ul:not(.dropdown-menu)"),d=i.attr("data-target"),g,c,h;if(!d){d=i.attr("href");d=d&&d.replace(/.*(?=#[^\s]*$)/,"")}if(i.parent("li").hasClass("active")){return}g=f.find(".active a").last()[0];h=b.Event("show",{relatedTarget:g});i.trigger(h);if(h.isDefaultPrevented()){return}c=b(d);this.activate(i.parent("li"),f);this.activate(c,c.parent(),function(){i.trigger({type:"shown",relatedTarget:g})})},activate:function(e,d,h){var c=d.find("> .active"),g=h&&b.support.transition&&c.hasClass("fade");function f(){c.removeClass("active").find("> .dropdown-menu > .active").removeClass("active");e.addClass("active");if(g){e[0].offsetWidth;e.addClass("in")}else{e.removeClass("fade")}if(e.parent(".dropdown-menu")){e.closest("li.dropdown").addClass("active")}h&&h()}g?c.one(b.support.transition.end,f):f();c.removeClass("in")}};b.fn.tab=function(c){return this.each(function(){var e=b(this),d=e.data("tab");if(!d){e.data("tab",(d=new a(this)))}if(typeof c=="string"){d[c]()}})};b.fn.tab.Constructor=a;b(function(){b("body").on("click.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(c){c.preventDefault();b(this).tab("show")})})}(window.jQuery);!function(a){var b=function(d,c){this.$element=a(d);this.options=a.extend({},a.fn.typeahead.defaults,c);this.matcher=this.options.matcher||this.matcher;this.render=this.options.render||this.render;this.sorter=this.options.sorter||this.sorter;this.highlighter=this.options.highlighter||this.highlighter;this.updater=this.options.updater||this.updater;this.hide=this.options.hide||this.hide;this.blur=this.options.blur||this.blur;this.$menu=a(this.options.menu).appendTo("body");this.source=this.options.source;this.shown=false;this.listen()};b.prototype={constructor:b,select:function(){var c=this.$menu.find(".active").attr("data-value");this.$element.val(this.updater(c)).change();return this.hide()},updater:function(c){return c},show:function(){var c=a.extend({},this.$element.offset(),{height:this.$element[0].offsetHeight});this.$menu.css({top:c.top+c.height,left:c.left});this.$menu.show();this.shown=true;return this},hide:function(){this.$menu.hide();this.shown=false;return this},lookup:function(d){var c;this.query=this.$element.val();if(!this.query||this.query.length<this.options.minLength){return this.shown?this.hide():this}c=a.isFunction(this.source)?this.source(this.query,a.proxy(this.process,this)):this.source;return c?this.process(c):this},process:function(c){var d=this;c=a.grep(c,function(e){return d.matcher(e)});c=this.sorter(c);if(!c.length){return this.shown?this.hide():this}return this.render(c.slice(0,this.options.items)).show()},matcher:function(c){return ~c.toLowerCase().indexOf(this.query.toLowerCase())},sorter:function(e){var f=[],d=[],c=[],g;while(g=e.shift()){if(!g.toLowerCase().indexOf(this.query.toLowerCase())){f.push(g)}else{if(~g.indexOf(this.query)){d.push(g)}else{c.push(g)}}}return f.concat(d,c)},highlighter:function(c){var d=this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&");return c.replace(new RegExp("("+d+")","ig"),function(e,f){return"<strong>"+f+"</strong>"})},render:function(c){var d=this;c=a(c).map(function(e,f){e=a(d.options.item).attr("data-value",f);e.find("a").html(d.highlighter(f));return e[0]});c.first().addClass("active");this.$menu.html(c);return this},next:function(d){var e=this.$menu.find(".active").removeClass("active"),c=e.next();if(!c.length){c=a(this.$menu.find("li")[0])}c.addClass("active")},prev:function(d){var e=this.$menu.find(".active").removeClass("active"),c=e.prev();if(!c.length){c=this.$menu.find("li").last()}c.addClass("active")},listen:function(){this.$element.on("blur",a.proxy(this.blur,this)).on("keypress",a.proxy(this.keypress,this)).on("keyup",a.proxy(this.keyup,this));if(a.browser.webkit||a.browser.msie){this.$element.on("keydown",a.proxy(this.keydown,this))}this.$menu.on("click",a.proxy(this.click,this)).on("mouseenter","li",a.proxy(this.mouseenter,this))},move:function(c){if(!this.shown){return}switch(c.keyCode){case 9:case 13:case 27:c.preventDefault();break;case 38:c.preventDefault();this.prev();break;case 40:c.preventDefault();this.next();break}c.stopPropagation()},keydown:function(c){this.suppressKeyPressRepeat=!~a.inArray(c.keyCode,[40,38,9,13,27]);this.move(c)},keypress:function(c){if(this.suppressKeyPressRepeat){return}this.move(c)},keyup:function(c){switch(c.keyCode){case 40:case 38:break;case 9:case 13:if(!this.shown){return}this.select();break;case 27:if(!this.shown){return}this.hide();break;default:this.lookup()}c.stopPropagation();c.preventDefault()},blur:function(d){var c=this;setTimeout(function(){c.hide()},150)},click:function(c){c.stopPropagation();c.preventDefault();this.select()},mouseenter:function(c){this.$menu.find(".active").removeClass("active");a(c.currentTarget).addClass("active")}};a.fn.typeahead=function(c){return this.each(function(){var f=a(this),e=f.data("typeahead"),d=typeof c=="object"&&c;if(!e){f.data("typeahead",(e=new b(this,d)))}if(typeof c=="string"){e[c]()}})};a.fn.typeahead.defaults={source:[],items:8,menu:'<ul class="typeahead dropdown-menu"></ul>',item:'<li><a href="#"></a></li>',minLength:1};a.fn.typeahead.Constructor=b;a(function(){a("body").on("focus.typeahead.data-api",'[data-provide="typeahead"]',function(d){var c=a(this);if(c.data("typeahead")){return}d.preventDefault();c.typeahead(c.data())})})}(window.jQuery);function agile_setAccount(b,a){agile_id.set(b,a);agile_setEmailFromUrl()}function agile_setEmailFromUrl(){if(window.location.href.search("fwd=cd")!==-1){try{var a=decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]"+encodeURI("data").replace(/[\.\+\*]/g,"\\$&")+"(?:\\=([^&]*))?)?.*$","i"),"$1"));if(a){agile_guid.set_email(JSON.parse(a).email)}}catch(b){console.log(b.message)}}}var _agile={set_account:function(b,a){agile_setAccount(b,a)},set_email:function(a){agile_setEmail(a)},track_page_view:function(a){agile_trackPageview(a)},create_contact:function(a,b){agile_createContact(a,b)},get_contact:function(a,b){agile_getContact(a,b)},delete_contact:function(a,b){agile_deleteContact(a,b)},add_tag:function(b,c,a){agile_addTag(b,c,a)},remove_tag:function(b,c,a){agile_removeTag(b,c,a)},add_score:function(b,c,a){agile_addScore(b,c,a)},subtract_score:function(b,c,a){agile_subtractScore(b,c,a)},add_note:function(b,c,a){agile_addNote(b,c,a)},set_property:function(b,c,a){agile_setProperty(b,c,a)},add_task:function(b,c,a){agile_addTask(b,c,a)},add_deal:function(b,c,a){agile_addDeal(b,c,a)},get_score:function(b,a){agile_getScore(b,a)},get_tags:function(b,a){agile_getTags(b,a)},get_notes:function(b,a){agile_getNotes(b,a)},get_tasks:function(b,a){agile_getTasks(b,a)},get_deals:function(b,a){agile_getDeals(b,a)},add_campaign:function(b,c,a){agile_addCampaign(b,c,a)},get_campaigns:function(b,a){agile_getCampaigns(b,a)},get_campaign_logs:function(b,a){agile_getCampaignlogs(b,a)},get_workflows:function(a){agile_getWorkflows(a)},get_milestones:function(a){agile_getMilestones(a)},update_contact:function(b,c,a){agile_updateContact(b,c,a)},get_email:function(a){agile_getEmail(a)},create_company:function(a,b){agile_createCompany(a,b)},get_property:function(b,c,a){agile_getProperty(b,c,a)},remove_property:function(b,c,a){agile_removeProperty(b,c,a)},add_property:function(b,c,a){agile_setProperty(b,c,a)}};function agile_addCampaign(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="data={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/contacts/add-campaign?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_getCampaigns(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-campaigns?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}function agile_getCampaignlogs(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-campaign-logs?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}function agile_getWorkflows(b){var a=agile_id.getURL()+"/contacts/get-workflows?callback=?&id="+agile_id.get();agile_json(a,b)}function agile_createContact(a,g){var e=[];for(var f in a){if(a.hasOwnProperty(f)&&f!="tags"){e.push(agile_propertyJSON(f,a[f]))}}var d="original_ref";e.push(agile_propertyJSON(d,agile_read_cookie(agile_guid.cookie_original_ref)));var c={};c.properties=e;if(a.tags){var i=a.tags;var b=i.trim().replace("/ /g"," ");b=i.replace("/, /g",",");c.tags=b.split(",")}var h=agile_id.getURL()+"/contacts?callback=?&id="+agile_id.get()+"&contact="+encodeURIComponent(JSON.stringify(c));agile_json(h,g)}function agile_deleteContact(b,c){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contact/delete?callback=?&id="+agile_id.get()+"&email="+encodeURIComponent(b);agile_json(a,c)}function agile_getContact(b,d){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var c="email={0}".format(encodeURIComponent(b));var a=agile_id.getURL()+"/contact/email?callback=?&id="+agile_id.get()+"&"+c;agile_json(a,d)}function agile_updateContact(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="data={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/contact/update?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_createCompany(e,f){var d=[];for(var c in e){if(e.hasOwnProperty(c)){d.push(agile_propertyJSON(c,e[c]))}}var b={};b.properties=d;var a=agile_id.getURL()+"/company?callback=?&id="+agile_id.get()+"&data="+encodeURIComponent(JSON.stringify(b));agile_json(a,f)}function agile_propertyJSON(a,d,c){var b={};if(c==undefined){b.type="SYSTEM"}else{b.type=c}b.name=a;b.value=d;return b}function agile_json(a,c){var b="json"+(Math.random()*100).toString().replace(/\./g,"");window[b]=function(d){if(d.error){if(c&&typeof(c.error)=="function"){c.error(d)}return}if(c&&typeof(c.success)=="function"){c.success(d)}if(c&&typeof(c)=="function"){c(d)}};document.getElementsByTagName("body")[0].appendChild((function(){var d=document.createElement("script");d.type="text/javascript";d.src=a.replace("callback=?","callback="+b);return d})())}String.prototype.format=function(){var a=arguments;return this.replace(/{(\d+)}/g,function(b,c){return typeof a[c]!="undefined"?a[c]:b})};function agile_addDeal(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="opportunity={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/opportunity?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_getDeals(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-deals?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}function agile_setEmail(a){agile_guid.set_email(a)}function agile_getEmail(c){var b=agile_guid.get_email();var a=agile_id.getURL()+"/email?callback=?&id="+agile_id.get()+"&email="+encodeURIComponent(b);agile_json(a,c)}var agile_guid={init:function(){this.cookie_name="agile-crm-guid";this.cookie_email="agile-email";this.cookie_original_ref="agile-original-referrer"},random:function(){var a=function(){return(((1+Math.random())*65536)|0).toString(16).substring(1)};return(a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a())},get:function(){var a=agile_read_cookie(this.cookie_name);if(!a){a=this.generate()}return a},generate:function(){guid=this.random();agile_create_cookie(this.cookie_name,guid,365*5);this.set_original_referrer();return guid},reset:function(){agile_create_cookie(this.cookie_name,"",-1)},set_email:function(a){var b=agile_read_cookie(this.cookie_email);if(!b||(b!=a)){this.email=a;if(b){this.reset();agile_session.reset()}agile_create_cookie(this.cookie_email,this.email,365*5)}},get_email:function(){if(this.email){return this.email}var a=agile_read_cookie(this.cookie_email);return a},set_original_referrer:function(){var a=document.referrer;agile_create_cookie(this.cookie_original_ref,a,365*5)}};agile_guid.init();var agile_id={set:function(b,a){this.id=b;this.namespace=a},get:function(){return this.id},getURL:function(){if(!this.namespace||this.namespace=="localhost"){return"http://localhost:8888/core/js/api"}else{return"https://"+this.namespace+".agilecrm.com/core/js/api"}},getNamespace:function(){return this.namespace}};function agile_getMilestones(b){var a=agile_id.getURL()+"/contact/get-milestones?callback=?&id="+agile_id.get();agile_json(a,b)}function agile_addNote(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="data={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/contacts/add-note?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_getNotes(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-notes?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}function agile_setProperty(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="data={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/contacts/add-property?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_getProperty(c,d,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}if(!c){return}var a=agile_id.getURL()+"/contacts/get-property?callback=?&id="+agile_id.get()+"&name="+c+"&email="+encodeURIComponent(b);agile_json(a,d)}function agile_removeProperty(c,d,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}if(!c){return}var a=agile_id.getURL()+"/contacts/remove-property?callback=?&id="+agile_id.get()+"&name="+c+"&email="+encodeURIComponent(b);agile_json(a,d)}function agile_addScore(c,d,b){if(!c){return}if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/add-score?callback=?&id="+agile_id.get()+"&score="+c+"&email="+encodeURIComponent(b);agile_json(a,d)}function agile_subtractScore(c,d,b){if(!c){return}if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/subtract-score?callback=?&id="+agile_id.get()+"&score="+c+"&email="+encodeURIComponent(b);agile_json(a,d)}function agile_getScore(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-score?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}var agile_session={init:function(){this.cookie_name="agile-crm-session_id";this.cookie_start_time="agile-crm-session_start_time";this.cookie_duration_secs=60*1000;this.new_session=false},random:function(){var a=function(){return(((1+Math.random())*65536)|0).toString(16).substring(1)};return(a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a())},get:function(){var b=agile_read_cookie(this.cookie_name);if(!b){return this.generate()}var a=agile_read_cookie(this.cookie_start_time);var c=new Date().getUTCSeconds();if((c<a)||(c>(a+this.cookie_duration_secs))){return this.generate()}return b},generate:function(){var a=this.random();agile_create_cookie(this.cookie_name,a,0);agile_create_cookie(this.cookie_start_time,new Date().getUTCSeconds(),0);this.new_session=true;return a},reset:function(){agile_create_cookie(this.cookie_name,"",-1);agile_create_cookie(this.cookie_start_time,"",-1)}};agile_session.init();function agile_addTag(c,e,b){if(!c){return}if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="email={0}&tags={1}".format(encodeURIComponent(b),encodeURIComponent(c));var a=agile_id.getURL()+"/contacts/add-tags?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_removeTag(c,e,b){if(!c){return}if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="email={0}&tags={1}".format(encodeURIComponent(b),encodeURIComponent(c));var a=agile_id.getURL()+"/contacts/remove-tags?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_getTags(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-tags?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}function agile_addTask(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="task={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/task?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_getTasks(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-tasks?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}function agile_trackPageview(h){var d=agile_guid.get();var e=agile_session.get();var c=document.location.href;if(c!==undefined&&c!=null){c=encodeURIComponent(c)}else{c=""}var a=agile_id.get();var g="";if(agile_session.new_session){var f=document.referrer;if(f!==undefined&&f!=null&&f!="null"){f=encodeURIComponent(f)}else{f=""}g="guid={0}&sid={1}&url={2}&agile={3}&new=1&ref={4}".format(d,e,c,a,f)}else{g="guid={0}&sid={1}&url={2}&agile={3}".format(d,e,c,a)}if(agile_guid.get_email()){g+="&email="+encodeURIComponent(agile_guid.get_email())}var b="https://"+agile_id.getNamespace()+".agilecrm.com/stats?callback=?&"+g;agile_json(b,h)}function agile_read_cookie(b){b=agile_id.get()+"-"+b;var e=b+"=";var a=document.cookie.split(";");for(var d=0;d<a.length;d++){var f=a[d];while(f.charAt(0)==" "){f=f.substring(1,f.length)}if(f.indexOf(e)==0){return unescape(f.substring(e.length,f.length))}}return null}function agile_create_cookie(c,d,e){c=agile_id.get()+"-"+c;if(e){var b=new Date();b.setTime(b.getTime()+(e*24*60*60*1000));var a="; expires="+b.toGMTString()}else{var a=""}document.cookie=c+"="+escape(d)+a+"; path=/"}function agile_enable_console_logging(){var a=false;if(typeof console==="undefined"||!a){console={log:function(){},error:function(){}}}if(typeof(console.log)==="undefined"||!a){console.log=function(){return 0}}if(typeof(console.error)==="undefined"||!a){console.error=function(){return 0}}};