function select3(){
		$(".czx_select3 h4").click(function(e){
			e.stopPropagation();
			$(".select ol").hide();
			$(".czx_select3 ol").show();
		})
		$(".czx_select3 li").click(function(e){
			e.stopPropagation();
			$(".czx_select3 h4").html($(this).html());
			$(".select ol").hide();
		})
	}
function selectTab(parent){
	$(function(){
		//点击dt将dl展开到它原本的高度;
		$(".selectList dt").click(function(e){
			e.stopPropagation();
			var ind = $(".selectList dt").index($(this));
			$(".selectitem").height($(".selectList dt").height())
			$(".selectitem").eq(ind).css({
				height:$(".selectList").height()
			})
		})
		//将dd的内容复制到dt内;
		$(".selectList dd").click(function(e){
			e.stopPropagation();
			var $thisparent = $(this).parent();
			$(".selectitem").height($(".selectList dt").height());
			$thisparent.children('dt').html($(this).html());
		})
		//点击空白区域隐藏dd;
		$(document).click(function(){
			$(".selectitem").height($(".selectList dt").height());
		})
	})	
}
$(function (){
	selectTab();
	$("body").css({
		"min-height":$(document).height()-156
	})

	$(".czx_select1 h4").click(function(e){
		e.stopPropagation();
		$(".select ol").hide();
		$(".czx_select1 ol").show();
	})
	$(".czx_select1 li").click(function(e){
		e.stopPropagation();
		$(".czx_select1 h4").html($(this).html());
		$(".select ol").hide();
	})
	$(".czx_select2 h4").click(function(e){
		e.stopPropagation();
		$(".select ol").hide();
		$(".czx_select2 ol").show();
	})
	$(".czx_select2 li").click(function(e){
		e.stopPropagation();
		$(".czx_select2 h4").html($(this).html());
		$(".select ol").hide();
	})
	select3();
	$(document).click(function(){
		$(".select ol").hide();
	
})
	$(".pan_add").click(function(){
		$(".touming").height($(document).outerHeight())
		$(".touming").show();
	})
	$(".tjjgHeader span").click(function(){
		$(".touming").hide();
		$(".czx_tjjgCont input").val("");
	})
	
	$("#loanClassify li").hover(function (){
		var a = $(this).index();
		if (a==0) {
			$(".qy").css("backgroundPosition","0 -207px");
		}
		if (a==2) {
			$(".gr").css("backgroundPosition","-54px -207px");
		}
		if (a==4) {
			$(".fw").css("backgroundPosition","-99px -207px");
		}
		if (a==6) {
			$(".qc").css("backgroundPosition","-152px -207px");
		}
		$("#loanClassify li:eq("+a+") .loanTit").css("color","#4f92fa");
		$("#loanClassify li:eq("+a+") .loanIntro").css("color","#4f92fa");
	},function (){
		var a = $(this).index();
		if (a==0) {
			$(".qy").css("backgroundPosition","0 -159px");
		}
		if (a==2) {
			$(".gr").css("backgroundPosition","-54px -159px");
		}
		if (a==4) {
			$(".fw").css("backgroundPosition","-99px -159px");
		}
		if (a==6) {
			$(".qc").css("backgroundPosition","-152px -159px");
		}
		$("#loanClassify li .loanTit").css("color","#868686");
		$("#loanClassify li .loanIntro").css("color","#868686");
	})
	$(".login").click(function (e){
		e.stopPropagation();
		$("#login").animate({"height":130},300);
	})
	$(document).click(function (){
		$("#login").animate({"height":0},300);
	})
	$(".closetanchuan").click(function (){
		$(".tanchuang").css("display","none");
	})
	$(".lijisq").click(function (){
		$(".tanchuang").css("display","block");
	})
	$(".menu4").hover(function (){
		$(".qrCode").css("display","block");
	},function (){
		$(".qrCode").css("display","none");
	})
	$(".jump").click(function (){
		var index = $(this).index();//获取jump的下标
		if(index==4){//如果点击的jump下标是4就跳到顶部								
			$("html,body").animate({scrollTop:0},0);
		}else{//否则跳到对应的位置
			var jump = $(".loanProduct").eq(index).offset().top;//获取对应位置相对于页面顶部的位置
			$("html,body").animate({scrollTop:jump},1000);//根据上面获取的jump跳到对应的位置
		}
	})
	$(".searYongtu").click(function (e){
		e.stopPropagation();
		$(".searOption1").css("display","block");
		$(".searOption2").css("display","none");
		$(".searOption3").css("display","none");
	})
	$(".searOption1 li").click(function (e){
		e.stopPropagation();
		var index = $(this).index();
		$(".searOption1").css("display","none");
		$(".yongtu").html($(".searOption1 li").eq(index).html());
	})
	$(".searJine").click(function (e){
		e.stopPropagation();
		$(".searOption1").css("display","none");
		$(".searOption2").css("display","block");
		$(".searOption3").css("display","none");
	})
	$(".searOption2 li").click(function (e){
		e.stopPropagation();
		var index = $(this).index();
		$(".searOption2").css("display","none");
		$(".jine").html($(".searOption2 li").eq(index).html());
	})
	$(".searQixian").click(function (e){
		e.stopPropagation();
		$(".searOption1").css("display","none");
		$(".searOption2").css("display","none");
		$(".searOption3").css("display","block");
	})
	$(".searOption3 li").click(function (e){
		e.stopPropagation();
		var index = $(this).index();
		$(".searOption3").css("display","none");
		$(".qixian").html($(".searOption3 li").eq(index).html());
	})
	$(document).click(function (){
		$(".searOption1").css("display","none");
		$(".searOption2").css("display","none");
		$(".searOption3").css("display","none");
		$(".jineOption").css("display","none");
		$(".qixianOption").css("display","none");
	})
	function anima(){
		var loanCaseTop = $(".loanCaseLists li").outerHeight()*($(".loanCaseLists li").size()-3);
		$(".loanCaseLists").stop().animate({
			"top":-loanCaseTop
		},30000,"linear",function (){
			$(".loanCaseLists").css("top",0);
			anima();
		})
	}
	$(".loanCaseList").hover(function (){
		$(".loanCaseLists").stop();
	},function (){	
		anima();
	})
	anima();
	$(".jineSelect").click(function (e){
		e.stopPropagation();
		$(".jineOption").css("display","block");
		$(".qixianOption").css("display","none");
	})
	$(".qixianSelect").click(function (e){
		e.stopPropagation();
		$(".jineOption").css("display","none");
		$(".qixianOption").css("display","block");
	})
	$(".jineOption li").click(function (){
		var index = $(this).index();
		$(".jineNum").html($(".jineOption li").eq(index).html());
		$(".jineOption").css("display","none");
	})
	$(".qixianOption li").click(function (){
		var index = $(this).index();
		$(".qixianNum").html($(".qixianOption li").eq(index).html());
		$(".qixianOption").css("display","none");
	})
	$(".chakan").click(function (){
		window.location = "loanInfor.html";
	})
	$(".inforTxt1").focus(function (){
		$(".loanTips1").css("visibility","visible");
	})
	$(".inforTxt1").blur(function (){
		$(".loanTips1").css("visibility","hidden");
	})
	$(".inforTxt2").focus(function (){
		$(".loanTips2").css("visibility","visible");
	})
	$(".inforTxt2").blur(function (){
		$(".loanTips2").css("visibility","hidden");
	})
	$(".regNext1").click(function (){
		$("#regCon").hide();
		$("#regCon2").show();
	})
	$(".pzy_prev").click(function (){
		$("#regCon").show();
		$("#regCon2").hide();
	})
	// 后台对接后删除
	$(".regNext2").click(function (){
		window.location = "reg2.html";
	})
	$(".czx_sqcgFooter input").click(function(){
		window.location = "ywht-ls/xiugaimma.html";
	})
	// 后台对接后删除end
	$(".czx_jllxw").click(function(){
		$(".tanchuang").hide();
		$(".tanchuang1").show();
	})
	$(".close").click(function(){
		$(".tanchuang1").hide();
	})

})
//banner图转样式
//background: url(../images/banner.jpg) center 0 no-repeat; }
$(function (){
	var bannerHtml1 = $(".banners div img").eq(0).prop("src");
	var bannerHtml2 = $(".banners div img").eq(1).prop("src");
	var bannerHtml3 = $(".banners div img").eq(2).prop("src");
	var bannerHtml4 = $(".banners div img").eq(3).prop("src");
	var bannerHtml5 = $(".banners div img").eq(4).prop("src");
	var bannerHtml6 = $(".banners div img").eq(5).prop("src");
	var bannerStyle = "<style type='text/css'>"+
	".banner1{background:url("+bannerHtml1+") center 0 no-repeat;width:100%;height:100%;}"+
	".banner2{background:url("+bannerHtml2+") center 0 no-repeat;width:100%;height:100%;}"+
	".banner3{background:url("+bannerHtml3+") center 0 no-repeat;width:100%;height:100%;}"+
	".banner4{background:url("+bannerHtml4+") center 0 no-repeat;width:100%;height:100%;}"+
	".banner5{background:url("+bannerHtml5+") center 0 no-repeat;width:100%;height:100%;}"+
	".banner6{background:url("+bannerHtml6+") center 0 no-repeat;width:100%;height:100%;}"+
	"</style>";
	$("head").append(bannerStyle);
	$(".banners div img").remove();
	//第一张图片链接
})
function addToFavorite(){
       var a="http://jr.youboy.com/";
       var b="有求必应-微小贷";
       if(document.all){window.external.AddFavorite(a,b)}
       else if(window.sidebar){window.sidebar.addPanel(b,a,"")}
       else{alert("对不起，您的浏览器不支持此操作!\n请您使用菜单栏或Ctrl+D收藏本页。")}
}