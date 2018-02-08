/**
 * 登录
 * @authors jiaguishan (http://tammylights.com)
 * @date    2017-04-10 19:06:37
 * @version 1.0
 */

'use strict';
define(function(require, exports, module) {
    function Login() {
        var _this = this;
        _this.key = '';
        this.init = function() {
            this.initPlugins();
            this.registerEvent();
            $('.goLogin').click(function() {
                window.location.reload();
            })
        };

        this.initPlugins = function() {
            window.jh = require('common'); //自定义对象
            jh.utils.template = require('template'); //为自定义函数
        };

        this.registerEvent = function() {
            var states;
            jh.utils.validator.init({
                id: 'form_login',
                submitHandler: function(form) {
                    var datas = jh.utils.formToJson(form); //表单数据
                    var urls = states == 1 ? '/user/authLogin' : '/user/codeLogin';
                    jh.utils.ajax.send({
                        url: urls,
                        method: 'post',
                        data: datas,
                        done: function(returnData) {
                            datas.username && sessionStorage.setItem('customer-username', datas.username);
                            datas.mobile && sessionStorage.setItem('customer-username', datas.mobile);
                            sessionStorage.setItem('customer-X-Token', returnData.data.token);
                            sessionStorage.setItem('customer-isState', returnData.data.state);
//                          if (returnData.data.state == 'available') {
//                              window.location.href = jh.config.pageIndex;
//                          } else {
//                              window.location.href = ROOTURL + '/src/modules/index/index.html#routeModule=/src/modules/person/person-center#routeData=';
//                          }

                           	var targetUrl = window.location.protocol + '//' + window.location.host ;
                           	if (returnData.data.state == 'available') {
                               	targetUrl +=jh.config.pageIndex;
                           	} else {
                               targetUrl +='/src/modules/index/index.html#routeModule=/src/modules/person/person-center#routeData=';
                           	}
                           	targetUrl = encodeURIComponent(targetUrl);
                           	window.location.href = signAdress + targetUrl;

                        }
                    });
                    return false;
                }
            });
            jh.utils.validator.init({
                id: 'form_forget',
                submitHandler: function(form) {
                    var datas = jh.utils.formToJson(form); //表单数据
                    jh.utils.ajax.send({
                        url: '/user/findPassword',
                        method: 'post',
                        data: datas,
                        done: function(returnData) {
                            window.location.href = '/src/modules/login/login.html'
                        }
                    });
                    return false;
                }
            })
            $('.loginCode').click(function() {
                var me = $(this);
                var id = me.attr("id");
                var typeNum = id === 'phoneLogin-getCheckcode' ? 1 : 4;
                var phone = me.siblings(".phoneNumber").val();
                if (phone && /^1[3|4|5|6|7|8][0-9]{9}$/.test(phone)) {
                    jh.utils.ajax.send({
                        url: '/user/getSMSCode',
                        data: {
                            mobile: phone,
                            type: typeNum
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

            $('.tab-login').click(function() {
                $('.tab-page').eq($(this).index()).attr("id", "login-active").siblings().removeAttr("id");
                $(this).addClass("active").siblings().removeClass("active");
                states = $(this).index();
            })
            $('.forgetPwd').click(function() {
                $('.loginForm').css('display', 'none');
                $('.forgetForm').css('display', 'block');
            })

            $('body').on('click', '#login', function() {
                window.location.reload();
            });
        };
    }
    module.exports = Login;
});