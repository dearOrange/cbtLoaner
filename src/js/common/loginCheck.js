/**
 * check is login
 * @authors jiaguishan (jiaguishan@gmail.com)
 * @date    2017-04-20 14:29:47
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function CheckLogin() {
        var _this = this;

        var isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };

        this.init = function() {
            this.initPlugins();
            this.checkLogin();
        };

        this.initPlugins = function() {
            window.jh = require('common'); //自定义对象
        };

        this.checkLogin = function() {
            if (isMobile.Android() || isMobile.iOS()) {
                window.location.href = 'http://m.loaner.chebutou.com.cn';
            } else {
                var token = sessionStorage.getItem('customer-X-Token');
                if (token) {
                    window.location.href = jh.config.pageIndex;
                } else {
                    window.location.href = jh.config.pageLogin;
                }
            }
        };
    }
    module.exports = CheckLogin;
});