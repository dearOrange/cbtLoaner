/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function BindingPhone() {
        var _this = this;

        this.init = function() {
            this.registerEvent();
        };
        this.registerEvent = function() {
            $('body').off('click', '.loginCode').on('click', '.loginCode', function() {
            	var me = $(this);
                var id = me.attr("id");
                var phone = $("#bindPhoneNum").val();
                if (phone && /^1[3|4|5|6|7|8][0-9]{9}$/.test(phone)) {
                    jh.utils.ajax.send({
                        url: '/user/getSMSCode',
                        data: {
                            mobile: phone,
                            type: 6
                        },
                        done: function(returnData) {
                            jh.utils.alert({
                                content: '验证码发送成功'
                            });
                            jh.utils.smsCountDown.init(id, 'click');
                        }
                    })
                } else {
                    jh.utils.alert({
                        content: "请填写手机号"
                    })
                }
            });
            
            $('.bind-sure').on('click', function() {
                jh.utils.ajax.send({
                    url: '/user/bundling',
                    data: {
                        mobile: $.trim($("#bindPhoneNum").val()),
                        code: $.trim($('#bindPhoneCode').val())
                    },
                    done: function(returnData) {
                        jh.utils.load("/src/modules/person/person-center");
                    }
                })
            });
        };
    }
    module.exports = BindingPhone;
});