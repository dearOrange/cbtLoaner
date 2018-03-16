/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function CommonQuery() {
        var _this = this;
        this.init = function() {
            this.registerEvent();
        };
        
        this.registerEvent = function() {
            //车辆违章查询
            $('.vehicle-violation').click(function() {
                jh.utils.load("/src/modules/commonquery/vehicleViolation");
            });
            //车辆残值查询
            $('.vehicle-residual').click(function() {
                jh.utils.load("/src/modules/commonquery/carPrice");
            });
            //身份证查询
            $('.search-idCard').click(function() {
                jh.utils.load("/src/modules/commonquery/IdCard");
            });
            //车架号
            $('.search-vinNo').click(function() {
                jh.utils.load("/src/modules/commonquery/frameNumber");
            });
            //失信人名单查询
            $('.search-noPromise').click(function() {
                jh.utils.load("/src/modules/commonquery/dishonest");
            });
            //行业黑名单查询
            $('.search-blacklist').click(function() {
                jh.utils.load("/src/modules/commonquery/blackList");
            });
        };
    }
    module.exports = CommonQuery;
});