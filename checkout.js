function customerInfo(){
	var cartArray = cart.getCartArray();
	var subtotal = 0;
	for(a=0; a<cartArray.length; a++) {
		var qty = parseInt(cartArray[a][1],10);
		var price = parseInt(cartArray[a][3],10);
		var totalItemPrice = qty * price;
		subtotal += totalItemPrice;
	}
	var items = cart.size();
	var word = "Item";
	if (items > 1) word = "Items";
	var shipping = 5;
	var taxRate = .08;
	var totalBeforeTax = subtotal + shipping;
	var taxCollected = totalBeforeTax * taxRate;
	var orderTotal = totalBeforeTax + taxCollected;
	var block="<table style='none' id='order_table'>\
	<caption style='font-size:22px'>Order Summary</caption>\
	<tr>\
	<th>"+word+"("+items+"):</th><th>$"+subtotal.toFixed(2)+"</th>\
	</tr>\
	<tr>\
	<th>Shipping:</th><th>$5.00</th>\
	</tr>\
	<tr>\
	<th>Total before tax:</th><th>$"+totalBeforeTax.toFixed(2)+"</th>\
	</tr>\
	<tr>\
	<th>State tax:</th><th>$"+taxCollected.toFixed(2)+"</th>\
	</tr>\
	<tr style='font-size:22px'>\
	<th>Order Total:</th><th>$"+orderTotal.toFixed(2)+"</th>\
	</tr>\
	</table>\
	<button id='place_order'>Place your order</button><br>\
	";

	$('#order_info').html(block);
	$('#customer_info').dialog({
		resizable: true,
		autoOpen:false,
		height:$(window).height()-300,
		width:$(window).width()-200,
		modal: true
	});
	$('#customer_info').parent().css({position:"fixed"}).end().dialog('open');

	$('#checkbox').change(function(){
		if(this.checked){
			$("[name='s_fullname']").val($("[name='fullname']").val());
			$("[name='s_address1']").val($("[name='address1']").val());
			$("[name='s_address2']").val($("[name='address2']").val());
			$("[name='s_city']").val($("[name='city']").val());
			$("[name='s_state']").val($("[name='state']").val());
			$("[name='s_zip']").val($("[name='zip']").val());
			$("[name='s_phone']").val($("[name='phone']").val());
		}
		else{
			$("[name='s_fullname']").val("");
			$("[name='s_address1']").val("");
			$("[name='s_address2']").val("");
			$("[name='s_city']").val("");
			$("[name='s_state']").val("");
			$("[name='s_zip']").val("");
			$("[name='s_phone']").val("");
		}
	});

	$('#place_order').click(function(){
		placeOrder();
	});
}

function placeOrder(){
	var date = "date="+$.datepicker.formatDate('mm/dd/yy', new Date());
	var cartArray = cart.getCartArray();
	for(a=0; a<cartArray.length; a++) {
		var sku = "sku="+ cartArray[a][0];
		var qty = "qty="+ parseInt(cartArray[a][1],10);
		var input = sku +"&" + qty + "&" + date;
		$.post("/jadrn032/servlet/RemoveInventory", input, function(response){
			if(response == -1){
				$('#customer_info').html("<p style='font-size:30px'>We are sorry. This product just ran out of stock</p>");
				$('#customer_info').css({"background":"url(http://jadran.sdsu.edu/~jadrn032/proj1/picpic/"+cartArray[a][0]+") center center no-repeat","background-size":"contain"});
			}
		});
		cart.delete(cartArray[a][0]);
	}
	$('#count').text(cart.size());
	showCart();

	confirmation();
}

function confirmation(){
	$('#customer_info').html("");
	$('#customer_info').css({"background":"url(/jadrn032/pic/confirm.jpg) center center no-repeat","background-size":"contain"});
	$('#customer_info').dialog({
		close: function(){location.replace("http://jadran.sdsu.edu/jadrn032/proj3.html")}
	});
	//window.setTimeout(function(){location.replace("http://jadran.sdsu.edu/jadrn032/proj3.html")}, 1600);
}