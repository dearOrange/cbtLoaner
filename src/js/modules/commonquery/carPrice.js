/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function CarPrice() {
        var _this = this;
        $('select').select2({
            minimumResultsForSearch: Infinity
        });
        this.init = function() {
            this.registerEvent();
        };
        this.registerEvent = function() {
            jh.utils.validator.init({
                id: 'search_carprice_form',
                submitHandler: function(form) {
                    var datas = jh.utils.formToJson(form); //表单数据
                    datas.carNumber = datas.carNumber_province + datas.carNumber;
                    delete datas.carNumber_province;
                    jh.utils.ajax.send({
                        url: '/query/carPrice',
                        method: 'get',
                        data: datas,
                        done: function(returnData) {
                            returnData.viewImgRoot = jh.config.viewImgRoot;
                            var conditiona = returnData.data.conditiona.split('-');
                            var conditionb = returnData.data.conditionb.split('-');
                            var conditionc = returnData.data.conditionc.split('-');
                            returnData.conditiona = conditiona[1] + '万';
                            returnData.conditionb = conditionb[1] + '万';
                            returnData.conditionc = conditionc[1] + '万';
                            returnData.referencepricea = conditiona[0] + '万-' + conditiona[2] + '万';
                            returnData.referencepriceb = conditionb[0] + '万-' + conditionb[2] + '万';
                            returnData.referencepricec = conditionc[0] + '万-' + conditionc[2] + '万';
                            var str = jh.utils.template('search_carPrice_template', returnData);
                            $('#carPrice-content').html(str);
                            return false;
                        }
                    });
                    
                }
            });
            
            //初始化品牌
            jh.utils.ajax.send({
                url: '/car/brand',
                done: function(result) {
                    var str = '<option value="" data-id="">请选择品牌</option>';
                    $.each(result.data, function(index, item) {
                        str += '<option value="' + item.name + '" data-id="' + item.id + '">' + item.name + '</option>';
                    });
                    $('#customer-addTask-carBrand').html(str);
                }
            });
            
            //品牌更改 初始化车系
            $('body').off('change', '#customer-addTask-carBrand').on('change', '#customer-addTask-carBrand', function() {
                var me = $(this);
                var id = me.find('option:selected').data('id');
                jh.utils.ajax.send({
                    url: '/car/series',
                    data: {
                        brandId: id
                    },
                    done: function(result) {
                        var str = '<option value="" data-id="">请选择车系</option>';
                        $.each(result.data, function(index, item) {
                            str += '<option value="' + item.name + '" data-id="' + item.id + '">' + item.name + '</option>';
                        });
                        $('#customer-addTask-carSeries').html(str);
                    }
                });
                $('#carBrandId').val(id);
            });
            //车系更改 初始化车型
            $('body').off('change', '#customer-addTask-carSeries').on('change', '#customer-addTask-carSeries', function() {
                var me = $(this);
                var id = me.find('option:selected').data('id');
                jh.utils.ajax.send({
                    url: '/car/model',
                    data: {
                        seriesId: id
                    },
                    done: function(result) {
                        var str = '<option value="" data-id="">请选择车型</option>';
                        $.each(result.data, function(index, item) {
                            str += '<option value="' + item.name + '" data-id="' + item.id + '">' + item.name + '</option>';
                        });
                        $('#customer-addTask-carModel').html(str);
                    }
                });
                $('#carSeriesId').val(id);
            });
            //车型更改
            $('body').off('change', '#customer-addTask-carModel').on('change', '#customer-addTask-carModel', function() {
                var me = $(this);
                var id = me.find('option:selected').data('id');
                $('#carModelId').val(id);
            });
        };
    }
    module.exports = CarPrice;
});