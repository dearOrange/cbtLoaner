/**
 * OpenList
 * @authors jiaguisshan
 * @date    2017-11-28 16:22:12
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function TaskList() {
    var _this = this;
    _this.form = $('#custmoer-taskList-form');
    _this.userInfo = null;

    this.init = function() {
      this.initContent();
      this.registerEvent();
      this.getUserInfo();
      $('select').select2({
        minimumResultsForSearch: Infinity
      });
    };
    this.initContent = function(isSearch) {
      var datas = jh.utils.formToJson(_this.form);
      datas.carNumber = datas.carNumber_province + datas.carNumber;
      delete datas.carNumber_province;
      var page = new jh.ui.page({
        data_container: $('#customer-taskList-container'),
        page_container: $('#page_container'),
        method: 'post',
        url: '/task/taskList',
        contentType: 'application/json',
        data: datas,
        isSearch: isSearch,
        callback: function(data) {
          var contentHtml = jh.utils.template('customer-taskList-template', data);
          return contentHtml;
        }
      });
      page.init();
    };

    this.getUserInfo = function() {
      jh.utils.ajax.send({
        url: '/user/userInfo',
        done: function(returnData) {
          _this.userInfo = returnData.data;
        }
      });
    };

    this.registerEvent = function() {
      jh.utils.uploader.init({
        server: REQUESTROOT + '/task/import',
        pick: {
          id: '#imports-list'
        },
        accept: {
          title: 'Applications',
          extensions: 'xls,xlsx',
          mimeTypes: 'application/xls,application/xlsx'
        }
      }, {
        uploadAccept: function(file, response) {
          alert(response.data);
        }
      });

      //查询
      jh.utils.validator.init({
        id: 'custmoer-taskList-form',
        submitHandler: function(form) {
          _this.initContent(true);
          return false;
        }
      });

      //新增任务
      $('.dataContent').off('click', '.customer-addTask').on('click', '.customer-addTask', function() {
        var me = $(this);
        var alertInfo = jh.utils.template('customer-addTask-template', {});
        jh.utils.alert({
          content: alertInfo,
          ok: function() {
            $('#customer-addTask-form').submit();
            return false;
          },
          okValue: '确定发布',
          cancel: true
        });
        jh.utils.validator.init({
          id: 'customer-addTask-form',
          submitHandler: function(form) {
            //禁止重复提交
            if ($(form).hasClass('disabled')) {
              return false;
            }
            $(form).addClass('disabled');

            //数据处理
            var datas = jh.utils.formToJson(form);
            datas.carNumber = datas.carNumber_province + datas.add_carNumber;
            delete datas.carNumber_province;
            delete datas.add_carNumber;

            if (!datas.attachment) {
              datas.attachment = [];
            }
            if (!datas.courtDecision) {
              datas.courtDecision = [];
            }
            datas.attachment = jh.utils.isArray(datas.attachment) ? datas.attachment : [datas.attachment];
            datas.courtDecision = jh.utils.isArray(datas.courtDecision) ? datas.courtDecision : [datas.courtDecision];
            jh.utils.ajax.send({
              url: '/task/issueTask',
              method: 'post',
              contentType: 'application/json',
              data: datas,
              done: function() {
                jh.utils.alert({
                  content: '任务发布成功！',
                  ok: function() {
                    jh.utils.closeArt();
                    window.location.reload();
                  },
                  cancel: false
                });
              },
              fail: function() {
                $(form).removeClass('disabled');
              }
            });
            return false;
          }
        });

        //初始化新增任务时上传附件按钮
        jh.utils.uploader.init({
          fileNumLimit: 15,
          pick: {
            id: '#attachment'
          }
        });

        jh.utils.uploader.init({
          fileNumLimit: 10,
          pick: {
            id: '#courtDecision'
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
      //开启与关闭任务
      $('body').off('click', '.operatorTaskOpen').on('click', '.operatorTaskOpen', function() {
        var me = $(this);
        var id = me.data('id');
        jh.utils.ajax.send({
          url: '/task/close',
          data: {
            taskId: id
          },
          done: function(result) {
            jh.utils.alert({
              content: '任务操作成功！',
              ok: function() {
                me.removeClass('operatorTaskOpen').addClass('operatorTaskClose');
              },
              cancel: false
            });
          }
        });
      });
      $('body').off('change', '#taskTypeFlag').on('change', '#taskTypeFlag', function() {
        var me = $(this);
        var val = me.val();
        if (val === 'recycle') {
          $('#dwLocation').removeClass('hide').prev().removeClass('hide');
        } else {
          $('#dwLocation').addClass('hide').prev().addClass('hide');
        }
      });
      $('body').off('click', '.operatorTaskClose').on('click', '.operatorTaskClose', function() {
        var me = $(this);
        var id = me.data('id');
        jh.utils.ajax.send({
          url: '/task/open',
          data: {
            taskId: id
          },
          done: function(result) {
            jh.utils.alert({
              content: '任务操作成功！',
              ok: function() {
                me.removeClass('operatorTaskClose').addClass('operatorTaskOpen');
              },
              cancel: false
            });
          }
        });
      });

      //删除任务
      $('.dataContent').off('click', '.customer-removeTask').on('click', '.customer-removeTask', function() {
        var me = $(this);
        var ids = jh.utils.getCheckboxValue('customer-taskList-container', 'value');
        if (!ids) {
          jh.utils.alert({
            content: '请选择需要删除的任务！',
            ok: true,
            cancel: false
          });
          return false;
        }
        jh.utils.alert({
          content: '确认删除任务吗？',
          ok: function() {
            jh.utils.ajax.send({
              url: '/task/delTask',
              data: {
                taskIds: ids
              },
              done: function() {
                jh.utils.alert({
                  content: '任务删除成功！',
                  ok: function() {
                    _this.initContent();
                  },
                  cancel: false
                });
              }
            });
          },
          cancel: true
        });
      });

      //查看任务详情
      $('.dataShow').off('click', '.customer-detail').on('click', '.customer-detail', function() {
        var me = $(this);
        var id = me.data('id');
        jh.utils.ajax.send({
          url: '/task/detail',
          data: {
            taskId: id
          },
          done: function(returnData) {
            returnData.menuState = jh.utils.menuState;
            returnData.viewImgRoot = jh.config.viewImgRoot;
            var str = jh.utils.template('customer-taskDetail-template', returnData);
            jh.utils.alert({
              content: str,
              ok: true,
              cancel: true
            });
          }
        });
      });

      //          编辑任务
      $('.dataShow').off('click', '.customer-edit-detail').on('click', '.customer-edit-detail', function() {
        var me = $(this);
        var id = me.data('id');
        jh.utils.load("/src/modules/task/task-edit", {
          id: id
        });
      });

    };
  }
  module.exports = TaskList;
});