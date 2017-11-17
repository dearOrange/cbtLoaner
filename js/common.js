var cbt = cbt || {
    version: '1.0.0'
};
cbt.utils = cbt.utils || {}; //公共函数

var ROOTURL = '/hunter';/*项目根目录名称 谨慎修改*/
var REQUESTROOT = '/hunterServer'; /*服务器默认为/manager 当本地开发时切换为域名映射*/
var qiniuURL = '';
if(window.location.hostname === 'local.cbt.com'){
    REQUESTROOT = 'http://test.cbt.com:8080/hunterServer';
    qiniuURL = 'http://test.cbt.com:8080/adminServer';
}else{
  REQUESTROOT = 'http://192.168.2.181:8080/hunterServer';
  qiniuURL = 'http://192.168.2.181:8080/adminServer';
}
$.ajaxSetup({
  beforeSend:function(xhr){
    var token = $.cookie('X-Token');
    xhr.setRequestHeader("X-Token", token);
  }
});
cbt.utils.bottomBar = {
  init:function(){
    var _this = this;
    _this.initHtml();
    _this.initEvents();
    _this.initActiveState();
  },
  initHtml:function(){
    var role = $.cookie('userRole');
    var source = '<div id="bottomBar">'
    +    '<ul>'
    +        '<li data-target="'+ROOTURL+'/searchCar.html"><i class="searchCar"></i></li>'
    +        '<li data-target="'+ROOTURL+'/carList.html"><i class="list"></i></li>'
    +        '<li data-target="'+ROOTURL+'/personCenter.html"><i class="userCenter"></i></li>';
    if( role==="type_A" ){
      source += '<li data-target="'+ROOTURL+'/inCome.html"><i class="log"></i></li>';
    }
    source += '</ul></div>';
    $('body').find('#bottomBar').remove();
    $('body').append(source);
  },
  initEvents:function(){
    $('#bottomBar').off('click','li').on('click','li',function(){
      var me = $(this);
      me.addClass('active').siblings().removeClass('active');
      var targetTo = me.data('target');
      window.location.href = targetTo;
    });
  },
  initActiveState:function(){
    var pathname = window.location.pathname;
    var list = $('#bottomBar').find('li');
    if(list.length===3){
      list.css('width','33.3%');
    }
    for(var i = 0;i<list.length;i++){
      var item = list.eq(i);
      if(item.data('target') === pathname){
        item.addClass('active').siblings().removeClass('active');
        break;
      }
    }
  }
};
