//个人经营贷贷款测算器
$(function (){
	var saleloan = {};
	saleloan.InterValObj; //timer变量，控制时间
    saleloan.count = ctx.messageAliveTime*60; //间隔函数，1秒执行
    saleloan.curCount;//当前剩余秒数
	saleloan.isMobile = /^((\+?86)|(\(\+86\)))?1\d{10}$/;
	saleloan.mobileCodeSended = false;
	saleloan.mobileCodeCorrect = false;
	$(".lc1_txt").focus(function (){
    	$(this).siblings(".txt_tip").hide();
    })
    $(".lc1_txt").blur(function (){
    	if($(this).val() == ""){
    		$(this).siblings(".txt_tip").show();
    	}
    })
    $(".txt_tip").click(function (){
    	$(this).hide().siblings(".lc1_txt").focus();
    })
	var num = 0;
	var num2 = 0;
	var money = 0;
	var current = 1;
	var timer = null;
	
	var age = 0;
	var companyType = '';
	var monthIncomePublic = 0;
	var monthIncomePrivate = 0;
	var houseType = '';//房产类型
	var houseTotalPrice = 0;//房产总价
	var houseMonthPay = 0;//房产月供金额
	var personalDebt = '';
	var companyDebt = '';
	var shares = 0;
	
	$(".loan_CalculationConR").eq(num).show();
	$(".loan_calNext").click(function (){
		age = $("input[name='age']").val();	
		companyType = $("input[name='companyType']:checked").val();	
		shares = $("input[name='shares']").val();	
		monthIncomePublic = $("input[name='monthIncomePublic']").val();	
		monthIncomePrivate = $("input[name='monthIncomePrivate']").val();	
		var housePayType = $("input[name='housePayType']:checked").val();	//房产类型、
		personalDebt = $("input[name='personalDebt']:checked").val();	
		companyDebt = $("input[name='companyDebt']:checked").val();	
		
		var localHouseType = $("input[name='localHouseType']:checked").val();	                   //本地房产类型（买断或者月供）
		var localHouseMonthType = $("input[name='localHouseMonthType']:checked").val();            //本地房产月供类型
        var localHouseTotalPrice = $("input[name='localHouseTotalPrice']").val();	               //本地房产总价（买断情况下）
	    var localHouseMonthTotalPrice = $("input[name='localHouseMonthTotalPrice']").val();    	   //本地房产总价（月供情况下）
		var localHouseMonthPay = $("input[name='localHouseMonthPay']").val();	                   //本地房产月供金额
		
		
		//第一题
		if (current==1){
			//验证年龄，月薪和公积金
			if( $.isNumeric(age) == false || !(header.isInt.test(age))){
                $("#ageTip").html('<em class="err"></em>抱歉！请输入正确年龄');
				return false;
			}
			if(age == '' || age <18 || age >65 ){
				$("#ageTip").html('<em class="err"></em>抱歉！18~65岁人士才可申请贷款哦~');
				return false;
			}		
			current=2;		
		}	
		//第二题
		else if(current==2){
			var companyTypeLength = $("input[name='companyType']:checked").length;
			if(companyTypeLength <= 0){	
			    $("#sharesTip").html('<em class="err"></em>请选择公司类型');	
				return false;
			}
			if(companyType != 1){
				if(shares == '' || shares < 0 || shares > 100 || $.isNumeric(shares) == false){
					$("#sharesTip").html('<em class="err"></em>请输入您所在公司的真实所占股份比例，要不测试结果不准确哦~');
					return false;
				}
			}
			else{
				shares = 100;
				$("input[name='shares']").val('100');
			}
			
			current=3;			
		}
		//第三题
		else if(current==3){
			
			if(monthIncomePublic == '' || monthIncomePublic < 0 || monthIncomePublic > 5000000  || $.isNumeric(monthIncomePublic) == false){		
				$("#monthIncomeTip").html('<em class="err"></em>公司月均对公进账流水应该在 0 —— 5000000 元之间');
				return false;
			}
			if(monthIncomePrivate == '' || monthIncomePrivate < 0 || monthIncomePrivate > 5000000  || $.isNumeric(monthIncomePrivate) == false ){		
                $("#monthIncomeTip").html('<em class="err"></em>公司月均对私进账流水应该在 0 —— 5000000 元之间');			
				return false;
			}
			current=4;			
		}
		//第四题
		else if(current==4){
			var housePayTypeLength = $("input[name='housePayType']:checked").length;
			if(housePayTypeLength <= 0){
			    $("#houseTip").html('<em class="err"></em>请选择房产类型');			
				return false;
			}
			//本地房产
			if(housePayType == 1){
				houseType = housePayType;
			}
			else if(housePayType == 2){		
				if(typeof(localHouseType) == "undefined"){
					$("#houseTip").html('<em class="err"></em>请选择本地房产类型');		
					return false;
				}		
				//买断
				if(localHouseType == 21){			
					if( localHouseTotalPrice == '' || localHouseTotalPrice > 50000 || localHouseTotalPrice < 0  || $.isNumeric(localHouseTotalPrice) == false ){
					    $("#houseTip").html('<em class="err"></em>请填写正确买断房产总价，应该在0-50000（万）元之间');
						return false;
					}
					houseType = localHouseType;
					houseTotalPrice = localHouseTotalPrice;
				}
				//月供
				else if(localHouseType == 22){	
				    var localHouseMonthType = $("input[name='localHouseMonthType']:checked").val();
					if(typeof(localHouseMonthType) == "undefined"){
						$("#houseTip").html('<em class="err"></em>请选择本地房产月供类型');
						return false;
					}	
					if( localHouseMonthTotalPrice == '' || localHouseMonthTotalPrice > 50000 || localHouseMonthTotalPrice < 0   || $.isNumeric(localHouseMonthTotalPrice) == false ){
						$("#houseTip").html('<em class="err"></em>请输入您真实的房产价值/月供金额，要不测试结果不准确哦~');
						return false
					}
					if( localHouseMonthPay == '' || localHouseMonthPay > 1000000 || localHouseMonthPay < 0   || $.isNumeric(localHouseMonthPay) == false ){
						$("#houseTip").html('<em class="err"></em>请输入您真实的房产价值/月供金额，要不测试结果不准确哦~');
						return false
					}
					houseType = localHouseMonthType;
					houseTotalPrice = localHouseMonthTotalPrice;
					houseMonthPay = localHouseMonthPay;
				}	
			}
			
			//外地房产
			else if(housePayType == 3){
				var nonlocalHouseType = $("input[name='nonlocalHouseType']:checked").val();
				if(typeof(nonlocalHouseType) == "undefined"){
					$("#houseTip").html('<em class="err"></em>请选择外地房产类型');
					return false;
				}		
				//买断
				if(nonlocalHouseType == 31){	
                    var nonlocalHouseTotalPrice = $("input[name='nonlocalHouseTotalPrice']").val();				
					if( nonlocalHouseTotalPrice == '' || nonlocalHouseTotalPrice > 50000 || nonlocalHouseTotalPrice < 0  || $.isNumeric(nonlocalHouseTotalPrice) == false  ){
						$("#houseTip").html('<em class="err"></em>请输入您真实的房产价值/月供金额，要不测试结果不准确哦~');
						return false;
					}
					houseType = nonlocalHouseType;
					houseTotalPrice = nonlocalHouseTotalPrice;
				}
				//月供
				if(nonlocalHouseType == 32){	
				    var nonlocalHouseMonthType = $("input[name='nonlocalHouseMonthType']:checked").val();
					var nonlocalHouseMonthPay = $("input[name='nonlocalHouseMonthPay']").val();
					if(typeof(nonlocalHouseMonthType) == "undefined"){
						$("#houseTip").html('<em class="err"></em>请选择本地房产月供类型');
						return false;
					}	
					var nonlocalHouseMonthTotalPrice = $("input[name='nonlocalHouseMonthTotalPrice']").val();
					if( nonlocalHouseMonthTotalPrice == '' || nonlocalHouseMonthTotalPrice > 50000 || nonlocalHouseMonthTotalPrice < 0  || $.isNumeric(nonlocalHouseMonthTotalPrice) == false ){
						$("#houseTip").html('<em class="err"></em>请输入您真实的房产价值/月供金额，要不测试结果不准确哦~');
						return false
					}
					if( nonlocalHouseMonthPay == '' || nonlocalHouseMonthPay > 1000000 || nonlocalHouseMonthPay < 0  || $.isNumeric(nonlocalHouseMonthPay) == false ){
						$("#houseTip").html('<em class="err"></em>请输入您真实的房产价值/月供金额，要不测试结果不准确哦~');
						return false
					}
					houseType = nonlocalHouseType;
					houseTotalPrice = nonlocalHouseMonthTotalPrice;
					houseMonthPay = nonlocalHouseMonthPay;
				}	
			}
			current=5;			
		}
		//第五题
		else if(current==5){
			var personalDebtLength = $("input[name='personalDebt']:checked").length;
			if(companyTypeLength <= 0){	
			    $("#personalDebtTip").html('<em class="err"></em>请选择负债类型');	
				return false;
			}	
			var personalDebtType = $("input[name='personalDebt']:checked").val();
			if(personalDebtType == 2){
                   var personalDebtMonth = $("input[name='personalDebtMonth']").val();
                   var personalDebtTotal = $("input[name='personalDebtTotal']").val();
                   if(personalDebtTotal == '' || personalDebtTotal <1000){
                      	$("#personalDebtTip").html('<em class="err"></em>小于1000元的负债，可视为无负债哟！');	
                        return false;
                   }
                   if(personalDebtTotal == '' || personalDebtTotal >5000000){
                      	$("#personalDebtTip").html('<em class="err"></em>您的负债过高，如您需要申请贷款，请在有求必应注册账号，稍后会有专员为您提供专业信贷服务');	
                        return false;
                   }
                   if(personalDebtMonth == '' || personalDebtMonth <0 || personalDebtMonth > 489000){
                        $("#personalDebtTip").html('<em class="err"></em>请输入您真实的月还款金额，要不测试结果不准确哦~');	
                        return false;
                   }
			}
			current=6;			
		}
		//第六题
		else if(current==6){
			var companyDebttLength = $("input[name='companyDebt']:checked").length;
			if(companyDebttLength <= 0){
			    $("#companyDebtTip").html('<em class="err"></em>请选择负债类型');			
				return false;
			}	
			var companyDebtType = $("input[name='companyDebt']:checked").val();
			if(companyDebtType == 2){
                   var companyDebtMonth = $("input[name='companyDebtMonth']").val();
                   var companyDebtTotal = $("input[name='companyDebtTotal']").val();
                   if(companyDebtTotal == '' || companyDebtTotal <1000){
                      	$("#companyDebtTip").html('<em class="err"></em>小于1000元的负债，可视为无负债哟！');	
                        return false;
                   }
                   if(companyDebtTotal == '' || companyDebtTotal >5000000){
                      	$("#companyDebtTip").html('<em class="err"></em>您的负债过高，如您需要申请贷款，请在有求必应注册账号，稍后会有专员为您提供专业信贷服务');	
                        return false;
                   }
                   if(companyDebtMonth == '' || companyDebtMonth <0 || companyDebtMonth > 489000){
                   	    $("#companyDebtTip").html('<em class="err"></em>请输入您真实的月还款金额，要不测试结果不准确哦~');	
                        return false;
                   }
			}
			current=6;			
		}
		
		num++;
		$(".loan_CalculationConR").hide();
		$(".loan_CalculationConR").eq(num).show();
		if(num==6){
			$(".bdsharebuttonbox").show();
		}
		$(".loan_CalculationConL em").addClass("rot"+(num+1));
		if(num==6){
			$.ajax({
					url : ctx.web_domain+"/calculate/sale/next",
					type : "POST",
					dataType : "json",
					data : {
						"companyType":companyType,    
						"age":age,                
						"housePayType":houseType,          
						"personalDebt":personalDebt,
						'companyDebt':companyDebt,
						"shares":shares,
						"monthIncomePublic":monthIncomePublic,
						"monthIncomePrivate":monthIncomePrivate
							  
					},
					error : function(XMLHttpRequest, textStatus,
							errorThrown) {
					},
					success : function(money) {
						$(".loan_CalculationConL span").html("约"+money+"万");
						$("#result").html("约"+money+"万");
					}
			});
		}
	})
	$(".fund").change(function (){
		var ind = $(this).parent().index();
		if(ind>0){
			$(".jiaona").show();
		}else{
			$(".jiaona input[type='text']").val("");
			$(".jiaona").hide();
		}
	})
	$(".property1").change(function (){
		var ind = $(this).parent().index();
		if(ind==1){
			$(".fangchan1").show();
			$(".fangchan2").hide();
			$(".yuegong").hide();
			$(".fangchan2 input[type='text']").val("");
			$(".fangchan2 input[type='radio']").prop("checked",false);
			$(".fangchangjiazhi").hide();
			$(".fangchangjiazhi2").hide();
		}else if(ind==2){
			$(".fangchan1").hide();
			$(".fangchan2").show();
			$(".yuegong").hide();
			$(".fangchan1 input[type='text']").val("");
			$(".fangchan1 input[type='radio']").prop("checked",false);
			$(".fangchangjiazhi").hide();
			$(".fangchangjiazhi2").hide();
		}else{
			$(".fangchan1 input[type='radio']").prop("checked",false);
			$(".fangchan2 input[type='radio']").prop("checked",false);
			$(".fangchan1 input[type='text']").val("");
			$(".fangchan2 input[type='text']").val("");
			$(".fangchan1").hide();
			$(".fangchan2").hide();
			$(".yuegong").hide();
			$(".fangchangjiazhi").hide();
			$(".fangchangjiazhi2").hide();
		}
	})
	$(".property2").change(function (){
		var ind = $(this).parent().index();
		if(ind==1){
			$(".yuegong").hide()
			$(".yuegong input[type='radio']").prop("checked",false);
			$(".yuegong input[type='text']").val("");
			$(".fangchangjiazhi2").hide();
			$(".fangchangjiazhi").show();
		}
		if(ind==2){
			$(".fangchangjiazhi").hide();
			$(".yuegong").show()
		}
	})
	$(".property3").change(function (){
		$(".fangchangjiazhi2").show();
	})
	$(".lc_rad1").change(function (){
		var ind = $(this).parent().index();
		if(ind==1){
			$(".chechan1").show();
			$(".chechan2").hide();
			$(".yuegong2").hide();
			$(".chechan2 input[type='text']").val("");
			$(".chechan2 input[type='radio']").prop("checked",false);
			$(".chechanjiazhi").hide();
			$(".chechanjiazhi2").hide();
		}else if(ind==2){
			$(".chechan1").hide();
			$(".chechan2").show();
			$(".yuegong2").hide();
			$(".chechan1 input[type='text']").val("");
			$(".chechan1 input[type='radio']").prop("checked",false);
			$(".chechanjiazhi").hide();
			$(".chechanjiazhi2").hide();
		}else{
			$(".chechan1 input[type='radio']").prop("checked",false);
			$(".chechan2 input[type='radio']").prop("checked",false);
			$(".chechan1 input[type='text']").val("");
			$(".chechan2 input[type='text']").val("");
			$(".chechan1").hide();
			$(".chechan2").hide();
			$(".yuegong2").hide();
			$(".chechanjiazhi").hide();
			$(".chechanjiazhi2").hide();
		}
	})
	$(".lc_rad2").change(function (){
		var ind = $(this).parent().index();
		if(ind==1){
			$(".yuegong2").hide()
			$(".yuegong2 input[type='radio']").prop("checked",false);
			$(".yuegong2 input[type='text']").val("");
			$(".chechanjiazhi2").hide();
			$(".chechanjiazhi").show();
		}
		if(ind==2){
			$(".chechanjiazhi").hide();
			$(".yuegong2").show()
		}
	})
	$(".lc_rad3").change(function (){
		$(".chechanjiazhi2").show();
	})
	$(".chongxinjisuan").click(function (){
		location.reload();
	})

	//了解更多
	$(".jixuliaojie").click(function (){	
		if(header.logined){
            saleloanDoSubmit();
		}
		else{
			$(".loan_CalculationConL").hide();
			$(".loan_CalculationConL2").show();
			$(".loan_CalculationConR").hide();
			$(".loan_CalculationConR2").show();
			num=0;
		}	
	})
	
	$('#getMobileCode').click(function(){  
	     saleloan.curCount = saleloan.count;
		 var mobile = $("input[name='mobile']").val();
	     if(mobile == ''  || !(header.isMobilePhone.test(mobile))){
			 $(".loan_succ_tck2").stop();
			 tips('请输入手机号码');
			 return false;
		 }

	    //发送验证码手机
		 $.ajax({
			url : ctx.web_domain+"/verification/mobile/code?mobile="+mobile,
			type : "get",
			dataType : "json",
			async : false,
			error : function(XMLHttpRequest, textStatus,
					errorThrown) {
			},
			success : function(result) {
				if (result == 1){
					$(".loan_succ_tck2").stop();
					tips('手机验证码发送失败');
				}
				else if (result == 2){
					$(".loan_succ_tck2").stop();
					tips('抱歉，您今天信息发送次数已用完');
				}
				else if (result == 3){
					$(".loan_succ_tck2").stop();
					tips('请输入手机号码');
				}
				else{
				    //设置button效果，开始计时
				    $("#getMobileCode").attr("disabled", "true");
					$("#getMobileCode").val("请在" + saleloan.curCount + "秒内输入验证码");
					saleloan.InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
					saleloan.mobileCodeSended = true;
				}
			}
		 })
	});
	
	//验证提示
	function tips(text){
		$("#tipText").html(text);
		$(".loan_succ_tck2").show().animate({
			"opacity":"1",
			"top":"49%"
		},800);
		setTimeout(function(){
			$(".loan_succ_tck2").fadeOut(800).animate({
				"opacity":"0",
				"top":"50%"
			},1);
		},1800)	
	}
	
	//timer处理函数
    function SetRemainTime() {
		
		if (saleloan.curCount == 0) {                
			window.clearInterval(saleloan.InterValObj);//停止计时器
			$("#getMobileCode").removeAttr("disabled");//启用按钮
			$("#getMobileCode").val("重新发送验证码");
			saleloan.curCount = ctx.messageAliveTime*60;
		}
		else {
			saleloan.curCount--;
			$("#getMobileCode").val("请在" + saleloan.curCount + "秒内输入验证码");
		}
	}

	function saleloanDoSubmit(){
		    var mobile = $("input[name='mobile']").val();
			// 取得要提交页面的URL  
			var action = $('#submit').attr('href');  
			// 创建Form  
			var form = $('<form></form>');  
			// 设置属性  
			form.attr('action', action);  
			form.attr('method', 'post');  
			form.attr('target', '_self');  

			// 附加到Form  
			form.append($('<input type="text" name="age" value="'+age+'"/>')); 
			form.append($('<input type="text" name="companyType" value="'+companyType+'"/>')); 
			form.append($('<input type="text" name="monthIncomePublic" value="'+monthIncomePublic+'"/>')); 
			form.append($('<input type="text" name="monthIncomePrivate" value="'+monthIncomePrivate+'"/>')); 
			form.append($('<input type="text" name="housePayType" value="'+houseType+'"/>')); 
			form.append($('<input type="text" name="houseTotalPrice" value="'+houseTotalPrice+'"/>')); 
			form.append($('<input type="text" name="houseMonthPay" value="'+houseMonthPay+'"/>')); 
			form.append($('<input type="text" name="personalDebt" value="'+personalDebt+'"/>')); 
			form.append($('<input type="text" name="companyDebt" value="'+companyDebt+'"/>')); 
			form.append($('<input type="text" name="shares" value="'+shares+'"/>')); 	 
			form.append($('<input type="text" name="mobile" value="'+mobile+'"/>'));  
			
			// 提交表单  
			form.submit(); 
	}
	//提交form
	$('#submit').click(function(){  
		 var mobile = $("input[name='mobile']").val();
		 var mobileCode = $("input[name='mobileCode']").val();
		  
		  if(mobile == ''  || !(header.isMobilePhone.test(mobile))){
			 $(".loan_succ_tck2").stop();
			 tips('请输入手机号码');
			 return false;
		  }
		  if(mobileCode.length != 6){
			 $(".loan_succ_tck2").stop();
			 tips('请输入正确手机验证码');
			 return false;
		  }
		  					
	    if(saleloan.mobileCodeSended){
			 //验证手机验证码是否填写正确
			 $.ajax({
				url : ctx.web_domain+"/verification/check/mobilecode?mobileCode="+mobileCode+"&mobile="+mobile,
				type : "get",
				dataType : "json",
				async : false,
				error : function(XMLHttpRequest, textStatus,
						errorThrown) {
				},
				success : function(result) {								
				    saleloan.mobileCodeCorrect = true;				
				}
			})
            if(!saleloan.mobileCodeCorrect){
				$(".loan_succ_tck2").stop();
			    tips('手机验证码错误');
				return false;
			}

			saleloanDoSubmit();
			
		}
		else{
			$(".loan_succ_tck2").stop();
			tips('手机验证码发送失败');
		} 

		return false;  
	});
	
	$("#captchaImage").click(function() {
		var captchaUrl =  ctx.web_domain+"/captcha/?" + Math.random().toString();
		$("#captchaImage").attr("src", captchaUrl);
	});
	
	$(".share").change(function (){
		$("#sharesTip").html('');
		var ind = $(this).parent().index();
		if (ind==0){
			$(".gufen").hide();
		}else{
			$(".gufen").show();
		};
	})
	$(".liabilities").change(function() {
		var ind = $(this).parent().index();
		if (ind!=0){
			$(".grfuzhai").show();
		}else{
			$(".grfuzhai").hide();
		};
	});
	$(".liabilities2").change(function() {
		var ind = $(this).parent().index();
		if (ind!=0){
			$(".qyfuzhai").show();
		}else{
			$(".qyfuzhai").hide();
		};
	});
})