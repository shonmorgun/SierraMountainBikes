$(document).ready(function(){

  //At load set the username to empty and focus on it
  $("[name='password']").val('');
  $("[name='user']").val('');
  $("[name='user']").focus(); 

  //Toggle the signup form if the Sign In link is being pressed
  $('.message a').click(function(){
  	$('form').animate({height: "toggle", opacity: "toggle"}, "slow");
  });

  $("[value='Login']").click(function(e){
  	if($('#user').val().trim() == "") {
      e.preventDefault();
      $('#error').text("Enter Your Username");
      $('#user').focus();
    }
    else if($('#password').val().trim() == "") {
      e.preventDefault(); 
      $('#error').text("Enter Your Password");
      $('#password').focus();
    }         
    else
      return;
  });

  $("#user, #password").blur(function(){
    $('#error').text("");
  });

});

