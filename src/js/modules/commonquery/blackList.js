/**
 * FrameNumber
 * @authors jiaguishan
 * @date    2018-03-09 15:03:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function BlackList() {
    this.init = function() {
        this.registerEvent();
        $('select').select2({
            minimumResultsForSearch: Infinity
        });
        setTimeout(function() {
          jh.utils.changeText($('#breadCrumb'), '>车辆查询>行业黑名单查询');
        }, 0)
    };
    this.registerEvent = function() {
      //查询
      jh.utils.validator.init({
        id: 'blackList-form',
        submitHandler: function(form) {
          var datas = jh.utils.formToJson(form);
          jh.utils.ajax.send({
            url: '/query/blackList',
            method: 'get',
            data: datas,
            done: function(returnData) {
              returnData.dataLen = returnData.data.length;
              var str = jh.utils.template('blackList-result-template', returnData);
              $('#blackList-content').html(str);
              return false;
            }
          });
        }
      });
    };
  }
  module.exports = BlackList;
});