(function(global){
  var Rout = function rout(Conf) {
    //set standart position (index)
    global.location.hash=Conf.index||'';
    //set the Vars
    this.setVars();
    //set the triggers
    this.setTriggers();
    //Save Conf
    this.Config=Conf;
    return this;
    };
  Rout.prototype.setVars = function () {
      this.Routs = [];    //Objects {"link":"/link/mask",function}
      this.Rout404 = {};  //Object  {function} function for work in error 404
      this.Config = {};   //Object  {"index":"/index"}
      this.History = [];  //Objects {"link":"/link/mask",function,'location':'/link/page','active':bollean}
  }
  /*
    ????????????? ??????????? 
  */
  Rout.prototype.setTriggers=function(){
    var t=this;
    if('onhashchange' in global) global.addEventListener("hashchange", function(){t.trigger.call(t)}, false);
    if('onpopstate' in global) global.addEventListener("onpopstate", function(){t.trigger.call(t)}, false);
  };
  /*
    ????????? Rout ???????.
    var RoutObject - {"link":"/link/mask",function};
  */
  Rout.prototype.addLink=function(RoutObject){
    var isSet=false;
    if(this.Routs.length>0){
      for(var key in this.Routs){
        if(this.Routs[key]['link']==RoutObject['link']) isSet=true;
      }
    }
    if(!isSet) this.Routs[this.Routs.length]=RoutObject;
    if(this.History.length<1) this.trigger();
    return this;
  };
  /*
    ????????? ??????????? ??????? ???????? 404.
    var RoutObject - {"link":"/link/mask",function};
  */
  Rout.prototype.set404=function(RoutObject){
    this.Rout404=RoutObject;
    return this;
  };
  /*
    ??????? ? ????? ???????????? ? ??????? Routs.
    ? ?????? ???? ???????? ?????? ??????? ?????????? ??????????? ??????? Rout404
  */
  Rout.prototype.trigger = function () {
    for(var index in this.Routs){
      var LocationHash=global.location.hash.substring(1),TestRout=this.Routs[index]['link'];
      if(this.testLink(TestRout,LocationHash)) {
          this.addHistory(this.Routs[index], LocationHash);
        return this.CallFunction(this.Routs[index],LocationHash);
      }
    } console.warn('WARNING: no link established. 404!');
    if(typeof this.Rout404!='undefined') return this.CallFunction(this.Rout404,false);
  };
  /*
    ????? ?????????? Rout.
    var RoutObject - {"link":"/link/mask",function}
    var Link - string
  */
  Rout.prototype.CallFunction=function(RoutObject,Link){
      if (Link != false) RoutObject['function'].call(this.RoutScoup(RoutObject, Link));
      else if (typeof RoutObject['function'] != 'undefined') RoutObject['function'].call({ 'error': 404, 'msg': 'WARNING: no link established' });
      else console.warn(this,RoutObject, Link);
  }
  /*
    ????????? ?????? ?? ???????????? ? ?????????? Rout.
    var RoutObject - {"link":"/link/mask",function}
    var Link - string
  */
  Rout.prototype.testLink=function(RoutLink,Link){
    return (new RegExp('^'+RoutLink.replace(/\(\:[a-z0-9]+\)/i,'')+'$','i')).test(Link);
  };
  /*
    ????????? url ??? ????????? ?????????? ?? url.
    URL ?????? ???? ????????? ??? ?????????????? JavaScript RegExp ?? ???????????? ??????? ???? (:varName) ???????????? ????? ?????????? ? ??????? ????? ???????????? ?????? ?? url.
    var RoutObject - {"link":"/link/mask",function}
    var Link - string (??????: /page/(:id)[0-9]+)
  */
  Rout.prototype.RoutScoup=function(RoutObject,Link){
    if(/\(\:[a-z-0-9_]+\)/i.test(RoutObject['link'])){
      var LinkArray=Link.split('/'); var RoutArray=RoutObject['link'].split('/'); var Reusult={};
      for(var index in RoutArray){
        if(/\(\:[a-z-0-9_]+\)/i.test(RoutArray[index])){
          var Name=RoutArray[index].match(/\(\:[a-z-0-9_]+\)/i)[0]; Name = Name.substring(2,Name.length-1);
          Reusult[Name]=LinkArray[index];
        }
      }
      return Reusult;
    } else return {};
  };
  /*
    ????????? ???????.
  */
  Rout.prototype.getHistory = function(){
      return this.History;
  };
  /*
    ?????????? Rout ? ???????.
    var RoutObject - {"link":"/link/mask",function}
    var Link - string
  */
  Rout.prototype.addHistory = function(RoutObject, Location){
      this.unActive();
      var HistoryElement = RoutObject; HistoryElement['location'] = Location; HistoryElement['active'] = true; this.History[this.History.length] = HistoryElement;
  };
  /*
    ???????????? ??? ???????? ???????.
  */
  Rout.prototype.unActive = function(){
      for(var i in this.History) this.History[i]['active'] = false;
  };
  /*
    ?????????? ???????? ??????? ??????? ? ???????? ???.
  */
  Rout.prototype.go = function (to) {
      this.unActive();
      if(to >= 0){
          this.History[to]['active'] = true;
          this.CallFunction(this.History[to],this.History[to]['location']);
      } else {
          var positon = this.History.length - 1 + (to);
          this.History[positon]['active'] = true;
          this.CallFunction(this.History[positon], this.History[positon]['location']);
      } return this;
  };
  Rout.prototype.back = function(){
      return this.go(-1);
  };
  /*
  Rout.prototype.Routs=[];    //Objects {"link":"/link/mask",function}
  Rout.prototype.Rout404={};  //Object  {function} function for work in error 404
  Rout.prototype.Config={};   //Object  {"index":"/index"}
  Rout.prototype.History=[];  //Objects {"link":"/link/mask",function,'location':'/link/page','active':bollean}
  */
  //Export
  global.RouteCross=Rout;
})(window);
