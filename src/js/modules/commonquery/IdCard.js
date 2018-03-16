/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function IdCard() {
        var _this = this;
        this.init = function() {
            this.registerEvent();
        };
        this.registerEvent = function() {
            jh.utils.validator.init({
                id: 'IdCard_form',
                submitHandler: function(form) {
                    var cardData = jh.utils.formToJson(form); //表单数据
                    jh.utils.ajax.send({
                        url: '/query/idNumber',
                        method: 'get',
                        data: cardData,
                        done: function(returnData) {
                            var str = jh.utils.template('IdCard-detail-template', returnData);
                            $('#idCard-content').html(str);
                            return false;
                        }
                    });
                }
            });
        };
    }
    module.exports = IdCard;
});