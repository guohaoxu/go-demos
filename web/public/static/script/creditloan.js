//贷款测算器
$(function (){
	var creditloan = {};
	creditloan.InterValObj; //timer变量，控制时间
    creditloan.count = ctx.messageAliveTime*60; //间隔函数，1秒执行
    creditloan.curCount;//当前剩余秒数
    creditloan.isMobile = /^((\+?86)|(\(\+86\)))?1\d{10}$/;
    creditloan.mobileCodeSended = false;
    creditloan.mobileCodeCorrect = false;
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
	var mn = 0;
	
	var houseType = '';//房产类型
	var houseTotalPrice = 0;//房产总价
	var houseMonthPay = 0;//房产月供金额
	var carType = '';//车产类型
	var carTotalPrice = 0;//车产总价
	var carMonthPay = 0;//车产月供金额
	var companyType = '';  //公司类型
	var monthSalary = 0;  //月薪
	var age = 0;         //年龄
	var fundMonthPay = 0; //公积金月支付金额
	var fundHand = '';     //公积金缴纳
	
	var occupation = '';   //职业身份
	var job = '';          //职位
	var insuranceHand = '' //社保缴纳类型
	var insuranceMonthPay = 0;//社保月供情况
	var salaryPayType = '';    //薪资发放形式
	var monthQuery = '';       //当月征信查询
	var otherLoan = '';        //是否有其他贷款
	$(".loan_CalculationConR").first().show();

	$(".loan_calNext").click(function (){
		////////////////////////基础信息--- 开始//////////////////////		
		companyType = $("input[name='companyType']:checked").val();	
		monthSalary = $("input[name='monthSalary']").val();		
		
		var housePayType = $("input[name='housePayType']:checked").val();	//房产类型
		
		var localHouseType = $("input[name='localHouseType']:checked").val();	                   //本地房产类型（买断或者月供）
		var localHouseMonthType = $("input[name='localHouseMonthType']:checked").val();            //本地房产月供类型
        var localHouseTotalPrice = $("input[name='localHouseTotalPrice']").val();	               //本地房产总价（买断情况下）
	    var localHouseMonthTotalPrice = $("input[name='localHouseMonthTotalPrice']").val();    	   //本地房产总价（月供情况下）
		var localHouseMonthPay = $("input[name='localHouseMonthPay']").val();	                   //本地房产月供金额
		  
		var nonlocalHouseType = $("input[name='nonlocalHouseType']:checked").val();	                //外地房产类型（买断或者月供）
		var nonlocalHouseMonthType = $("input[name='nonlocalHouseMonthType']:checked").val();       //外地房产月供类型
        var nonlocalHouseTotalPrice = $("input[name='nonlocalHouseTotalPrice']").val();	            //外地房产总价（买断情况下）
	    var nonlocalHouseMonthTotalPrice = $("input[name='nonlocalHouseMonthTotalPrice']").val();	//外地房产总价（月供情况下）
		var nonlocalHouseMonthPay = $("input[name='nonlocalHouseMonthPay']").val();                 //外地房产月供金额
				
		var carPayType = $("input[name='carPayType']:checked").val();	//车产类型
		
		var localCarType = $("input[name='localCarType']:checked").val();	                   //本地车产类型（买断或者月供）
		var localCarMonthType = $("input[name='localCarMonthType']:checked").val();            //本地车产月供类型
        var localCarTotalPrice = $("input[name='localCarTotalPrice']").val();	               //本地车产总价（买断情况下）
	    var localCarMonthTotalPrice = $("input[name='localCarMonthTotalPrice']").val();    	   //本地车产总价（月供情况下）
		var localCarMonthPay = $("input[name='localCarMonthPay']").val();	                   //本地车产月供金额
		  
		var nonlocalcarType = $("input[name='nonlocalcarType']:checked").val();	                //外地车产类型（买断或者月供）
		var nonlocalCarMonthType = $("input[name='nonlocalCarMonthType']:checked").val();       //外地车产月供类型
        var nonlocalCarTotalPrice = $("input[name='nonlocalCarTotalPrice']").val();	            //外地车产总价（买断情况下）
	    var nonlocalCarMonthTotalPrice = $("input[name='nonlocalCarMonthTotalPrice']").val();	//外地车产总价（月供情况下）
		var nonlocalCarMonthPay = $("input[name='nonlocalCarMonthPay']").val();                 //外地车产月供金额

		fundHand = $("input[name='fundHand']:checked").val();	
		fundMonthPay = $("input[name='fundMonthPay']").val();	
	    age = $("input[name='age']").val();	
		
		
		//第一题
		if (current==1){
			if( $.isNumeric(age) == false || !(header.isInt.test(age))){
                $("#ageTip").html('<em class="err"></em>抱歉！请输入正确年龄');
				return false;
			}
			if(age == '' || age <18 || age > 65 || $.isNumeric(age) == false){
				$("#ageTip").html('<em class="err"></em>抱歉！18~65岁人士才可申请贷款哦~');
				return false;
			}		
			current=2;		
		}	
		//第二题
		else if(current==2){
			if( monthSalary == '' || monthSalary < 0 || monthSalary > 652000 || $.isNumeric(monthSalary) == false){
				$("#monthSalaryTip").html('<em class="err"></em>请输入正确的薪资，薪资范围0~652,000。如您需要贷款，请在有求必应首页注册账号，稍后会有专员为您提供专业信贷服务。');
				return false;
			}
			current=3;			
		}
		//第三题
		else if(current==3){
			var companyTypeLength = $("input[name='companyType']:checked").length;
			if(companyTypeLength <= 0){		
				$("#companyTypeTip").html('<em class="err"></em>请选择您所在公司类型');
				return false;
			}
			current=4;			
		}
		//第四题
		else if(current==4){
			var fundHandLength = $("input[name='fundHand']:checked").length;
			if(fundHandLength <= 0){		
				return false;
			}
			if(fundHand == "2" || fundHand == "3" || fundHand == "4"){
				if(fundMonthPay =="" || fundMonthPay < 0 || fundMonthPay > 652000  || $.isNumeric(fundMonthPay) == false){
			        $("#fundHandTip").html('<em class="err"></em>请出入您的真实公积金月缴金额，要不测试结果不准确哦~');
					return false;
				}
			}
			current=5;			
		}
		//第五题
		else if(current==5){
			var housePayTypeLength = $("input[name='housePayType']:checked").length;
			if(housePayTypeLength <= 0){		
				return false;
			}
			
			if(housePayType == 1){
				houseType = housePayType;
			}
			//本地房产
			else if(housePayType == 2){		
				if(typeof(localHouseType) == "undefined"){
					$("#localHouseTypeTip").html('<em class="err"></em>请选择本地房产类型');
					return false;
				}		
				//买断
				if(localHouseType == 21){			
					if( localHouseTotalPrice == '' || localHouseTotalPrice > 50000 || localHouseTotalPrice < 0  || $.isNumeric(localHouseTotalPrice) == false){
			            $("#localHouseTypeTip").html('<em class="err"></em>请输入您真实的房产价值/月供金额，要不测试结果不准确哦~');
						return false;
					}
					houseType = localHouseType;
					houseTotalPrice = localHouseTotalPrice;
				}
				//月供
				else if(localHouseType == 22){	
					if(typeof(localHouseMonthType) == "undefined"){
			            $("#localHouseTypeTip").html('<em class="err"></em>请选择本地房产月供类型');
						return false;
					}	
					if( localHouseMonthTotalPrice == '' || localHouseMonthTotalPrice > 50000 || localHouseMonthTotalPrice < 0  || $.isNumeric(localHouseMonthTotalPrice) == false ){
			            $("#localHouseTypeTip").html('<em class="err"></em>请输入您真实的房产价值/月供金额，要不测试结果不准确哦~');
						return false
					}
					if( localHouseMonthPay == '' || localHouseMonthPay > 1000000 || localHouseMonthPay < 0  || $.isNumeric(localHouseMonthPay) == false ){					
			            $("#localHouseTypeTip").html('<em class="err"></em>请输入您真实的房产价值/月供金额，要不测试结果不准确哦~');
						return false
					}
					houseType = localHouseMonthType;
					houseTotalPrice = localHouseMonthTotalPrice;
					houseMonthPay = localHouseMonthPay;
				}	
			}
			
			//外地房产
			else if(housePayType == 3){
				if(typeof(nonlocalHouseType) == "undefined"){
					
			        $("#nonlocalHouseTypeTip").html('<em class="err"></em>请选择外地房产类型');
					return false;
				}		
				//买断
				if(nonlocalHouseType == 31){			
					if( nonlocalHouseTotalPrice == '' || nonlocalHouseTotalPrice > 50000 || nonlocalHouseTotalPrice < 0  || $.isNumeric(nonlocalHouseTotalPrice) == false ){
						$("#nonlocalHouseTypeTip").html('<em class="err"></em>请输入您真实的房产价值/月供金额，要不测试结果不准确哦~');
						return false;
					}
					houseType = nonlocalHouseType;
					houseTotalPrice = nonlocalHouseTotalPrice;
				}
				//月供
				if(nonlocalHouseType == 32){	
					if(typeof(nonlocalHouseMonthType) == "undefined"){
						$("#nonlocalHouseTypeTip").html('<em class="err"></em>请选择外地房产月供类型');
						return false;
					}	
					if( nonlocalHouseMonthTotalPrice == '' || nonlocalHouseMonthTotalPrice > 50000 || nonlocalHouseMonthTotalPrice < 0  || $.isNumeric(nonlocalHouseMonthTotalPrice) == false  ){
						$("#nonlocalHouseTypeTip").html('<em class="err"></em>请输入您真实的房产价值/月供金额，要不测试结果不准确哦~');
						return false
					}
					if( nonlocalHouseMonthPay == '' || nonlocalHouseMonthPay > 1000000 || nonlocalHouseMonthPay < 0 || $.isNumeric(nonlocalHouseMonthPay) == false ){
						$("#nonlocalHouseTypeTip").html('<em class="err"></em>请输入您真实的房产价值/月供金额，要不测试结果不准确哦~');
						return false
					}
					houseType =  nonlocalHouseMonthType;
					houseTotalPrice = nonlocalHouseMonthTotalPrice;
					houseMonthPay = nonlocalHouseMonthPay;
				}	
			}
			current=6;			
		}
		//第六题
		else if(current==6){
			var carPayTypeLength = $("input[name='carPayType']:checked").length;
			if(carPayTypeLength <= 0){		
				return false;
			}
			 //验证车产类型
			if(carPayType == 1){
				carType = carPayType;
			}
			else if(carPayType == 2){		
				if(typeof(localCarType) == "undefined"){
					$("#carTip").html('<em class="err"></em>请选择本地车产类型');
					return false;
				}		
				//买断
				if(localCarType == 21){			
					if( localCarTotalPrice == '' || localCarTotalPrice > 50000 || localCarTotalPrice < 0  || $.isNumeric(localCarTotalPrice) == false){
						$("#carTip").html('<em class="err"></em>请输入您真实的的车产价值/月供金额，要不测试结果不准确哦~');
						return false;
					}
					carType = localCarType;
					carTotalPrice = localCarTotalPrice;
				}
				//月供
				else if(localCarType == 22){	
				    var localCarMonthType = $("input[name='localCarMonthType']:checked").val();
					if(typeof(localCarMonthType) == "undefined"){
						$("#carTip").html('<em class="err"></em>请选择本地车产月供类型');
						return false;
					}	
					if( localCarMonthTotalPrice == '' || localCarMonthTotalPrice > 50000 || localCarMonthTotalPrice < 0  || $.isNumeric(localCarMonthTotalPrice) == false ){
						$("#carTip").html('<em class="err"></em>请输入您真实的的车产价值/月供金额，要不测试结果不准确哦~');
						return false
					}
					if( localCarMonthPay == '' || localCarMonthPay > 1000000 || localCarMonthPay < 0  || $.isNumeric(localCarMonthPay) == false ){
						$("#carTip").html('<em class="err"></em>请输入您真实的的车产价值/月供金额，要不测试结果不准确哦~');
						return false
					}
					carType = localCarMonthType;
					carTotalPrice = localCarMonthTotalPrice;
					carMonthPay = localCarMonthPay;
				}	
			}
			
			//外地车产
			else if(carPayType == 3){
				var nonlocalcar = $("input[name='nonlocalcarType']:checked").val();
				if(typeof(nonlocalcar) == "undefined"){
					$("#carTip").html('<em class="err"></em>请选择外地车产类型');
					return false;
				}					
				//买断
				if(nonlocalcar == 31){			
					if( nonlocalCarTotalPrice == '' || nonlocalCarTotalPrice > 50000 || nonlocalCarTotalPrice < 0  || $.isNumeric(nonlocalCarTotalPrice) == false){
						$("#carTip").html('<em class="err"></em>请输入您真实的的车产价值/月供金额，要不测试结果不准确哦~');
						return false;
					}
					carType = nonlocalcar;
					carTotalPrice = nonlocalCarTotalPrice;
				}
				//月供
				if(nonlocalcar == 32){	
				    var nonlocalCarMonthLength = $("input[name='nonlocalCarMonthType']:checked").length;	
					var nonlocalCarMonthPay =  $("input[name='nonlocalCarMonthPay']").val();
					var nonlocalCarMonthTotalPrice =  $("input[name='nonlocalCarMonthTotalPrice']").val();
					if( nonlocalCarMonthLength <= 0){
						$("#carTip").html('<em class="err"></em>请选择异地车产月供类型');
						return false;
					}	
					if( nonlocalCarMonthTotalPrice == '' || nonlocalCarMonthTotalPrice > 50000 || nonlocalCarMonthTotalPrice < 0  || $.isNumeric(nonlocalCarMonthTotalPrice) == false){
						$("#carTip").html('<em class="err"></em>请输入您真实的的车产价值/月供金额，要不测试结果不准确哦~');
						return false
					}
					if( nonlocalCarMonthPay == '' || nonlocalCarMonthPay > 1000000 || nonlocalCarMonthPay < 0  || $.isNumeric(nonlocalCarMonthPay) == false){
						$("#carTip").html('<em class="err"></em>请输入您真实的的车产价值/月供金额，要不测试结果不准确哦~');
						return false
					}
					carType = nonlocalcar;
					carTotalPrice = nonlocalCarMonthTotalPrice;
					carMonthPay = nonlocalCarMonthPay;
				}	
			}
							
		}
			
		
		num++;
		$(".loan_CalculationConR").hide();
		$(".loan_CalculationConR").eq(num).show();
		if(num==6){
			$(".bdsharebuttonbox").show();
		}
		$(".loan_CalculationConL em").addClass("rot"+(num+1));
			
		$(function() {					
			$.ajax({
				url : ctx.web_domain+"/calculate/credit/next",
				type : "POST",
				dataType : "json",
				data : {
					"companyType":companyType, //公司类型     
					"age":age,                //年龄
					"monthSalary":monthSalary,  //月薪    
					"fundHand":fundHand,         //公积金缴纳   
					"fundMonthPay":fundMonthPay,     //每月上交公积金金额      
					"insuranceMonthPay":20,//每月上交社保金额
					"carPayType":carType,           //车产月供状态  
					"carMonthPay":carMonthPay,      //车贷月供金额
					"housePayType":houseType,       //房产月供情况   
					"houseMonthPay":houseMonthPay  //房贷月供金额
				},
				error : function(XMLHttpRequest, textStatus,
						errorThrown) {
				},
				success : function(money) {
					timer = setInterval(function (){
						mn++;
						if(mn>money){
							mn=money;
							clearInterval(timer);							
						}
						$(".loan_CalculationConL span").html("约"+mn+"万");
					},1);
					$("#result").html("约"+money+"万");
				}
			});
		});		
		
	})
	
	//了解更多下一步
	$(".loan_calNext2").click(function (){
			
		occupation = $("input[name='occupation']:checked").val();
		job = $("input[name='job']:checked").val();
		insuranceHand = $("input[name='insuranceHand']:checked").val();
		insuranceMonthPay = $("input[name='insuranceMonthPay']").val();
		salaryPayType = $("input[name='salaryPayType']:checked").val();
		monthQuery = $("input[name='monthQuery']:checked").val();
		otherLoan = $("input[name='otherLoan']:checked").val();			
		
		//验证社保月供金额
		if (insuranceHand == "2" || insuranceHand == "3" || insuranceHand == "4"){
			if ( insuranceMonthPay == "" || insuranceMonthPay < 80 || insuranceMonthPay > 652000  || $.isNumeric(insuranceMonthPay) == false){
				$("#insuranceMonthPayTip").html('请填写正确月供车产总价，应该在0-50000（万）之间');
				return false;
			}		
		}
		
		num++;
		$(".loan_CalculationConR").hide();
		$(".loan_CalculationConR").eq(num).show();
		$(".loan_CalculationConL em").addClass("rot"+(num+1));
		
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
            creditloanDoSubmit();
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
	     creditloan.curCount = creditloan.count;
		 var mobile = $("input[name='mobile']").val();
	     if(mobile == ''  || !(header.isMobilePhone.test(mobile))){
			 $(".loan_succ_tck2").stop();
			 tips('请输入正确手机号');
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
                     $('#getMobileCode').attr("disabled", true);
                     $("this").val(creditloan.curCount + "秒内输入");
                     creditloan.InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
					 creditloan.mobileCodeSended = true;
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
		},3000)	
	}
	
	//timer处理函数
    function SetRemainTime() {
		
		if (creditloan.curCount == 0) {                
			window.clearInterval(creditloan.InterValObj);//停止计时器
			$("#getMobileCode").removeAttr("disabled");//启用按钮
			$("#getMobileCode").val("重新发送");
			creditloan.curCount = ctx.messageAliveTime*60;
		}
		else {
			creditloan.curCount--;
			$("#getMobileCode").val(creditloan.curCount + "秒内输入");
		}
	}

    //提交测试题目
	function creditloanDoSubmit(){
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
		form.append($('<input type="text" name="companyType" value="'+companyType+'"/>') );  		
		form.append($('<input type="text" name="housePayType" value="'+houseType+'"/>') );  	
		form.append($('<input type="text" name="houseTotalPrice" value="'+houseTotalPrice+'"/>'));  
		form.append($('<input type="text" name="houseMonthPay" value="'+houseMonthPay+'"/>') );  		
		form.append($('<input type="text" name="carPayType" value="'+carType+'"/>') );  	
		form.append($('<input type="text" name="carTotalPrice" value="'+carTotalPrice+'"/>') );  
		form.append($('<input type="text" name="carMonthPay" value="'+carMonthPay+'"/>') );  		
		form.append($('<input type="text" name="monthSalary" value="'+monthSalary+'"/>') );  	
		form.append($('<input type="text" name="fundMonthPay" value="'+fundMonthPay+'"/>') );  
		form.append($('<input type="text" name="fundHand" value="'+fundHand+'"/>') );  
		form.append($('<input type="text" name="mobile" value="'+mobile+'"/>'));  
		
		// 提交表单  
		form.submit(); 
	}
	
	//提交form
	$('#submit').click(function(){  
		var mobile = $("input[name='mobile']").val();
		var mobileCode = $("input[name='mobileCode']").val();
		  
		if(mobile == ''  || !(header.isMobilePhone.test(mobile)) ){
			 $(".loan_succ_tck2").stop();
			 tips('请输入正确的手机号');
			 return false;
		}
		if(mobileCode.length != 6){
			 $(".loan_succ_tck2").stop();
			 tips('请输入正确的手机验证码');
			 return false;
		}			
		  
	    if(creditloan.mobileCodeSended){
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
					creditloan.mobileCodeCorrect = result;
				}
			})
            if(!creditloan.mobileCodeCorrect){
            	$(".loan_succ_tck2").stop();
			    tips('手机验证码错误');
				return false;
			}

		    creditloanDoSubmit();
			
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
})