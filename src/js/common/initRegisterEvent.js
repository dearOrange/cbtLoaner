/**
 * @authors jiaguishan (http://tammylights.com)
 * @date    2017-04-01 14:54:43
 * @version 1.0
 */
define(function(require, exports, module) {
    function RegisterJQueryEvent() {
        this.init = function() {
            this.registerEvent();
        };

        this.registerEvent = function() {

            jh.utils.ajax.send({
                url: '/qiniu/getToken',
                done:function(returnData){
                    sessionStorage.setItem('customer-uploadToken',returnData.data.uploadToken);
                }
            });

            /**
             * 菜单点击事件
             */
            $('#leftMenu-box').on('click', '.first-menu-item', function() {
                var m = $(this);
                var isActive = m.parent().hasClass('active');
                m.parent().siblings().removeClass('active');
                var icon = m.find('i.fr');
                if (isActive) {
                    m.parent().removeClass('active');
                } else {
                    m.parent().addClass('active');
                }
                var currentUrl = m.data('url');
                var module = (jh.utils.getURLValue()).module;
                if(currentUrl+'.html' === module){
                    window.location.reload();
                }else{
                    jh.utils.load(currentUrl);
                }
            });

            /*地址栏变化事件*/
            $(window).on('hashchange', function() {
                var currentHash = window.location.hash,
                    repHash = currentHash.replace(/^[#*]$/ig, '');
                var moduleInfo = jh.utils.getURLValue();
                if (!currentHash || !repHash || !moduleInfo.module) {
                    $('#content-container').empty();
                    jh.utils.updateMenuBoxHeight();
                    return false;
                }
                jh.utils.showHTML(moduleInfo.module);
            });

            /*只能输入数字，并且小数点只能输入一个*/
            $('#content-container').on('keyup change', '.OnlyPrice', function() {
                this.value = this.value.replace(/[^\d.]/, ''); /*禁止输入非数字和小数点以外字符*/
                this.value = this.value.replace(/^\./, ''); /*禁止开头为‘.’*/
                this.value = this.value.replace(/[\u4e00-\u9fa5]/ig, ''); /*禁止输入汉字*/
                this.value = this.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.'); /*不允许两个及以上小数点*/
                this.value = this.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
            });

            /*为密码框绑定事件，禁止复制，剪贴，粘贴，输入空格*/
            $('body').on('keyup', 'input:password,.pwd', function() {
                this.value = this.value.replace(/\s/, '');
            });

            $('body').on('copy paste cut', 'input:password', function() {
                return false;
            });

            /*返回事件*/
            $('#content-container').on('click', '.goBack', function() {
                window.history.go(-1);
            });

            $('#userCenterLink').on('click', function() {
                var me = $(this);
                jh.utils.load('/src/modules/person/person-file');
            });
            

            $('body').off('click', '.delete-img').on('click', '.delete-img', function() {
                var m = $(this);
                m.parent().remove(); //删除整个容器
            });

            $('body').off('click', '#exportFile').on('click', '#exportFile', function() {
                var m = $(this);
                var form = m.parents('form');
                var datas = form.serialize();
                var XToken = encodeURIComponent(sessionStorage.getItem('customer-X-Token'));
                window.location.href = REQUESTROOT + '/task/export' + '?' + datas + '&XToken=' + XToken;
            });

            $('body').off('click', '.preview-img').on('click', '.preview-img', function() {
                var m = $(this);
                var src = m.attr('src');
                var title = m.data('tips') ? m.data('tips') : '查看大图';
                src = src.replace(/\?imageMogr2\/auto-orient\/thumbnail\/100x100/, '');
                jh.utils.alert({
                    title: title,
                    content: '<img src="' + src + '"/>'
                });
            });
            
            $('#logoutLink').on('click', function() {
                var me = $(this);
                jh.utils.alert({
                    content: '确定要安全退出吗？',
                    ok: function() {
                        var singout = new jh.utils.singout();
                        singout.init();
                    },
                    cancel: function() {}
                });
            });

            $('.wrapper').off('click', '.stateChange li').on('click', '.stateChange li', function() {
                var me = $(this);
                var val = me.data('value');
                me.addClass('active').siblings().removeClass('active');
                me.siblings('input[type=hidden]').val(val);
                me.parents('form').submit();
            });

            $('body').off('change', '#checkAll').on('click', '#checkAll', function() {
                var me = $(this);
                var state = me.is(':checked');
                var checkboxs = me.parents('table').find('input[type=checkbox]');
                if(state){
                    checkboxs.prop('checked',true);
                }else{
                    checkboxs.prop('checked',false);
                }
            });

            $('body').off('click','#index_logo').on('click','#index_logo',function(){
                var me = $(this);
                var isState = sessionStorage.getItem('customer-isState');
                var skipAuth = sessionStorage.getItem('skipAuth');
                if(isState !== 'available' && !skipAuth){
                    return false;
                }
                window.location.href = '/';
            });
        };
    }
    module.exports = RegisterJQueryEvent;
});