/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function WelcomeDetail() {
        this.init = function() {
            this.registerEvent();
            this.scrollEvent();
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

            $('.newTask').click(function() {
                jh.utils.load("/src/modules/task/task-list");
            });

            $('.findCar').click(function() {
                jh.utils.load("/src/modules/find/find-list");
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