/**
 * 谷歌浏览器api
 */
//桌面通知
var btn_notice = document.getElementById("notice");
btn_notice.onclick = function(){
	var title = document.getElementById("title").value;
	var content = document.getElementById("content").value;
	var icon = "images/brand-business-bg1.jpg";
	showChromeNotice(title, content, icon);
}

/**
 * 显示桌面通知
 * @param {Object} title
 * @param {Object} content
 * @param {Object} icon
 */
function showChromeNotice(title, content, icon){
	var options = {
		body: content,
		icon: icon || "image_url"
	}
	var Notification = window.Notification || window.mozNotification || window.webkitNotification;
	Notification.requestPermission(function(status){
		if(Notification.permission != status){
			Notification.permission = status;
		}
		if(status == "granted"){
			var instance = new Notification(title, options);
			instance.onshow = function(){
				setTimeout(function(){
					instance.close();
				}, 5000)
			}
			instance.onclick = function(){
				location.href = "http://www.baidu.com";
			}
		}
	})
}

//全屏
var fullContent = document.getElementById("fullScreenContent");
var btn_fullscreen = document.getElementById("fullscreen");
btn_fullscreen.onclick = function(){
	fullContent.webkitRequestFullScreen();
}
