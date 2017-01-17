var youboyUI = {};
youboyUI.citySwitch = function(){
	$(".city").click(function (e){
		e.stopPropagation();
		$(".city_pos").fadeIn();
	})
	$(".city_pos").click(function (e){
		e.stopPropagation();
		$(".city_pos").show();
	});
	$(".city_list span").click(function (e){
		e.stopPropagation();
		$(".pit_city").html($(this).html());
		$(".city_pos").hide();
	})
	$(document).click(function (){
		$(".city_pos").hide();
	})
}
youboyUI.fastOptions = function(){
	$(".select_option_r a").click(function(){
		$(this).parent().siblings().find(".cur").removeClass("cur");
		$(this).addClass("cur");
	});
}
youboyUI.fastLoan = function(){
	$(".lianxiwo li").click(function (e){
		var ind = $(this).index();
		if(ind!=5){
			if(!$(e.target).is("input[type=button]")){
				$(this).find("span").hide();
				$(this).find("input[type=text]").focus();
			}
		}
	});
	$(".lianxiwo input[type=text]").click(function (){
		if($(this).next("span").is(":visible")){
			$(this).next("span").hide();
		};
	}).focus(function(){
		if($(this).next("span").is(":visible")){
			$(this).next("span").hide();
		};
	});
	$(".lianxiwo input[type=text]").blur(function (){
		if($(this).val() == ""){
			$(this).next("span").show();
		};
	});
}
youboyUI.fastSort = function(){
	$(".loan-product-filter .fr a").click(function(){
		if(!$(this).hasClass("cur")){
			$(this).siblings().removeClass("cur")
			$(this).addClass("cur");
		}else{
			if($(this).find("em").length > 0){
				if($(this).find("em").css("background-position") == "0px 0px"){
					$(this).find("em").css("background-position", "-7px 0px");
				}else{
					$(this).find("em").css("background-position", "0px 0px");
				}
			}
		}
	});
}
youboyUI.render = function(){
	youboyUI.fastSort();
	youboyUI.citySwitch();
	youboyUI.fastOptions();
	youboyUI.fastLoan();
}
function toTop(){
	$(window).scroll(function(){
		if($(window).scrollTop() > 600) {
			if($(".upTop").length == 0){
				$("#footer").before('<div class="upTop" style="display: none;"><a href="javascript:;" title="返回顶部"></a></div>');
			}
			$(".upTop").stop().fadeIn();
		}else{
			$(".upTop").stop().fadeOut();
		}
	});
	$("body").delegate(".upTop", "click", function(){
		$("body,html").animate({scrollTop:"0px"},800);
	});
}
// 首页大图切换
function imgRun(){
	var ind5 = 0;
	var imgRunTime = null;
	function bannerAutoRun(){
		imgRunTime = setTimeout(function(){
			ind5++;
			if(ind5>=$(".banners div").size()){
				ind5 = 0;
			}
			$(".banners div").eq(ind5).animate({
				opacity: 1,
				"z-index": 2
			},1200).siblings().animate({
				opacity: 0,
				"z-index":1
			},1200);
			bannerAutoRun();
			$(".pagination span").removeClass('active');
			$(".pagination span").eq(ind5).addClass('active');
		},4000);
	}
	bannerAutoRun();
	$(".pagination span").click(function(){
		clearTimeout(imgRunTime);
		ind5 = $(".pagination span").index($(this));
		$(".banners div").eq(ind5).animate({
				opacity: 1,
				"z-index": 2
			},1200).siblings().animate({
				opacity: 0,
				"z-index":1
			},1200);

			$(".pagination span").removeClass('active');
			$(".pagination span").eq(ind5).addClass('active');
		bannerAutoRun();
	})
}
//快速搜索下拉效果
function fastSearch(){
	var tf = true;
	$(".selectitem dt").click(function (){
		var ind = $(".selectitem dt").index($(this));
		if(tf==true){
			$(".selectOption .selectitem").eq(ind).height($(".selectList").eq(ind).height());
			$(".SelectTag").eq(ind).css("background-position","10px -524px");
			tf=false;
		}else{
			$(".selectOption li:eq("+ind+") .selectitem").height($(".selectitem dt").height());
			$(".SelectTag").css("background-position","10px -92px");
			tf=true;
		}
	})
	$(".selectitem").mouseleave(function (){
		$(".selectitem").height($(".selectitem dt").height());
		$(".SelectTag").css("background-position","10px -92px");
		tf=true;
	})
	$(".selectitem dd").click(function(e){
		e.stopPropagation();
		var $thisparent = $(this).parent();
		$(".selectitem").height($(".selectitem dt").height());
		$(".SelectTag").css("background-position","10px -92px");
		$thisparent.children('dt').children('input').val($(this).html());
		tf=true;
		$(this).addClass("selmoren").siblings().removeClass("selmoren");
	})
	$(".selectList2 dd").click(function (e){
		e.stopPropagation();
		if($(this).index()==($(".selectList2 dd").size())){
			$(".selectList2 input").val("").focus();
		}else{
			$(".selectList2 input").val($(this).html()).blur();
		}
	})
	$(".selectitem dd").hover(function (){
		var ind = $(this).index();
		$(".selectitem dd.selmoren").css("background","none");
		$(".selectitem dd").removeClass("selActive");
		$(this).addClass("selActive");
	},function (){
		$(".selectitem dd").removeClass("selActive");
		$(".selectitem dd.selmoren").css("background","#fcecec");
	})
}

function focusFn(obj){
		$(obj).click(function (){
			if($(this).prevAll("em").is(":visible")){
				$(this).prevAll("em").hide();
			};
		}).focus(function(){
			if($(this).prevAll("em").is(":visible")){
				$(this).prevAll("em").hide();
			};
		});
		$(obj).blur(function (){
			if($(this).val() == ""){
				$(this).prevAll("em").show();
			};
			if(!$(".newreg_txt").eq(1).val()){
				$(".newreg_txt").eq(1).prevAll("em").show();
			}
		});
	}
//注册页面输入框
function textOnFocus(){

$(".js_phone").focus(function(){
    $(this).siblings("i").css("background-position", "-72px -146px").parent().css("background-position", "0px -212px");
}).blur(function(){
        $(this).siblings("i").css("background-position", "-2px -146px").parent().css("background-position", "0px 0px");
});
$(".js_email").focus(function(){
    $(this).siblings("i").css("background-position", "-89px -146px").parent().css("background-position", "0px -256px");
}).blur(function(){
        $(this).siblings("i").css("background-position", "-19px -146px").parent().css("background-position", "0px -97px");
});
$(".js_lock").focus(function(){
    $(this).siblings("i").css("background-position", "-106px -144px").parent().css("background-position", "0px -212px");
}).blur(function(){
        $(this).siblings("i").css("background-position", "-36px -144px").parent().css("background-position", "0px 0px");
});
$(".js_lock2").focus(function(){
    $(this).siblings("i").css("background-position", "-106px -144px").parent().css("background-position", "0px -212px");
}).blur(function(){
        $(this).siblings("i").css("background-position", "-36px -144px").parent().css("background-position", "0px 0px");
});
$(".js_key").focus(function(){
    $(this).siblings("i").css("background-position", "-166px -145px").parent().css("background-position", "0px -256px");
}).blur(function(){
        $(this).siblings("i").css("background-position", "-135px -145px").parent().css("background-position", "0px 0px");
});
$(".newreg_input").click(function (e){
var ind = $(this).index();
if(ind!=4){
	if(!$(e.target).is("input[type=button]")){
		$(this).find("em").hide();
		$(this).find("input[type=text]").focus();
		$(this).find("input[type=password]").focus();
		}
	}
});
focusFn(".newreg_txt");
$(".gerLog2 li").click(function (){
var ind = $(this).index();
if(ind!=3){
	if(!$(this).is("input[type=button]")){
		$(this).find("em").hide();
		$(this).find("input").focus();
	}
	}
});

$(".gerLog2 .input_user").focus(function(){
	if($(this).prev("em").is(":visible")){
			$(this).prev("em").hide();
	};
    $(this).css("border", "2px solid #d44").siblings("i").css("background-position", "-212px -840px");
	// focusFn(this);
}).blur(function(){
	if($(this).val() == ""){
			$(this).prev("em").show();
	};
    $(this).css("border", "2px solid #fff").siblings("i").css("background-position", "-212px -598px");
	if(!$(".input_pw").val()){
		$(".input_pw").prev("em").show();
	}
});
 $(".gerLog2 .input_pw").focus(function(){
	if($(this).prev("em").is(":visible")){
		$(this).prev("em").hide();
	};
    $(this).css("border", "2px solid #d44").siblings("i").css("background-position", "-150px -840px");
	// focusFn(this);
}).blur(function(){
	if($(this).val() == ""){
			$(this).prev("em").show();
	};
        $(this).css("border", "2px solid #fff").siblings("i").css("background-position", "-150px -598px");
});
$(".gerLog2 .input_yzm").focus(function(){
	if($(this).prev("em").is(":visible")){
			$(this).prev("em").hide();
	};
    $(this).css("border", "2px solid #d44").siblings("i").css("background-position", "-212px -928px");
	// focusFn(this);
}).blur(function(){
	if($(this).val() == ""){
			$(this).prev("em").show();
	};
        $(this).css("border", "2px solid #fff").siblings("i").css("background-position", "-150px -928px");
});
}

// 机构入驻城市选择
function cityChoose(){
	$(".cityChoose").click(function(){
		$(".cityChoose ul").removeClass('cur');
		$(this).find("ul").addClass('cur');
	})
	$(".cityChoose li").click(function(e){
		e.stopPropagation();
		$(this).parents(".cityChoose").find("span").html($(this).html());
		$(this).parent().removeClass('cur');
	})
	$(".cityChoose").mouseleave(function(){
			$(".cityChoose ul").removeClass('cur');
	})
}
function regAgre(){
	$(".reg_agrelink").click(function (){
		$(".mask").show();
		$(".reg_agre").show();
	});
	$(".reg_agreclose").click(function (){
		$(".mask").hide();
		$(".reg_agre").hide();
	});
	$(".reg_agrebtn input").click(function (){
		$(".mask").hide();
		$(".reg_agre").hide();
	});
}
var loan = {};
loan.fastSearch = function(){
	$(".loan-search-show-a").click(function(e){
		//var showbol = $(this).siblings(".loan-search-hide-div");
		//if(showbol.show()){
		$(this).siblings(".loan-search-hide-div").show();
		//}else{
		//	$(this).siblings(".loan-search-hide-div").hide();
		//}
		e.stopPropagation();
	});
	$(".loan-search-hide-div a").click(function(){
		$(this).siblings(".selected").removeClass("selected");
		$(this).addClass("selected");
		$(this).parent().prev().find(".show-input").html($(this).attr("data-value"));
	});
	$(document).click(function(){
		$(".loan-search-hide-div").hide();
	});
}
loan.showTip = function(){
	$(".loan-search-input input").focus(function(){
		$(".loan-input-msg").show();
	}).blur(function(){
		$(".loan-input-msg").hide();
	});
}
loan.searchFix = function(){
	if($(".loan-search").get().length > 0){
		var theFixTop = $(".loan-search").offset().top;
	}
	$(window).scroll(function(){
		if ($(window).scrollTop() > theFixTop) {
			$(".loan-search").css({"position": "fixed", "top": "0", "width": "1068px", "z-index": "10"})
		}else{
			$(".loan-search").css({"position": "static"})
		}
	});
}
loan.popBox = function(){
	$(".toLoginLink a").click(function(){
		$(".tck_dk_data").hide();
		$(".tck_dk_login").show().css("margin-top", -($(".tck_dk_login").height() / 2));
	});
	$(".bot_login_btn").click(function(){
		$(".tck_dk_data, .mask").hide();
	});

	$(".sq_tck .bot .cancel_btn").click(function(){
		$(".sq_tck, .mask").hide();
	});
	$(".tck_dk_data h2 a").click(function(){
		$(".tck_dk_data, .mask").hide();
	});
	$(".loan-detail-param p .sq_btn, .loan-detail-bot a").click(function(){
		var theTop = $(window).scrollTop() + ($(window).height() - $(".sq_tck").height())/2 -17.5;
		var theLeft = $(window).scrollLeft() + ($(window).width() - $(".sq_tck").width())/2 - 7.5;
		$(".sq_tck").css({"top": theTop, "left": theLeft});
	});
}
loan.render = function(){
	loan.fastSearch();
	loan.searchFix();
	loan.showTip();
	loan.popBox();
}

var user = {};
user.uploadmore = function(){
	$(".more").click(function(){
		var ind = $(".more").index($(this));
		if($(".indentList").eq(ind).is(":visible")){
			$(".indentList").eq(ind).hide();
			$(this).html("更多");
			$(this).removeClass('packup');
		}else{
			$(".indentList").eq(ind).show();
			$(this).html("收起");
			$(this).addClass('packup');
		}
	})
}
user.render = function(){
	user.uploadmore();
}

// function showtips(clickObj,showObj){
// 	$(clickObj).click(function(){
// 		$(".mask").show();
// 		$(showObj).show();
// 	})
// }
function hideTip(clickObj,hideObj){
	$(clickObj).click(function(){
		$(".mask").hide();
		$(hideObj).hide();
	})
}
function sub(){
	showtips(".czx_bjbtn",".czx_bjalBg")
}
jQuery.fn.extend({
	//contTxt : 弹窗要显示的内容;
  showTips: function(contTxt){
  	$(this).click(function(){
  		var tips = $('<div class="czx_shanchuqueren"><div class="czx_zhifuheader"><a class="closeBtn" href="javascript:;"></a></div><div class="czx_zhifuCont"><em class="shanchu1"></em><span>'+contTxt+'</span></div><div class="czx_zhifufooter"><div><a id="confirm" href="javascript:;">确定</a><a class="cancel" href="javascript:;">取消</a></div></div></div>');
		$("#showTips").append(tips);
		$("#showTips").show();
		$(".cancel").hideTips();
		$(".closeBtn").hideTips();
  	})
  },
  hideTips: function(){
  	$(this).click(function(){
  		$("#showTips").hide();
  	})
  },
  placeholder: function() {
			if ('placeholder' in document.createElement('input')) { //判断是否支持placeHolder
				return this.each(function(){
						var _this=$(this),placeholderTxt = _this.attr('placeholder'),blurPlaceholderTxt=placeholderTxt,focusPlaceholderTxt='';
						_this.focus(function(){
								return _this.attr('placeholder',focusPlaceholderTxt);
							}).blur(function(){
								return _this.attr('placeholder',blurPlaceholderTxt);
							});
					})
			} else { //不支持placeHolder
				return this.each(function() {
					var _this = $(this),
					this_placeholder = _this.attr('placeholder');
					//if(_this.val()===''){ //input类型为password
							var pwdField    = $(this);
							var pwdVal      = pwdField.attr('placeholder');
							pwdField.after('<span class="input_txt Placeholder" style="white-space:nowrap;display:inline-block;">' + pwdVal + '</span>');
							var pwdPlaceholder =pwdField.next('.Placeholder');  //placeholder
							pwdPlaceholder.css({position:'absolute',zIndex:'1',left:'0'});
							pwdField.css({position:'absolute',zIndex:'2',left:'0'});
							if(pwdField.val() === '') {
								pwdField.addClass('cur');
							}
							pwdField.focus(function(){
								pwdField.removeClass('cur');
							}).blur(function(){
								if(pwdField.val() === '') {
									pwdField.addClass('cur');
								}
							});
					//}


				})

			}
		},
		//end placeholder
		focusFunc:function(obj,className){
				 return this.each(function(){
				 var $this=$(this);
				 $this.focus(function(){
					 	$this.parents(obj).addClass(className);
					 }).blur(function(){
						$this.parents(obj).removeClass(className);
					 })
				})
			},
		//checkBox style
		checkBox:function(elem,className){
				var onCheck=$(this).siblings(elem);
				var offCheck=$(this).siblings(elem);
				if($(this).is(":checked")){

					}
				$(this).change(function(){
					if($(this).is(":checked")){
						onCheck.addClass(className);
					}else{
						offCheck.removeClass(className);
						}
				});
			}



});
function decimal(num, dig){
	//num 数字 3890.1933  dig保留的位数 2
	return Math.round(num * Math.pow(10, dig)) / Math.pow(10, dig);
};
function txtHide(){
	setTimeout(function(){
		if($("#password").val() != "" && $("#username").val() != ""){
			$("#password").prev("em").hide();
		};
		txtHide();
	},100);
};
function setHeight(obj){
	var arr = [];
	$(obj).each(function(){
		arr.push($(this).innerHeight());
	})
	var arr2 = arr.sort()
	$(obj).height(arr2[arr2.length-1]);
}
function allHideTip(){
	hideTip(".cancel",".czx_shanchuqueren");// 取消按钮
	hideTip(".cancel",".pwd_success");// 取消按钮
	hideTip(".cancel",".bjjsBg");// 取消按钮
	hideTip(".cancel",".caseBg");// 取消按钮
	hideTip(".cancel",".remarkBg");// 订单业务取消按钮
	hideTip(".close",".bigImg");// 右上角关闭按钮
	hideTip(".closeBtn",".caseBg");// 右上角关闭按钮
	hideTip(".closeBtn",".czx_shanchuqueren");// 右上角关闭按钮
	hideTip(".closeBtn",".bjjsBg");// 右上角关闭按钮
	hideTip(".closeBtn",".remarkBg");// 订单业务右上角关闭按钮
	hideTip(".closeBtn",".popup");

  	hideTip(".verify_msg a",".verify_msg");
}
function setHeight(obj){
	var arr = [];
	$(obj).each(function(){
		arr.push($(this).height());
	})
	var arr2 = arr.sort()
	$(obj).height(arr2[arr2.length-1]);
}
$(function(){
	imgRun();// 首页大图切换
	//numRun();//首页1F滚动数字
	fastSearch();// 快速搜索下拉效果
	textOnFocus();// 注册页面输入框
	toTop();//返回顶部
	cityChoose();// 机构入驻
	regAgre();// 注册协议
	allHideTip();//

	youboyUI.render();
	loan.render();
	user.render();
	sy.init();
	setHeight(".comLoanCondition dl");
	$("#username").focus(function(){
		txtHide();
	})
	txtHide();
	$(".indentList input[data-canwrite='true']").click(function(e){
		e.stopPropagation();
		$(".indentList input").css({
			"border":"0"
		})
		$(this).css({
			"border":"1px solid #000"
		})
		$(".indentList input").attr({
			readonly:true
		})
		$(this).attr({
			readonly:false
		})
	})
	$(".selectitem dd:last-child").css("border-bottom","1px solid #908b8a");
	(function(){
		var widths = ["width60", "width90", "width90", "width100", "width90", "width90", "width90", "width90", "width90", "width90", "width90", "width90", "width100", "width90", "width90", "width90"];
		$("#creditcardForm .select_option_r").each(function(){
			var len = $(this).find("span").length;
			for (var i = 0; i < len; i++) {
				$($(this).find("span").get(i)).addClass(widths[i]);
			}
		});
		$($("#creditcardForm .select_option_r").find("span").get(10)).css("padding-left", "64px");
	})();
	(function(){
		var widths = ["width60", "width90", "width100", "width110", "width110", "width100"];
		$("#conductForm .select_option_r").each(function(){
			var len = $(this).find("span").length;
			for (var i = 0; i < len; i++) {
				$($(this).find("span").get(i)).addClass(widths[i]);
			}
		});
	})();
	(function(){
		var widths = ["width60", "width100", "width90", "width90", "width90", "width110"];
		$("#fundationForm .select_option_r").each(function(i){
			if (i > 0) {
				var len = $(this).find("span").length;
				for (var i = 0; i < len; i++) {
					$($(this).find("span").get(i)).addClass(widths[i]);
				}
			}

		});
	})();


	setHeight(".comLoanCondition dl");
})



//
var numberLimit={};

	numberLimit.keyUp=function(obj){ //判断键盘输入的是否为数字
			obj.value=obj.value.replace(/[^\d]/g,'');
		}
	numberLimit.beforePaste=function(){ //判断复制的是否为数字
			clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))
		}
// //JS样式
// $(function (){
// 	$(".xinyongkaR li:last-child").css("border-bottom",0);
// 	$(".licaiHelp li:last-child").css("border-bottom",0);
// 	$(".jijinjingsuan li:last-child").css("border-bottom",0);
// })

//index interface effect(新版首页)
var sy = sy || {};
//导航线
sy.navLine = function(){
	if($(".new_nav .cur").length){
			$(".new_nav .line, .new_nav .ani_bg").css({
			"left": $(".new_nav .cur").position().left + 5,
			"width": $(".new_nav .cur").width() + 60
		});
	}
	$(".new_nav a").hover(function(){
		$(".new_nav .line, .new_nav .ani_bg").css({
			"left": $(this).position().left + 5,
			"width": $(this).width() + 60
		});
	}, function(){
		if($(".new_nav .cur").length){
			$(".new_nav .line, .new_nav .ani_bg").css({
				"left": $(".new_nav .cur").position().left + 5,
				"width": $(".new_nav .cur").width() + 60
			});
		}else{
			$(".new_nav .line, .new_nav .ani_bg").css({
				"left": 0,
				"width": 0
			});
		}

	});
};
//显示申请贷款弹出框
sy.showSapply = function(){
	$(".mask, .s_apply_box").show();
};
//关闭申请贷款弹出框
sy.hideSapply = function(){
	$(".mask, .s_apply_box, .s_apply_ok").hide();
};
//申请信息提交成功
sy.apply_ok = function(){
	$(".s_apply_box").hide();
	$(".s_apply_ok").show();
};
//申请贷款晃动提示
sy.applyShake = function(){
	$(".s_apply input[type=text]").blur(function(){
		if(!$(this).val()){
			$(".tip").removeClass("on");
			$(this).siblings(".tip").fadeIn().addClass("on");
		}else{
			$(this).siblings(".tip").fadeOut();
		}
	});
};
//咨询顾问滚动
sy.handlerScroll = function () {
	var curI = 0,
		n = $(".r_adviser li").length;
	$(".r_adviser .prev").addClass("no");
	if(n < 4){
		$(".r_adviser .prev, .r_adviser .next").addClass("no");
	}
	if(n >= 4){
		var node = $(".r_adviser_f ul").html();
		$(".r_adviser_f ul").append(node);
		n *= 2;

		function doPrev(){
			if(curI > 0){
				clearInterval(auto);
				auto = setInterval(play, 2000);
				curI -= 2;
				play();
			}
		}
		function doNext(){
			clearInterval(auto);
			auto = setInterval(play, 2000);
			play();
		}
		function play(){
			$(".r_adviser .prev").off("click", doPrev);
			$(".r_adviser .next").off("click", doNext);

			if(parseInt($(".r_adviser_f ul").css("top")) < -100*(n/2) ) {
				$(".r_adviser li").each(function(i){
					if(i < n/2){
						$(this).appendTo(".r_adviser ul");
					}
				});
				$(".r_adviser ul").css("top", 0);
				curI = 0;
			}

			curI += 1;
			$(".r_adviser ul").stop().animate({
				top: -108 * curI
			}, 800, function(){
				$(".r_adviser .prev").on("click", doPrev);
				$(".r_adviser .next").on("click", doNext);
			});

			$(".r_adviser .prev").removeClass("no");
			if(curI < 1) $(".r_adviser .prev").addClass("no");
		}

		$(".r_adviser .prev").on("click", doPrev);
		$(".r_adviser .next").on("click", doNext);

		var auto = setInterval(play, 3000);
	}

};

//成功案例滚动
sy.casesScroll = function () {
	var curI = 0,
		n = $(".cases_per").length;
	$(".cases_prev").addClass("no");
	if(n < 4){
		$(".cases_prev, .cases_next").addClass("no");
	}
	if(n >= 4){
		var node = $(".cases_wrap_div").html();
		n *= 2;

		$(".cases_wrap_div").width(n * 260);
		$(".cases_wrap_div").append(node);

		function doPrev(){
			if(curI > 0){
				clearInterval(auto);
				auto = setInterval(play, 2000);
				curI -= 2;
				play();
			}
		}
		function doNext(){
			clearInterval(auto);
			auto = setInterval(play, 2000);
			play();
		}
		function play(){
			$(".cases_prev").off("click", doPrev);
			$(".cases_next").off("click", doNext);

			if(parseInt($(".cases_wrap_div").css("left")) < -250*(n/2) ) {
				$(".cases_per").each(function(i){
					if(i < n/2){
						$(this).appendTo(".cases_wrap_div");
					}
				});
				$(".cases_wrap_div").css("left", 0);
				curI = 0;
			}

			curI += 1;
			$(".cases_wrap_div").stop().animate({
				left: -260 * curI
			}, 800, function(){
				$(".cases_prev").on("click", doPrev);
				$(".cases_next").on("click", doNext);
			});

			$(".cases_prev").removeClass("no");
			if(curI < 1) $(".cases_prev").addClass("no");
		}

		$(".cases_prev").on("click", doPrev);
		$(".cases_next").on("click", doNext);

		var auto = setInterval(play, 3000);
	}

};
//右侧固定
sy.fixRight = function(){
	$(".fixed_rb .li_wx, .fixed_rb .li_up, .fixed_rb .li_zx, .fixed_rb .li_cs").hover(function () {
		$(this).find("a").addClass("on");
		$(this).find(".fade_div").show().stop().animate({
			right: "44px",
			opacity: 1
		}, 200);
	}, function () {
		$(this).find("a").removeClass("on");
		$(this).find(".fade_div").stop().animate({
			right: "30px",
			opacity: 0
		}, 200, function () {
			$(this).hide();
		});
	});
	$(".fixed_rb .li_up").click(function () {
		$("html, body").animate({
			scrollTop: 0
		});
	});
};

sy.txtScr = function(){
	setInterval(function(){
		if($(".outstand .txt p").css("margin-top") == "0px"){
			$(".outstand .txt p").animate({ marginTop: "-20px" });
		}else{ $(".outstand .txt p").animate({ marginTop: 0
			});
		}
	}, 3000);
};
sy.apply_ok_txt = function(){
	$(".s_apply_box .nav_c a").click(function(){
		$(this).addClass("cur").siblings().removeClass("cur");
		$(".cor_loan_f").hide().eq($(this).index()).show();
	});
	$(".cor_loan_f .li_r_face").click(function(e){
		$(".cor_loan_f .li_r_show").hide();
		$(this).next(".li_r_show").show();
		e.stopPropagation();
	});
	$(document).click(function(){
		$(this).find(".li_r_show").hide();
	});
	$(".cor_loan_f .li_r_show span").click(function(e){
		$(this).addClass("sel").siblings(".sel").removeClass("sel");
		$(this).parent().siblings(".li_r_face").find("span").text($(this).text());
	});
};

sy.init = function(){
	sy.navLine();
	sy.fixRight();
	sy.applyShake();
	sy.casesScroll();
	sy.handlerScroll();
	sy.txtScr();
	sy.apply_ok_txt();
};
