define([
       "jquery", "underscore", "backbone"
      , "views/temp-snippet"
      , "helper/pubsub"
      , "helper/formsettings"
      , "text!templates/app/renderform.html",
], function(
  $, _, Backbone
  , TempSnippetView
  , PubSub
  , FormSettings
  , _renderForm
){
  return Backbone.View.extend({
    tagName: "fieldset"
    , initialize: function(){
      this.collection.on("add", this.render, this);
      this.collection.on("remove", this.render, this);
      this.collection.on("change", this.render, this);
      PubSub.on("mySnippetDrag", this.handleSnippetDrag, this);
      PubSub.on("tempDrop", this.handleTempDrop, this);
      PubSub.on("tempMove", this.handleTempMove, this);
      this.$build = $("#build");
      this.renderForm = _.template(_renderForm);
      this.render();
    }

    , render: function(){
      saveform[0] = this.collection.models[0].attributes;
      //Render Snippet Views
      this.$el.empty();
      var that = this;
      _.each(this.collection.renderAll(), function(snippet){
        that.$el.append(snippet);
      });
      $("#render").val(that.renderForm({preload : FormSettings.getSetting("agilepreloadfields"),
	  method : FormSettings.getSetting("agileformmethod"), action : window.location.protocol + '//' + window.location.host + '/formsubmit',
	  text: _.map(this.collection.renderAllClean(), function(e){return e.html();}).join("\n")
      }));
      this.$el.appendTo("#build form");
      this.delegateEvents();
    }

    , getBottomAbove: function(eventY){
      var myFormBits = $(this.$el.find(".component"));
      var topelement = _.find(myFormBits, function(renderedSnippet) {
        if (($(renderedSnippet).position().top + $(renderedSnippet).height()) > eventY  - 90) {
          return true;
        }
        else {
          return false;
        }
      });
      if (topelement){
        return topelement;
      } else {
        return myFormBits[0];
      }
    }

    , handleSnippetDrag: function(mouseEvent, snippetModel) {
      var index = this.collection.indexOf(snippetModel);
      $("body").append(new TempSnippetView({model: snippetModel}).render());
      this.collection.remove(snippetModel);
      saveform.splice(index, 1);
      PubSub.trigger("newTempPostRender", mouseEvent);
    }

    , handleTempMove: function(mouseEvent){
      $(".target").removeClass("target");
      if(mouseEvent.pageX >= this.$build.position().left &&
          mouseEvent.pageX < (this.$build.width() + this.$build.position().left) &&
          mouseEvent.pageY >= this.$build.position().top &&
          mouseEvent.pageY < (this.$build.height() + this.$build.position().top)){
        $(this.getBottomAbove(mouseEvent.pageY)).addClass("target");
      } else {
        $(".target").removeClass("target");
      }
    }

    , handleTempDrop: function(mouseEvent, model, index){
      if(mouseEvent.pageX >= this.$build.position().left &&
         mouseEvent.pageX < (this.$build.width() + this.$build.position().left) &&
         mouseEvent.pageY >= this.$build.position().top &&
         mouseEvent.pageY < (this.$build.height() + this.$build.position().top)) {
        var index = $(".target").index();
        $(".target").removeClass("target");
        this.collection.add(model,{at: index+1});
        saveform.splice((index+1),0,model.attributes);
      } else {
        $(".target").removeClass("target");
      }
    }
  })
});