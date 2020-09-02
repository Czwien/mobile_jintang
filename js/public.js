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
 * 初始化滑动区域
 */
function initScroll(){
	mui('.mui-scroll-wrapper').scroll({
		 scrollY: true, //是否竖向滚动
		 startX: 0, //初始化时滚动至x
		 startY: 0, //初始化时滚动至y
		 indicators: true, //是否显示滚动条
		 deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
		 bounce: true //是否启用回弹
	});
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
 * @param {Object} selecttor 选择器，将要给哪个元素注入值
 * @param {Object} type 类型
 */
function fillTime(selector,type) {
	var dtPicker = new mui.DtPicker({
		type: type
	});
	dtPicker.show(function (selectItems) {
		switch(type) {
			case 'datetime':
				$(selector).val(selectItems.y.value + '-'
					+ selectItems.m.value + '-' + selectItems.d.value + '-'
					+ selectItems.h.value + '-' + selectItems.i.value);
			break;
			case 'date':
				$(selector).val(selectItems.y.value + '-'
					+ selectItems.m.value + '-' + selectItems.d.value);
			break;
			case 'time':
				$(selector).val(selectItems.h.value + '-' + selectItems.i.value);
			break;
			case 'month':
				$(selector).val(selectItems.y.value + '-'
					+ selectItems.m.value + '-');
			break;
			case 'hour':
				$(selector).val(selectItems.y.value + '-'
					+ selectItems.m.value + '-' + selectItems.d.value
					+ selectItems.h.value);
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
	if (!value) {
		value = ' ';
	}
	let html = `
		<div class="query-condition-item">
			<span>${title}</span>
			<input readonly type="text" value="${value}" placeholder="请输入资产编号"/>
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
	if (!value1) {
		value1 = ' ';
	}
	if (!value2) {
		value2 = ' ';
	}
	let html = `
		<div class="query-two-lines">
			<span>${title1}</span>
			<input readonly type="text" value="${value1}"/>
			<div class="two-lines-separate"></div>
			<span>${title2}</span>
			<input readonly type="text" value="${value2}"/>
		</div>
	`;
	return html;
}

/**
 * 详情页面图片生成
 * @param {Object} data 数组，图片信息
 */
function createDetails_picture(data){
	let html = $('<div id="picture0" class="picture-cell"></div>');
	let count = 0,idCount = 0;
	for (let i in data) {
		let fileName = data[i].fileName.toUpperCase();
		if (count != 0 && count % 3 ==0) {
			$(".show-picture").append(html);
			idCount++;
			html = $('<div id="picture"'+idCount+' class="picture-cell"></div>');
		}
		
		if (fileName.indexOf('.PNG') != -1 || fileName.indexOf('.JPG') != -1
			|| fileName.indexOf('.JPEG') != -1) {	
			var xhr = new XMLHttpRequest();
			xhr.open("get", BASE.config.assetsUrl + '/admin/upload/download/?id='+data[i].fileId, true);
			xhr.responseType = "blob";
			xhr.setRequestHeader('Authorization',loginStatus);
			xhr.onload = function() {
				if (this.status == 200) {
					var blob = this.response;
					var img = document.createElement("img");
					img.onload = function(e) {
						window.URL.revokeObjectURL(img.src);
					};
					img.src = window.URL.createObjectURL(blob);
					html.append(img);
				}
			};
			xhr.send();	
			count++;
		}
	}
	if (count == 0) {
		html.append('<img src="../../../image/assetsManange/noPicture.png">')
	}
	$(".show-picture").append(html);
}

/**
 * 详情页面生成附件
 * @param {Object} data
 */
function createDetails_files(data) {
	let count = true;
	for (let i in data) {
		let fileName = data[i].fileName.toUpperCase();
		if (fileName.indexOf('.PNG') == -1 && fileName.indexOf('.JPG') == -1
			&& fileName.indexOf('.JPEG') == -1) {
			$(".show-files").append("<span data-id='"+data[i].fileId+"'>附件名: "+data[i].fileName+"</span>")
			count = false;
		}
	}
	if (count) {
		$(".show-files").append("<span>暂无相关附件</span>")
	}
}

/**
 * 详情页面权证信息生成
 * @param {Object} certificate
 */
function createDetails_certificate(certificate){
	for (let i in certificate) {
		let data = certificate[i];
		let html = createDetails_oneWay('产权证号',data.cerNo)
			+ createDetails_oneWay('详细地址',data.located)
			+ createDatails_twoLines('原权利人','权利人',data.oldObligee,data.obligee)
			+ createDatails_twoLines('地号','用途',data.qiudiNo,data.groundType)
			+ createDatails_twoLines('结构','共用情况',data.structure,data.commonSituation)
			+ createDatails_twoLines('使用权类型','共用情况',data.useType,'');
		if (i != 0) {
			$(".show-certificate").append("<div style='height:5px;background-color:none;'></div>");
		}	
		$(".show-certificate").append(html);
	}
}

/**
 * 获取访问路径中的参数信息
 */
function getParams(){
	let url = location.href;
	return url.substring(url.indexOf('?')+1);
}