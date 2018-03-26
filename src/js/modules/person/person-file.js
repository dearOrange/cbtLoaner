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
                  var data = returnData.data;
                  var dataType = returnData.data.type;
                  returnData.menuState = jh.utils.menuState;
                  returnData.viewImgRoot = jh.config.viewImgRoot;
                  var getStr = jh.utils.template('task_getAuditInfo_template', returnData);
                  $('.modelData').html(getStr);
                  _this.changeImgByUserType(returnData.data.type);
                  
                  if(!dataType || !data.linkman || !data.companyName || !data.address || !data.contactPhone) {
                    _this.selectType();
                  }
                }
            });
        };
        this.changeImgByUserType = function(type) {
            if (type === 'UPSTREAM_PERSONAL') {
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
        this.selectType = function() {
          var typeStr = jh.utils.template('select_type_template', {});
          jh.utils.alert({
            title: '选择类型',
            content: typeStr,
            ok: function(){
              $('#select_type_form').submit();
              return false;
            },
            okValue: '保存'
          });
          $('body').off('click', '.select_type_li').on('click', '.select_type_li', function() {
            var mine = $(this);
            _this.index = mine.index();
            mine.addClass("type_active").siblings().removeClass("type_active");
            $('.select_content').eq(_this.index).removeClass('hide').siblings().addClass('hide');
          });
          
          jh.utils.validator.init({
              id: 'select_type_form',
              submitHandler: function(form) {
                  var datas = jh.utils.formToJson(form); //表单数据
                  datas.type = _this.index == 0 ? 'UPSTREAM_PERSONAL' : 'UPSTREAM_ENTERPRISE';
                  datas.linkman = _this.index == 0 ? datas.linkman[0] : datas.linkman[1];
                  jh.utils.ajax.send({
                      url: '/user/basic',
                      method: 'post',
                      data: datas,
                      done: function(returnData) {
                          
                      }
                  });
                  return false;
              }
          });
        }
    }
    module.exports = PersonFile;
});