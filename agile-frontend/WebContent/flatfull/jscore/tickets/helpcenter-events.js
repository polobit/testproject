var Helcenter_Events = {

   categorieDelete: function(el){
     
      $(".remove_categorie",el).on("click",function(e){
                       
         e.preventDefault();
         var id = $(this).data("id");
                  
         showModalConfirmation("{{agile_lng_translate 'admin-settings-tasks' 'delete-category'}}", "{{agile_lng_translate 'admin-settings-tasks' 'confirm-delete-category'}}", function(){

                     
                     
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
   },

   articleDelete: function(el){
     
      $(".remove_article",el).on("click",function(e){
                       
         e.preventDefault();
         var id = $(this).data("id");
                  
         showModalConfirmation("{{agile_lng_translate 'article' 'delete-text'}}", "{{agile_lng_translate 'article' 'delete-confirm'}}", function(){

            console.log(id);
                     
            $.ajax({
              
               url: '/core/api/knowledgebase/article/'+id,
               type: 'DELETE',
               contentType : "application/json",
               success : function(response){
                  model=App_Ticket_Module.articlesCollection.collection.get(id);
                  model.destroy();     
               }
            });                                    
                     

         }, null,null, "{{agile_lng_translate 'portlets' 'yes'}}", "{{agile_lng_translate 'portlets' 'no'}}");

      });
   },

   sectionDelete: function(el){
     
      $(".remove_section",el).on("click",function(e){
                       
         e.preventDefault();
         var id = $(this).data("id");
                  
         showModalConfirmation("{{agile_lng_translate 'section' 'delete-text'}}", "{{agile_lng_translate 'section' 'delete-confirm'}}", function(){

            console.log(id);
                     
            $.ajax({
              
               url: '/core/api/knowledgebase/section?id='+id,
               type: 'DELETE',
               contentType : "application/json",
               success : function(response){
                  model=App_Ticket_Module.sectionsCollection.collection.get(id);
                  model.destroy();     
               }
            });                                    
                     

         }, null,null, "{{agile_lng_translate 'portlets' 'yes'}}", "{{agile_lng_translate 'portlets' 'no'}}");

      });
   }



};