var Helcenter_Events = {

	initializeStatuscheckbox : function(el){
   		

   		$(".article_status",el).off();	
   		$(".article_status",el).on("change" ,function(){

            var msg = "Do you want to publish the article";
            var article_id = $(this,el).closest("td").data("id");   
            var flag = $( "."+article_id ).is(":checked");
            
            if(!flag)
            	msg = "{{agile_lng_translate 'article' 'save-as-draft'}}";     

   				var data = true;

                   if(!flag)
                      data = false; 
                    
               showModalConfirmation("{{agile_lng_translate 'widgets' 'status'}}", msg, function(){
   					
                  if(!App_Helpcenter_Module.articlesCollection)
                        return;
                
                  var newArticleModel = new BaseModel();
                 
                  newArticleModel.url = "/core/api/knowledgebase/article/update-status/" +article_id;
               
                  var json = {} ;
                   
                  json = {"id":article_id,"is_article_published":flag };

                  newArticleModel.save(json, {
                    
                     success: function(model){

                        if(App_Helpcenter_Module.articlesCollection.collection){
                           
                             // Get data from collection with id
                              var model = App_Helpcenter_Module.articlesCollection.collection.get(article_id);

                              //Update data in model
                              model.set({"id":article_id,"is_article_published":data}, {silent: true});
                        }
                           
                     }

                  });
                  
   				  }, function(){
                    
                     if(!flag)
                        $("."+article_id,el).prop('checked','true');
                     else   
                        $("."+article_id,el).removeAttr('checked');  
                                    
               },null);
   		});
	},

   categorieDelete: function(el){
     
      $(".remove_categorie",el).on("click",function(e){
                       
         e.preventDefault();
         var id = $(this).data("id");
                  
         showModalConfirmation("{{agile_lng_translate 'admin-settings-tasks' 'delete-category'}}", "{{agile_lng_translate 'admin-settings-tasks' 'confirm-delete-category'}} ", function(){

                     
                     
            console.log(id);
                     
            $.ajax({
              
               url: '/core/api/knowledgebase/categorie/'+id,
               type: 'DELETE',
               contentType : "application/json",
               success : function(response){
                  model=App_Helpcenter_Module.categoriesCollection.collection.get(id);
                  model.destroy();     
               }
            });                                    
                     

         }, null,null, "{{agile_lng_translate 'portlets' 'yes'}}", "{{agile_lng_translate 'portlets' 'no'}}");

      });
   }


};