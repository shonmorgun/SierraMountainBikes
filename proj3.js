
var vendors = ["Select Brand", "Trek", "Specialized", "Cannondale", "Scott", "Yeti", "Kona"];
var categories = ["Select Category", "Overmountain", "Cross Country", "Trail", "XC Sport", "Gravity", "Fat Bike"];
var sku;
var category;
var vendor;
var model;
var description;
var features;
var cost;
var price;
var image;
window.qty;
var cart;

$(document).ready(function(){

	checkBrowser();

	$('body').height($(window).height());
	$('body').width($(window).width());

	cart = new shopping_cart("jadrn032");
	$('#count').text(cart.size());


	$('#bike').click(function(e){
		e.stopPropagation();
		$('#list').animate({height: "toggle", opacity: "toggle"}, "slow");
	});

	$('body').click(function(event){
		if ($('#list').is(":visible")) {
			$('#list').animate({height: "toggle", opacity: "toggle"}, "slow");
		}
		/*if ($('#cart_content').is(":visible") && !$(event.target).is('#checkout')) {
			$('#cart_content').animate({height: "toggle", opacity: "toggle"}, "slow");
		}*/
	});

	$('#logo').click(function(){
		$('#main').siblings().hide();
		$('#main').show();
		$('#products').hide();
	});

	$('#innovation').click(function(){
		$('#display_innovation').siblings().hide();
		$('#display_innovation').show();
		$('#products').hide();
	});

	$('#about').click(function(){
		$('#display_about').siblings().hide();
		$('#display_about').show();
		$('#products').hide();
	});

	$('#icon').click(function(e){
		e.stopPropagation();
		if ($('#cart_content').is(":visible")){
			$('#cart_content').animate({height: "toggle", opacity: "toggle"}, "slow");
		}
		else if(cart.size()!=0){
			$('#cart_content').animate({height: "toggle", opacity: "toggle"}, "slow");
			showCart();
			handleCart();
		}
	});


	$('*').click(function(){
		var name = $(this).attr('name');
		var first_char=name.charAt(0);
		var second_char=name.charAt(1);
		var input = "first_char="+first_char+"&second_char="+second_char;
		if(first_char=="a"){
			fetchData(input);
		}
		else if(first_char=="b"){
			fetchData(input);
		} 
		else if(first_char=="c"){
			fetchData(input);
		} 
	});

});

function fetchData (input) {
	$.post("/jadrn032/servlet/FetchData", input, function(response){
		if(response!=-1) populateData(response);
	});
}


//////////////////////POPULATING LIST OF PRODUCTS///////////////////
function populateData(raw_data){
	var string="<table style='width:100%'>";
	var i;
	var outside_data = raw_data.split("|");
	var outside_data_length = outside_data.length;
	for (i=0; i<outside_data_length; i++){
		if(i%2==0) string += "<tr>";
		var data = outside_data[i].split(",");
		resetData(data);
		string += "<td class='item' id='"+sku+"' name='" + sku + "' style='width:50%'>\
		<div class='frame'><img class='item_img' src='http://jadran.sdsu.edu/~jadrn032/proj1/picpic/"+sku+"'>\
		<span class='moreinfo'></span>\
		<div class='info'><div class='brand'>"+vendors[vendor]+": "+model+"</div>\
		<div class='price'>$"+price+"</div></div></td>";
		if(i%2!=0) string +="</tr>";
	}

	string+="</table>";
	$('#main').hide();
	$('#display_innovation').hide();
	$('#display_about').hide();
	$('#products').html(string);
	$('#products').slideDown("slow", "swing");

	handleProducts();
	

}

function handleProducts(){
	$('.item').hover(
		function(){
			var qty;
			var temp_sku = "sku="+ $(this).attr('id');
			$.get("/jadrn032/servlet/CheckInStock", temp_sku, function(response){
				qty=response;
				if(response==-1){
					$('.item').find(".moreinfo").css({"background":"url('/jadrn032/pic/coming_soon.png')", "background-size":"cover"});
				}
				else if(response==0){
					$('.item').find(".moreinfo").css({"background":"url('/jadrn032/pic/more.png')", "background-size":"cover"});
				}
				else{
					$('.item').find(".moreinfo").css({"background":"url('/jadrn032/pic/in_stock.png')", "background-size":"cover"});
				}
			});
			$(this).find(".moreinfo").stop().animate({opacity: 1},"slow");
			$(this).click(function(){
				fetchSKU(temp_sku,qty);
			});
		},
		function(){
			$(this).find(".moreinfo").stop().animate({opacity: 0},"fast");
		});
}


function checkBrowser(){
	if( navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ){
		$('#display_innovation').css({"background":"url(/jadrn032/pic/innovation_firefox.jpg)", "height":"855px"});
		$('#display_about').css({"background":"url(/jadrn032/pic/about_firefox.jpg)", "height":"855px"});
		$('#footer').css({"background":"url(/jadrn032/pic/footer_firefox.jpg)","height":"300px"});
	}

}

function fetchSKU(sku,qty){
	$.get("/jadrn032/servlet/FetchSKU", sku, function(response){
		var response_array = $.parseJSON(response);
		populateDialog(response_array[0],qty);
	});
}


///////////////// INSIDE DIALOG ////////////////////
function populateDialog(data,qty){
	resetData(data);
	var temp_sku = "sku="+ sku;
	var temp_qty="";

	if(qty>0){
		var i;
		for(i=1; i<=qty; i++){
			temp_qty +="<option value='"+i+"'>"+i+"</option>";
		}
	}
	var string = "<div class='row'>\
	<div class='col-sm-4'>\
	<div id='dialog_info'>\
	<div id='dialog_text'>\
	<p>"+vendors[vendor]+" - "+categories[category]+"</p>\
	<p>"+model+"</p><hr>\
	<p>Description:<br>"+description+"</p><hr>\
	<p>Features:<br>"+features+"</p><hr>\
	<p>Price: $"+price+"</p>\
	</div>\
	<div id='dialog_order'>\
	<select name='qty' id='qty'>"+temp_qty+"\
	</select>\
	<input type='submit' value='ADD TO CART' id='add_to_cart'>\
	</div>\
	</div>\
	</div>\
	<div class='col-sm-8' id='dialog_img_frame'>\
	<div id='dialog_img'></div>\
	<div id='dialog_status'></div>\
	<p id='error_message'>&nbsp</p>\
	</div>\
	</div>";
	$('#dialog').html(string);
	if(qty==-1){
		$('#dialog_status').css({"background":"url('/jadrn032/pic/dialog_coming_soon.png')", "background-size":"contain", "display":"inline"});
		$('#dialog_order').css("display","none");
	}
	else if(qty==0){
		$('#dialog_status').css({"background":"url('/jadrn032/pic/dialog_more_to_come.png')", "background-size":"contain","display":"inline"});
		$('#dialog_order').css("display","none");
	}
	else{
		$('#dialog_order').css("display","inline");
		$('#dialog_status').css("display","none");
	}
	$('#dialog_img').css({"background":"url(http://jadran.sdsu.edu/~jadrn032/proj1/picpic/"+sku+") center center no-repeat","background-size":"contain"});
	$('#dialog').dialog({
		resizable: false,
		autoOpen:false,
		height:600,
		width:1400,
		modal: true
	});
	$('#dialog').parent().css({position:"fixed"}).end().dialog('open');

	$('#add_to_cart').click(function(){
		addCart(sku,$('#qty').val(),qty,price);
		$('#dialog').dialog('close');
		if ($('#cart_content').is(":visible")) {
			showCart();
		}
	});
}

function addCart(sku,qty, limit, price){
	cart.add(sku, qty, limit, price);
	$('#count').text(cart.size());

}


function resetData(data){
	sku = data[0];
	category = data[1];
	vendor = data[2];
	model = data[3];
	description = data[4];
	features = data[5];
	cost = data[6];
	price = data[7];
	image = data[8];
}

function getQuantity(response){
	currentQuantity=parseInt(response,10);
	qty=currentQuantity;
}

function showCart(){
	var cartArray = cart.getCartArray();
	var total = 0;
	var shipping = 5;
	var taxRate = .08;
	var block = "<div id='checkout'>\
	<span id='subtotal'></span></br>\
	<button type='button' id='c_button'>CHECKOUT</button>\
	</div>\
	<ul id='c_ul' style='list-style: none;'>";

	for(a=0; a<cartArray.length; a++) {
		var sku = cartArray[a][0];
		var qty = parseInt(cartArray[a][1],10);
		var limit = parseInt(cartArray[a][2],10);
		var price = parseInt(cartArray[a][3],10);
		var totalItemPrice = qty * price;
		total += totalItemPrice;
		block +="<li class='list'>\
		<img src='http://jadran.sdsu.edu/~jadrn032/proj1/picpic/"+sku+"' alt='"+sku+"'></br>\
		<span>Price: $"+price+"/each</span></br>\
		<select name='"+sku+"' class='c_qty'>";
		for(b=1; b<=limit; b++){
			if(b==qty){
				block+="<option value='"+b+"' selected>"+b+"</option>";
			}
			else {
				block+="<option value='"+b+"'>"+b+"</option>";
			}
		}
		block +="</select>\
		<button type='button' class='c_delete' id='"+sku+"'>Delete</button>\
		</li>";	
	}
	block+="</ul>";
	if(total==0) shipping=0;
	var tax = (total+shipping)*taxRate;
	var finalPrice = total + tax + shipping;
	$('#cart_content').html(block);
	$('#subtotal').text("Subtotal: $"+total);
	handleCart();
}

function handleCart(){
	$('.c_qty').change(function(){
		var sku = $(this).attr('name');
		var qty = $(this).val();
		cart.setQuantity(sku,qty);
		$('#count').text(cart.size());
		showCart();
		handleCart();
	});
	$('.c_delete').click(function(){
		var sku = $(this).attr('id');
		cart.delete(sku);
		$('#count').text(cart.size());
		showCart();
		handleCart();
	});
	if(cart.size()==0){
		$('#cart_content').hide();
	}

	$('#c_button').click(function(){
		customerInfo();
	});

}