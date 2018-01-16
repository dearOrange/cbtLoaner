/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function FindList() {
        var _this = this;
        _this.form = $('#custmoer-findList-form');
        this.init = function() {
            this.initContent();
            this.registerEvent();
            $('select').select2({
                minimumResultsForSearch: Infinity
            });
        };
        this.initContent = function(isSearch) {
            var datas = jh.utils.formToJson(_this.form);
            datas.carNumber = datas.carNumber_province + datas.carNumber;
            delete datas.carNumber_province;
            var page = new jh.ui.page({
                data_container: $('#find_list_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/task/findedList',
                contentType: 'application/json',
                data: datas,
                isSearch: isSearch,
                callback: function(returnData) {
                    return jh.utils.template('findList-contentTemplate', returnData);
                }
            });
            page.init();
        };

        //展示详情
        this.showDetail = function(taskId) {
            jh.utils.ajax.send({
                url: '/task/detail',
                data: {
                    taskId: taskId
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    var alertStr = jh.utils.template('find-detail-template', returnData);
                    var okStr = returnData.data.state === 'platReceive' ? '收到车了' : '确定';
                    
                    jh.utils.alert({
                        content: alertStr,
                        okValue: okStr,
                        ok: function() {
                            //如果是待债权方确认状态则进行上传凭证与进行电子签章
                            if (returnData.data.state === 'unconfirmed' || returnData.data.state === 'voucherInvalid') {
                                _this.uploadVouch(returnData.data);
                                return false;
                            } else if (returnData.data.state === 'platReceive') {
                                (new jh.ui.shadow()).init();
                                //如果平台已收车，则债权方进行确认收车
                                _this.confirmeReceive(taskId);
                                return false;
                            } else {
                                return true;
                            }
                        },
                        cancel: true
                    });

                    jh.utils.uploader.init({
                        fileNumLimit: 15,
                        pick: {
                            id: '#voucherUrl'
                        }
                    });

                    jh.utils.uploader.init({
                        fileNumLimit: 5,
                        pick: {
                            id: '#entrustUrl'
                        }
                    });
                }
            });
        };

        //上传凭证
        this.uploadVouch = function(returnDetail) {
            var datas = jh.utils.formToJson($('#custmoer-upload-form'));
            //判断有无上传凭证
            if (!datas.voucherUrl) {
                jh.utils.confirm({
                    content: '请上传相关凭证！',
                    ok: true,
                    cancel: true
                });
                return false;
            }
            if (!datas.entrustUrl) {
                jh.utils.confirm({
                    content: '请上传委托书原件！',
                    ok: true,
                    cancel: true
                });
                return false;
            }
            //以逗号连接数据
            datas.voucherUrl = jh.utils.isArray(datas.voucherUrl) ? datas.voucherUrl.join(',') : datas.voucherUrl;
            datas.entrustUrl = jh.utils.isArray(datas.entrustUrl) ? datas.entrustUrl.join(',') : datas.entrustUrl;
            (new jh.ui.shadow()).init();
            //保存已上传凭证数据
            jh.utils.ajax.send({
                url: '/task/confirmeEntrust',
                method: 'post',
                data: datas,
                done: function(returnData) {
                    jh.utils.closeArt();
                    if (returnDetail.contractState === 0) {
                        //保存成功后调用电子签章
                        _this.requestContractUrl(datas.taskId);
                    } else {
                        (new jh.ui.shadow()).close();
                        _this.initContent();
                    }
                }
            });
        };

        //电子签章
        this.requestContractUrl = function(taskId) {
            jh.utils.ajax.send({
                url: '/tasksign/getContractUrl',
                data: {
                    taskId: taskId
                },
                done: function(returnData) {
                    var width = $(window).width() * 0.95;
                    var height = $(window).height() * 0.9;
                    //调用第三方电子签章
                    dialog({
                        url: returnData.data.signUrl,
                        id: 'iframe-dialog',
                        width: width,
                        height: height,
                        cancel: true,
                        cancelValue: '关闭',
                        fixed: true,
                        onclose: function() {
                            _this.initContent();
                        }
                    }).showModal();
                    (new jh.ui.shadow()).close();
                }
            });
        };

        //确认收车
        this.confirmeReceive = function(taskId) {
            //如果平台收到车了，则进行债权方确认收车操作
            jh.utils.ajax.send({
                url: '/task/confirmeReceive',
                data: {
                    taskId: taskId
                },
                done: function(urlData) {
                    jh.utils.closeArt();
                    (new jh.ui.shadow()).close();
                    jh.utils.alert({
                        content: '恭喜收到爱车！',
                        ok: function() {
                            window.location.reload();
                        },
                        cancel: false
                    });
                }
            });
        };

        this.registerEvent = function() {
            //查看任务详情
            $('.dataShow').off('click', '.detail').on('click', '.detail', function() {
                var me = $(this);
                var taskId = me.data('id');
                _this.showDetail(taskId);
            });

            // 搜索
            jh.utils.validator.init({
                id: 'custmoer-findList-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

        };
    }
    module.exports = FindList;
});