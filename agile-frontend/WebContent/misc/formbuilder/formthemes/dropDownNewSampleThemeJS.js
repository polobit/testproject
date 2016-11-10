
	function custThemePopUpCode(){
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
			colorCss=new CustomThemeCss("Color Css",[]);
			
			themeArray=[alignmentCss,borderCss,fontCss,bckgroundCss,colorCss];
			<!--DEFAULT SELECTSPAN VALUE AND DISPLAYING--> 
			<!--ITS CORRESPONDING COMPONENTS -->

			var selectedSelectThemeEle=$(".selectDiv select option:selected").text();
			if(selectedSelectThemeEle=="Alignment"){
				$(".outerAlignmentTheme").css("display","inline");
				$(".createCustomFormContent legend").css("text-align","center");

					var css="legend{text-align:center;}";

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
			else if(selectedSelectThemeEle=="Color"){
				$(".outerColorThemeEle").css("display","inline");
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
						$(".outerColorThemeEle").css("display","none");
					}
					else if(selectedSelectThemeEle=="border"){
						$(".outerAlignmentTheme").css("display","none");
						$(".outerBorderTheme").css("display","inline");
						$(".outerFontTheme").css("display","none");
						$(".outerBackgroundTheme").css("display","none");
						$(".outerColorThemeEle").css("display","none");
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
						$(".outerColorThemeEle").css("display","none");
						fontChangeEventHandler();
					}
					else if(selectedSelectThemeEle=="color"){
						$(".outerAlignmentTheme").css("display","none");
						$(".outerBorderTheme").css("display","none");
						$(".outerFontTheme").css("display","none");
						$(".outerBackgroundTheme").css("display","inline");
						$(".outerColorThemeEle").css("display","inline");
					}
				
			});
			<!--ALIGNMENT COMPONENT FORM ELEMENTS CLICK LOGIC START -->
			$(".innerAlignmentFormEle select").change(function(){
				var themeEle="Alignment";
				var alignFormEle=$(".innerAlignmentFormEle select option:selected").text();
				var alignTypeEle=$(".innerAlignmentAlignStart select").val();
				if(alignFormEle=="Form Title"){
					
					$(".createCustomFormContent legend").css("text-align",alignTypeEle);
					for(i=0;i<alignmentCss.form_element.length;i++){
						if(alignmentCss.form_element[i].ele=="Form Title/legend"){
							alignmentCss.form_element.splice(i,1);
							break;
						}
					}

					var css="legend{text-align:"+alignTypeEle+";}";

					var eleThemeCss=new EleThemeCss("Form Title/legend",css);
					alignmentCss.form_element.push(eleThemeCss);
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

						var css=".agile-group button{margin-left:0px;float"+alignTypeEle+"}";
						if(alignTypeEle=="right"){
							var css=".agile-group button{margin-left:340px;}";
						}
					}
					else{
						$(".createCustomFormContent form button").parent().css("margin-left","140px");
						$(".createCustomFormContent form button").parent().css("float","none");

						var css=".agile-group button{margin-left:165px;float:none;}";
					}
						var eleThemeCss=new EleThemeCss("Submit Button/button",css);
						alignmentCss.form_element.push(eleThemeCss);
				
				}
			});
			$(".innerAlignmentAlignStart select").change(function(){
				var themeEle="Alignment";
				var alignFormEle=$(".innerAlignmentFormEle select option:selected").text();
				var alignTypeEle=$(".innerAlignmentAlignStart select").val();
				if(alignFormEle=="Form Title"){
					
   					$(".createCustomFormContent legend").css("text-align",alignTypeEle);

					for(i=0;i<alignmentCss.form_element.length;i++){
						if(alignmentCss.form_element[i].ele=="Form Title/legend"){
							alignmentCss.form_element.splice(i,1);
							break;
						}
					}

					var css="legend{text-align:"+alignTypeEle+"}";

					var eleThemeCss=new EleThemeCss("Form Title/legend",css);
					alignmentCss.form_element[0]=eleThemeCss;
					
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
						var css=".agile-group button{margin-left:0px;float:"+alignTypeEle+";}";
						if(alignTypeEle=="right"){
							var css=".agile-group button{margin-left:340px;}";
						}
					}
					else{
						$(".createCustomFormContent form button").parent().css("margin-left","140px");
						$(".createCustomFormContent form button").parent().css("float","none");
						var css=".agile-group button{margin-left:165px;float:none;}";
					}
						var eleThemeCss=new EleThemeCss("Submit Button/button",css);
						alignmentCss.form_element.push(eleThemeCss);
				}
			});
			
			<!--ALIGNMENT COMPONENT FORM ELEMENTS CLICK LOGIC START -->

			<!--BACKGROUND COMPONENT FORM ELEMENTS CLICK LOGIC START -->
			$(".innerBackgroundFormEle select").change(function(){
				var themeEle="Background";
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
					var css="legend{background-color:"+backgroundColorVal+";background-image:url("+backgroundImgEle+");}";
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
					$(".createCustomFormContent form button").parent().parent().css("margin-bottom","0px");
					$(".createCustomFormContent form button").parent().parent().css("background-color",backgroundColorVal);
					$(".createCustomFormContent form button").parent().parent().css("background-image","url("+backgroundImgEle+")");
					var css=".agile-group button{height:63px;margin-bottom:0px;background-color:"+backgroundColorVal+";background-image:url("+backgroundImgEle+");}";
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
					var css=".agile-group button{background-color:"+backgroundColorVal+";background-image:url("+backgroundImgEle+");}";
					var eleThemeCss=new EleThemeCss("Button/button",css);
					for(i=0;i<bckgroundCss.form_element.length;i++){
						if(bckgroundCss.form_element[i].ele=="Button/button"){
							bckgroundCss.form_element.splice(i,1);
							break;
						}
					}

				}
				bckgroundCss.form_element.push(eleThemeCss);
				
			});
			$(".innerBackgroundImageTheme li").click(function(e){
				var themeEle="Background";
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
					$(".createCustomFormContent form button").parent().parent().css("margin-bottom","0px");
					$(".createCustomFormContent form button").parent().parent().css("background-color",backgroundColorVal);
					$(".createCustomFormContent form button").parent().parent().css("background-image","url("+backgroundImgEle+")");
					var css=".agile-group button{height:63px;margin-bottom:0px;background-color:"+backgroundColorVal+";background-image:url("+backgroundImgEle+");}";
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
					var css=".agile-group button{background-color:"+backgroundColorVal+";background-image:url("+backgroundImgEle+");}";
					var eleThemeCss=new EleThemeCss("Button/button",css);
					for(i=0;i<bckgroundCss.form_element.length;i++){
						if(bckgroundCss.form_element[i].ele=="Button/button"){
							bckgroundCss.form_element.splice(i,1);
							break;
						}
					}
				}
				bckgroundCss.form_element.push(eleThemeCss);
						
			});
			$(".innerBackgroundTheme input").change(function(e){
				var themeEle="Background";
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
					$(".createCustomFormContent form button").parent().parent().css("margin-bottom","0px");
					$(".createCustomFormContent form button").parent().parent().css("background-color",backgroundColorVal);
					$(".createCustomFormContent form button").parent().parent().css("background-image","url("+backgroundImgEle+")");
					var css=".agile-group button{height:63px;margin-bottom:0px;background-color:"+backgroundColorVal+";background-image:url("+backgroundImgEle+");}";
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
					var css=".agile-group button{background-color:"+backgroundColorVal+";background-image:url("+backgroundImgEle+");}";
					var eleThemeCss=new EleThemeCss("Button/button",css);
					for(i=0;i<bckgroundCss.form_element.length;i++){
						if(bckgroundCss.form_element[i].ele=="Button/button"){
							bckgroundCss.form_element.splice(i,1);
							break;
						}
					}
				}
				bckgroundCss.form_element.push(eleThemeCss);
						
			});

			<!--BACKGROUND COMPONENT FORM ELEMENTS CLICK LOGIC START -->

			<!-- COLOR COMPONENT FORM ELEMENTS CLICK LOGIC START -->
				$(".innerColorThemeEle select").change(function(e){
					colorEleFunc("elementchange");
				});
				$(".colorTheme input").change(function(e){
					colorEleFunc("colorchange");

				});
				function colorEleFunc(changeVal){
					var themeEle = $(".innerColorThemeEle select option:selected").text();
					var themecolor ="#"+$(".colorTheme input").val();
					var borderWidth=$(".innerBorderWidthTheme select option:selected").text();
					var borderStyle= null;
					var isThemeEleExist=false;
					if(themeEle == "Form Border"){

						if(borderWidth != "None"){
							$(".innerBorderStyleTheme li").each(function(){
								if($(this).hasClass("selected")){
									borderStyle=$(this).find("p").attr("name");
								}

							});
							for(i=0;i<colorCss.form_element.length;i++){
								if(colorCss.form_element[i].ele=="FormBorder/formBorder"){
									if(changeVal == "elementchange"){
										themecolor = colorCss.form_element[i].css.substring(colorCss.form_element[i].css.lastIndexOf("\t")+1,colorCss.form_element[i].css.lastIndexOf("}"));
									}
									    isThemeEleExist=true;
									    colorCss.form_element.splice(i,1);
										break;
								}
							}
							if(changeVal == "elementchange"){
								if(!isThemeEleExist){
									themecolor="#000000";
									$(".colorTheme input").val("000000");
									$(".colorTheme input").css("background-color","#000000");
									$(".colorTheme input").css("color","#FFFFFF");
								}
								else{
									$(".colorTheme input").val(themecolor.substring(1));
									$(".colorTheme input").css("background-color",themecolor);
									$(".colorTheme input").css("color","#CCCCCC");
								}
							}
							$(".createCustomFormContent form").css("border",borderWidth+"\t"+borderStyle+"\t"+themecolor);
							var css="{border:"+borderWidth+"\t"+borderStyle+"\t"+themecolor+"}";
							var eleThemeCss=new EleThemeCss("FormBorder/formBorder",css);
						}

					}

					else if(themeEle == "Form Background"){
						for(i=0;i<colorCss.form_element.length;i++){
							if(colorCss.form_element[i].ele=="FormBackground/FormBackground"){
								isThemeEleExist=true;
								if(changeVal == "elementchange"){
								themecolor = colorCss.form_element[i].css.substring(colorCss.form_element[i].css.lastIndexOf(":")+1,colorCss.form_element[i].css.lastIndexOf("}"));
								}
								colorCss.form_element.splice(i,1);
								break;
							}
						}
						if(changeVal == "elementchange"){
							if(!isThemeEleExist){
								themecolor="#FFFFFF";
								$(".colorTheme input").val("FFFFFF");
								$(".colorTheme input").css("background-color","#FFFFFF");
								$(".colorTheme input").css("color","#000000");
							}
								
							else{
								$(".colorTheme input").val(themecolor.substring(1));
								$(".colorTheme input").css("background-color",themecolor);
								$(".colorTheme input").css("color","#CCCCCC");
							}
						}
						$(".createCustomFormContent form").css("background-color",themecolor);
						var css="{background-color:"+themecolor+"}";
						var eleThemeCss=new EleThemeCss("FormBackground/FormBackground",css);
					}
					else if(themeEle == "Title"){
						
						for(i=0;i<colorCss.form_element.length;i++){
							if(colorCss.form_element[i].ele=="Title/title"){
								isThemeEleExist=true;
								if(changeVal == "elementchange"){
								themecolor = colorCss.form_element[i].css.substring(colorCss.form_element[i].css.lastIndexOf(":")+1,colorCss.form_element[i].css.lastIndexOf("}"));
								}
								colorCss.form_element.splice(i,1);
								break;
							}
						}
						if(changeVal == "elementchange"){
							if(!isThemeEleExist){
								themecolor="#000000";
								$(".colorTheme input").val("000000");
								$(".colorTheme input").css("background-color","#000000");
								$(".colorTheme input").css("color","#FFFFFF");
							}
							else{
								$(".colorTheme input").val(themecolor.substring(1));
								$(".colorTheme input").css("background-color",themecolor);
								$(".colorTheme input").css("color","#CCCCCC");
							}
						}
						$(".createCustomFormContent legend").css("color",themecolor);
						var css="legend{color:"+themecolor+"}";
						var eleThemeCss=new EleThemeCss("Title/title",css);	
					}
					else if(themeEle == "Field Label"){
						
						for(i=0;i<colorCss.form_element.length;i++){
							if(colorCss.form_element[i].ele=="FieldLabel/fieldLabel"){
								isThemeEleExist=true;
								if(changeVal == "elementchange"){
								themecolor = colorCss.form_element[i].css.substring(colorCss.form_element[i].css.lastIndexOf(":")+1,colorCss.form_element[i].css.lastIndexOf("}"));
								}
								colorCss.form_element.splice(i,1);
								break;
							}
						}
						if(changeVal == "elementchange"){
							if(!isThemeEleExist){
								themecolor="#000000";
								$(".colorTheme input").val("000000");
								$(".colorTheme input").css("background-color","#000000");
								$(".colorTheme input").css("color","#FFFFFF");
							}
							else{
							$(".colorTheme input").val(themecolor.substring(1));
							$(".colorTheme input").css("background-color",themecolor);
							$(".colorTheme input").css("color","#CCCCCC");
								
						    }
					    }
						$(".createCustomFormContent .agile-group .agile-label").css("color",themecolor);	
					    var css=".agile-group .agile-label{color:"+themecolor+"}";
						var eleThemeCss=new EleThemeCss("FieldLabel/fieldLabel",css);
					}
					else if(themeEle == "Button Text"){
						
						for(i=0;i<colorCss.form_element.length;i++){
							if(colorCss.form_element[i].ele=="ButtonText/buttonText"){
								isThemeEleExist=true;
								if(changeVal == "elementchange"){
								themecolor = colorCss.form_element[i].css.substring(colorCss.form_element[i].css.lastIndexOf(":")+1,colorCss.form_element[i].css.lastIndexOf("}"));
								}
								colorCss.form_element.splice(i,1);
								break;
							}
						}
						if(changeVal == "elementchange"){
							if(!isThemeEleExist){
								themecolor="#000000";
								$(".colorTheme input").val("000000");
								$(".colorTheme input").css("background-color","#000000");
								$(".colorTheme input").css("color","#FFFFFF");
							}
							else{
								$(".colorTheme input").val(themecolor.substring(1));
								$(".colorTheme input").css("background-color",themecolor);
								$(".colorTheme input").css("color","#CCCCC");
							}
						}
						$(".createCustomFormContent .agile-group .agile-field button").css("color",themecolor);	
					    var css=".agile-group .agile-field button{color:"+themecolor+"}";
						var eleThemeCss=new EleThemeCss("ButtonText/buttonText",css);
					}
					else if(themeEle == "Button Background"){
						
						for(i=0;i<colorCss.form_element.length;i++){
							if(colorCss.form_element[i].ele=="ButtonBackground/buttonBackground"){
								isThemeEleExist=true;
								if(changeVal == "elementchange"){
								themecolor = colorCss.form_element[i].css.substring(colorCss.form_element[i].css.lastIndexOf(":")+1,colorCss.form_element[i].css.lastIndexOf("}"));
								}
								colorCss.form_element.splice(i,1);
								break;
							}
						}
						if(changeVal == "elementchange"){
							if(!isThemeEleExist){
								themecolor="#CCCCCC";
								$(".colorTheme input").val(themecolor.substring(1));
								$(".colorTheme input").css("background-color",themecolor);
								$(".colorTheme input").css("color","#000000");
							}	
						    else{
						    	$(".colorTheme input").val(themecolor.substring(1));
								$(".colorTheme input").css("background-color",themecolor);
								$(".colorTheme input").css("color","#000000");
							}
					    }
						$(".createCustomFormContent .agile-group .agile-field button").css("background-color",themecolor);
						$(".createCustomFormContent .agile-group .agile-field button").css("border-color",themecolor);
						
					    var css=".agile-group .agile-field button{background-color:"+themecolor+";border-color:"+themecolor+"}";
						var eleThemeCss=new EleThemeCss("ButtonBackground/buttonBackground",css);
					}

					if(eleThemeCss!=undefined){
						colorCss.form_element.push(eleThemeCss);
					
					}
					
				}
			<!-- COLOR COMPONENT FORM ELEMENTS CLICK LOGIC END -->	
			
			<!--BORDER COMPONENT FORM ELEMENTS CLICK LOGIC START -->
				$(".innerBorderWidthTheme select").change(function(e){
					var themeEle="border";
					var borderFormEle="Form";
					var borderWidth=$(".innerBorderWidthTheme select option:selected").text();
					var borderStyle=null
					var borderColor = "#"+$(".colorTheme input").val();
					
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
						
						$(".createCustomFormContent form").css("border","1px"+" "+borderStyle+" "+borderColor);
						/*var css="{border:1px"+"\t"+borderStyle+"\t"+"#"+borderColor+"}";*/
						var css="{border:1px"+"\t"+borderStyle+"\t"+borderColor+"}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					else if(borderWidth=="Thick"){
						$(".createCustomFormContent form").css("border","5px"+" "+borderStyle+" "+borderColor);
						var css="{border:5px"+"\t"+borderStyle+"\t"+borderColor+"}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					else if(borderWidth=="Medium"){
						$(".createCustomFormContent form").css("border","3px"+" "+borderStyle+" "+borderColor);
						var css="{border:3px"+"\t"+borderStyle+"\t"+borderColor+"}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					borderCss.form_element.push(eleThemeCss);
						
				});
				$(".innerBorderStyleTheme li").click(function(e){
					var themeEle="border";
					var borderFormEle="Form";
					var borderWidth=$(".innerBorderWidthTheme select option:selected").text();
					var borderStyle=$(e.currentTarget).find("p").attr("name");
					var borderColor="#"+$(".colorTheme input").val();

					$(".innerBorderStyleTheme li").each(function(){
					$(this).removeClass("selected");
					});
					$(e.currentTarget).addClass("selected");
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
						$(".createCustomFormContent form").css("border","1px"+"\t"+borderStyle+"\t"+borderColor);
						var css="{border:1px"+"\t"+borderStyle+"\t"+borderColor+";}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					else if(borderWidth=="Thick"){
						$(".createCustomFormContent form").css("border","5px"+" "+borderStyle+"\t"+borderColor);
						var css="{border:5px"+"\t"+borderStyle+"\t"+borderColor+"}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					else if(borderWidth=="Medium"){
						$(".createCustomFormContent form").css("border","3px"+" "+borderStyle+"\t"+borderColor);
						var css="{border:3px"+"\t"+borderStyle+"\t"+borderColor+"}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					borderCss.form_element.push(eleThemeCss);
						
				});
				$(".innerBorderTheme input").change(function(e){
					var themeEle="border";
					var borderFormEle="Form";
					var borderWidth=$(".innerBorderWidthTheme select option:selected").text();
					var borderStyle=null;
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
						$(".createCustomFormContent form").css("border","1px"+"\t"+borderStyle);
						var css="{border-width:1px;border-style:"+borderStyle+";}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					else if(borderWidth=="Thick"){
						$(".createCustomFormContent form").css("border","5px"+" "+borderStyle);
						var css="{border-width:1px;border-style:"+borderStyle+";}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					else if(borderWidth=="Medium"){
						$(".createCustomFormContent form").css("border","3px"+" "+borderStyle);
						var css="{border-width:1px;border-style:"+borderStyle+";}";
						var eleThemeCss=new EleThemeCss("Form/form",css);
						for(i=0;i<borderCss.form_element.length;i++){
							if(borderCss.form_element[i].ele=="Form/form"){
								borderCss.form_element.splice(i,1);
								break;
							}
						}
					}
					if(eleThemeCss!=undefined){
						borderCss.form_element.push(eleThemeCss);
					}
				});
				
			<!--BORDER COMPONENT FORM ELEMENTS CLICK LOGIC START -->
			<!--FONT COMPONENT FORM ELEMENTS CLICK LOGIC START -->
				$(".innerFontEleTheme select").change(function(){
					fontChangeEventHandler("elementchange");
				});
				$(".innerFontFamilyTheme select").change(function(){
					fontChangeEventHandler("fontchange");
				});
				$(".innerFontStyleDiv select").change(function(){
					
					fontChangeEventHandler("fontchange");
				});
				$(".innerFontWeightDiv select").change(function(){
					
					fontChangeEventHandler("fontchange");
				});
				$(".innerFontSizeUlDiv select").change(function(){
					fontChangeEventHandler("fontchange");
				});
				$(".innerFontTheme input").change(function(){
					fontChangeEventHandler("fontchange");
				});
				function fontChangeEventHandler(changeVal){
					var formEle=$(".innerFontEleTheme select option:selected").text();
					var fontFamilyEle=$(".innerFontFamilyTheme select").val();
					var fontStyleEle=$(".innerFontStyleDiv select").val();
					var fontWeightEle=$(".innerFontWeightDiv select").val();
					var fontSizeEle=$(".innerFontSizeDiv select").val()+"px";
					var isThemeEleExist=false;
					if(formEle=="Title"){
						for(i=0;i<fontCss.form_element.length;i++){
							if(fontCss.form_element[i].ele=="Title/form legend"){
								if(changeVal=="elementchange"){
									var fontOnlyCss = fontCss.form_element[i].css.substring(fontCss.form_element[i].css.lastIndexOf("{")+1,fontCss.form_element[i].css.lastIndexOf("}"));
									var fontOnlyCssArr = fontOnlyCss.split(";");
									$.each(fontOnlyCssArr,function(index,value){
										var fontCssSplit = value.split(":");
										if(fontCssSplit[0] == "font-family"){
											fontFamilyEle=fontCssSplit[1];
											$(".innerFontFamilyTheme select").val(fontCssSplit[1]);
										}
										else if(fontCssSplit[0] == "font-style"){
											fontStyleEle=fontCssSplit[1];
											$(".innerFontStyleDiv select").val(fontCssSplit[1]);
										}
										else if(fontCssSplit[0] == "font-weight"){
											fontWeightEle=fontCssSplit[1];
											$(".innerFontWeightDiv select").val(fontCssSplit[1]);
										}
										else if(fontCssSplit[0] == "font-size"){
											fontSizeEle=fontCssSplit[1];
											$(".innerFontSizeDiv select").val(fontCssSplit[1].substring(0,fontCssSplit[1].lastIndexOf("px")));

										}
									});
								}
								isThemeEleExist=true;
								fontCss.form_element.splice(i,1);
								break;
							}
						}
						if(changeVal=="elementchange" && !isThemeEleExist){
							
								//default
								fontFamilyEle="Arial,Arial,Helvetica,sans-serif";
								fontStyleEle="normal";
								fontWeightEle="normal";
								fontSizeEle="14px";
								$(".innerFontFamilyTheme select").val(fontFamilyEle);
								$(".innerFontStyleDiv select").val(fontStyleEle);
								$(".innerFontWeightDiv select").val(fontWeightEle);
								$(".innerFontSizeDiv select").val("14");
						}
						
						$(".createCustomFormContent form legend").css("font-family",fontFamilyEle);
						$(".createCustomFormContent form legend").css("font-style",fontStyleEle);
						$(".createCustomFormContent form legend").css("font-weight",fontWeightEle);
						$(".createCustomFormContent form legend").css("font-size",fontSizeEle);
						var css="legend{font-family:"+fontFamilyEle+";font-style:"+fontStyleEle+";font-weight:"+fontWeightEle+";font-size:"+fontSizeEle+";}";
						var eleThemeCss=new EleThemeCss("Title/form legend",css);
						
					}
					else if(formEle=="Field Label"){
						var formEle=".agile-group .agile-label";
						/*var multipleFormEleFinal="";
						var multipleFormEle=".agile-group .agile-label,.agile-group input,.agile-group .agile-group-addon,.agile-group select,.agile-group .agile-field";
						var multipleFormEleArr=multipleFormEle.split(",");
						for(i=0;i<multipleFormEleArr.length;i++){
							$(".createCustomFormContent form"+"\t"+multipleFormEleArr[i]).css("font-family",fontFamilyEle);
							$(".createCustomFormContent form"+"\t"+multipleFormEleArr[i]).css("font-style",fontStyleEle);
							$(".createCustomFormContent form"+"\t"+multipleFormEleArr[i]).css("font-weight",fontWeightEle);
							$(".createCustomFormContent form"+"\t"+multipleFormEleArr[i]).css("font-size",fontSizeEle);
						}
						var css=multipleFormEle+"{font-family:"+fontFamilyEle+"!important;font-style:"+fontStyleEle+";font-weight:"+fontWeightEle+";font-size:"+fontSizeEle+";}";*/
						for(i=0;i<fontCss.form_element.length;i++){
							if(fontCss.form_element[i].ele=="Field Label/"+formEle){
								if(changeVal == "elementchange"){
									var fontOnlyCss = fontCss.form_element[i].css.substring(fontCss.form_element[i].css.lastIndexOf("{")+1,fontCss.form_element[i].css.lastIndexOf("}"));
									var fontOnlyCssArr = fontOnlyCss.split(";");
									$.each(fontOnlyCssArr,function(index,value){
										var fontCssSplit = value.split(":");
										if(fontCssSplit[0] == "font-family"){
											fontFamilyEle=fontCssSplit[1];
											$(".innerFontFamilyTheme select").val(fontCssSplit[1]);
										}
										else if(fontCssSplit[0] == "font-style"){
											fontStyleEle=fontCssSplit[1];
											$(".innerFontStyleDiv select").val(fontCssSplit[1]);
										}
										else if(fontCssSplit[0] == "font-weight"){
											fontWeightEle=fontCssSplit[1];
											$(".innerFontWeightDiv select").val(fontCssSplit[1]);
										}
										else if(fontCssSplit[0] == "font-size"){
											fontSizeEle=fontCssSplit[1];
											$(".innerFontSizeDiv select").val(fontCssSplit[1].substring(0,fontCssSplit[1].lastIndexOf("px")));

										}
									});
								}
								isThemeEleExist = true;
								fontCss.form_element.splice(i,1);
								break;
							}
						}
						if(changeVal == "elementchange" && !isThemeEleExist){
							//default
							fontFamilyEle="Arial,Arial,Helvetica,sans-serif";
							fontStyleEle="normal";
							fontWeightEle="normal";
							fontSizeEle="14px";
							$(".innerFontFamilyTheme select").val(fontFamilyEle);
							$(".innerFontStyleDiv select").val(fontStyleEle);
							$(".innerFontWeightDiv select").val(fontWeightEle);
							$(".innerFontSizeDiv select").val("14");
						}
						var css=formEle+"{font-family:"+fontFamilyEle+"!important;font-style:"+fontStyleEle+";font-weight:"+fontWeightEle+";font-size:"+fontSizeEle+";}";
						var eleThemeCss=new EleThemeCss("Field Label/"+formEle,css);
						    $(".createCustomFormContent form .agile-group .agile-label").css("font-family",fontFamilyEle);
							$(".createCustomFormContent form .agile-group .agile-label").css("font-style",fontStyleEle);
							$(".createCustomFormContent form .agile-group .agile-label").css("font-weight",fontWeightEle);
							$(".createCustomFormContent form .agile-group .agile-label").css("font-size",fontSizeEle);
						
					}
					else if(formEle=="Button Text"){
						for(i=0;i<fontCss.form_element.length;i++){
							if(fontCss.form_element[i].ele=="Button Text/button"){
								if(changeVal == "elementchange"){
									var fontOnlyCss = fontCss.form_element[i].css.substring(fontCss.form_element[i].css.lastIndexOf("{")+1,fontCss.form_element[i].css.lastIndexOf("}"));
									var fontOnlyCssArr = fontOnlyCss.split(";");
									$.each(fontOnlyCssArr,function(index,value){
										var fontCssSplit = value.split(":");
										if(fontCssSplit[0] == "font-family"){
											fontFamilyEle=fontCssSplit[1];
											$(".innerFontFamilyTheme select").val(fontCssSplit[1]);
										}
										else if(fontCssSplit[0] == "font-style"){
											fontStyleEle=fontCssSplit[1];
											$(".innerFontStyleDiv select").val(fontCssSplit[1]);
										}
										else if(fontCssSplit[0] == "font-weight"){
											fontWeightEle=fontCssSplit[1];
											$(".innerFontWeightDiv select").val(fontCssSplit[1]);
										}
										else if(fontCssSplit[0] == "font-size"){
											fontSizeEle=fontCssSplit[1];
											$(".innerFontSizeDiv select").val(fontCssSplit[1].substring(0,fontCssSplit[1].lastIndexOf("px")));
										}
									});
								}
								isThemeEleExist = true;
								fontCss.form_element.splice(i,1);
								break;
							}
						}
						if(changeVal == "elementchange" && !isThemeEleExist){
							//default
							fontFamilyEle="Arial,Arial,Helvetica,sans-serif";
							fontStyleEle="normal";
							fontWeightEle="normal";
							fontSizeEle="14px";
							$(".innerFontFamilyTheme select").val(fontFamilyEle);
							$(".innerFontStyleDiv select").val(fontStyleEle);
							$(".innerFontWeightDiv select").val(fontWeightEle);
							$(".innerFontSizeDiv select").val("14");
						}
						$(".createCustomFormContent form button").css("font-family",fontFamilyEle);
						$(".createCustomFormContent form button").css("font-style",fontStyleEle);
						$(".createCustomFormContent form button").css("font-weight",fontWeightEle);
						$(".createCustomFormContent form button").css("font-size",fontSizeEle);
						var css=".agile-group button{font-family:"+fontFamilyEle+";font-style:"+fontStyleEle+";font-weight:"+fontWeightEle+";font-size:"+fontSizeEle+";}";
						var eleThemeCss=new EleThemeCss("Button Text/button",css);
						

					}
					fontCss.form_element.push(eleThemeCss);
						
				}

			<!--FONT COMPONENT FORM ELEMENTS CLICK LOGIC START -->
			}
		
function defaultFormEleFun(){
	$(".selectDiv  select").val("Alignment");

	$(".outerAlignmentTheme").css("display","inline");
	$(".outerBorderTheme").css("display","none");
	$(".outerFontTheme").css("display","none");
	$(".outerColorThemeEle").css("display","none");


	$(".innerAlignmentFormEle select").val("Form Title");
	$(".innerAlignmentAlignStart select").val("Center");
	$(".innerBorderThemeFormEle select").val("Form");
	$(".innerBorderWidthTheme select").val("None");
	$(".innerBorderStyleTheme").css("display","none");
	$(".innerFontEleTheme select").val("Title");
	$(".innerFontFamilyTheme select").val("Arial");
	$(".innerFontStyleDiv select").val("Normal");
	$(".innerFontWeightDiv select").val("Normal");
	$(".innerFontSizeDiv select").val("14");
	$(".innerColorThemeEle select").val("Form Border");
	$(".innerColorTheme").val("000000");
	$(".innerColorTheme").css("color","#FFFFFF");
	$(".innerColorTheme").css("background-color","#000000");
}

		