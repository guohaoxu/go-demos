
$(function(){
	$(".caozuoTd").hover(function (){
		var ind = $(this).parent().index();
		$(".n1Tab tr:eq("+ind+") .caozuoTd .caozuo").show();
	},function (){
		$(".caozuo").hide();
	})
	$(".caozuoTd li:last-child").hover(function (){
		$(".divhide").show();
	},function (){
		$(".divhide").hide();
	})
	$(document).click(function(){
		$(".personal_input1 ul").hide();
	})
	$(".input_st .personal_input1").click(function(e){
		e.stopPropagation();
		var ind=$(".input_st .personal_input1").index($(this));
		$(".personal_input1 ul").hide();
		$(".personal_input1").eq(ind).children("ul").show();
	})
	$(".personal_input1 li").click(function(e){
		e.stopPropagation();
		$(this).parent().prev("span").html($(this).html());
		$(".personal_input1 ul").hide();
	})
	//tab切换
	$(".pzy_tab input").click(function (){
		var ind = $(this).index();
		$("#n1").hide();
		$("#n2").hide();
		$("#n3").hide();
		$("#n4").hide();
		$("#n5").hide();
		$("#n"+(ind+1)).show();
		$(".pzy_tab input").removeClass("pzy_tabTit");
		$(".pzy_tab input").eq(ind).addClass("pzy_tabTit");
	})

	$(".pzy_tab input").click(function (){
		var ind = $(this).index();
		$("#a1").hide();
		$("#a2").hide();
		$("#a3").hide();
		$("#a"+(ind+1)).show();
		$(".pzy_tab input").removeClass("pzy_tabTit");
		$(".pzy_tab input").eq(ind).addClass("pzy_tabTit");
	})
	// // 左边栏
	// $(".personal_entleft a").click(function(){
	// 	var ind = $(".personal_entleft a").index($(this));
	// 	$(".personal_entleft a").removeClass('active');
	// 	$(this).addClass('active');
	// })
})


// 帮助中心
// $(function(){
// 	$(".hybz").click(function(e){
// 		e.stopPropagation();
// 		$(".lbtab").hide();
// 		$(".lbtab").css("height","0");
// 		var ind = $(".hybz").index($(this));
// 		$(".lbtab").eq(ind).show();
// 		$(".lbtab").eq(ind).animate({
// 			"height":"120"
// 		},300);
// 	})
// 	$(".ls_tab").click(function(e){
// 		e.stopPropagation();
// 		$(".ls_tab2").hide();
// 		var ind = $(".ls_tab").index($(this));
// 		$(".ls_tab2").eq(ind).show(300)
// 	})
// 	$(document).click(function(){
// 		$(".ls_tab2").hide();
// 	})
$(function(){
	// 删除确认
	$(".del").click(function(){
		$(".toumingceng").show();
		$(".shanchuqueren").show();
	})
	$(".closeBtn").click(function(){
		$(".shanchuqueren").hide();
		$(".toumingceng").hide();
		
	})

	// 添加银行卡
	$(".tj").click(function(){
		$(".toumingceng").show();
		$(".tianjiayhk").show();
	})
	$(".closebtn").click(function(){
		$(".tianjiayhk").hide();
		$(".toumingceng").hide();
		
	})
 })


         