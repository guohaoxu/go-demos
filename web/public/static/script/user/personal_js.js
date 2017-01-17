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
	$("tr:nth-child(odd)").css("backgroundColor","#fafcfb");
	//tab切换
	$(".pzy_tab input").click(function (){
		var ind = $(this).index();
		$("#n1").hide();
		$("#n2").hide();
		$("#n3").hide();
		$("#n"+(ind+1)).show();
		$(".pzy_tab input").removeClass("pzy_tabTit");
		$(".pzy_tab input").eq(ind).addClass("pzy_tabTit");
	})
	// 左边栏
	$(".personal_entleft a").click(function(){
		var ind = $(".personal_entleft a").index($(this));
		$(".personal_entleft a").removeClass('active');
		$(this).addClass('active');
	})
})

         