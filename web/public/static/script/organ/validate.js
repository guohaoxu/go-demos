$(function() {
		// 手机号码验证 
		jQuery.validator.addMethod("isMobile", function(value, element) {
			var length = value.length;
			var mobile = /^(130|131|132|133|134|135|136|137|138|139|150|151|152|153|155|156|157|158|159|180|185|186|187|188|189)\d{8}$/;
			return this.optional(element)
					|| (length == 11 && mobile.test(value));
		}, "请正确填写您的手机号码");
		// 真实姓名验证 
		jQuery.validator.addMethod("isRealName", function(value, element) {
			var length = value.length;
			var authRegExp = /^[A-Za-z\\u4e00-\\u9fa5]+$/;
			return this.optional(element)
					|| (authRegExp.test(value));
		}, "请正确填写您的真实姓名");
		//
		jQuery.validator.addMethod("isExistUsername", function(value, element) {  
				  var mobile = $("#mobile").val();   
				  return eval(
						  $.ajax({ 
				      url: ctx.web_domain+"/organization/checkuser", 
				      type: 'POST', 
				      async: false, 
				      dataType: "json",
				      data: {
				    	  mobile:mobile
				      } 
				  	}).responseText
				  ); 
		  
		     }, "该手机号码已经被注册！"); 
		
		//开始验证
		$("#orgUserForm").validate({
			 debug: false,
			/**设置验证规则 */
			rules : {
				'username' : {
					required : true,
					isMobile : true,
					isExistUsername:true
				},
				'password': {
					required: true,
					minlength: 5
				},
				'confirmPassword': {
					required: true,
					minlength: 5,
					equalTo: $("input[name='password']")
				},
				'organizationUserInfo.realname' : {
					required : true
				},
				'organizationUserInfo.organization.city' : {
					required : true
				},
				'organizationUserInfo.organization.id' : {
					required : true
				},
				'organizationUserInfo.businessTypeId' : {
					required : true
				},
				agree: "required"
				
			},

			/**设置错误信息 */
			messages : {
				"username" : {
					required : "请输入手机号码"
				},
				"password": {
					required: "请输入密码",
					minlength: "密码长度至少5个字符"
				},
				"confirmPassword": {
					required: "请输入确认密码",
					minlength: "确认密码长度至少5个字符",
					equalTo: "确认密码不一致"
				},
				"organizationUserInfo.realname" : {
					required : "请输入真实姓名"
				},
				"organizationUserInfo.organization.city" : {
					required : "请选择城市"
				},
				"organizationUserInfo.organization.id" : {
					required : "请选择机构"
				},
				'organizationUserInfo.businessTypeId' : {
					required : "请选择贷款类型"
				},
				agree: "请勾选同意协议"
			},
			errorPlacement: function(error, element) {
			    if ( element.is(":radio") ){
			    	 error.appendTo( element.parent());
			    	}
			    else if ( element.is(":checkbox") ){
			    	error.appendTo( element.parent());
				    }
			    else
			        error.appendTo(  element.parent());
			        
				}

		});
		
		$(".czx_tjjgBtn").click(function(){
			var orgnName=$("#orgnName").val();
			var orgnType=$('input[name="orgnType.id"]:checked').val();
			if(!orgnName){
				alert("机构名称不能为空");
				return;
			}
			var val=$('input:radio[name="orgnType.id"]:checked').val();
			if(val == undefined){
				alert("请输选择机构类型");
				return;
			}
			if ($('#city').val() === "") {
				alert("请输选择机构所在省市");
				return;
			}
			$.ajax({
				url :ctx.web_domain + "/organization/create",
				type : "post",
				dataType : "json",
				data : {
					"orgnName" : orgnName,
					"orgnTypeId" : orgnType,
					"province" : $('#province').val(),
					"city" : $('#city').val()
				},
				success : function(orgId) {
					$("#orgnId").attr("value",orgId);
					var opt = document.createElement("option");
				    opt.text = orgnName;
				    opt.value = orgId;
				    $('#orgnId')[0].options.add(opt);
					$("#orgnId").val(orgId)
					//关闭当前框
					$(".touming").hide();
					select3();
				}
			});	
			
		});

		//初始化省份下拉框数据
		for(var p in provinces){
	        var opt=document.createElement("option");
	        opt.text=p;
	        opt.value=p;
	        if($('#province'))
	        {
	            $('#province')[0].options.add(opt);
	        }
	    }
		
		$('#province').change(function(){
			changeCity();
		});
		$('#city').change(function(){
			changeOrgnName();
		});

		$('#selectOrgnName').change(function(){
			selectJiGou();
		});
		
	});

	//根据省份选择其下的所有城市
	function changeCity(){
	    $("#city").empty();
		$("#orgnId").empty();
	    var opt=document.createElement("option");
	    opt.text="--城市--";
	    opt.value="";
		var optCity=document.createElement("option");
	    optCity.text="--请选择机构--";
	    optCity.value="";
		$('#city')[0].options.add(opt);
	    $('#orgnId')[0].options.add(optCity);
	    var selectProvince=$('#province').val();
	    if(selectProvince){
	        var citys=provinces[selectProvince];
	        $.each(citys, function(index,name){
	            var option=document.createElement("option");
	            option.text=name;
	            option.value=name;
	            $('#city')[0].options.add(option);
	        
	        });
	        if($('#city')[0].options.length==2)
	        {
	            $('#city')[0].selectedIndex=1;
	        }
	    }
	}
	
	//根据选择的城市筛选其下的所有机构
	function changeOrgnName(){
		var city = $("#city").val();
		$.ajax({
				url :ctx.web_domain + "/organization/queryOrganization",
				type : "post",
				dataType : "json",
				data : {
					"city" : city
				},
				success : function(data) {
				if(data!=null){
					$("#orgnId").empty();
					var opt=document.createElement("option");
					opt.text="--请选择机构--";
					opt.value="";
					$('#orgnId')[0].options.add(opt);
					$.each(data, function(index,organization){
						var option=document.createElement("option");
						option.text=organization.orgnName;
						option.value=organization.id;
						$('#orgnId')[0].options.add(option);
					})
				 }
				}
	        });
		}	

	function selectJiGou(){
		var selectProvince=$('#selectOrgnName').val();
		$("#orgId").attr("value",selectProvince);
	}
	