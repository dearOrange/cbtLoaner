/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function PersonFile() {
        var _this = this;
        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function() {
            jh.utils.ajax.send({
                url: '/user/userInfo',
                done: function(returnData) {
                    if (returnData.data.type == 'UPSTREAM_INSURANCE') {
                        returnData.data.type = '保险公司'
                    } else if (returnData.data.type == 'UPSTREAM_BANK') {
                        returnData.data.type = '银行'
                    } else if (returnData.data.type == 'UPSTREAM_FACTORY') {
                        returnData.data.type = '厂家金融'
                    } else if (returnData.data.type == 'UPSTREAM_LEASE') {
                        returnData.data.type = '融资租赁'
                    } else if (returnData.data.type == 'UPSTREAM_P2P') {
                        returnData.data.type = 'P2P平台'
                    } else if (returnData.data.type == 'UPSTREAM_LAWFIRM') {
                        returnData.data.type = '律师事务所'
                    } else if (returnData.data.type == 'UPSTREAM_GUARANTEE') {
                        returnData.data.type = '担保公司'
                    } else if (returnData.data.type == 'UPSTREAM_PERSONAL') {
                        returnData.data.type = '个人'
                    } else if (returnData.data.type == 'UPSTREAM_OTHER') {
                        returnData.data.type = '其他'
                    }
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    var getStr = jh.utils.template('task_getAuditInfo_template', returnData);
                    $('.modelData').html(getStr);
                    _this.changeImgByUserType(returnData.data.type);
                    
                }
            });
        };
        this.changeImgByUserType = function(type) {
            if (type === '个人') {
                $('.businessImg').addClass("hide");
            } else {
                $('.businessImg').removeClass("hide");
            }
        };
        this.registerEvent = function() {
            //修改密码
            $('body').off('click', '.changePassword').on('click', '.changePassword', function() {
                var phone = $('#show-userPhone').text();
                var alertStr = jh.utils.template('taskfile_changePassword_template', { mobile: phone });
                jh.utils.alert({
                    content: alertStr,
                    ok: function() {
                        var datachange = {
                            mobile: $.trim($('.bangPhone').html()),
                            code: $.trim($('.find-checkcode').val()),
                            password: $.trim($('.find-newpwd').val())
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
            //解绑手机
            $('body').off('click', '.removePhone').on('click', '.removePhone', function() {
                var mobile = $('#show-userPhone').text();
                var alertStr = jh.utils.template('taskfile_removePhone_template', { mobile: mobile });
                jh.utils.alert({
                    content: alertStr,
                    ok: function() {
                        var databang = {
                            mobile: $.trim($('.bangPhone').html()),
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

            $('body').off('click', '.loginCodeFile').on('click', '.loginCodeFile', function() {
                var me = $(this);
                var id = me.attr("id");
                var typeNum = id === 'changesPasswordCode' ? 3 : 5;
                var phone = me.siblings(".bangPhone").html();
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
            });

            //重新编辑
            $('body').off('click', '.editFile').on('click', '.editFile', function() {
                jh.utils.load("/src/modules/person/person-center");
            });
        };
    }
    module.exports = PersonFile;
});