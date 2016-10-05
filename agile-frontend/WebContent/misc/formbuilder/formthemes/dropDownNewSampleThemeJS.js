$(document).ready(function(){

			
			<!--DropDownSampleTheme JS -->
			function CustomThemeCss(selectedCssType,formEle){
				this.selectedCssType=selectedCssType;
				this.form_element=formEle;
			}
			function EleThemeCss(ele,css){
				this.ele=ele;
				this.css=css;
			}
			
			alignmentCss=new CustomThemeCss("Alignment CSS",[]);
			borderCss=new CustomThemeCss("Border CSS",[]);
			fontCss=new CustomThemeCss("Font CSS",[]);
			bckgroundCss=new CustomThemeCss("Background CSS",[]);
			
			themeArray=[alignmentCss,borderCss,fontCss,bckgroundCss];
			
			<!--DEFAULT SELECTSPAN VALUE AND DISPLAYING--> 
			<!--IT'S CORRESPONDING COMPONENTS -->

			var selectedSelectThemeEle=$(".selectDiv select option:selected").text();
			if(selectedSelectThemeEle=="Alignment"){
				$(".outerAlignmentTheme").css("display","inline");
				/*$(".createCustomFormContent legend").css("margin-left","-14px");
					$(".createCustomFormContent legend").css(" width","432px");
					$(".createCustomFormContent legend").css("padding-top","15px");
					$(".createCustomFormContent legend").css("padding-right","26px");*/
					$(".createCustomFormContent legend").css("text-align","-webkit-center");

					var css="legend{text-align:-webkit-center;}";

					var eleThemeCss=new EleThemeCss("Form Title/legend",css);
					alignmentCss.form_element.push(eleThemeCss);
					console.log(alignmentCss);
					
			}
			else if(selectedSelectThemeEle=="Border"){
				$(".outerBorderTheme").css("display","inline");
			}
			else if(selectedSelectThemeEle=="Font"){
				$(".outerFontTheme").css("display","inline");
			}
			else if(selectedSelectThemeEle=="Background"){
				$(".outerBackgroundTheme").css("display","inline");
			}

			<!-- SELECT DIV  CLICK CHANGE LOGIC-->
			
			<!-- SELECT LI CLICK LOGIC -->
			$(".selectDiv select").change(function(){
				
				var selectedSelectThemeEle=$(".selectDiv select").val();
			
					if(selectedSelectThemeEle=="alignment"){
						$(".outerAlignmentTheme").css("display","inline");
						$(".outerBorderTheme").css("display","none");
						$(".outerFontTheme").css("display","none");
						$(".outerBackgroundTheme").css("display","none");
					}
					else if(selectedSelectThemeEle=="border"){
						$(".outerAlignmentTheme").css("display","none");
						$(".outerBorderTheme").css("display","inline");
						$(".outerFontTheme").css("display","none");
						$(".outerBackgroundTheme").css("display","none");
							if($(".innerBorderWidthTheme select option:selected").text()=="None"){
								$(".borderStyleArrow").css("display","none");
								$(".innerBorderStyleTheme").css("display","none");
								$(".borderColorArrow").css("display","none");
								$(".innerBorderColorTheme").css("display","none");
	                      }
					}
					else if(selectedSelectThemeEle=="font"){
						$(".outerAlignmentTheme").css("display","none");
						$(".outerBorderTheme").css("display","none");
						$(".outerFontTheme").css("display","inline");
							$(".outerBackgroundTheme").css("display","none");
					}
					else if(selectedSelectThemeEle=="background"){
						$(".outerAlignmentTheme").css("display","none");
						$(".outerBorderTheme").css("display","none");
						$(".outerFontTheme").css("display","none");
						$(".outerBackgroundTheme").css("display","inline");
					}
				
			});
			<!--ALIGNMENT COMPONENT FORM ELEMENTS CLICK LOGIC START -->
			$(".innerAlignmentFormEle select").change(function(){
				var themeEle="Alignment";
				var alignFormEle=$(".innerAlignmentFormEle select option:selected").text();
				var alignTypeEle=$(".innerAlignmentAlignStart select").val();
				if(alignFormEle=="Form Title"){
					/*$("legend").css("text-align",alignTypeEle);*/
					/*$(".createCustomFormContent legend").css("margin-left","-14px");
					$(".createCustomFormContent legend").css(" width","432px");
					$(".createCustomFormContent legend").css("padding-top","15px");
					$(".createCustomFormContent legend").css("padding-right","26px");*/
					$(".createCustomFormContent legend").css("text-align","-webkit-"+alignTypeEle);
					
					for(i=0;i<alignmentCss.form_element.length;i++){
						if(alignmentCss.form_element[i].ele=="Form Title/legend"){
							alignmentCss.form_element.splice(i,1);
							break;
						}
					}

					var css="legend{text-align:-webkit-"+alignTypeEle+";}";

					var eleThemeCss=new EleThemeCss("Form Title/legend",css);
					alignmentCss.form_element.push(eleThemeCss);
					console.log(themeArray);
				}
				else if(alignFormEle=="Submit Button"){

					for(i=0;i<alignmentCss.form_element.length;i++){
							if(alignmentCss.form_element[i].ele=="Submit Button/button"){
								alignmentCss.form_element.splice(i,1);
								break;
							}
						}
					if(alignTypeEle=="left" || alignTypeEle=="right"){
						$(".createCustomFormContent form button").parent().css("margin-left","0px");
						$(".createCustomFormContent form button").parent().css("float",alignTypeEle);

						var css="button{margin-left:0px;float"+alignTypeEle+"}";
						if(alignTypeEle=="right"){
							var css="button{margin-left:340px;}";
						}
					}
					else{
						$(".createCustomFormContent form button").parent().css("margin-left","140px");
						$(".createCustomFormContent form button").parent().css("float","none");

						var css="button{margin-left:165px;float:none;}";
					}
						var eleThemeCss=new EleThemeCss("Submit Button/button",css);
						alignmentCss.form_element.push(eleThemeCss);
						console.log(themeArray);

				}
			});
			$(".innerAlignmentAlignStart select").change(function(){
				var themeEle="Alignment";
				var alignFormEle=$(".innerAlignmentFormEle select option:selected").text();
				var alignTypeEle=$(".innerAlignmentAlignStart select").val();
				if(alignFormEle=="Form Title"){
					
   					/*$(".createCustomFormContent legend").css("margin-left","-14px");
					$(".createCustomFormContent legend").css(" width","432px");
					$(".createCustomFormContent legend").css("padding-top","15px");
					$(".createCustomFormContent legend").css("padding-right","26px");*/
					$(".createCustomFormContent legend").css("text-align","-webkit-"+alignTypeEle);

					for(i=0;i<alignmentCss.form_element.length;i++){
						if(alignmentCss.form_element[i].ele=="Form Title/legend"){
							alignmentCss.form_element.splice(i,1);
							break;
						}
					}

					var css="legend{text-align:-webkit-"+alignTypeEle+"}";

					var eleThemeCss=new EleThemeCss("Form Title/legend",css);
					alignmentCss.form_element[0]=eleThemeCss;
					console.log(themeArray);
				}
				else if(alignFormEle=="Submit Button"){

					for(i=0;i<alignmentCss.form_element.length;i++){
						if(alignmentCss.form_element[i].ele=="Submit Button/button"){
							alignmentCss.form_element.splice(i,1);
							break;
						}
					}

					if(alignTypeEle=="left" || alignTypeEle=="right"){
						$(".createCustomFormContent form button").parent().css("margin-left","0px");	
						$(".createCustomFormContent form button").parent().css("float",alignTypeEle);	
						var css="button{margin-left:0px;float:"+alignTypeEle+";}";
						if(alignTypeEle=="right"){
							var css="button{margin-left:340px;}";
						}
					}
					else{
						$(".createCustomFormContent form button").parent().css("margin-left","140px");
						$(".createCustomFormContent form button").parent().css("float","none");
						var css="button{margin-left:165px;float:none;}";
					}
						var eleThemeCss=new EleThemeCss("Submit Button/button",css);
						alignmentCss.form_element.push(eleThemeCss);
						console.log(themeArray);	
				}
			});
			
			<!--ALIGNMENT COMPONENT FORM ELEMENTS CLICK LOGIC START -->

			<!--BACKGROUND COMPONENT FORM ELEMENTS CLICK LOGIC START -->
			$(".innerBackgroundFormEle select").change(function(){
				var themeEle="Background";
				console.log($(".innerBackgroundFormEle select option:selected").text());
				var backgroundFormEle=$(".innerBackgroundFormEle select option:selected").text();
				var backgroundImgEle=null;
				var backgroundColorVal=null;
				
				$(".innerBackgroundImageTheme li").each(function(){
						if($(this).hasClass("selected")){
								backgroundImgEle=$(this).find("img").attr("src");
						}
				});
				backgroundColorVal="#"+$(".innerBackgroundTheme input").val();
				if(backgroundFormEle=="Form"){
					/*$("form").css("background-color",backgroundColorVal);
					$("form").css("background","url("+backgroundImgEle+")");*/
					$(".createCustomFormContent form").css("background",backgroundColorVal+"\t"+"url("+backgroundImgEle+")");
					var css="form{background:"+backgroundColorVal+"\t"+"url("+backgroundImgEle+");}";
					var eleThemeCss=new EleThemeCss("Form/form",css);
					for(i=0;i<bckgroundCss.form_element.length;i++){
						if(bckgroundCss.form_element[i].ele=="Form/form"){
							bckgroundCss.form_element.splice(i,1);
							break;
						}
					}
						
				}
				else if(backgroundFormEle=="Header"){
					$(".createCustomFormContent form legend").css("background-color",backgroundColorVal);
					$(".createCustomFormContent form legend").css("background-image","url("+backgroundImgEle+")");
					var css="form legend{background-color:"+backgroundColorVal+";background-image:url("+backgroundImgEle+");}";
					var eleThemeCss=new EleThemeCss("Header/form legend",css);
					for(i=0;i<bckgroundCss.form_element.length;i++){
						if(bckgroundCss.form_element[i].ele=="Header/form legend"){
							bckgroundCss.form_element.splice(i,1);
							break;
						}
					}
						
				}
				else if(backgroundFormEle=="Body"){
					$("").css("background-color",backgroundColorVal);
					$("").css("background-image","url("+backgroundImgEle+")");
					var css="{background-color:"+backgroundColorVal+";background-image:url("+backgroundImgEle+");}";
					var eleThemeCss=new EleThemeCss("Body/",css);
					for(i=0;i<bckgroundCss.form_element.length;i++){
						if(bckgroundCss.form_element[i].ele=="Body/"){
							bckgroundCss.form_element.splice(i,1);
							break;
						}
					}
						
				}
				else if(backgroundFormEle=="Footer"){
					$(".createCustomFormContent form button").parent().parent().css("height","63px");
					/*$(".createCustomFormContent form button").parent().parent().css("margin","0px -14px -10px -14px");*/
					$(".createCustomFormContent form button").parent().parent().css("margin-bottom","0px");
					$(".createCustomFormContent form button").parent().parent().css("background-color",backgroundColorVal);
					$(".createCustomFormContent form button").parent().parent().css("background-image","url("+backgroundImgEle+")");
					var css="button{height:63px;margin-bottom:0px;background-color:"+backgroundColorVal+";background-image:url("+backgroundImgEle+");}";
					var eleThemeCss=new EleThemeCss("Footer/button",css);
					for(i=0;i<bckgroundCss.form_element.length;i++){
						if(bckgroundCss.form_element[i].ele=="Footer/button"){
							bckgroundCss.form_element.splice(i,1);
							break;
						}
					}

				}
				else if(backgroundFormEle=="Button"){
					$(".createCustomFormContent form button").css("background-color",backgroundColorVal);
					$(".createCustomFormContent form button").css("background","url("+backgroundImgEle+")");
					var css="button{background-color:"+backgroundColorVal+";background-image:url("+backgroundImgEle+");}";
					var eleThemeCss=new EleThemeCss("Button/button",css);
					for(i=0;i<bckgroundCss.form_element.length;i++){
						if(bckgroundCss.form_element[i].ele=="Button/button"){
							bckgroundCss.form_element.splice(i,1);
							break;
						}
					}

				}
				bckgroundCss.form_element.push(eleThemeCss);
				console.log(themeArray);
				console.log("form ele:"+backgroundFormEle+"backgroundImgEle:"+backgroundImgEle+"backgroundColorVal:"+backgroundColorVal);		
			});
			$(".innerBackgroundImageTheme li").click(function(e){
				var themeEle="Background";
				console.log(e);
				var backgroundFormEle=$(".innerBackgroundFormEle select option:selected").text();
				var backgroundImgEle=null;
				var backgroundColorVal=null;
				$(".innerBackgroundImageTheme li").each(function(){
					$(this).removeClass("selected");
				});
				$(e.currentTarget).addClass("selected");
				$(".innerBackgroundImageTheme li").each(function(){
						if($(this).hasClass("selected")){
								backgroundImgEle=$(this).find("img").attr("src");
								if(backgroundImgEle!=""||backgroundImgEle!=null){
									$(".innerBackgroundTheme input").val("FFFFFF");
									$(".innerBackgroundTheme input").css("background-color","#FFFFFF");
									$(".innerBackgroundTheme input").css("color","rgb(0, 0, 0)");
								}
						}
				});
				backgroundColorVal="#"+$(".innerBackgroundTheme input").val();
				if(backgroundFormEle=="Form"){
					$(".createCustomFormContent form").css("background-color",backgroundColorVal);
					$(".createCustomFormContent form").css("background-image","url("+backgroundImgEle+")");
					$(".createCustomFormContent form").css("background",backgroundColorVal+"\t"+"url("+backgroundImgEle+")");
					var css="{background:"+backgroundColorVal+"\t"+"url("+backgroundImgEle+");}";
					var eleThemeCss=new EleThemeCss("Form/form",css);
					for(i=0;i<bckgroundCss.form_element.length;i++){
						if(bckgroundCss.form_element[i].ele=="Form/form"){
							bckgroundCss.form_element.splice(i,1);
							break;
						}
					}
				}
				else if(backgroundFormEle=="Header"){
					$(".createCustomFormContent form legend").css("background-color",backgroundColorVal);
					$(".createCustomFormContent form legend").css("background-image","url("+backgroundImgEle+")");
					var css="legend{background:"+backgroundColorVal+"\t"+"url("+backgroundImgEle+");}";
					var eleThemeCss=new EleThemeCss("Header/form legend",css);
					for(i=0;i<bckgroundCss.form_element.length;i++){
						if(bckgroundCss.form_element[i].ele=="Header/form legend"){
							bckgroundCss.form_element.splice(i,1);
							break;
						}
					}	
				}
				else if(backgroundFormEle=="Body"){
					$("").css("background-color","backgroundColorVal");
					$("").css("background","url("+backgroundImgEle+")");
					var css="";
					var eleThemeCss=new EleThemeCss("Body/",css);
					for(i=0;i<bckgroundCss.form_element.length;i++){
						if(bckgroundCss.form_element[i].ele=="Body/"){
							bckgroundCss.form_element.splice(i,1);
							break;
						}
					}
				}
				else if(backgroundFormEle=="Footer"){
					$(".createCustomFormContent form button").parent().parent().css("height","63px");
					/*$(".createCustomFormContent form button").parent().parent().css("margin","0px -14px -10px -14px");*/
					$(".createCustomFormContent form button").parent().parent().css("margin-bottom","0px");
					$(".createCustomFormContent form button").parent().parent().css("background-color",backgroundColorVal);
					$(".createCustomFormContent form button").parent().parent().css("background-image","url("+backgroundImgEle+")");
					var css="button{height:63px;margin-bottom:0px;background-color:"+backgroundColorVal+";background-image:url("+backgroundImgEle+");}";
					var eleThemeCss=new EleThemeCss("Footer/button",css);
					for(i=0;i<bckgroundCss.form_element.length;i++){
						if(bckgroundCss.form_element[i].ele=="Footer/button"){
							bckgroundCss.form_element.splice(i,1);
							break;
						}
					}
				}
				else if(backgroundFormEle=="Button"){
					$(".createCustomFormContent form button").css("background-color",backgroundColorVal);
					$(".createCustomFormContent form button").css("background-image","url("+backgroundImgEle+")");
					var css="button{background-color:"+backgroundColorVal+";background-image:url("+backgroundImgEle+");}";
					var eleThemeCss=new EleThemeCss("Button/button",css);
					for(i=0;i<bckgroundCss.form_element.length;i++){
						if(bckgroundCss.form_element[i].ele=="Button/button"){
							bckgroundCss.form_element.splice(i,1);
							break;
						}
					}
				}
				bckgroundCss.form_element.push(eleThemeCss);
				console.log(themeArray);		
			});
			$(".innerBackgroundTheme input").change(function(e){
				var themeEle="Background";
				console.log(e);
				var backgroundFormEle=$(".innerBackgroundFormEle select option:selected").text();
				var backgroundImgEle=null;
				var backgroundColorVal="#"+$(".innerBackgroundTheme input").val();
				var isImageFirst=false;
				$(".innerBackgroundImageTheme li").each(function(){
						if($(this).hasClass("selected")){
								if($(this)==$(".innerBackgroundImageTheme li").first()){
									isImageFirst=true;
									backgroundImgEle=$(this).find("img").attr("src");
								}
								else{
								$(this).removeClass("selected");	
								}
						}
				});
				if(!isImageFirst){
					backgroundImgEle=$(".innerBackgroundImageTheme li").first().addClass("selected").find("img").attr("src");
				}

				if(backgroundFormEle=="Form"){
					$(".createCustomFormContent form").css("background-color",backgroundColorVal);
					$(".createCustomFormContent form").css("background-image","url("+backgroundImgEle+")");
					var css="{background:"+backgroundColorVal+"\t"+"url("+backgroundImgEle+");}";
					var eleThemeCss=new EleThemeCss("Form/form",css);
					for(i=0;i<bckgroundCss.form_element.length;i++){
						if(bckgroundCss.form_element[i].ele=="Form/form"){
							bckgroundCss.form_element.splice(i,1);
							break;
						}
					}
				}
				else if(backgroundFormEle=="Header"){
					$(".createCustomFormContent form legend").css("background-color",backgroundColorVal);
					$(".createCustomFormContent form legend").css("background-image","url("+backgroundImgEle+")");
					var css="legend{background:"+backgroundColorVal+"\t"+"url("+backgroundImgEle+");}";
					var eleThemeCss=new EleThemeCss("Header/form legend",css);
					for(i=0;i<bckgroundCss.form_element.length;i++){
						if(bckgroundCss.form_element[i].ele=="Header/form legend"){
							bckgroundCss.form_element.splice(i,1);
							break;
						}
					}	
				}
				else if(backgroundFormEle=="Body"){
					$(".agile-group,.agile-label,input[type=text],input[type=hidden],.agile-group-addon,select,input[type=checkbox],input[type=radio]").css("background-color","backgroundColorVal");
					$(".agile-group,.agile-label,input[type=text],input[type=hidden],.agile-group-addon,select,input[type=checkbox],input[type=radio]").css("background-image","url("+backgroundImgEle+")");
					var css="";
					var eleThemeCss=new EleThemeCss("Body/",css);
					for(i=0;i<bckgroundCss.form_element.length;i++){
						if(bckgroundCss.form_element[i].ele=="Body/"){
							bckgroundCss.form_element.splice(i,1);
							break;
						}
					}
				}
				else if(backgroundFormEle=="Footer"){
					$(".createCustomFormContent form button").parent().parent().css("height","63px");
					/*$(".createCustomFormContent form button").parent().parent().css("margin","0px -14px -10px -14px");*/
					$(".createCustomFormContent form button").parent().parent().css("margin-bottom","0px");
					$(".createCustomFormContent form button").parent().parent().css("background-color",backgroundColorVal);
					$(".createCustomFormContent form button").parent().parent().css("background-image","url("+backgroundImgEle+")");
					var css="button{height:63px;margin-bottom:0px;background-color:"+backgroundColorVal+";background-image:url("+backgroundImgEle+");}";
					var eleThemeCss=new EleThemeCss("Footer/button",css);
					for(i=0;i<bckgroundCss.form_element.length;i++){
						if(bckgroundCss.form_element[i].ele=="Footer/button"){
							bckgroundCss.form_element.splice(i,1);
							break;
						}
					}
				}
				else if(backgroundFormEle=="Button"){
					$(".createCustomFormContent form button").css("background-color",backgroundColorVal);
					$(".createCustomFormContent form button").css("background-image","url("+backgroundImgEle+")");
					var css="button{background-color:"+backgroundColorVal+";background-image:url("+backgroundImgEle+");}";
					var eleThemeCss=new EleThemeCss("Button/button",css);
					for(i=0;i<bckgroundCss.form_element.length;i++){
						if(bckgroundCss.form_element[i].ele=="Button/button"){
							bckgroundCss.form_element.splice(i,1);
							break;
						}
					}
				}
				bckgroundCss.form_element.push(eleThemeCss);
				console.log(themeArray);		
			});

			<!--BACKGROUND COMPONENT FORM ELEMENTS CLICK LOGIC START -->
			
			<!--BORDER COMPONENT FORM ELEMENTS CLICK LOGIC START -->
				$(".innerBorderWidthTheme select").change(function(e){
					var themeEle="border";
					var borderFormEle="Form";
					var borderWidth=$(".innerBorderWidthTheme select option:selected").text();
					var borderStyle=null
					var borderColor=null;
					
					if(borderWidth=="None"){
						$(".borderStyleArrow").css("display","none");
						$(".innerBorderStyleTheme").css("display","none");
						$(".borderColorArrow").css("display","none");
						$(".innerBorderColorTheme").css("display","none");
					}
					else{
						$(".borderStyleArrow").css("display","block");
						$(".innerBorderStyleTheme").css("display","block");
						$(".borderColorArrow").css("display","block");
						$(".innerBorderColorTheme").css("display","block");	
					}
					$(".innerBorderStyleTheme li").each(function(){
						if($(this).hasClass("selected")){
							borderStyle=$(this).find("p").attr("name");
						}
					});
					borderColor=$(".innerBorderTheme input").val();
					if(borderWidth=="None"){
						$(".createCustomFormContent form").css("border","none");
						var css="{border:none}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					if(borderWidth=="Thin"){
						$(".createCustomFormContent form").css("border","1px"+"\t"+borderStyle+"\t"+"#"+borderColor);
						var css="{border:1px"+"\t"+borderStyle+"\t"+"#"+borderColor+"}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					else if(borderWidth=="Thick"){
						$(".createCustomFormContent form").css("border","5px"+" "+borderStyle+" "+"#"+borderColor);
						var css="{border:5px"+"\t"+borderStyle+"\t"+"#"+borderColor+"}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					else if(borderWidth=="Medium"){
						$(".createCustomFormContent form").css("border","3px"+" "+borderStyle+" "+"#"+borderColor);
						var css="{border:3px"+"\t"+borderStyle+"\t"+"#"+borderColor+"}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					borderCss.form_element.push(eleThemeCss);
					console.log(themeArray);	
				});
				$(".innerBorderStyleTheme li").click(function(e){
					var themeEle="border";
					var borderFormEle="Form";
					var borderWidth=$(".innerBorderWidthTheme select option:selected").text();
					var borderStyle=$(e.currentTarget).find("p").attr("name");
					var borderColor=null;
					$(".innerBorderStyleTheme li").each(function(){
					$(this).removeClass("selected");
					});
					$(e.currentTarget).addClass("selected");
					
					borderColor=$(".innerBorderTheme input").val();
					if(borderWidth=="None"){
						$("form").css("border","none");
						var css="{border:none}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					if(borderWidth=="Thin"){
						$(".createCustomFormContent form").css("border","1px"+"\t"+borderStyle+"\t"+"#"+borderColor);
						var css="{border:1px"+"\t"+borderStyle+"\t"+"#"+borderColor+"}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					else if(borderWidth=="Thick"){
						$(".createCustomFormContent form").css("border","5px"+" "+borderStyle+" "+"#"+borderColor);
						var css="{border:5px"+"\t"+borderStyle+"\t"+"#"+borderColor+"}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					else if(borderWidth=="Medium"){
						$(".createCustomFormContent form").css("border","3px"+" "+borderStyle+" "+"#"+borderColor);
						var css="{border:3px"+"\t"+borderStyle+"\t"+"#"+borderColor+"}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					borderCss.form_element.push(eleThemeCss);
					console.log(themeArray);	
				});
				$(".innerBorderTheme input").change(function(e){
					var themeEle="border";
					var borderFormEle="Form";
					var borderWidth=$(".innerBorderWidthTheme select option:selected").text();
					var borderStyle=null;
					var borderColor=$(e.currentTarget).val();
					/*$(".innerBorderWidthTheme li").each(function(){
						if($(this).hasClass("selected")){
							borderWidth=$(this).text();
						}
					});*/
					$(".innerBorderStyleTheme li").each(function(){
						if($(this).hasClass("selected")){
							borderStyle=$(this).find("p").attr("name");
						}
					});
					if(borderWidth=="None"){
						$(".createCustomFormContent form").css("border","none");
						var css="{border:none}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					if(borderWidth=="Thin"){
						$(".createCustomFormContent form").css("border","1px"+"\t"+borderStyle+"\t"+"#"+borderColor);
						var css="{border:1px"+"\t"+borderStyle+"\t"+"#"+borderColor+"}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					else if(borderWidth=="Thick"){
						$(".createCustomFormContent form").css("border","5px"+" "+borderStyle+" "+"#"+borderColor);
						var css="{border:5px"+"\t"+borderStyle+"\t"+"#"+borderColor+"}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					else if(borderWidth=="Medium"){
						$(".createCustomFormContent form").css("border","3px"+" "+borderStyle+" "+"#"+borderColor);
						var css="{border:3px"+"\t"+borderStyle+"\t"+"#"+borderColor+"}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					borderCss.form_element.push(eleThemeCss);
					console.log(themeArray);	
				});
				
			<!--BORDER COMPONENT FORM ELEMENTS CLICK LOGIC START -->
			<!--FONT COMPONENT FORM ELEMENTS CLICK LOGIC START -->
				$(".innerFontEleTheme select").change(function(){
					fontChangeEventHandler();
				});
				$(".innerFontFamilyTheme select").change(function(){
					fontChangeEventHandler();
				});
				$(".innerFontStyleDiv select").change(function(){
					
					fontChangeEventHandler();
				});
				$(".innerFontWeightDiv select").change(function(){
					
					fontChangeEventHandler();
				});
				$(".innerFontSizeUlDiv select").change(function(){
					fontChangeEventHandler();
				});
				$(".innerFontTheme input").change(function(){
					fontChangeEventHandler();
				});
				function fontChangeEventHandler(){
					var formEle=$(".innerFontEleTheme select option:selected").text();
					var fontFamilyEle=$(".innerFontFamilyTheme select").val();
					var fontStyleEle=$(".innerFontStyleDiv select").val();
					var fontWeightEle=$(".innerFontWeightDiv select").val();
					var fontSizeEle=$(".innerFontSizeUlDiv select").val()+"px";
					var fontThemeColor="#"+$(".innerFontTheme input").val();
					/*var fontThemeColor=$(e.currentTarget).val();*/
					console.log(formEle+"\t"+fontFamilyEle+"\t"+fontStyleEle+"\t"+fontWeightEle+"\t"+fontSizeEle+"\t"+fontThemeColor);
					if(formEle=="Title"){
						$(".createCustomFormContent form legend").css("font-family",fontFamilyEle);
						$(".createCustomFormContent form legend").css("font-style",fontStyleEle);
						$(".createCustomFormContent form legend").css("font-weight",fontWeightEle);
						$(".createCustomFormContent form legend").css("font-size",fontSizeEle);
						$(".createCustomFormContent form legend").css("color",fontThemeColor);
						var css="legend{font-family:"+fontFamilyEle+";font-style:"+fontStyleEle+";font-weight:"+fontWeightEle+";font-size:"+fontSizeEle+";color:"+fontThemeColor+";}";
						var eleThemeCss=new EleThemeCss("Title/form legend",css);
						for(i=0;i<fontCss.form_element.length;i++){
							if(fontCss.form_element[i].ele=="Title/form legend"){
								fontCss.form_element.splice(i,1);
								break;
							}
						}
					}
					else if(formEle=="Field Label"){
						var multipleFormEleFinal="";
						var multipleFormEle=".agile-label,form input[type=text],form input[type=hidden],.agile-group-addon,form select,form input[type=checkbox],form input[type=radio]";
						var multipleFormEleArr=multipleFormEle.split(",");
						for(i=0;i<multipleFormEleArr.length;i++){
							multipleFormEleFinal=multipleFormEleFinal+".createCustomFormContent"+"\t"+multipleFormEleArr[0]+",";
						}
						multipleFormEleFinal=multipleFormEleFinal.substring(0,multipleFormEleFinal.lastIndexOf(","));
						$(multipleFormEleFinal).css("font-family",fontFamilyEle);
						$(multipleFormEleFinal).css("font-style",fontStyleEle);
						$(multipleFormEleFinal).css("font-weight",fontWeightEle);
						$(multipleFormEleFinal).css("font-size",fontSizeEle);
						$(multipleFormEleFinal).css("color",fontThemeColor);
						var css=multipleFormEle+"{font-family:"+fontFamilyEle+";font-style:"+fontStyleEle+";font-weight:"+fontWeightEle+";font-size:"+fontSizeEle+";color:"+fontThemeColor+";}";
						var eleThemeCss=new EleThemeCss("Field Label/"+multipleFormEle,css);
						for(i=0;i<fontCss.form_element.length;i++){
							if(fontCss.form_element[i].ele=="Field Label/"+multipleFormEle){
								fontCss.form_element.splice(i,1);
								break;
							}
						}
					}
					else if(formEle=="Button Text"){
						$(".createCustomFormContent form button").css("font-family",fontFamilyEle);
						$(".createCustomFormContent form button").css("font-style",fontStyleEle);
						$(".createCustomFormContent form button").css("font-weight",fontWeightEle);
						$(".createCustomFormContent form button").css("font-size",fontSizeEle);
						$(".createCustomFormContent form button").css("color",fontThemeColor);
						var css="button{font-family:"+fontFamilyEle+";font-style:"+fontStyleEle+";font-weight:"+fontWeightEle+";font-size:"+fontSizeEle+";color:"+fontThemeColor+";}";
						var eleThemeCss=new EleThemeCss("Button Text/button",css);
						for(i=0;i<fontCss.form_element.length;i++){
							if(fontCss.form_element[i].ele=="Button Text/button"){
								fontCss.form_element.splice(i,1);
								break;
							}
						}
					}
					fontCss.form_element.push(eleThemeCss);
					console.log(themeArray);	
				}

			<!--FONT COMPONENT FORM ELEMENTS CLICK LOGIC START -->
		});	


		