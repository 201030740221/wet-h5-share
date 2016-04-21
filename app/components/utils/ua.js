var ua = [
["LBBROWSER", "猎豹浏览器"],
["Maxthon", "遨游浏览器"],
["Firefox", "火狐浏览器"],
["SE", "搜狗浏览器"],
["Opera", "Opera浏览器"],
["BIDUBrowser", "百度浏览器"],
["MSIE", "IE浏览器"],
["Chrome", "chrome浏览器"],
["Safari", "Safari浏览器"],
["Weibo","新浪微博"]
];

module.exports = {
	suitUa: function(){
		var _ua = navigator.userAgent;
		var ual = ua.length;
		for(var i = 0 ; i < ual; i++){
			if(new RegExp(ua[i][0]).test(_ua)){
				return ua[i];
			}
		}
		return ["unkown", "未知浏览器"];
	}
};
