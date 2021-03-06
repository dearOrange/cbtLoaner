﻿/**
 * @authors jiaguishan (jiaguishan@gmail.com)
 * @date    2017-04-18 11:39:52 测试版本回退
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    //tammy 全局命名空间
    var tammy = tammy || {
        version: '1.0.0'
    };
    tammy.utils = tammy.utils || {}; //公共函数
    tammy.ui = tammy.ui || {}; //公共UI函数及插件

    var basePath = ROOTURL + '/src/'; //基础根路径

    //加载插件
    require('jquery.validate'); //表单验证
    require('common/validator'); //表单验证扩展
    require('plugin/webuploader/webuploader.min'); //上传模块

    require('plugin/select2/select2.min'); //下拉框
    require('plugin/scrollbar/scrollbar'); //scrollbar

    var FINAL_OPTIONS = {
        viewImgRoot: viewImageRoot,
        imageScale: '?imageMogr2/auto-orient/thumbnail/100x100',
        pageSize: 10, //默认每页显示条数
        pageIndex: basePath + 'modules/index/index.html',
        pageLogin: basePath + 'modules/login/login.html', //登陆页面路径
        page500: basePath + 'modules/index/index.html', //数据请求异常页面
        page404: basePath + 'modules/index/index.html', // 加载异常页面
        citylist: {
            "北京": ["北京"],
            "广东": ["广州", "深圳", "珠海", "汕头", "韶关", "佛山", "江门", "湛江", "茂名", "肇庆", "惠州", "梅州", "汕尾", "河源", "阳江", "清远", "东莞", "中山", "潮州", "揭阳", "云浮"],
            "上海": ["上海"],
            "天津": ["天津"],
            "重庆": ["重庆"],
            "辽宁": ["沈阳", "大连", "鞍山", "抚顺", "本溪", "丹东", "锦州", "营口", "阜新", "辽阳", "盘锦", "铁岭", "朝阳", "葫芦岛"],
            "江苏": ["南京", "苏州", "无锡", "常州", "镇江", "南通", "泰州", "扬州", "盐城", "连云港", "徐州", "淮安", "宿迁"],
            "湖北": ["武汉", "黄石", "十堰", "荆州", "宜昌", "襄樊", "鄂州", "荆门", "孝感", "黄冈", "咸宁", "随州", "恩施土家族苗族自治州", "仙桃", "天门", "潜江", "神农架林区"],
            "四川": ["成都", "自贡", "攀枝花", "泸州", "德阳", "绵阳", "广元", "遂宁", "内江", "乐山", "南充", "眉山", "宜宾", "广安", "达州", "雅安", "巴中", "资阳", "阿坝藏族羌族自治州", "甘孜藏族自治州", "凉山彝族自治州"],
            "陕西": ["西安", "铜川", "宝鸡", "咸阳", "渭南", "延安", "汉中", "榆林", "安康", "商洛"],
            "河北": ["石家庄", "唐山", "秦皇岛", "邯郸", "邢台", "保定", "张家口", "承德", "沧州", "廊坊", "衡水"],
            "山西": ["太原", "大同", "阳泉", "长治", "晋城", "朔州", "晋中", "运城", "忻州", "临汾", "吕梁"],
            "河南": ["郑州", "开封", "洛阳", "平顶山", "安阳", "鹤壁", "新乡", "焦作", "濮阳", "许昌", "漯河", "三门峡", "南阳", "商丘", "信阳", "周口", "驻马店"],
            "吉林": ["长春", "吉林", "四平", "辽源", "通化", "白山", "松原", "白城", "延边朝鲜族自治州"],
            "黑龙江": ["哈尔滨", "齐齐哈尔", "鹤岗", "双鸭山", "鸡西", "大庆", "伊春", "牡丹江", "佳木斯", "七台河", "黑河", "绥化", "大兴安岭地区"],
            "内蒙古": ["呼和浩特", "包头", "乌海", "赤峰", "通辽", "鄂尔多斯", "呼伦贝尔", "巴彦淖尔", "乌兰察布", "锡林郭勒盟", "兴安盟", "阿拉善盟"],
            "山东": ["济南", "青岛", "淄博", "枣庄", "东营", "烟台", "潍坊", "济宁", "泰安", "威海", "日照", "莱芜", "临沂", "德州", "聊城", "滨州", "菏泽"],
            "安徽": ["合肥", "芜湖", "蚌埠", "淮南", "马鞍山", "淮北", "铜陵", "安庆", "黄山", "滁州", "阜阳", "宿州", "巢湖", "六安", "亳州", "池州", "宣城"],
            "浙江": ["杭州", "宁波", "温州", "嘉兴", "湖州", "绍兴", "金华", "衢州", "舟山", "台州", "丽水"],
            "福建": ["福州", "厦门", "莆田", "三明", "泉州", "漳州", "南平", "龙岩", "宁德"],
            "湖南": ["长沙", "株洲", "湘潭", "衡阳", "邵阳", "岳阳", "常德", "张家界", "益阳", "郴州", "永州", "怀化", "娄底", "湘西土家族苗族自治州"],
            "广西": ["南宁", "柳州", "桂林", "梧州", "北海", "防城港", "钦州", "贵港", "玉林", "百色", "贺州", "河池", "来宾", "崇左"],
            "江西": ["南昌", "景德镇", "萍乡", "九江", "新余", "鹰潭", "赣州", "吉安", "宜春", "抚州", "上饶"],
            "贵州": ["贵阳", "六盘水", "遵义", "安顺", "铜仁地区", "毕节地区", "黔西南布依族苗族自治州", "黔东南苗族侗族自治州", "黔南布依族苗族自治州"],
            "云南": ["昆明", "曲靖", "玉溪", "保山", "昭通", "丽江", "普洱", "临沧", "德宏傣族景颇族自治州", "怒江傈僳族自治州", "迪庆藏族自治州", "大理白族自治州", "楚雄彝族自治州", "红河哈尼族彝族自治州", "文山壮族苗族自治州", "西双版纳傣族自治州"],
            "西藏": ["拉萨", "那曲地区", "昌都地区", "林芝地区", "山南地区", "日喀则地区", "阿里地区"],
            "海南": ["海口", "三亚", "五指山", "琼海", "儋州", "文昌", "万宁", "东方", "澄迈县", "定安县", "屯昌县", "临高县", "白沙黎族自治县", "昌江黎族自治县", "乐东黎族自治县", "陵水黎族自治县", "保亭黎族苗族自治县", "琼中黎族苗族自治县"],
            "甘肃": ["兰州", "嘉峪关", "金昌", "白银", "天水", "武威", "酒泉", "张掖", "庆阳", "平凉", "定西", "陇南", "临夏回族自治州", "甘南藏族自治州"],
            "宁夏": ["银川", "石嘴山", "吴忠", "固原", "中卫"],
            "青海": ["西宁", "海东地区", "海北藏族自治州", "海南藏族自治州", "黄南藏族自治州", "果洛藏族自治州", "玉树藏族自治州", "海西蒙古族藏族自治州"],
            "新疆": ["乌鲁木齐", "克拉玛依", "吐鲁番地区", "哈密地区", "和田地区", "阿克苏地区", "喀什地区", "克孜勒苏柯尔克孜自治州", "巴音郭楞蒙古自治州", "昌吉回族自治州", "博尔塔拉蒙古自治州", "石河子", "阿拉尔", "图木舒克", "五家渠", "伊犁哈萨克自治州"],
            "香港": ["香港"],
            "澳门": ["澳门"],
            "台湾": ["台北市", "高雄市", "台北县", "桃园县", "新竹县", "苗栗县", "台中县", "彰化县", "南投县", "云林县", "嘉义县", "台南县", "高雄县", "屏东县", "宜兰县", "花莲县", "台东县", "澎湖县", "基隆市", "新竹市", "台中市", "嘉义市", "台南市"]
        }
    };
    tammy.config = FINAL_OPTIONS;

    //数据类型判断
    (function() {
        function isType(type) {
            return function(obj) {
                return {}.toString.call(obj) == '[object ' + type + ']';
            };
        }

        function objIsNull(obj) {
            for (var i in obj) {
                return false;
            }
            return true;
        }
        tammy.utils.isObject = isType('Object');
        tammy.utils.isString = isType('String'); //是否为字符串
        tammy.utils.isArray = Array.isArray || isType('Array'); //是否为数组
        tammy.utils.isFunction = isType('Function'); //是否为Function
        tammy.utils.isNumber = isType('Number'); //是否为数字
        tammy.utils.objIsNull = objIsNull; //对象是否为空
    })();

    (function() {
        function imgLoad(obj) {
            var winWidth = $(window).width(),
                winHeight = $(window).height(),
                left, top, objWidth, objHeight;
            var wRatio = (winWidth * 0.7) / obj.width;
            var hRatio = (winHeight * 0.7) / obj.height;
            if (obj.height > winHeight * 0.7 || obj.width > winWidth * 0.7) {
                var Ratio = wRatio <= hRatio ? wRatio : hRatio;
                objWidth = obj.width * Ratio;
                objHeight = obj.height * Ratio;
                obj.setAttribute('width', objWidth);
                obj.setAttribute('height', objHeight);
            } else {
                objWidth = obj.width;
                objHeight = obj.height;
            }

            left = (winWidth - objWidth) / 2;
            top = (winHeight - objHeight - 50) / 2;
            return {
                left: left,
                top: top,
                width: objWidth,
                height: objHeight
            };
        }
        tammy.utils.imgLoad = imgLoad;
    })();

    /**
     * 弹窗口统一调用
     */
    (function() {
        require('art-dialog');
        var poup = {
            showModal: function(opt) {
                var defaults = {
                    title: '温馨提示',
                    okValue: '确定',
                    fixed: true,
                    onclose: function() {
                        $('.self-errMsg-container').remove();
                    },
                    cancelValue: '取消'
                };

                $.extend(defaults, opt);

                defaults.content = $.trim(defaults.content);
                var beforeFour = defaults.content.substring(0, 4);
                if (beforeFour === '<img') {
                    (new tammy.ui.shadow()).init();
                    var conText = defaults.content;
                    var imgSrc = conText.substring(conText.indexOf('src=') + 5, conText.indexOf('"/>'));
                    var imgObj = new Image();
                    imgObj.onload = function() {
                        var positions = tammy.utils.imgLoad(imgObj);
                        defaults.width = positions.width;
                        defaults.height = positions.height;
                        defaults.left = positions.left;
                        defaults.top = positions.top;
                        var imgHtml = '<img src="' + imgSrc + '" width="' + defaults.width + '" height="' + defaults.height + '"/>';
                        defaults.content = imgHtml;
                        (new tammy.ui.shadow()).close();
                        var dg = dialog(defaults);
                        dg.showModal();
                    };
                    imgObj.onerror = function() {
                        var imgHtml = '<img src="/src/img/nopic.png" width="400" height="300"/>';
                        defaults.content = imgHtml;
                        (new tammy.ui.shadow()).close();
                        defaults.width = 400;
                        defaults.height = 300;
                        var dg = dialog(defaults);
                        dg.showModal();
                    };
                    imgObj.src = imgSrc;
                    return false;
                }

                var dg = dialog(defaults);
                dg.showModal();
                var dgo = $('.ui-dialog-grid');
                var dgh = $('.ui-dialog-grid').height();
                if (dgo.length > 1) {
                    dgh = dgo.eq(dgo.length - 1).height();
                }
                var h = $(window).height();
                if (dgh > h - 200) {
                    $(".ui-dialog-content").mCustomScrollbar({
                        setHeight: h - 240,
                        theme: "minimal-dark"
                    });
                }
                return dg;
            },
            confirm: function(opt) {
                var defaults = {
                    title: '温馨提示',
                    content: opt.content,
                    ok: opt.ok || function() {},
                    okValue: opt.okValue || '确定',
                    cancel: function() {
                        this.close();
                    },
                    cancelValue: opt.okValue || '取消'
                };
                var dg = dialog(defaults);
                dg.showModal();
            },
            alertTime: function(opt) {
                var defaults = {
                    content: opt.content,
                };
                var dg = dialog(defaults);
                dg.showModal();
                window.setTimeout(function() {
                    dg.close().remove();
                }, opt.time * 1000);
            },
            tips: function(opt) {
                var defaults = {
                    content: opt.content,
                    quickClose: true,
                    align: opt.align || 'bottom'
                };
                var dg = dialog(defaults);
                dg.show(opt.target);
            },
            closeArt: function() {
                var list = dialog.list;
                for (var i in list) {
                    list[i].close();
                }
            }
        };
        tammy.utils.alert = poup.showModal;
        tammy.utils.confirm = poup.confirm;
        tammy.utils.closeArt = poup.closeArt;
        tammy.utils.alertTime = poup.alertTime;
        tammy.utils.tips = poup.tips;
    })();

    /**
     *  数组内查找
     * @param  val string 要查找字符
     * @return number 存在则返回索引 不存在则返回 -1
     */
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };

    /**
     * 数组内删除
     * @param val string 要删除的字符
     */
    Array.prototype.remove = Array.remove || function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    /**
     * 表单转换JSON对象方法
     * @return object json对象
     */
    (function() {
        function FormToJSON(form) {
            var arr = $(form).serializeArray();
            var final_json = {};
            $.each(arr, function(index, item) {
                var attrName = item.name;
                var attrVal = $.trim(item.value);
                if (typeof final_json[attrName] === 'undefined') {
                    final_json[attrName] = attrVal;
                } else {
                    var tempStr = final_json[attrName];
                    if (jh.utils.isArray(tempStr)) {
                        final_json[attrName].push(attrVal);
                    } else {
                        var newArr = [];
                        newArr.push(tempStr);
                        newArr.push(attrVal);
                        final_json[attrName] = newArr;
                    }
                }
            });

            var radios = $('input[type=radio],input[type=checkbox]', $(form));
            $.each(radios, function(index, item) {
                if (!final_json.hasOwnProperty(item.name)) {
                    final_json[item.name] = '';
                }
            });
            return final_json;
        }
        tammy.utils.formToJson = FormToJSON;
    })();

    /**
     * 字符串操作
     */
    (function() {
        function _String() {}
        /**
         * 格式化金额
         * @param string, separator
         * @return string
         */
        _String.formateMoney = function(string, separator) {
            if (!separator) separator = ',';
            if (typeof string === 'number') {
                string = string.toString();
            }
            return string.replace(/\b\d+\b/, function(str) {
                var len = str.length,
                    miu = Math.floor((len % 3 === 0 ? (len - 1) : len) / 3);
                if (len < 4) {
                    return str;
                }
                str = str.split('');
                for (var i = 1, j = 0; i <= miu; i++, j++) {
                    str.splice(len - i * 3 - j, 0, separator);
                    len++;
                }
                return str.join('');
            });
        };
        /**
         * 反格式化金额
         * @param string, separator
         * @return string
         */
        _String.unformateMoney = function(string, separator) {
            if (!separator) separator = ',';
            return string.split(separator).join('');
        };
        /**
         * 忽略大小写检测字符串是不是相等
         * @param s1
         * @param s2
         * @return Boolean
         */
        _String.equalsIgnoreCase = function(s1, s2) {
            return s1.toUpperCase() == s2.toUpperCase();
        };
        /**
         * 检测是否全为中文
         * @param s
         * @return Boolean
         */
        _String.isChinese = function(s) {
            return /^[\u4E00-\uFA29]*$/.test(s) && (!/^[\uE7C7-\uE7F3]*$/.test(s.replace(/(^\s*)|(\s*$)/g, '')));
        };
        /**
         * 检测是否为Email
         * @param s
         * @return Boolean
         */
        _String.isEmail = function(s) {
            var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/i;
            return reg.exec(s) !== null;
        };
        /**
         * 是否为邮编
         * @param s
         * @return Boolean
         */
        _String.isPost = function(s) {
            return /^\d{6}$/.test(s);
        };
        /**
         * 检测扩展名是否为图片
         * @param s
         * @return Boolean
         */
        _String.isImg = function(s) {
            var reg = /[.]+(jpg|jpeg|png|bmp|gif)$/gi;
            return reg.test(s);
        };
        /**
         * 是否为手机号
         * @param mobile
         * @return Boolean
         */
        _String.isMobile = function(mobile) {
            var reg = /^1[3|4|5|7|8][0-9]{9}$/;
            return reg.test(mobile);
        };
        /**
         * 数字是否正整数
         * @param number
         * @return Boolean
         */
        _String.isPositiveInteger = function(num) {
            return /^[1-9]\d*$/.test(num);
        };
        /**
         * 数字是否为身份证号
         * @param number
         * @return Boolean
         */
        _String.isIdCard = function(num) {
            return /^[1-9]((\d{14})|(\d{16}(\d|X|x)))$/.test(num);
        };
        /**
         * 判断字符串不含特殊字符
         * @param string
         * @return Boolean
         */
        _String.hasNoSpecial = function(str) {
            return /^[a-zA-Z0-9\u4E00-\u9FA5]+$/.test(str);
        };
        /**
         * 时间格式转时间戳
         * @param time,seperator
         * @return number
         */
        _String.timeFormate2Number = function(time, seperator) {
            var str, arr, newTime;
            if (!seperator) seperator = '-';
            str = time.replace(/:/g, seperator);
            str = str.replace(/ /g, seperator);
            arr = str.split(seperator);
            newTime = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
            return newTime.getTime();
        };
        /**
         * 时间戳转时间格式
         * @param time,seperator
         * @return string
         */
        _String.timeNumber2Formate = function(time, seperator) {
            var str, first, second, arr;
            if (!seperator) seperator = '-';
            if (typeof time === 'string') {
                time = parseInt(time, 10);
            }
            str = new Date(time);
            first = str.toLocaleDateString().replace(/\//g, seperator);
            second = str.toLocaleTimeString();
            if (second.indexOf('上午') >= 0) {
                arr = second.replace('上午', '').split(':');
                if (parseInt(arr[0], 10) < 10) {
                    arr[0] = '0' + arr[0];
                }
                second = arr.join(':');
            }
            if (second.indexOf('下午') >= 0) {
                arr = second.replace('下午', '').split(':');
                arr[0] = parseInt(arr[0], 10) + 12;
                arr[0] += '';
                second = arr.join(':');
            }
            return first + ' ' + second;
        };

        /**
         * 隐藏手机号中间四位
         * @param string
         * @return string
         */
        _String.dealMobile = function(str) {
            if (typeof str === 'number') {
                str = str.toString();
            }
            return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        };

        /**
         * 隐藏身份证号中间几位
         * @param string
         * @return string
         */
        _String.dealIDCard = function(str) {
            if (typeof str === 'number') {
                str += '';
            }
            var s;
            s = str.length === 18 ? str.replace(/(\d{3})\d{12}([\d{3}]|[\d{2}]X)/, '$1************$2') : str.replace(/(\d{3})\d{9}(\d{3})/, '$1*********$2');
            return s;
        };

        /**
         * 判断数字的奇偶性
         * @param number
         * @return boolean
         * 奇数返回true，偶数返回false，非数字报错
         */

        _String.isOdd = function(number) {
            if (typeof number !== 'number') {
                throw new Error('parameter must be number type');
            } else {
                return number % 2 === 1;
            }
        };
        tammy.utils.string = tammy.utils.string || _String;
    })();

    /**ajax*/
    (function() {
        var ajax = {};
        ajax.array = [];
        ajax.setting = function(data) {
            var _this = this;
            _this.url = data.hasOwnProperty('url') ? data.url : '';
            _this.method = data.hasOwnProperty('method') ? data.method : 'GET';
            _this.dataType = data.hasOwnProperty('dataType') ? data.dataType : 'json';
            _this.data = data.hasOwnProperty('data') ? data.data : {};
            _this.async = data.hasOwnProperty('async') ? data.async : true;
            _this.contentType = data.hasOwnProperty('contentType') ? data.contentType : 'application/x-www-form-urlencoded; charset=UTF-8';
            _this.fail = data.hasOwnProperty('fail') ? data.fail : function() {};
            _this.done = data.hasOwnProperty('done') ? data.done : function() {};
            _this.always = data.hasOwnProperty('always') ? data.always : function() {};
            _this.isAlert = data.hasOwnProperty('isAlert') ? data.isAlert : true;
            _this.beforeSend = data.hasOwnProperty('beforeSend') ? data.beforeSend : function() {};

            return _this;
        };
        ajax.send = function(opt) {
            var arr = ajax.array;
            var setting = new ajax.setting(opt);
            arr.push(setting);
            if (arr.length > 0) {
                var opts = arr.shift();
                ajax.arrSend(opts);
            }
        };

        ajax.arrSend = function(settings) {
            if (!tammy.utils.objIsNull(settings.data) && settings.contentType == 'application/json') {
                settings.data = JSON.stringify(settings.data);
            }

            $.ajax({
                url: REQUESTROOT + settings.url,
                type: settings.method,
                dataType: settings.dataType,
                contentType: settings.contentType,
                data: settings.data,
                cache: false,
                async: settings.async,
                beforeSend: function(xhr) {
                    var token = sessionStorage.getItem('customer-X-Token');
                    xhr.setRequestHeader("X-Token", token);
                    settings.beforeSend.call(null, xhr);
                }
            }).
            done(function(responseText, statusText, xhr) {
                if (responseText && responseText.code === "TOKEN_FAIL") {
                    tammy.utils.confirm({
                        content: '登陆失效，请重新登陆',
                        ok: function() {
                            sessionStorage.removeItem('customer-X-Token');
                            sessionStorage.removeItem('customer-username');
                            sessionStorage.removeItem('customer-isState');
                            sessionStorage.removeItem('customer-uploadToken');
                            window.location.href = jh.config.pageLogin;
                        },
                        cancel: false
                    });
                    return false;
                }
                if (responseText && responseText.code !== 'SUCCESS') {
                    //错误时提示信息
                    if (settings.isAlert) {
                        //错误时提示信息
                        tammy.utils.confirm({
                            content: responseText.msg,
                            ok: true
                        });
                    }
                    settings.fail.call(null, responseText);
                    return false;
                }
                settings.done.call(null, responseText, statusText, xhr);
            }).
            fail(function(response) {
                settings.fail.call(null, response);
            }).
            always(function(response, text) {
                settings.always.call(null, response, text);
            });
            $('body').dequeue();
        };
        tammy.utils.ajax = ajax;
    })();

    (function() {
        function Singout() {
            this.init = function() {
                tammy.utils.ajax.send({
                    url: '/user/logout',
                    always: function() {
                        sessionStorage.removeItem('customer-X-Token');
                        sessionStorage.removeItem('customer-username');
                        sessionStorage.removeItem('customer-isState');
                        sessionStorage.removeItem('customer-uploadToken');
                        sessionStorage.removeItem('skipAuth');
                        window.location.href = jh.config.pageLogin;
                    }
                });
            };
        }
        tammy.utils.singout = Singout;
    })();

    /*修改菜单区域高度*/
    (function() {
        var updateMenuBoxHeight = function() {
            var winHeight = $(window).height();
            var docHeight = $(document).height();
            var rigthCon = $('.right-side');
            var lefthCon = $('.left-side');

            rigthCon.height(winHeight - 100);
            lefthCon.height(winHeight - 100);

            rigthCon.mCustomScrollbar({
                setHeight: winHeight - 100,
                theme: "minimal-dark"
            });

            lefthCon.mCustomScrollbar({
                setHeight: winHeight - 100,
                theme: "minimal-dark"
            });
        };
        tammy.utils.updateMenuBoxHeight = updateMenuBoxHeight;
    })();

    /**
     * 请求页面
     */
    (function() {
        var showHTML = function(targetURL) {
            if (targetURL.indexOf(ROOTURL + '/') === -1) {
                var firstChart = targetURL.substring(0, 1);
                if (firstChart === '/') {
                    targetURL = ROOTURL + targetURL;
                } else {
                    targetURL = ROOTURL + '/' + targetURL;
                }
            }
            $('#content-container').load(targetURL, function(response, status, xhr) {
                if (xhr.status === 404) {
                    tammy.utils.load(FINAL_OPTIONS.page404);
                } else {
                    tammy.utils.updateMenuBoxHeight();
                    var txt = '';
                    var breadCrumb = $('#breadCrumb'); //面包屑容器
                    var breadParnet = breadCrumb.parent();
                    var moduleCon = $('#leftMenu-box').children('li.active'); //一级菜单
                    var activeFirst = moduleCon.children('a'); //一级选中的文字
                    txt += activeFirst.text();
                    if (txt) {
                        txt = ' > ' + txt;
                        breadCrumb.text(txt);
                        breadParnet.removeClass('hide');
                    } else {
                        breadParnet.addClass('hide');
                    }
                    tammy.utils.defaultPage();
                }
            });
        };
        tammy.utils.showHTML = showHTML;
    })();
    
    (function() {
      var breadCrumb = function(obj, str) {
        obj.text(str)
      }
      tammy.utils.changeText = breadCrumb;
    })();

    /**
     * 加载页面
     */
    (function() {
        var kyload = function(targetURL, data) {
            var dataStr = '';
            for (var temp in data) {
                var item = data[temp];
                dataStr += ',' + temp + '=' + item;
            }
            dataStr = dataStr.substring(1);
            window.location.href = tammy.utils.BASEURL + '#routeModule=' + targetURL + '*routeData=' + dataStr;
        };
        tammy.utils.load = kyload;
    })();

    /**
     * 获取URL中模块信息及参数
     */
    (function(win) {
        var getURLValue = function() {
            var hashs = win.hash;
            var returnData = {
                module: '',
                args: {}
            };
            hashs = hashs.replace(/[#*]/ig, '');
            var datas = hashs.substring(hashs.indexOf('routeData=') + 10);
            var moduleStr = hashs.substring(hashs.indexOf('routeModule=') + 12, hashs.indexOf('routeData='));
            returnData.module = moduleStr.indexOf('.html') === -1 ? moduleStr + '.html' : moduleStr;

            var dataArr = datas.split(',');
            for (var i = 0; i < dataArr.length; ++i) {
                var temp = dataArr[i].split('=');
                var name = temp[0],
                    val = temp[1];
                returnData.args[name] = val;
            }
            return returnData;
        };
        tammy.utils.getURLValue = getURLValue;
    })(window.location);

    /**
     * 获取当前文档地址
     */
    (function() {
        var dispathHost = function() {
            var baseUrl = window.location;
            var protocol = baseUrl.protocol; //协议
            var host = baseUrl.host; //域名端口
            var pathName = baseUrl.pathname; //当前页面的路径和文件名
            var finalUrl = protocol + '//' + host + pathName; //完整目录
            return finalUrl;
        };
        tammy.utils.BASEURL = dispathHost();
    })();

    /**
     * 加载默认页面
     *感觉可以再模板处直接判断。之后测试一下
     */
    (function() {
        var defaultContent = function(targetURL, fn) {
            var currURL = window.location;
            if (currURL.hash) {
                var args = targetURL ? targetURL : (tammy.utils.getURLValue()).module;
                var allMenu = $('#leftMenu-box').find('li');
                for (var i = 0, len = allMenu.length; i < len; ++i) {
                    var item = allMenu.eq(i);
                    var itemModule = item.children('a').data('url');
                    var str1 = args.substring(0, args.lastIndexOf('/'));
                    var str2 = itemModule.substring(0, args.lastIndexOf('/'));
                    if (args === itemModule + '.html' || str1 === str2) {
                        if (typeof fn === 'function') {
                            fn(item);
                        } else {
                            allMenu.removeClass('active');
                            item.addClass('active');
                        }
                    }
                }
            } else {
                var isState = sessionStorage.getItem('customer-isState');
                var skipAuth = sessionStorage.getItem('skipAuth');
                if ( (isState === 'new' || isState === 'unavailable') && !skipAuth) {
                    jh.utils.load('/src/modules/person/person-center');
                } else {
                    jh.utils.load('/src/modules/welcome/welcome.html');
                }
            }
        };
        tammy.utils.defaultPage = defaultContent;
    })();

    (function() {
        function Shadow(option) {
            var m = this;
            m.option = {};
            $.extend(m.option, option);
        }
        Shadow.prototype.addShadow = function() {
            if ($('#kyPoupshadow').length > 0) {
                $('#kyPoupshadow').remove();
            }
            var shadowstr = '<div id="kyPoupshadow" class="loading"><div class="loading-img"><div/></div>';
            $('body').append(shadowstr).end().find('#kyPoupshadow').css('height', $(document).height());
        };
        Shadow.prototype.close = function() {
            $('#kyPoupshadow').fadeOut(600);
        };
        Shadow.prototype.init = function() {
            var m = this;
            m.addShadow();
        };
        tammy.ui.shadow = Shadow;
    })();

    (function() {
        function Page(options) {
            var m = this;
            m.settings = {
                url: '',
                method: 'GET',
                contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                show_page_number: 5,
                showPageTotal: true,
                jump: true,
                noData: '',
                ident: '', //模块标识
                data: {
                    pageNum: 1,
                    pageSize: tammy.config.pageSize,
                    params: {}
                },
                data_container: $('.data_container'), //数据容器
                page_container: $('.page_container'), //分页容器
                firstText: '<',
                preText: '上一页',
                nextText: '下一页',
                lastText: '>',
                isSearch: false,
                callback: function() {},
                btnClickCallBack: function() {},
                beforRender: function() {},
                onload: function() {}
            };
            if (jh.utils.objIsNull(options.data)) {
                delete options.data;
            }
            m.settings.data.params = $.extend({}, m.settings.data.params, options.data);
            options.data = m.settings.data;
            $.extend(m.settings, options);
        }
        Page.prototype.init = function() {
            var m = this;
            m.settings.page_container.addClass('pagination');
            m.render(1);
            m.regEvent();
        };
        Page.prototype.create = function(num) {
            var m = this;
            if (typeof num !== 'number') {
                if (parseInt(num, 10)) {
                    num = parseInt(num, 10);
                } else {
                    num = 1;
                }
            }
            m.makepage(num);
        };
        Page.prototype.makepage = function(num) {
            var m = this,
                arr = [],
                s = m.settings,
                half;
            if (m.page_total <= s.show_page_number + 2) {
                //如果总页数<=展示页数 + 2，则直接循环输出分页按钮
                for (var i = 1; i <= m.page_total; i++) {
                    if (i !== num) {
                        arr.push('<a href="#page- ' + i + '">' + i + '</a>');
                    } else {
                        arr.push('<span class="jh_current_page">' + i + '</span>');
                    }
                }
            } else {
                half = tammy.utils.string.isOdd(s.show_page_number) ? Math.ceil(s.show_page_number / 2) : s.show_page_number / 2;
                var lastPage = '<span class="ellipsis">...</span>'; //中间省略号部分
                lastPage += '<a href="#page-' + m.page_last_second + '">' + m.page_last_second + '</a>'; //倒数第二页
                lastPage += '<a href="#page-' + m.page_total + '">' + m.page_total + '</a>'; //最后一页
                if (num <= half) {
                    for (var i = 1; i <= s.show_page_number; i++) {
                        if (i !== num) {
                            arr.push('<a href="#page- ' + i + '">' + i + '</a>');
                        } else {
                            arr.push('<span class="jh_current_page">' + i + '</span>');
                        }
                    }
                    arr.push(lastPage);
                } else {
                    var j = Math.floor(s.show_page_number / 2);
                    if (num >= 3 + half) {
                        arr.push('<a href="#page-1">1</a><a href="#page-2">2</a><span class="ellipsis">...</span>');
                        var start = m.page_total - s.show_page_number - 3;
                        if (num > start) {
                            if (start < 4) {
                                start = 4;
                            }
                            for (var i = start; i <= m.page_total; i++) {
                                if (i !== num) {
                                    arr.push('<a href="#page- ' + i + '">' + i + '</a>');
                                } else {
                                    arr.push('<span class="jh_current_page">' + i + '</span>');
                                }
                            }
                        } else {
                            half = tammy.utils.string.isOdd(s.show_page_number) ? j : (j - 1);
                            for (var i = num - half; i <= num + j; i++) {
                                if (i !== num) {
                                    arr.push('<a href="#page- ' + i + '">' + i + '</a>');
                                } else {
                                    arr.push('<span class="jh_current_page">' + i + '</span>');
                                }
                            }
                            arr.push(lastPage);
                        }
                    } else {
                        var i, tmp = num + j;
                        for (i = 1; i <= tmp; i++) {
                            if (i >= m.page_last_second) {
                                continue;
                            }
                            if (i !== num) {
                                arr.push('<a href="#page- ' + i + '">' + i + '</a>');
                            } else {
                                arr.push('<span class="jh_current_page">' + i + '</span>');
                            }
                        }
                        if (m.page_total - tmp > 2) {
                            arr.push('<span class="ellipsis">...</span>');
                        }
                        arr.push('<a href="#page-' + m.page_last_second + '">' + m.page_last_second + '</a><a href="#page-' + m.page_total + '">' + m.page_total + '</a>');
                    }
                }
            }
            s.page_container.find('.jh_page').html(arr.join(''));
            if (s.jump) {
                s.page_container.find('.jh_jump_text').val(num);
            }
        };
        /**
         * [makeHtml 拼接分页主容器
         * @return string 分页主容器结构字符串
         */
        Page.prototype.makeHtml = function() {
            var m = this,
                s = m.settings,
                arr = [];
            if (s.showPageTotal) {
                arr.push('<div class="pull-left">');
                arr.push('  <span id="jh_page_totalSize"> 总共：</span>');
                arr.push('</div>');
            }
            arr.push('<div class="pull-right jh_pages">');
            //pre容器
            arr.push('<div class="jh_page_pre">');
            // arr.push('<span class="jh_first_page">' + s.firstText + '</span>'); //首页 不可点击状态
            arr.push('<span class="jh_pre_page">' + s.preText + '</span>'); //上一页 不可点击状态
            arr.push('</div>'); //pre容器结束
            //中间页数容器
            arr.push('<div class="jh_page"></div>');
            //next容器
            arr.push('<div class="jh_page_next">');
            arr.push(' <a href="#page-" ' + m.page_total + ' class="jh_next_page"> ' + s.nextText + ' </a> '); //下一页
            // arr.push(' <a href="#page-" ' + m.page_total + ' class="jh_last_page"> ' + s.lastText + ' </a> '); //尾页
            arr.push('</div>'); //next容器结束

            if (s.jump) {
                arr.push('<div class="jh_jump_to">');
                arr.push('<form>');
                arr.push('<span class="noBg">跳至</span>');
                arr.push('<input type="text" value="1" class="jh_jump_text"  maxlength="6" id="jh_jump_text"/>'); //默认显示第一页
                arr.push('<span class="noBg">页</span>');
                arr.push('<input type="submit" value="跳转" class="jh_jump_button" />');
                arr.push('</form></div>'); //跳转结束
            }

            arr.push('</div>'); //分页容器结束
            return arr.join('');
        };
        Page.prototype.render = function(pageNum) {
            var m = this,
                s = m.settings;
            s.data.pageNum = pageNum;
            tammy.utils.ajax.send({
                url: s.url,
                method: s.method,
                contentType: s.contentType,
                data: s.data,
                done: function(returnData) {
                    var response = returnData.data;
                    //如果返回数据没有total数据总条数，则清空内容和分页容器 显示错误信息
                    if (!response.total) {
                        var tdCol = s.data_container.siblings().find('th').length;
                        s.noData = s.noData ? s.noData : '<tr><td colspan="' + tdCol + '">无记录</td></tr>';
                        s.data_container.html(s.noData);
                        s.page_container.empty();
                        return false;
                    }

                    m.page_total = Math.ceil(response.total / s.data.pageSize); //分页总数
                    m.page_last_second = m.page_total - 1; //倒数第二页

                    try {
                        response.menuState = tammy.utils.menuState;
                        var viewStr = s.callback.call(null, response); //获取拼接后的展示数据，增加容错处理
                        s.data_container.html(viewStr); //插入数据
                        m.onload();
                    } catch (e) {

                    }

                    //如果数据超过 1 页则进行分页显示
                    if (m.page_total > 1) {
                        if (s.page_container.children('.jh_pages').length === 0) {
                            s.page_container.html(m.makeHtml()); //如果分页容器未进行初始化，则进行初始化操作
                        }
                        m.create(pageNum); //处理分页

                        if (pageNum === 1) {
                            s.page_container.find('.jh_page_pre').html('<span class="jh_pre_page">' + s.preText + '</span>');
                            s.page_container.find('.jh_page_next').html('<a class="jh_next_page" href="#page-' + m.page_total + '">' + s.nextText + '</a>');
                        } else if (pageNum === m.page_total) {
                            s.page_container.find('.jh_page_pre').html('<a class="jh_pre_page" href="#page-1">' + s.preText + '</a>');
                            s.page_container.find('.jh_page_next').html('<span class="jh_next_page">' + s.nextText + '</span>');
                        } else {
                            s.page_container.find('.jh_page_pre').html('<a class="jh_pre_page" href="#page-1">' + s.preText + '</a>');
                            s.page_container.find('.jh_page_next').html('<a class="jh_next_page" href="#page-' + m.page_total + '">' + s.nextText + '</a>');
                        }
                    } else {
                        s.page_container.empty();
                    }
                    $('#jh_page_totalSize').html(' 总共: ' + response.total + ' 条');
                }
            });
        };
        Page.prototype.current = function() {
            var m = this;
            return parseInt(m.settings.page_container.find('.jh_page .jh_current_page').html(), 10);
        };
        Page.prototype.regEvent = function() {
            var m = this,
                s = m.settings;
            //首页
            s.page_container.off('click', '.jh_first_page').on('click', '.jh_first_page', function(event) {
                event.preventDefault();
                var cur = m.current();
                if (cur === 1) {
                    return false;
                }
                s.beforRender(1);
                m.render(1);
                s.btnClickCallBack();

            });
            //上一页
            s.page_container.off('click', '.jh_pre_page').on('click', '.jh_pre_page', function(event) {
                event.preventDefault();
                var cur = m.current();
                if (cur === 1) {
                    return false;
                }
                var preNum = cur - 1;
                s.beforRender(preNum);
                m.render(preNum);
                s.btnClickCallBack(preNum);
            });
            //第几页
            s.page_container.off('click', '.jh_page a').on('click', '.jh_page a', function(event) {
                event.preventDefault();
                var me = $(this),
                    val = me.text();
                if (me.hasClass('jh_current_page')) {
                    return false;
                }
                val = parseInt(val, 10);
                s.beforRender(val);
                m.render(val);
                s.btnClickCallBack();
            });
            //下一页
            s.page_container.off('click', '.jh_next_page').on('click', '.jh_next_page', function(event) {
                event.preventDefault();
                var cur = m.current();
                if (cur === m.page_total) {
                    return false;
                }
                var preNum = cur + 1;
                s.beforRender(preNum);
                m.render(preNum);
                s.btnClickCallBack(preNum);
            });
            //尾页
            s.page_container.off('click', '.jh_last_page').on('click', '.jh_last_page', function(event) {
                event.preventDefault();
                var cur = m.current();
                if (cur === m.page_total) {
                    return;
                }
                s.beforRender(m.page_total);
                m.render(m.page_total);
                s.btnClickCallBack();
            });
            //跳转
            if (s.jump) {
                s.page_container.off('click', '.jh_jump_to .jh_jump_button').on('click', '.jh_jump_to .jh_jump_button', function(event) {
                    event.preventDefault();
                    var me = $(this).siblings('.jh_jump_text'),
                        val = me.val();
                    if (val.match(/^[1-9][0-9]*$/)) {
                        val = parseInt(val, 10);
                        if (val > m.page_total) {
                            val = m.page_total;
                        }
                        m.render(val);
                    } else {
                        tammy.utils.tips({
                            content: '请输入正确的页数！',
                            target: me[0]
                        });
                    }
                    return false;
                });
            }
        };
        Page.prototype.onload = function() {
            var m = this,
                s = m.settings;
            $(document).ready(function() {
                s.onload();
            });

        };
        tammy.ui.page = Page;
    })();

    (function() {
        var tammy_webuploader = {
            init: function(opts, callbackObj) {
                var _this = this;
                //配置参数
                var options = {
                    auto: true, //自动上传
                    isAppend: true, //是否加入队列，false为覆盖
                    hiddenName: '',
                    swf: basePath + 'js/plugin/webuploader/Uploader.swf', //swf文件路径
                    server: opts.server || 'http://up.qiniu.com/', //后台server
                    pick: {
                        id: '#file',
                        multiple: false
                    }, //上传按钮id,是否可以多个文件同时上传
                    fileNumLimit: 10, //可上传数量
                    fileSingleSizeLimit: 5242880,
                    duplicate: true, //可重复上传同一张图片
                    fileVal: 'file',
                    formData: {
                        token: ''
                    }, //向后台发送的formData数据
                    accept: {
                        title: 'Images',
                        extensions: 'jpg,jpeg,bmp,png',
                        mimeTypes: 'image/jpg,image/jpeg,image/png,image/bmp'
                    }
                };
                var opt = $.extend({}, options, opts); //合并参数
                if (options.server === 'http://up.qiniu.com/') {
                    opt.formData.token = sessionStorage.getItem('customer-uploadToken');
                } else {
                    opt.formData.token = sessionStorage.getItem('customer-X-Token');
                }
                var uploader = WebUploader.create(opt); //创建上传对象
                var pickId = uploader.options.pick.id.replace(/#/, '');
                var queueList = $('#' + pickId).siblings('.upload-list');
                $('#' + pickId + ' .webuploader-pick').text($('#' + pickId).text());

                //文件被添加进队列之前
                uploader.on('beforeFileQueued', function() {
                    //当前已上传数量如已达到最大限制数量，则提示并中断加入加入队列
                    if (uploader.options.fileNumLimit === queueList.children('div').length) {
                        tammy.utils.alert({
                            content: '最多上传' + uploader.options.fileNumLimit + '个文件'
                        });
                        return false;
                    }
                });

                // 文件上传失败，显示上传出错。
                uploader.on('uploadError', function(file,reason) {
                    if(reason === 'http'){
                        tammy.utils.confirm({
                            content: '网络开小差了！',
                            ok: function() {
                                window.location.reload();
                            },
                            cancel: false
                        });
                    }
                    var li = $('#' + file.id),
                        error = li.find('div.error');
                    // 避免重复创建
                    if (!error.length) {
                        error = $('<div class="error"></div>').appendTo(li);
                    }
                    error.text('上传失败');
                });

                //错误处理
                uploader.on('error', function(type) {
                    var errstr = '';
                    var isOk = _this.fileLengthCheck.call(this, queueList, uploader);
                    if (!isOk) {
                        switch (type) {
                            case 'Q_EXCEED_NUM_LIMIT':
                                errstr = '最多上传' + uploader.options.fileNumLimit + '个文件';
                                break;
                            case 'F_EXCEED_SIZE':
                                errstr = '文件大小超过限制,请上传5MB文件';
                                break;
                            case 'Q_TYPE_DENIED':
                                var accept = tammy.utils.isArray(uploader.options.accept) ? uploader.options.accept[0].extensions : uploader.options.accept.extensions;
                                errstr = '文件格式不正确,仅限 ' + accept;
                        }
                    }
                    if (errstr) {
                        tammy.utils.alert({
                            content: errstr
                        });
                    }
                });

                //服务端响应事件
                uploader.on('uploadAccept', function(file, returnData) {
                    uploader.reset(); //重置队列
                    if (typeof returnData.code !== 'undefined') {
                        if (returnData.code !== "SUCCESS") {
                            tammy.utils.alert({
                                content: returnData.msg
                            });
                            return false;
                        }
                        if (typeof callbackObj !== 'undefined' && !tammy.utils.objIsNull(callbackObj)) {
                            returnData.uploader = uploader;
                            callbackObj.uploadAccept(file, returnData);
                        }
                        return false;
                    }

                    if (typeof returnData.key !== 'undefined') {
                        var item = $(
                            '<div class="upfile-item">' +
                            '<img class="preview-img" />' +
                            '<span class="delete-img"></span>' +
                            '<input type="hidden" />' +
                            '</div>'
                        );
                        var img = item.find('img'); //预览图对象
                        var span = item.find('span'); //删除按钮
                        var input = item.find('input'); //隐藏域

                        img.attr('src', tammy.config.viewImgRoot + returnData.key + tammy.config.imageScale);
                        var inputName = uploader.options.hiddenName === '' ? pickId : uploader.options.hiddenName;
                        input.attr({
                            name: inputName,
                            value: returnData.key
                        });
                        if (uploader.options.isAppend) {
                            queueList.append(item); //加入展示容器
                        } else {
                            queueList.empty().html(item); //覆盖容器内容
                        }
                    }
                });

                // 上传完了，成功或者失败，先删除进度条。
                uploader.on('uploadComplete', function() {});
                window._selfUploader = window._selfUploader || {}; //存储当前实例
                window._selfUploader[pickId] = uploader;
            },
            fileLengthCheck: function(queueList, uploader) {
                var list = queueList.children('div');
                if (list.length < uploader.options.fileNumLimit) {
                    for (var i = 0, len = uploader.options.fileNumLimit - list.length; i < len; i++) {
                        var files = this.getFiles('complete');
                        if (files.length === 0) {
                            break;
                        }
                        var file = files[files.length - 1];
                        this.removeFile(file);
                    }
                    return false;
                }
                return true;
            }
        };
        tammy.utils.uploader = tammy_webuploader;
    })();

    (function() {
        function validateImg(form) {
            var imgStatus = true;
            var uploaderRequired = form.find('.uploaderRequired');
            for (var i = 0; i < uploaderRequired.length; i++) {
                var item = uploaderRequired.eq(i);
                var uploader = item.siblings('.webuploader-container');
                item.siblings('label.error').remove().end();
                if (item.children('div').length === 0) {
                    uploader.addClass('red-border');
                    imgStatus = false;
                    break;
                } else {
                    uploader.removeClass('red-border');
                }
            }
            return imgStatus;
        }
        tammy.utils.validateImg = validateImg;
    })();
    (function() {
        function validateUeditor(form) {
            var ueStatus = true;
            var ueRequired = form.find('.ueRequired');
            if (ueRequired.length == 0) {
                return true;
            }
            var content = $('.ueRequired').children().attr('id');
            var ue = window.ueditor[content];
            ue.ready(function() {
                if (ue.hasContents()) {
                    ueStatus = true;
                } else {
                    ueRequired.children('.error').remove();
                    $('<label class="error clearfix">此项必填</label>').insertAfter($('#' + content));
                    ueStatus = false;
                }
            });
            return ueStatus;

        }
        tammy.utils.validateUeditor = validateUeditor;
    })();
    (function() {
        var validator = {};
        validator.init = function(options) {
            var m = this;
            m.settings = {
                id: 'formValidator',
                debug: false,
                errorPlacement: function(error, element) {
                    var el = $(element); //当前元素
                    var errMsg = $(error).text(); //错误信息
                    var isRight = errMsg ? false : true; //是否正确
                    if (!isRight) {
                        el.addClass('red-border');
                    } else {
                        el.removeClass('red-border');
                    }
                    if(el.get(0).type == 'radio'){
                        if (!isRight) {
                            error.addClass('error');
                            el.siblings('span.error').remove();
                            el.parent().append(error);
                        } else {
                            el.siblings('span.error').remove();
                        }
                    }
                },
                success: function(error, element) {
                    $(element).removeClass('red-border');
                },
                submitHandler: function() {}
            };
            $.extend(m.settings, options);
            var sets = m.settings;
            $.validator.setDefaults({
                onfocusout: function(element) {
                    // $(element).valid();
                },
                onkeyup: function() {},
                errorPlacement: sets.errorPlacement,
                success: sets.success,
                debug: sets.debug,
                showErrors: function(errors) {
                    var objIsNull = tammy.utils.objIsNull(errors);
                    if (objIsNull) {
                        this.settings.success($('<span></span>'), $(this.currentElements[0]));
                        return false;
                    }
                    for (var item in errors) {
                        this.settings.errorPlacement($('<span>' + errors[item] + '</span>'), document.getElementsByName(item));
                    }
                },
                submitHandler: function(form) {
                    form = $(form);
                    var imgStatus = tammy.utils.validateImg(form);
                    var ueStatus = tammy.utils.validateUeditor(form);
                    if (!imgStatus || !ueStatus) {
                        return false;
                    }
                    sets.submitHandler.call(null, form);
                    return false;
                }
            });
            $('#' + sets.id).validate();
        };

        tammy.utils.validator = validator;
    })();

    // 城市二级联动
    (function() {
        function mapSelect(name, callback) {
            name = name || {};
            var that = this;

            var provinceHtmls = '<option value="">请选择省</option>';
            var cityHtml = '<option value="">请选择市</option>';
            $.each(tammy.config.citylist, function(index, value) {
                provinceHtmls += '<option value="' + index + '">' + index + '</option>';
            });
            $('#' + name + '_province').html(provinceHtmls);
            $('#' + name + '_city').html(cityHtml);

            $('#' + name + '_province').off('change').on('change', function() {
                var me = $(this);
                var val = me.val();
                var subArr = tammy.config.citylist[val];
                var str = '';
                $.each(subArr, function(index, value) {
                    str += '<option value="' + value + '">' + value + '</option>';
                });
                $('#' + name + '_city').html(cityHtml + str).select2();;

            });

            if (typeof callback === 'function') {
                callback();
            }
        }
        tammy.utils.mapSelect = mapSelect;
    })();

    (function() {
        function SmsCountDown() {
            this.localNumber = 60;
        }
        SmsCountDown.prototype = {
            init: function(targetId, type) {
                var _this = this;
                _this.target = $('#' + targetId);
                _this.targetStr = targetId;
                _this.showText = '';
                _this.target.addClass('disabled').prop('disabled', true);
                _this.countDown();
            },
            countDown: function() {
                var _this = this;
                var timerId = window.setInterval(function() {
                    _this.localNumber--;
                    _this.refreshTime();
                    if (_this.localNumber < 1) {
                        clearInterval(timerId);
                        _this.target.text('获取验证码)').prop('disabled', false).removeClass('disabled');
                        return;
                    }
                }, 1000);
            },
            refreshTime: function() {
                var _this = this;
                if (_this.localNumber < 0) {
                    _this.localNumber = 0;
                }
                _this.target.text('重新发送(' + _this.localNumber + ')');
            }
        };
        tammy.utils.smsCountDown = SmsCountDown;
    })();

    //html转码与解码
    (function() {
        function HTMLDecode(text) {
            var temp = document.createElement('div');
            temp.innerHTML = text;
            var output = temp.innerText || temp.textContent;
            temp = null;
            return output;
        }
        tammy.utils.HTMLDecode = HTMLDecode;
    })();
    (function() {
        function HTMLEncode(html) {
            var temp = document.createElement('div');
            (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
            var output = temp.innerHTML;
            temp = null;
            return output;
        }
        tammy.utils.HTMLEncode = HTMLEncode;
    })();
    (function() {
        function getCheckboxValueById(id, type) {
            var list = $('#' + id).find(':checked');
            var ids = [];
            $.each(list, function(index, item) {
                if (type && type === 'value') {
                    ids.push($(item).val());
                } else {
                    ids.push($(item).data('id'));
                }
            });
            ids = ids.join(',');
            return ids;
        }
        tammy.utils.getCheckboxValue = getCheckboxValueById;
    })();
    (function() {
        var menuState = function(state) {
            switch (state) {
                case "new":
                    state = "查找中";
                    break;
                case "invalid":
                    state = "审核未通过";
                    break;
                case "undistributed":
                    state = "查找中";
                    break;
                case "unarrange":
                    state = "查找中";
                    break;
                case "tracing":
                    state = "查找中";
                    break;
                case "clueChecking":
                    state = "查找中";
                    break;
                case "unvaluation":
                    state = "查找中";
                    break;
                case "unconfirmed":
                    state = "待确认";
                    break;
                case "voucherChecking":
                    state = "凭证审核中";
                    break;
                case "voucherInvalid":
                    state = "凭证审核未通过";
                    break;
                case "hunterUnreceive":
                    state = "捕头未接受";
                    break;
                case "hunterReceive":
                    state = "捕头已接受";
                    break;
                case "platReceive":
                    state = "平台已收车";
                    break;
                case "upstreamReceive":
                    state = "债权方已收车";
                    break;
                case "all":
                    state = "无定位需找车并拖车";
                    break;
                case "trace":
                    state = "无定位只需找车";
                    break;
                case "recycle":
                    state = "有定位只需拖车";
                    break;
                case "unavailable":
                    state = "认证不通过";
                    break;
                case "available":
                    state = "已认证";
                    break;
                case "new":
                    state = "未提交认证";
                    break;
                case "wait":
                    state = "待认证";
                    break;
                case 0:
                    state = "关闭";
                    break;
                case 1:
                    state = "开启";
                    break;
                case "UPSTREAM_ENTERPRISE":
                    state = "企业";
                    break;
                case "UPSTREAM_PERSONAL":
                    state = "个人";
                    break;
                case "rejected":
                    state = "提现被拒";
                    break;
                case "completed":
                    state = "已打款";
                    break;
                case "withdrawing":
                    state = "申请中";
                    break;
                case "referrerloaner":
                    state = "推荐债权方任务奖励金";
                    break;
                case "loanerclean":
                    state = "推荐债权方清收奖励金";
                    break;
            }
            return state;
        }
        tammy.utils.menuState = menuState;
    })();
    module.exports = tammy;
});