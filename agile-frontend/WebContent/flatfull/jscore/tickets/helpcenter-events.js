var Helcenter_Events = {

   categorieDelete: function(el){
     
      $(".remove_categorie",el).on("click",function(e){
                       
         e.preventDefault();
         var id = $(this).data("id");
                  
         showModalConfirmation("Delete Category", "Are you sure, you want to delete category ", function(){

                     
                     
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
                     

         }, null,null, "Yes", "No");

      });
   },

   articleDelete: function(el){
     
      $(".remove_article",el).on("click",function(e){
                       
         e.preventDefault();
         var id = $(this).data("id");
                  
         showModalConfirmation("Delete Article", "Are you sure, you want to delete article", function(){

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
                     

         }, null,null, "Yes", "No");

      });
   },

   sectionDelete: function(el){
     
      $(".remove_section",el).on("click",function(e){
                       
         e.preventDefault();
         var id = $(this).data("id");
                  
         showModalConfirmation("Delete Section", "Are you sure, you want to delete section", function(){

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
                     

         }, null,null, "Yes", "No");

      });
   }



};