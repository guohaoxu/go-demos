
jr = {};

jr.search = function() {
	$("#pageNo").val("1");
	$('#myForm').attr("method", "get").submit();
};

jr.jumpPage = function(pageNo){
	$("#pageNo").val(pageNo);
	if($("#myForm").html()){
	   $("#myForm").submit();
	}
};