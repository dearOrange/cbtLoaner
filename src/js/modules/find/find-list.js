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
    _this.data = '';
    _this.form = $('#custmoer-findList-form');

    var auth = sessionStorage.getItem('customer-isState');

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
          //任务状态
          returnData.menuState = jh.utils.menuState;
          //图片预览
          returnData.viewImgRoot = jh.config.viewImgRoot;

          //任务展示
          var alertStr = jh.utils.template('find-detail-template', returnData);
          //确定按钮显示文字
          var okStr = (returnData.data.state === 'platReceive' || returnData.data.state === 'hunterReceive') ? '收到车了' : '确定';
          _this.data = returnData.data;

          okStr = returnData.data.state === 'unconfirmed' ? '确认拖车' : okStr;

//        if (_this.data.state === "upstreamReceive" && _this.data.contractState === 0) {
//          okStr = '电子签章';
//        }

          if (_this.data.state === "unconfirmed" && _this.data.entrust === 'trace') {
            okStr = '收到车了';
          }

          var alertOption = {
            content: alertStr,
            okValue: okStr,
            ok: function() {
              if (_this.data.state === 'platReceive' || _this.data.state === "hunterReceive" || (_this.data.state === 'unconfirmed' && _this.data.entrust === 'trace')) {
                (new jh.ui.shadow()).init();
                //如果平台已收车，则债权方进行确认收车
                _this.confirmeReceive(taskId);
                return false;
              } 
              if (auth === 'available') {
                //如果是待债权方确认状态则进行上传凭证与进行电子签章
                if ((_this.data.state === "unconfirmed" && _this.data.entrust !== 'trace') || _this.data.state === "hunterUnreceive" || _this.data.state === "voucherInvalid") {
                  _this.uploadVouch(_this.data);
                  return false;
                } else {
                  return true;
                }
              } else {
                var authArr = ['unconfirmed', 'upstreamReceive'];
                if (authArr.indexOf(returnData.data.state) !== -1 && _this.data.contractState === 0) {
                  jh.utils.alert({
                    content: '您还未认证，即将跳转到补全资料页面',
                    ok: function() {
                      jh.utils.load('/src/modules/person/person-center');
                    },
                    cancel: true
                  })
                } else if (_this.data.state === "hunterUnreceive") {
                  _this.uploadVouch(_this.data);
                }
                return true;
              }
            },
            cancel:true
          };
          
          jh.utils.alert(alertOption);
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
      datas.type = returnDetail.state === 'unconfirmed' ? 0 : 1;
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
          (new jh.ui.shadow()).close();
          jh.utils.alert({
            content: '操作成功！',
            ok: function() {
              window.location.reload();
            }
          });
        }
      });
    };

    //确认收车
    this.confirmeReceive = function(taskId) {
      //如果平台收到车了，则进行债权方确认收车操作
      jh.utils.alert({
        content: '您确定已收到车了吗？',
        ok: function() {
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
        },
        cancel: function(){
          (new jh.ui.shadow()).close();
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

      $('body').off('click', '.upload-voList').on('click', '.upload-voList', function() {
        _this.uploadVouch(_this.data);
      });
    };
  }
  module.exports = FindList;
});