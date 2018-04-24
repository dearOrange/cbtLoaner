/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function VehicleViolation() {
        var _this = this;
        $('select').select2({
            minimumResultsForSearch: Infinity
        });
        this.init = function() {
            this.registerEvent();
            setTimeout(function() {
              jh.utils.changeText($('#breadCrumb'), '>车辆查询>车辆违章查询');
            }, 0)
        };
        this.registerEvent = function() {
            jh.utils.validator.init({
                id: 'search_violation_form',
                submitHandler: function(form) {
                    var datas = jh.utils.formToJson(form); //表单数据
                    datas.carNumber = datas.carNumber_province + datas.carNumber;
                    delete datas.carNumber_province;
                    jh.utils.ajax.send({
                        url: '/query/violation',
                        method: 'get',
                        data: datas,
                        done: function(returnData) {
                            var clueListArr = returnData.data.clueList;
                            var sum = 0;
                            var sumMoney = 0;
                            $.each(clueListArr, function(index, item) {
                            	returnData.carNumber = item.carNumber;
                            	sumMoney +=+ clueListArr[index].money;
                            	sum +=+ clueListArr[index].fen;
                            });
                            returnData.fen = sum; 
                            returnData.money = sumMoney;
                            var str = jh.utils.template('search_violation_template', returnData);
                            $('#violation-content').html(str);
                            return false;
                        }
                    });
                }
            });
        };
    }
    module.exports = VehicleViolation;
});