/**
 * FrameNumber
 * @authors jiaguishan
 * @date    2018-03-09 15:03:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function FrameNumber() {
    this.init = function() {
      this.registerEvent();
    };
    this.registerEvent = function() {
      //查询
      jh.utils.validator.init({
        id: 'frameNumber-form',
        submitHandler: function(form) {
          var datas = jh.utils.formToJson(form);
          jh.utils.ajax.send({
            url: '/query/vin',
            method: 'get',
            data: datas,
            done: function(returnData) {
                var str = jh.utils.template('frameNumber-detail-template', returnData);
                $('#frameNumber-content').html(str);
                return false;
            }
          });
        }
      });
    };
  }
  module.exports = FrameNumber;
});