/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function MyAssets() {
    var _this = this;
    _this.data = '';
    _this.form = $('#personalAssets-form');
    
    this.init = function() {
      this.initContent();
      this.registerEvent();
    };
    this.initContent = function() {
      var datas = jh.utils.formToJson(_this.form);
      
      var page = new jh.ui.page({
        data_container: $('#myAssets_container'),
        page_container: $('#page_container'),
        method: 'post',
        url: '/task/findedList',
        contentType: 'application/json',
        data: datas,
        callback: function(returnData) {
          return jh.utils.template('myAssets-contentTemplate', returnData);
        }
      });
      page.init();
    };

    this.registerEvent = function() {
        //切换状态
        $('body').off('click', '.moneyState').on('click', '.moneyState', function() {
            $(this).addClass("active").siblings().removeClass("active");
            $('.tr-myMoney').eq($(this).index()).attr("id", "tr-moneyDetail").siblings().removeAttr("id");
        })
        $('body').off('click', '.goGetMoney').on('click', '.goGetMoney', function() {
            jh.utils.load("/src/modules/myAssets/getMoney", {});
        });
        $('.settingStyle').click(function(){
            jh.utils.load("/src/modules/myAssets/settingStyle", {});
        })
    };
  }
  module.exports = MyAssets;
});