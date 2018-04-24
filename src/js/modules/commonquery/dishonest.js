/**
 * Dishonest
 * @authors jiaguishan
 * @date    2018-03-09 17:16:39
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function Dishonest() {
      var _this = this;
    this.init = function() {
      this.registerEvent();
      setTimeout(function() {
        jh.utils.changeText($('#breadCrumb'), '>车辆查询>失信人名单查询');
      }, 0)
    };
    this.registerEvent = function() {
      //查询
      jh.utils.validator.init({
        id: 'dishonest-form',
        submitHandler: function(form) {
          var datas = jh.utils.formToJson(form);
          jh.utils.ajax.send({
            url: '/query/dishonest',
            method: 'get',
            data: datas,
            done: function(returnData) {
                var str = jh.utils.template('dishonest-result-template', returnData);
                $('#dishonest-content').html(str);
                _this.alertDetail(returnData);
                return false;
            }
          });
        }
      });
    };
    this.alertDetail = function(data) {
        $('body').off('click', '#find-dishonest-detail').on('click', '#find-dishonest-detail', function() {
            _this.id = $(this).data('id');
            var dishonestStr = jh.utils.template('dishonest-detail-template', data.data.dishonestList[_this.id]);
            jh.utils.alert({
                title: '详情',
                content: dishonestStr
            })
        });
    }
  }
  module.exports = Dishonest;
});