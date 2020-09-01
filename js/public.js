let baseUrl = window.sessionStorage.getItem("baseUrl");
let EnumList = null;// 系统参数
let page = 1; //页码 用于数据查询
let limit = 10; //数据查询时 每次查询数量

// 判断登录状态
let loginStatus = window.sessionStorage.getItem("loginStatus");
if ( !loginStatus ) {
	window.location.href = baseUrl + "login.html";
} else {
	let cookie = "Authorization=" + loginStatus + ";" + ";path=/;";
	document.cookie = cookie;
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
	
	// 获取系统参数
	$.ajax({
		url: BASE.config.assetsUrl + '/admin/system/generParameterFile',
		headers: {
			'Authorization':loginStatus
		},
		success: function(data) {
			EnumList = JSON.parse(data.replace('var EnumList = ',''));
		}
	})
});

/**
 * mui初始化
 * @param {Object} selector 滑动区域定位
 * @param {Object} callback 回调函数
 */
function initMui(selector,callback) {
	if (selector && callback) {
		mui.init({
			pullRefresh : {
			    container:$(selector),//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
			    up : {
			      height:50,//可选.默认50.触发上拉加载拖动距离
			      auto:true,//可选,默认false.自动上拉加载一次
			      contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
			      contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
			      callback :callback //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
			    }
			  }
		});
	} else {
		mui.init();
	}
}

/**
 * 确认是否可继续下拉
 * @param {Object} page
 * @param {Object} amount
 * @param {Object} selector
 */
function judgmentResult(page,amount,selector) {
	if(page*10>amount){
		mui(selector).pullRefresh().endPullupToRefresh(true);
	}else{
		mui(selector).pullRefresh().endPullupToRefresh(false);
	}
}

/**
 * 获取下拉框的值
 * @param {Object} key
 */
function fillSelect(key) {
	let param = EnumList[key];
	let result = [];
	$.each(param,function(k,v) {
		result.push({value:v,text:k});
	});
	return result;
}

/**
 * ajax封装 添加认证请求头
 * @param {Object} url 请求路径
 * @param {Object} type 请求方式
 * @param {Object} callback 回调函数
 * @param {Object} params 附加参数
 */
function ajaxJson(url,type,callback,params){
	$.ajax({
		url: url,
		dataType:'json',
		type:type,
		data: params,
		headers: {
			'Authorization':loginStatus,
			'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
		},
		success:function(data){
			callback(data);
		},
		error: function(){
			
		}
	})
}

/**
 * 表单内容填充
 * @param {Object} data
 * @param {Object} selector
 */
function loadForm(data,selector) {
	for (let k in data) {
		if ($(selector + ' input[name='+k+']').hasClass('select-box')) {
			if (!!EnumList[k]) {
				$(selector + ' input[name='+k+']').val(EnumList[k][data.k]);
			} else {
				$(selector + ' input[name='+k+']').val(data[k]);
			}
		} else {
			$(selector + ' input[name='+k+']').val(data[k]);
		}
	}
}

/**
 * 填充选择器
 * @param {Object} obj 数组，选择值
 * @param {Object} selecttor 选择器，将要给哪个元素注入值
 */
function selective(obj,selector) {
	var picker = new mui.PopPicker();
	picker.setData(obj);
	picker.show(function (selectItems) {
		$(selecttor).val(selectItems[0].value);
	});
}

/**
 * 填充选择器 (时间框)
 * @param {Object} obj 数组，选择值
 * @param {Object} selecttor 选择器，将要给哪个元素注入值
 */
function selective(obj,selector,type) {
	var dtPicker = new mui.DtPicker({
		type: type
	});
	dtPicker.show(function (selectItems) {
		switch(type) {
			case 'datetime':
				
			break;
			case 'date':
				
			break;
			case 'time':
				
			break;
			case 'month':
				$(selector).val(selectItems.y.value + '-'
					+ selectItems.m.value + '-');
			break;
			case 'hour':
				$(selector).val(selectItems.y.value + '-'
					+ selectItems.m.value + '-' + selectItems.d.value);
			break;
		}
	});
}

/**
 * 用于生成存储id(本地缓存)
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
	return uuid.replace(/-/g,"");
}

/**
 * 表单数据转json格式
 * @param {Object} selecttor 选择器
 */
function serializeJson (selector){
	var serializeObj={};
	var array=$(selector).serializeArray();
	var str=$(selector).serialize();
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

/**
 * 表单必填验证
 * @param {Object} selector 选择器
 */
function requiredVerify(selector){
	let inputs = $(selector + ' input');
	for (let i in inputs) {
		let item = inputs[i];
		if ($(item).hasClass('mustInput')) {
			if (!$(item).val()) {
				return false;
			}
		}
	}
	return true;
}

/************************************资产管理查询页面***********************/

/**
 * 资产查询页面列表生成
 * @param {Object} data 数组类型
 * @param {Object} selector 选择器
 */
function createList(data,selector) {
	if (data) {
		let html = "";
		$.each(data,function(index,item) {
			html += `
				<div class="content-query-item" data-id="${item.id}">
					<div class="item-title">
						<div class="item-no">
							<span>${item.assetsNo}</span>
							<img src="../../../image/public/next.png">
						</div>
						<div class="item-name">
							${item.assetsName}
						</div>
					</div>
					<div class="severance"></div>
					<div class="item-status">
						<div>
							<div class="status-head">资产状态</div>
							<div class="status-main">${item.assetsStatus}</div>
						</div>
						<div class="status-division">
							<div class="status-head">自主分类</div>
							<div class="status-main">${item.ownCategory}</div>
						</div>
						<div>
							<div class="status-head">抵押状态</div>
							<div class="status-main">${item.mortgageStatus}</div>
						</div>
					</div>
				</div>
			`;
		});
		$(selector).append(html);
	} else {
		
	}
}

/**
 * 生成详情页面单列显示框
 * @param {Object} title 标题
 * @param {Object} value 显示值
 */
function createDetails_oneWay(title,value) {
	let html = `
		<div class="query-condition-item">
			<span>${title}</span>
			<input type="text" value="${value}" placeholder="请输入资产编号"/>
		</div>
	`;
	return html;
}

/**
 * 生成详情页面双列显示框
 * @param {Object} title1
 * @param {Object} title2
 * @param {Object} value2
 * @param {Object} value1
 */
function createDatails_twoLines(title1,title2,value1,value2) {
	let html = `
		<div class="query-two-lines">
			<span>${title1}</span>
			<input type="text" value="${value1}"/>
			<div class="two-lines-separate"></div>
			<span>${title2}</span>
			<input type="text" value="${value2}"/>
		</div>
	`;
	return html;
}