//首页
	$(function (){
		var index = {};
		index.isMobile = /^((\+?86)|(\(\+86\)))?1\d{10}$/ ;
		index.isFee = /^[-\+]?\d+(\.\d+)?$/;
		index.InterValObj; //timer变量，控制时间
		index.count = ctx.messageAliveTime*60; //间隔函数，1秒执行
		index.curCount;//当前剩余秒数
		
		index.logined = false;
		index.registed =  false;
		index.successed = true;
		index.mobileCodeSended = false;
		index.mobileCodeCorrect = false;

 
		$('#loanSearchSubmit').click(function() {
			var loanType = $("#loansearch-loanType").val();
			var loan = $("#loansearch-loan").val();
			var loanMonth = $("#loansearch-month").val();
			location.href = ctx.web_domain + "/loan/" + loan + "/" + loanMonth + "?t=" + loanType;
		});

		//首页圆环
		var canvas_bg_length = $(".myCanvas_bg").length;
		var canvas_length = $(".myCanvas").length;
		if(canvas_bg_length > 0 && canvas_length > 0){
			var canvas_bg = $(".myCanvas_bg").get(0);
		    var canvas = $(".myCanvas").get(0);					
			if (canvas.getContext){
				$(".myCanvas_bg").each(function(i){
					var canvas_bg = $(".myCanvas_bg").get(i);
					var ctx = canvas_bg.getContext("2d");
					ctx.strokeStyle = "#dfdfdf";
					ctx.beginPath();
					ctx.lineWidth = 4;
					ctx.arc(50,50,20,-Math.PI/2,Math.PI*2,false);
					ctx.stroke();
				});

				$(".myCanvas").each(function(i){

							var canvas = $(".myCanvas").get(i);
							var deg = $($(".myCanvas").get(i)).siblings(".round").attr("data-round") * Math.PI *2 - Math.PI/2;
							var ctx = canvas.getContext("2d");
							ctx.strokeStyle = "#d33";
							ctx.lineWidth = 4;
							var nowDeg = -Math.PI/2;

							var doInter = setInterval(clear, 50);
							function clear(){
								ctx.clearRect(0,0,100,100);

								if(nowDeg < deg){
									ctx.beginPath();
									ctx.arc(50, 50, 20, -Math.PI/2, nowDeg, false);
									ctx.stroke();
									nowDeg += 0.4;
								}else{
									clearInterval(doInter);
									ctx.beginPath();
									ctx.arc(50, 50, 20, -Math.PI/2, deg, false);
									ctx.stroke();
								}
							}
					});
			}else{
				showSwf();	
			}
		}
		
		
		function showSwf(){
			var length = $(".swf_round").length, el, deg, flashvars, params, attributes;
			while(length--){
				el = $($(".swf_round").get(length-1)).children("div").get(0);
				deg = $($(".swf_round").get(length-1)).siblings(".round").attr("data-round");
				flashvars = {};
				params = {wmode:'transparent'};
				attributes = {};
				swfobject.embedSWF('static/images/Round_sy.swf?deg='+deg, el, 100, 100, 10,'/swf/expressInstall.swf', flashvars, params, attributes);	
			}
		}
			
	});

	
	