var BaseView = Backbone.View.extend({
  initialize:function(data){
    data=data||{};
    if(typeof data == "string"){
      data={id:data};
    }
    _.extend(this,data);

    if(!this.template && (this.template=document.getElementById(this.id))){
      this.template=document.getElementById(this.id);
    }
  },
  render:function(payload){
    this.el=this.template.innerHTML;
    return this;
  }
});
var app = (function(){
  var AppView = Backbone.View.extend({
    initialize:function(){
      this.render("loading");
      getXHR("https://wiki.wetfish.net/api/v1/auth",function(err,data,scope){
        var contentType;
        if(err){
          scope.render("error");
        }
        else{
          try{
            contentType=data.getResponseHeader("content-type").split(";")[0];
            if(contentType === "text/html"){
              scope.render("auth",data.response);
            }
            else{//todo test possible conditions 
              scope.render("bookmark",data.response);
            }
          }
          catch(e){
            scope.render("error");
            console.error(e);
          }
        }
      },this);
    },
    el:document.getElementById("app"),
    views:{
      auth: new BaseView("auth"),
      bookmark: new BaseView("bookmark"),
      error: new BaseView("error"),
      settings: new BaseView("settings"),
      history: new BaseView("history"),
      loading:  new BaseView("loading")
    },
    render:function(view, payload){
      if(!this.views[view].render){
        view="error";
      }
      this.$el.html(this.views[view].render(payload).el);
    }
  });
  return new AppView();
})();

//dumb convience methods because I hate jQuery syntax.
function getXHR(url,cb,scope){
  var request = new XMLHttpRequest();
  scope = scope ? scope : this;
  request.open("GET", url, true);
  request.onload = function(result) {
    cb(null, request, scope);
  };
  request.onerror = function(err) {
    cb(err, null, scope);
  };
  request.send();
}
