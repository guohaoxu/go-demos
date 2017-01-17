var areaSel = {};
areaSel.data = undefined;
areaSel.render = function(data) {
	this.data = data;
	$.each(this.data, function(index, node){
		if (node.fatherId == 0) {
			 var option = document.createElement("option");
			 option.text = node.name;
			 option.value = node.id;
			 $("#province")[0].options.add(option);
		}
	});
	$('#province').change(function(node){
		areaSel.changeCity(this.value);
	});
}
areaSel.changeCity = function(provinceId, cityId) {
	$("#city").empty();
	var opt = document.createElement("option");
	opt.text = "--城市--";
	opt.value = "0";
	$('#city')[0].options.add(opt);
	$.each(this.data, function(index, node){
		if (node.fatherId == provinceId) {
			 var option = document.createElement("option");
			 option.text = node.name;
			 option.value = node.id;
			 $("#city")[0].options.add(option);
		}
	});
	$('#city')[0].selectedIndex = 1;
}