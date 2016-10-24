
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
			
			/*themeArray=[alignmentCss,borderCss,fontCss,bckgroundCss];*/
			themeArray=[alignmentCss,borderCss,fontCss,bckgroundCss,colorCss];
			<!--DEFAULT SELECTSPAN VALUE AND DISPLAYING--> 
			<!--ITS CORRESPONDING COMPONENTS -->

			var selectedSelectThemeEle=$(".selectDiv select option:selected").text();
			if(selectedSelectThemeEle=="Alignment"){
				$(".outerAlignmentTheme").css("display","inline");
				/*$(".createCustomFormContent legend").css("margin-left","-14px");
					$(".createCustomFormContent legend").css(" width","432px");
					$(".createCustomFormContent legend").css("padding-top","15px");
					$(".createCustomFormContent legend").css("padding-right","26px");*/
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
			/*else if(selectedSelectThemeEle=="Background"){
				$(".outerBackgroundTheme").css("display","inline");
			}*/
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
					
   					/*$(".createCustomFormContent legend").css("margin-left","-14px");
					$(".createCustomFormContent legend").css(" width","432px");
					$(".createCustomFormContent legend").css("padding-top","15px");
					$(".createCustomFormContent legend").css("padding-right","26px");*/
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
					/*$("form").css("background-color",backgroundColorVal);
					$("form").css("background","url("+backgroundImgEle+")");*/
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
					/*$(".createCustomFormContent form button").parent().parent().css("margin","0px -14px -10px -14px");*/
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
					/*$(".createCustomFormContent form button").parent().parent().css("margin","0px -14px -10px -14px");*/
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
					/*$(".createCustomFormContent form button").parent().parent().css("margin","0px -14px -10px -14px");*/
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
					colorEleFunc();
				});
				$(".colorTheme input").change(function(e){
					colorEleFunc();

				});
				function colorEleFunc(){
					var themeEle = $(".innerColorThemeEle select option:selected").text();
					var themecolor ="#"+$(".colorTheme input").val();
					var borderWidth=$(".innerBorderWidthTheme select option:selected").text();
					var borderStyle= null;
					if(themeEle == "FormBorder"){

						if(borderWidth != "None"){
							$(".innerBorderStyleTheme li").each(function(){
								if($(this).hasClass("selected")){
									borderStyle=$(this).find("p").attr("name");
								}

							});
							$(".createCustomFormContent form").css("border",borderWidth+"\t"+borderStyle+"\t"+themecolor);
							var css="{border:"+borderWidth+"\t"+borderStyle+"\t"+themecolor+"}";
							var eleThemeCss=new EleThemeCss("FormBorder/formBorder",css);
							for(i=0;i<colorCss.form_element.length;i++){
								if(colorCss.form_element[i].ele=="FormBorder/formBorder"){
									colorCss.form_element.splice(i,1);
									break;
								}
							}
						}

						
					}
					else if(themeEle == "FormBackground"){
						$(".createCustomFormContent form").css("background-color",themecolor);
						var css="{background-color:"+themecolor+"}";
						var eleThemeCss=new EleThemeCss("FormBackground/FormBackground",css);
						for(i=0;i<colorCss.form_element.length;i++){
							if(colorCss.form_element[i].ele=="FormBackground/FormBackground"){
								colorCss.form_element.splice(i,1);
								break;
							}
						}
					}
					else if(themeEle == "Title"){
						$(".createCustomFormContent legend").css("color",themecolor);
						var css="legend{color:"+themecolor+"}";
						var eleThemeCss=new EleThemeCss("Title/title",css);
						for(i=0;i<colorCss.form_element.length;i++){
							if(colorCss.form_element[i].ele=="Title/title"){
								colorCss.form_element.splice(i,1);
								break;
							}
						}	
					}
					else if(themeEle == "FieldLabel"){
						$(".createCustomFormContent .agile-group .agile-label").css("color",themecolor);	
					    var css=".agile-group .agile-label{border-color:"+themecolor+"}";
						var eleThemeCss=new EleThemeCss("FieldLabel/fieldLabel",css);
						for(i=0;i<colorCss.form_element.length;i++){
							if(colorCss.form_element[i].ele=="FieldLabel/fieldLabel"){
								colorCss.form_element.splice(i,1);
								break;
							}
						}
					}
					else if(themeEle == "ButtonText"){
						$(".createCustomFormContent .agile-group .agile-field button").css("color",themecolor);	
					    var css=".agile-group .agile-field button{color:"+themecolor+"}";
						var eleThemeCss=new EleThemeCss("ButtonText/buttonText",css);
						for(i=0;i<colorCss.form_element.length;i++){
							if(colorCss.form_element[i].ele=="ButtonText/buttonText"){
								colorCss.form_element.splice(i,1);
								break;
							}
						}
					}
					else if(themeEle == "ButtonBackground"){
						$(".createCustomFormContent .agile-group .agile-field button").css("background-color",themecolor);
					    var css=".agile-group .agile-field button{background-color:"+themecolor+"}";
						var eleThemeCss=new EleThemeCss("ButtonBackground/buttonBackground",css);
						for(i=0;i<colorCss.form_element.length;i++){
							if(colorCss.form_element[i].ele=="ButtonBackground/buttonBackground"){
								colorCss.form_element.splice(i,1);
								break;
							}
						}
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
					/*borderColor=$(".innerBorderTheme input").val();*/
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
						/*var css="{border-width:1px;border-style:"+borderStyle+";}";*/
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
						/*var css="{border-width:1px;border-style:"+borderStyle+";}";*/
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
					
					/*borderColor=$(".innerBorderTheme input").val();*/
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
						/*$(".createCustomFormContent form").css("border","1px"+"\t"+borderStyle+"\t"+"#"+borderColor);
						var css="{border:1px"+"\t"+borderStyle+"\t"+"#"+borderColor+"}";*/
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
						/*var css="{border-width:5px;border-style:"+borderStyle+";}";*/
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
						/*var css="{border-width:3px;border-style:"+borderStyle+";}";*/
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
					/*var borderColor=$(e.currentTarget).val();*/
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
						$(".createCustomFormContent form").css("border","1px"+"\t"+borderStyle);
						/*var css="{border:1px"+"\t"+borderStyle+"\t"+"#"+borderColor+"}";*/
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
						/*var css="{border:5px"+"\t"+borderStyle+"\t"+"#"+borderColor+"}";*/
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
						/*var css="{border:3px"+"\t"+borderStyle+"\t"+"#"+borderColor+"}";*/
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
					/*var fontThemeColor="#"+$(".innerFontTheme input").val();*/
					/*var fontThemeColor=$(e.currentTarget).val();*/
					console.log(formEle+"\t"+fontFamilyEle+"\t"+fontStyleEle+"\t"+fontWeightEle+"\t"+fontSizeEle);
					if(formEle=="Title"){
						$(".createCustomFormContent form legend").css("font-family",fontFamilyEle);
						$(".createCustomFormContent form legend").css("font-style",fontStyleEle);
						$(".createCustomFormContent form legend").css("font-weight",fontWeightEle);
						$(".createCustomFormContent form legend").css("font-size",fontSizeEle);
						/*$(".createCustomFormContent form legend").css("color",fontThemeColor);*/
                        /*var css="legend{font-family:"+fontFamilyEle+";font-style:"+fontStyleEle+";font-weight:"+fontWeightEle+";font-size:"+fontSizeEle+";color:"+fontThemeColor+";}";*/
						var css="legend{font-family:"+fontFamilyEle+";font-style:"+fontStyleEle+";font-weight:"+fontWeightEle+";font-size:"+fontSizeEle+";}";
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
						var multipleFormEle=".agile-group .agile-label,.agile-group input[type=text],.agile-group input[type=hidden],.agile-group .agile-group-addon,.agile-group select,.agile-group input[type=checkbox],.agile-group input[type=radio]";
						var multipleFormEleArr=multipleFormEle.split(",");
						for(i=0;i<multipleFormEleArr.length;i++){
							multipleFormEleFinal=multipleFormEleFinal+".createCustomFormContent"+"\t"+multipleFormEleArr[0]+",";
						}
						multipleFormEleFinal=multipleFormEleFinal.substring(0,multipleFormEleFinal.lastIndexOf(","));
						$(multipleFormEleFinal).css("font-family",fontFamilyEle);
						$(multipleFormEleFinal).css("font-style",fontStyleEle);
						$(multipleFormEleFinal).css("font-weight",fontWeightEle);
						$(multipleFormEleFinal).css("font-size",fontSizeEle);
						/*$(multipleFormEleFinal).css("color",fontThemeColor);*/
						var css=multipleFormEle+"{font-family:"+fontFamilyEle+";font-style:"+fontStyleEle+";font-weight:"+fontWeightEle+";font-size:"+fontSizeEle+";}";
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
						/*$(".createCustomFormContent form button").css("color",fontThemeColor);*/
						var css=".agile-group button{font-family:"+fontFamilyEle+";font-style:"+fontStyleEle+";font-weight:"+fontWeightEle+";font-size:"+fontSizeEle+";}";
						var eleThemeCss=new EleThemeCss("Button Text/button",css);
						for(i=0;i<fontCss.form_element.length;i++){
							if(fontCss.form_element[i].ele=="Button Text/button"){
								fontCss.form_element.splice(i,1);
								break;
							}
						}
					}
					fontCss.form_element.push(eleThemeCss);
						
				}

			<!--FONT COMPONENT FORM ELEMENTS CLICK LOGIC START -->
			}
		


		