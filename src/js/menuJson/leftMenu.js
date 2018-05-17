/**
 * 
 * @authors jiaguishan (jiaguishan@gmail.com)
 * @date    2017-04-18 13:53:39
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    var FINAL_MENU_DATA_JSON = {
        menus: [{
            name: '任务管理',
            icon: 'icon-region',
            module: '/src/modules/task',
            url: '/task-list',
            childrens: []
        },{
            name: '锁定车辆',
            icon: 'icon-supplier',
            module: '/src/modules/find',
            url: '/find-list',
            childrens: []
        },{
            name: '用户中心',
            icon: 'icon-operate',
            module: '/src/modules/person',
            url: '/person-file',
            childrens: []
        },{
            name: '常用查询',
            icon: 'icon-operate',
            module: '/src/modules/commonquery',
            url: '/commonquery',
            childrens: []
        }]
    };
    module.exports = FINAL_MENU_DATA_JSON;
});