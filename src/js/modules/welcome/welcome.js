/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function WelcomeDetail() {
    	var _this = this;
    	_this.form = $('#custmoer-taskList-form');
        _this.userInfo = null;
        this.init = function() {
            this.registerEvent();
            this.scrollEvent();
            this.getUserInfo();
        };
        
        this.getUserInfo = function(){
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
                    id: '#importFileButton'
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


            $('.findCar').click(function() {
                jh.utils.load("/src/modules/find/find-list");
            });
            
            //新增任务
            $('.newTask').click(function() {
                var me = $(this);
                var alertInfo = jh.utils.template('customer-addTask-template', {});
                jh.utils.alert({
                    title:'新建任务',
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
                    if(datas.debtorIdNumber) {
                      var regex1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
                      var regex2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
                      datas.debtorIdNumber = datas.debtorIdNumber.replace(/\s/g, '');
                      if(!(regex1.test(datas.debtorIdNumber)) && !(regex2.test(datas.debtorIdNumber))){
                        $(form).removeClass('disabled');
                        jh.utils.alert({
                          content:'请输入正确的身份证号',
                          ok:true
                        })
                        return false;
                      }
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
                            str += '<option value="' + item.name + '" data-id="' + item.id + '">' + item.sort + "&nbsp;&nbsp;&nbsp;" + item.name + '</option>';
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
        };
        this.scrollEvent =  function(){
        	var carinfoItem = document.getElementById('carinfo-item');
        	var carinfoFirst = document.getElementById('carinfo-first');
        	var carinfoSecond = document.getElementById('carinfo-second');
        	carinfoSecond.innerHTML = carinfoFirst.innerHTML;
        	carinfoFirst.style.height = carinfoItem.offsetHeight + 'px';
        	carinfoSecond.style.height = carinfoItem.offsetHeight + 'px';
        	var timer = window.setInterval(function(){
        		if(carinfoItem.scrollTop >= carinfoItem.offsetHeight) {
        			carinfoItem.scrollTop = 0;
       			}else{
       				carinfoItem.scrollTop++;
       			}
        	},50)
        	carinfoItem.onmouseover = function(){
        		clearInterval(timer);
        	}
        	carinfoItem.onmouseout = function(){
        		timer = window.setInterval(function(){
	        		if(carinfoItem.scrollTop >= carinfoItem.offsetHeight) {
	        			carinfoItem.scrollTop = 0;
	       			}else{
	       				carinfoItem.scrollTop++;
	       			}
	        	},50)
        	}
        }
    }
    module.exports = WelcomeDetail;
});