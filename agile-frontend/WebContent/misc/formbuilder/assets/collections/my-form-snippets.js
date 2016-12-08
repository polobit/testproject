define([
       "jquery" , "underscore" , "backbone"
       , "models/snippet"
       , "collections/snippets" 
       , "views/my-form-snippet"
       , "collections/my-form-snippets"
       , "views/my-form"
], function(
  $, _, Backbone
  , SnippetModel
  , SnippetsCollection
  , MyFormSnippetView
  , MyFormSnippetsCollection
  , MyFormView
){
  return SnippetsCollection.extend({
    model: SnippetModel
    , initialize: function() {
       this.counter = {};
       this.on("add", this.giveUniqueId);
     }
 
     , giveUniqueId: function(snippet){
       
       if(snippet.attributes.fields.id){
       
       var snippetType = snippet.attributes.fields.id.value;

       if(!(isFinite(Math.max.apply(null, snippetType.match(/(\d+)/g))))){
       var idArray = "";
        for(var i=1; i<=saveform.length-1; i++){
        if(saveform[i].fields.id)
        idArray += saveform[i].fields.id.value+",";
       }
       //regex function to seperate numbers form id
      var largest = Math.max.apply(null, idArray.match(/(\d+)/g));
       
       if(typeof this.counter[snippetType] == "undefined") {
        if(isFinite(largest))
          this.counter[snippetType] = largest+1;
        else
         this.counter[snippetType] = (saveform.length);
       } else {
         this.counter[snippetType] += 1;
       }
 
       snippet.setField("id", snippetType + "-" + this.counter[snippetType]);
      }
    }
    else if(snippet.attributes.fields.name){
      var snippetType = snippet.attributes.fields.name.value;
      var snippet_Index = snippetType.lastIndexOf("_");
      var snippet_Substr = snippetType.substr(snippet_Index+1,snippet_Index.length);
      if(isNaN(snippet_Substr)){
        snippetType = snippetType+"_"+$.now();
        snippet.setField("name",snippetType);
      }
    }
  }
    , renderAll: function(){
      return this.map(function(snippet){
        return new MyFormSnippetView({model: snippet}).render(true);
      })
    }
    , renderAllClean: function(){
      return this.map(function(snippet){
        return new MyFormSnippetView({model: snippet}).render(false);
      });
    }
  });
});