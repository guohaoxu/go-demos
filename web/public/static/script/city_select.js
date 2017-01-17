//切换城市
$(function (){
	//注册协议
	$(".reg_agrelink").click(function (){
		$(".touming").show();
		$(".reg_agre").show();
	});
	$(".reg_agreclose").click(function (){
		$(".touming").hide();
		$(".reg_agre").hide();
	});
	$(".reg_agrebtn input").click(function (){
		$(".touming").hide();
		$(".reg_agre").hide();
	});
	$(".city").click(function (e){
		e.stopPropagation();
		$(".city_pos").fadeIn(500);
	})
	$(".city_list span").click(function (e){
		e.stopPropagation();
		var cityId = $(this).attr("data-val");
		var cityName = $(this).html();
		if(header.logined){
			$.ajax({
					url : ctx.web_domain+"/user/city/"+cityId,
					type : "put",
					dataType : "json",
					async: false,
					error : function(XMLHttpRequest, textStatus,
							errorThrown) {
					},
					success : function(result) {
						if(result){
							
						}
						$(".city_pos").hide();
					}
			});

		}
		$(".pit_city").html(cityName);
		$(".city_pos").hide();
        var now = new Date();
        now.setTime(now.getTime() + (365*24*60 * 60 * 1000));
		$.cookie("cityName", cityName, { expires: now }); 				
	})
	$(document).click(function(){
		$(".city_pos").hide();
	})
	$(".city_more").click(function (){
		$(".city_pop").css({
			"height":"710",
			"margin-top":"-355px"
		})
		$(".city_con").height(559);
	})
	$(".city_opt span").click(function (){
		$(".city span").html($(this).html());
		$(".touming").hide();
		$(".city_pop").hide();
		$(".city_pop").css({
			"height":"110",
			"margin-top":"-55px"
		})
		$(".city_con").height(0);
	})
	var tf = true;
	//快速搜索下拉效果
	$(".selectitem2 dt").click(function (){
		var ind = $(".selectitem2 dt").index($(this));
		if(tf==true){
			$(".selectitem2").eq(ind).height($(".selectList2").eq(ind).height());
			$(".selectitem2 .SelectTag2").eq(ind).css("background-position","0 -527px");
			tf=false;
			
		}else{
			$("li:eq("+ind+") .selectitem2").height($(".selectitem2 dt").height());
			$(".selectitem2 .SelectTag2").css("background-position","0 -95px");
			tf=true;
		}
	})
	$(".selectitem2").mouseleave(function (){
		$(".selectitem2").height($(".selectitem2 dt").height());
		$(".selectitem2 .SelectTag2").css("background-position","0 -95px");
		tf=true;
	})
	$(".selectitem2 dd").click(function(e){
		e.stopPropagation();
		var $thisparent = $(this).parent();
		$(".selectitem2").height($(".selectitem2 dt").height());
		$(".selectitem2 .SelectTag2").css("background-position","0 -95px");
		$thisparent.children('dt').html($(this).html());
		tf=true;
		$(this).siblings().removeClass("selmoren");
		$(this).addClass("selmoren");
	})
	$(".selectitem2 dd").hover(function (){
		var ind = $(this).index();
		$(".selectitem2 dd.selmoren").css("background","none");
		$(".selectitem2 dd").removeClass("selActive");
		$(this).addClass("selActive");
	},function (){
		$(".selectitem2 dd").removeClass("selActive");
		$(".selectitem2 dd.selmoren").css("background","#fcecec");
	})
})