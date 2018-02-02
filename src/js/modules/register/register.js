/**
 * 注册
 * @authors jiaguishan (http://tammylights.com)
 * @date    2017-04-10 19:06:37
 * @version 1.0
 */

'use strict';
define(function(require, exports, module) {
    function Register() {
        var _this = this;
        _this.key = '';
        this.init = function() {
            this.initPlugins();
            this.registerEvent();
        };
        this.initPlugins = function() {
            window.jh = require('common'); //自定义对象
            jh.utils.template = require('template'); //为自定义函数
        };

        this.registerEvent = function() {
            jh.utils.validator.init({
                id: 'form_register',
                submitHandler: function(form) {
                    var datas = jh.utils.formToJson(form); //表单数据
                    jh.utils.ajax.send({
                        url: '/user/register',
                        method: 'post',
                        data: datas,
                        done: function(returnData) {
                            if (returnData.code === 'SUCCESS') {
                                $('.registerForm').css('display', 'none');
                                $('.registers-form').css('display', 'block');
                            }
                        }
                    });
                    return false;
                }
            });
            $('.loginCode').click(function() {
                var me = $(this);
                var id = me.attr("id");
                var phone = me.siblings(".phoneNumber").val();
                if (phone && /^1[3|4|5|6|7|8][0-9]{9}$/.test(phone)) {
                    jh.utils.ajax.send({
                        url: '/user/getSMSCode',
                        data: {
                            mobile: phone,
                            type: 2
                        },
                        done: function(returnData) {
                            jh.utils.alert({
                                content: '验证码发送成功'
                            });
                            var temp = new jh.utils.smsCountDown();
                            temp.init(id, 'click');
                        }
                    })
                } else {
                    jh.utils.alert({
                        content: "请填写手机号"
                    })
                }

            })

        };
    }
    module.exports = Register;
});