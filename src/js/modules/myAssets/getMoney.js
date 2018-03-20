/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function GetMoney() {
    var _this = this;
    _this.form = $('#getMoney-form');
    
    this.init = function() {
      this.registerEvent();
    };

    this.registerEvent = function() {
        jh.utils.validator.init({
            id: 'getMoney-form',
            submitHandler: function(form) {
                var datas = jh.utils.formToJson(form); //表单数据
                jh.utils.ajax.send({
                    url: '/user/applyWithdraw',
                    method: 'post',
                    data: datas,
                    done: function(returnData) {
                        
                    }
                });
                return false;
            }
        });
    };
  }
  module.exports = GetMoney;
});