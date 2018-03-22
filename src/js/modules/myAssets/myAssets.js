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
    _this.url = '/user/incomeRecord';
    _this.templateName = 'myAssets-contentTemplate';
    _this.form = $('#personalAssets-form');
    
    this.init = function() {
      this.initMoney();
      this.initContent();
      this.registerEvent();
    };
    this.initContent = function() {
      var datas = jh.utils.formToJson(_this.form);  
      var page = new jh.ui.page({
        data_container: $('#myAssets_container'),
        page_container: $('#page_container'),
        method: 'post',
        url: _this.url,
        contentType: 'application/json',
        data: datas,
        callback: function(returnData) {
          return jh.utils.template( _this.templateName, returnData);
        }
      });
      page.init();
    };
    this.initMoney = function() {
        jh.utils.ajax.send({
            url: '/user/balance',
            done: function(returnData) {
                $('#totalMoney').html(returnData.data.fund);
            }
        });
    };
    this.registerEvent = function() {
        //切换状态
        $('body').off('click', '.moneyState').on('click', '.moneyState', function() {
            var mine = $(this);
            var index = mine.index();
            _this.url = mine.data('value') === 2 ? '/user/incomeRecord' : '/user/applyWithdrawRecord';
            _this.templateName = mine.data('value') === 2 ? 'myAssets-contentTemplate' : 'getMoney-contentTemplate';
            mine.addClass("active").siblings().removeClass("active");
            $('#myAssets_table tr').eq(index).removeClass("hide").siblings().addClass("hide");
            _this.initContent();
        });
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