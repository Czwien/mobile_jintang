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