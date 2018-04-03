/**
 * OpenList
 * @authors jiaguisshan
 * @date    2017-11-28 16:22:12
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function TaskEdit() {
        var _this = this;
        var args = jh.utils.getURLValue().args;
        _this.selectData = '';
        this.init = function() {
            this.registerEvent();
            $('select').select2({
                minimumResultsForSearch: Infinity
            });
        };
        
        this.registerEvent = function() {
          jh.utils.ajax.send({
              url: '/task/detail',
              data: {
                  taskId: args.id
              },
              done: function(returnData) {
                _this.selectData = returnData.data;
                  returnData.menuState = jh.utils.menuState;
                  returnData.viewImgRoot = jh.config.viewImgRoot;
                  var str = jh.utils.template('customer-editTask-template', returnData);
                  $('.taskEditContent').html(str);
                  
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
                            var selectStr = _this.selectData.carBrand === item.name ? 'selected' : '';
                            str += '<option value="' + item.name + '" ' + selectStr + ' data-id="' + item.id + '">' + item.sort + "&nbsp;&nbsp;&nbsp;" + item.name + '</option>';
                          });
                          $('#customer-editTask-carBrand').html(str);
                          $('#customer-editTask-carBrand').trigger('change');
                      }
                  });

              }
          });
          
          //品牌更改 初始化车系
          $('body').off('change', '#customer-editTask-carBrand').on('change', '#customer-editTask-carBrand', function() {
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
                        var selectCarSeries = _this.selectData.carSeries === item.name ? 'selected' : '';
                          str += '<option value="' + item.name + '" ' + selectCarSeries + ' data-id="' + item.id + '">' + item.name + '</option>';
                      });
                      $('#customer-editTask-carSeries').html(str);
                      $('#customer-editTask-carSeries').trigger('change');
                  }
              });
              $('#carBrandIds').val(id);
          });
          //车系更改 初始化车型
          $('body').off('change', '#customer-editTask-carSeries').on('change', '#customer-editTask-carSeries', function() {
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
                        var selectCarModel = _this.selectData.carModel === item.name ? 'selected' : '';
                        str += '<option value="' + item.name + '" ' + selectCarModel + ' data-id="' + item.id + '">' + item.name + '</option>';
                      });
                      $('#customer-editTask-carModel').html(str);
                      $('#customer-editTask-carModel').trigger('change');
                  }
              });
              $('#carSeriesIds').val(id);
          });
          //车型更改
          $('body').off('change', '#customer-editTask-carModel').on('change', '#customer-editTask-carModel', function() {
              var me = $(this);
              var id = me.find('option:selected').data('id');
              $('#carModelIds').val(id);
          });
          
          $('body').off('change', '#taskTypeFlags').on('change', '#taskTypeFlags', function() {
              var me = $(this);
              var val = me.val();
              if(val === 'recycle'){
                  $('#dwLocations').removeClass('hide').prev().removeClass('hide');
              }else{
                   $('#dwLocations').addClass('hide').prev().addClass('hide');
              }
          });
          
          jh.utils.validator.init({
              id: 'customer-editTask-form',
              submitHandler: function(form) {
                  //禁止重复提交
                  if ($(form).hasClass('disabled')) {
                      return false;
                  }
                  $(form).addClass('disabled');

                  //数据处理
                  var datas = jh.utils.formToJson(form);
                  
                  if( !datas.courtDecision){
                      datas.courtDecision = [];
                  }
                  
                  if( !datas.attachment){
                      datas.attachment = [];
                  }

                  datas.attachment = jh.utils.isArray(datas.attachment) ? datas.attachment : [datas.attachment];
                  datas.courtDecision = jh.utils.isArray(datas.courtDecision) ? datas.courtDecision : [datas.courtDecision];
                  
                  jh.utils.ajax.send({
                      url: '/task/edit',
                      method: 'post',
                      contentType: 'application/json',
                      data: datas,
                      done: function() {
                          jh.utils.alert({
                              content: '任务编辑成功！',
                              ok: function() {
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

            
        };
    }
    module.exports = TaskEdit;
});