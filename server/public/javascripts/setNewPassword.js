
$(document).ready(function(){
  $('.pass_show').append('<span class="ptxt">Show</span>');

  function getUrlVars()
  {
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++)
      {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
      }
      return vars;
  }

  $('#ResetButton').click(function() {
      console.log('resetbutton click');
      var newPassword = $('#newPass').val()
      var newPasswordConf = $('#newPassConf').val()

      // console.log(currentPassword);
      // console.log(newPassword);
      // console.log(newPasswordConf);
      // console.log(url);
      queries = getUrlVars(url);
      // console.log(queries["token"]);
      // call the api
      if(newPassword === newPasswordConf){
        const body = {
          newPassword : newPassword,
          newPasswordConf : newPasswordConf,
          token : queries["token"] };
          console.log(body);
        $.post( "http://192.168.0.5:3001/users/resetPassword",body)
        .done(function(data){
          alert("password changed")
        })
        .fail(function(data){
          alert(data)
        });
      } else {
        alert("Password and confirm password do not match");
      }

  });

});

var url = $(location).attr('href');
console.log(url);
$(document).on('click','.pass_show .ptxt', function(){

$(this).text($(this).text() == "Show" ? "Hide" : "Show");

$(this).prev().attr('type', function(index, attr){return attr == 'password' ? 'text' : 'password'; });
});
