/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function PersonCenter() {
        var _this = this;
        var isState = sessionStorage.getItem("customer-isState");
        _this.data = null;

        this.init = function() {
            this.initContent();
            this.registerEvent();
            if (isState === "available") {
                $(".personRemove").removeClass("hide");
            } else {
                $(".personRemove").addClass("hide");
            }
            setTimeout(function() {
              jh.utils.changeText($('#breadCrumb'), '>个人中心>编辑资料');
            }, 0)
        };
        this.initContent = function() {
            jh.utils.ajax.send({
                url: '/user/userInfo',
                done: function(returnData) {
                    _this.data = returnData.data;
                    returnData.data.viewImgRoot = jh.config.viewImgRoot;
                    returnData.data.isState = isState;
                    /*if (!returnData.data.mobile) {
                        jh.utils.load("/src/modules/bind/binding-phone");
                    }*/
                    var str = jh.utils.template('personCenter-baseInfo-template', returnData.data);
                    $('#personCenter-baseInfo-form').html(str);
                    $('#serviceType').val(returnData.data.type);
                    _this.changeImgByUserType(returnData.data.type);

                    _this.changeUserType(returnData.data);
                    //上传资质
                    var picArr = ['businessLicense', 'linkmanIdImg', 'linkmanHandIdImg'];
                    for (var i = 0; i < 5; i++) {
                        jh.utils.uploader.init({
                            isAppend: false,
                            pick: {
                                id: '#' + picArr[i]
                            }
                        });
                    }

                }
            })
        };

        this.changeUserType = function(data) {
            var typeInfo = '';
            var templateName = data.type === 'UPSTREAM_PERSONAL' ? 'personCenter_personInfo_template' : 'personCenter_businessInfo_template';
            typeInfo = jh.utils.template(templateName, data);

            $('#mainTypeBox').html(typeInfo);
        };

        this.changeImgByUserType = function(type) {
            if (type === 'UPSTREAM_PERSONAL') {
                $('.businessImg').addClass("hide");
                $('.businessLicense').removeClass("uploaderRequired");
                $('.showPuso').addClass("hide");
                $('#linkmanIdImg').siblings().addClass("uploaderRequired");
                
            } else {
                $('#linkmanIdImg').siblings().removeClass("uploaderRequired");
                $('.showPuso').removeClass("hide");
                $('.businessImg').removeClass("hide");
                $('.businessLicense').addClass("uploaderRequired");
            }
        };

        this.registerEvent = function() {
            //解绑手机
            $('body').off('click', '.removePhone').on('click', '.removePhone', function() {
                var mobile = $(".personPhone").text();
                var alertStr = jh.utils.template('task_removePhone_template', { mobile: mobile });
                jh.utils.alert({
                    content: alertStr,
                    ok: function() {
                        var databang = {
                            mobile: $.trim($('.changePhone').html()),
                            code: $.trim($('.find-checkcode').val()),
                            newMobile: $.trim($('.find-mobile').val())
                        };
                        jh.utils.ajax.send({
                            url: '/user/unbundling',
                            method: 'post',
                            data: databang,
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '手机解绑成功',
                                    ok: true,
                                    cancel: false
                                });
                            }
                        })
                    },
                    cancel: true
                });
            });

            $('body').off('change', '#serviceType').on('change', '#serviceType', function() {
                var me = $(this);
                var val = me.val();
                _this.data.type = val;
                _this.changeUserType(_this.data);
                _this.changeImgByUserType(_this.data.type);
            });

            //修改密码
            $('body').off('click', '.changePassword').on('click', '.changePassword', function() {
                var mobile = $(".personPhone").text();
                var alertStr = jh.utils.template('task_changePassword_template', { mobile: mobile });
                jh.utils.alert({
                    content: alertStr,
                    ok: function() {
                        var repnewpwd = $.trim($('.find-repnewpwd').val());
                        var newpwd = $.trim($('.find-newpwd').val());
                        var datachange = {
                            mobile: $.trim($('.changePhone').html()),
                            code: $.trim($('.find-checkcode').val()),
                            password: $.trim($('.find-newpwd').val())
                        };
                        if(repnewpwd != newpwd) {
                          jh.utils.alert({
                            content: '两次密码不一致，请保持一致',
                            ok: true
                          })
                          return false;
                        };
                        jh.utils.ajax.send({
                            url: '/user/updatePassword',
                            method: 'post',
                            data: datachange,
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '密码修改成功，请重新登录！',
                                    ok: function() {
                                        var sout = new jh.utils.singout();
                                        sout.init();
                                    },
                                    cancel: false
                                });
                            }
                        });
                    },
                    cancel: true
                });
            });
            $('body').off('click', '.loginCode').on('click', '.loginCode', function() {
                var me = $(this);
                var id = me.attr("id");
                var typeNum = id === 'changePwdPhone' ? 3 : 5;
                var phone = me.siblings(".changePhone").html();
                if (phone && /^1[3|4|5|6|7|8][0-9]{9}$/.test(phone)) {
                    jh.utils.ajax.send({
                        url: '/user/getSMSCode',
                        data: {
                            mobile: phone,
                            type: typeNum
                        },
                        done: function(returnData) {
                            jh.utils.alert({
                                content: '验证码发送成功',
                                ok:true
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
            });

            jh.utils.validator.init({
                id: 'personCenter-baseInfo-form',
                submitHandler: function(form) {
                    var datas = jh.utils.formToJson(form); //表单数据
                    (new jh.ui.shadow()).init();
                    jh.utils.ajax.send({
                        url: '/user/submitInfo',
                        method: 'post',
                        data: datas,
                        done: function(returnData) {
                            sessionStorage.setItem("customer-isState", returnData.data.state);
                            (new jh.ui.shadow()).close();
                            jh.utils.alert({
                                content: "提交成功，请等待审核！",
                                ok: function() {
//                                  $('#leftMenu-box').addClass('hide');
                                    jh.utils.load('/src/modules/person/person-file');
                                    $('#userIsPassState').addClass('icon-nopass');
                                    $('#imgState').text("审核中");
                                },
                                cancel: false
                            });
                        }
                    });
                    return false;
                }
            });

            //取消编辑
            $('body').off('click', '.clearEdit').on('click', '.clearEdit', function() {
                jh.utils.load("/src/modules/person/person-file");
            });

            //稍后认证
            $('body').off('click', '.skipAuth').on('click', '.skipAuth', function() {
                sessionStorage.setItem('skipAuth', 'true');
                window.location.href = '/';
            });

        };
    }
    module.exports = PersonCenter;
});