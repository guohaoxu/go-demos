$(function(){
	 //产品管理删除按钮
    $(".czx_chanpinliebiao .del").click(function(){
    	$(".czx_chanpinliebiao ol").eq($(".czx_chanpinliebiao .del").index($(this))).remove();
    })
	//产品管理添加第一步的选择框
	$(".czx_select h4").click(function(e){
		e.stopPropagation();
		$(".czx_select ol").hide();
		$(".czx_select ol").eq($(".czx_select h4").index($(this))).show();
	})
	$(".czx_select li").click(function(e){
		e.stopPropagation()
		var ind = $(".czx_select ol").index($(this).parent());
		$(".czx_select h4").eq(ind).html($(this).html());
		$(".czx_select ol").hide();
	})
	//全选按钮
	$(".allBtn").change(function(){
		if($(".allBtn").prop("checked")){
			$(".czx_qyBtn input[type=checkbox]").prop("checked",true);
		}else{
			$(".czx_qyBtn input[type=checkbox]").prop("checked",false);
		}
	})
	$(".czx_qyBtn input[type=checkbox]").change(function(){
		$(".czx_qyBtn input[type=checkbox]").each(function(){
			
		})
	})
})