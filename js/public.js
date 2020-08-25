let baseUrl = window.sessionStorage.getItem("baseUrl");

function pui() {
	this.confirm = function (title,body,bt1,bt2,cllback) {
		let dialog = "<div class='confirm'>"+
						"<div class='confirm-content'>"+
							"<div class='content-title'>"+title+"</div>"+
							"<div class='content-main-body'>"+body+"</div>"+
						"</div>"+
						"<div class='confirm-buttom'>"+
							"<buttom>"+bt1+"</buttom>"+
							"<buttom>"+bt2+"</buttom>"+
						"</div>"+
					"</div>"
		$(".mui-content").append(dialog);
	}
}

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