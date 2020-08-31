let baseUrl = window.sessionStorage.getItem("baseUrl");
let portalUrl = window.sessionStorage.getItem("portalUrl");

// 判断登录状态
let loginStatus = window.sessionStorage.getItem("loginStatus");
if ( !loginStatus ) {
	window.location.href = baseUrl + "login.html";
} else {
	let cookie = loginStatus + ";" + ";path=/;";
	document.cookie = cookie;
}

mui.init()

$(function(){
	
	// 选择框样式调整
	if ($(".select-box").length != 0) {
		// 处理选择框
		$(".select-box").attr("readonly",true);
		// 添加选择图标
		$(".select-box").parent().append("<span class='select-img'><img src='../../image/public/next.png'></span>")
		// 给选择框添加事件
		$(".select-box").parent().on("click",function(){
			
		});
	}
	
	// 查询框清空
	if ($(".cancal-img").length != 0) {
		$(".cancal-img").off().on("click",function() {
			$(this).prev().val("");
		});
	}
});

/**
 * @param {Object} obj 数组，选择值
 * @param {Object} selecttor 选择器，将要给哪个元素注入值
 */
function fullSelect(obj,selecttor) {
	var picker = new mui.PopPicker();
	picker.setData(obj);
	picker.show(function (selectItems) {
		$(selecttor).val(selectItems[0].value);
	});
}

/**
 * uuid生成
 */
function getUuid() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;
}

//将表单转换为JSON
function serializeJson (selecttor){
	var serializeObj={};
	var array=$(selecttor).serializeArray();
	var str=$(selecttor).serialize();
	$(array).each(function(){
		if(serializeObj[this.name]){
			if($.isArray(serializeObj[this.name])){
				serializeObj[this.name].push(this.value);
			}else{
				serializeObj[this.name]=[serializeObj[this.name],this.value];
			}
		}else{
			serializeObj[this.name]=this.value; 
		}
	});
	return serializeObj;
};