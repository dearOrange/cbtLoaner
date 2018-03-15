/**
 * @authors jiaguishan (jiaguishan@gmail.com)
 * @date    2017-04-18 11:39:52
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function Main() {
        var _this = this;
        _this.requestDate = 60 * 1000;
        _this.requestInterId = null;
        this.init = function() {
            this.initPlugins();
            this.checkLogin();
            this.getUserInfo();
            
            $('#index_logo').attr('href', ROOTURL);
            $('body').off('click', '.button').on('click', '.button', function() {
                $(this).css('background', '#ed9c08');
            });
            
			this.initUploadToken();
        };
        this.checkLogin = function() {
            //需要获取token存储在cookie X-Token
            _this.initMenu();
            _this.registerEvent();
            require('plugin/datePicker/WdatePicker');
            /*加载时默认触发一次变化事件进行事件加载*/
            $(window).trigger('hashchange');
            var moduleInfo = jh.utils.getURLValue();

            jh.utils.defaultPage(moduleInfo.module);
        };

        this.initUserName = function(){
            var userObj = JSON.parse(sessionStorage.getItem('customer-userInfo'));
            var username = userObj.companyName;
            
            var isState = sessionStorage.getItem('customer-isState');
            if (isState === "available") {
                $('#userIsPassState').addClass('icon-pass');
                $('#imgState').text("已认证");
            } else if (isState === "unavailable") {
                $('#userIsPassState').addClass('icon-nopass');
                $('#imgState').text("认证不通过");
            } else if (isState === "wait") {
                $('#userIsPassState').addClass('icon-nopass');
                $('#imgState').text("审核中");
            } else if (isState === "new") {
                $('#userIsPassState').addClass('icon-nopass');
                $('#imgState').text("未认证");
                username = sessionStorage.getItem('customer-username');
            }

            $('#usernameText').text(username);
        };

        this.getUserInfo = function() {
            jh.utils.ajax.send({
                url: '/user/userInfo',
                done: function(returnData) {
                    sessionStorage.setItem('customer-userInfo', JSON.stringify(returnData.data));
                    _this.initUserName();
                }
            });
        };

        this.initPlugins = function() {
            window.jh = require('common'); //自定义对象
            jh.utils.template = require('template'); //为自定义函数

        };

        this.initMenu = function(res) {
            var menuData = require('menuJson/leftMenu');
            var menuHtml = jh.utils.template('main_leftMenu_template', menuData);
            if (sessionStorage.getItem("customer-isState") == 'available' || sessionStorage.getItem('skipAuth') ) {
                $('#leftMenu-box').html(menuHtml);
            }
        };

        this.registerEvent = function() {
            var InitRegisterEvent = require('common/initRegisterEvent');
            var register = new InitRegisterEvent();
            register.init();
        };
        this.initUploadToken = function() {
        	_this.requestDate *= 20;
        	_this.requestInterId = window.setInterval(function() {
                _this.getUrlToken();
            }, _this.requestDate);
        }
        this.getUrlToken = function() {
        	jh.utils.ajax.send({
                url: '/qiniu/getToken',
                done:function(returnData){
                    sessionStorage.setItem('customer-uploadToken',returnData.data.uploadToken);
                }
            });
        }
    }
    module.exports = Main;
});