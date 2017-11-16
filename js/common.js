var cbt = cbt || {
    version: '1.0.0'
};
cbt.utils = cbt.utils || {}; //公共函数

var ROOTURL = '/hunter';/*项目根目录名称 谨慎修改*/
var REQUESTROOT = '/hunterServer'; /*服务器默认为/manager 当本地开发时切换为域名映射*/
if(window.location.hostname === 'local.cbt.com'){
    REQUESTROOT = 'http://test.cbt.com:8080/hunterServer';
}
$.ajaxSetup({
  beforeSend:function(xhr){
    var token = $.cookie('X-Token');
    xhr.setRequestHeader("X-Token", token);
  }
});