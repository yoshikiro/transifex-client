
var ACTIONS={
  rename:{
    url: '/_rename',
    text: 'Renamed'
  },
  modify_expr:{
    url: '/_modify_expr',
    text: 'Modified'
  }
}

var resID;

function pickUpResource(resourceName){
	
	var temp = resourceName.split("+");
	resID = temp[0];
	var username = temp[1];
	var password = temp[2];

	Data_for_resource_page = temp[0] + "***" + temp[1] + "***" + temp[2];
	window.open("http://localhost:5000/tx/resource/" + Data_for_resource_page, "_self", false)
;}

  /* Highlight rows */
  
$("input.rowcheckbox").click(function() { 
    $(this).parent().parent().toggleClass('highlight');
});

  /* AJAX: Modify resource */
 
$('.resname.edit').editable(ACTIONS["rename"].url, {
    id: 'elementid',
    style: 'display: inline',
    tooltip: 'Click to edit...',
    callback: function(value, settings) {
      /* Refresh the whole row with new resource IDs */
    location.reload();
	}
}, {  });

  /* AJAX: Modify resource expression */

$('.resexpr.edit').editable(function(value, settings) {
    var $this = $(this);

    $.ajax({
      type : "POST",
      cache : false,
      url: ACTIONS["modify_expr"].url,
      dataType: 'json',
      data: { 'res_id': $this.attr('data-id'),
              'value': value },
      success: function(data) {
        location.reload();
      }
    });
 	/* /ajax */

return value.replace('<lang>', '<span class="lang">&lt;lang&gt;</span>');
  }, {
    style: 'display: inline',
    tooltip: 'Click to edit...',
    data: function(value, settings) {
      return value.replace('<span class="lang">&lt;lang&gt;</span>', '<lang>');
    },
});

$(document).ready(function() {
	$('#pull').click(function(){
			
		var checkBox = document.getElementsByClassName("rowcheckbox");
		var flag=false;
		var resourceLink;
		var resArray =new Array();	
		for (var k=0; k<checkBox.length; k++)
		{	
			if(checkBox[k].checked){
				if(flag){
					resourceLink = resourceLink + "*//" + checkBox[k].name;
				}else{
					resourceLink = checkBox[k].name;
					flag=true;
				}	
			resArray.push(checkBox[k].name);
			}
		}

		$.ajax({
		type: "POST",
		url: "http://localhost:5000/tx/_pull",
		data: {
			"resources": resourceLink
		},
		beforeSend: function(){
			for(var d=0;d<resArray.length;d++){
				var temp = document.getElementById("zaab_" + resArray[d]);
				temp.innerHTML = "PENDING...";
				temp.setAttribute("class","label label-warning");	
			}  
      		},
		success: function(data){
			for(var d=0;d<resArray.length;d++){
				var temp = document.getElementById("zaab_" + resArray[d]);
				temp.innerHTML = "OK";
				temp.setAttribute("class","label label-success");
			}  
		}
		});
	});

	$('#push').click(function(){
	
		var checkBox = document.getElementsByClassName("rowcheckbox");
		var flag=false;
		var resourceLink;
		var resArray =new Array();	
		for (var k=0; k<checkBox.length; k++)
		{	
			if(checkBox[k].checked){
				if(flag){
					resourceLink = resourceLink + "*//" + checkBox[k].name;
				}else{
					resourceLink = checkBox[k].name;
					flag=true;
				}	
			resArray.push(checkBox[k].name);
			}
		}

		$.ajax({
		type: "POST",
		url: "http://localhost:5000/tx/_push",
		data: {
			"resources": resourceLink
		},
		beforeSend: function(){
			for(var d=0;d<resArray.length;d++){
				var temp = document.getElementById("zaab_" + resArray[d]);
				temp.innerHTML = "PENDING...";
				temp.setAttribute("class","label label-warning");	
			}  
      		},
		success: function(data){
			if(data=="success"){
				for(var d=0;d<resArray.length;d++){
					var temp = document.getElementById("zaab_" + resArray[d]);
					temp.innerHTML = "OK";
					temp.setAttribute("class","label label-success");
				}
			}else if(data=="failed"){
				for(var d=0;d<resArray.length;d++){
					var temp = document.getElementById("zaab_" + resArray[d]);
					temp.innerHTML = "FAILED";
					temp.setAttribute("class","label label-important");
				}
			}

		}
		});

	});

});


