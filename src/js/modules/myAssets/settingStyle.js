/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function SettingStyle() {
    var _this = this;
    this.init = function() {
      this.initContent();
      this.registerEvent();
      setTimeout(function() {
        jh.utils.changeText($('#breadCrumb'), '>个人资产>设置提现方式');
      }, 0)
    };
    this.initContent = function() {
      jh.utils.ajax.send({
        url: '/user/userInfo',
        done: function(returnData) {
          $('#alipay').val(returnData.data.alipay);
          $('#alipayName').val(returnData.data.alipayName);
          $('#bankCard').val(returnData.data.bankCard);
          $('#bankName').val(returnData.data.bankName);
          $('#payeeName').val(returnData.data.payeeName);
        }
      });
    };
    this.registerEvent = function() {
        jh.utils.validator.init({
            id: 'settingStyle-form',
            submitHandler: function(form) {
                var datas = jh.utils.formToJson(form); //表单数据
                if(!datas.alipay && !datas.bankCard) {
                    jh.utils.alert({
                        content: '提现方式必须填一种',
                        ok: true
                    })
                    return false;
                };
                jh.utils.ajax.send({
                    url: '/user/setWithdrawalWay',
                    method: 'post',
                    data: datas,
                    done: function(returnData) {
                      jh.utils.alert({
                          content: '设置成功，去提现吧',
                          ok: true
                      })
                    }
                });
                return false;
            }
        });
    };
  }
  module.exports = SettingStyle;
});