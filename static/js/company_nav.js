
var navhidden = true;
function initNav() {
  $("#nav").hide();
  // handlers for nav selection
  $("#navleaders").off().on('click', function(e){
    togglePages("leaders");
  });
  $("#navcompanies").off().on('click', function(e){
    togglePages("companies");
  });
  $("#navdetails").off().on('click', function(e){
    togglePages("companydetails");
  });

  // attach event handler to nav icon
  $("#hamburger").off().on('click', function(e){
    let nav = $("#nav");
    if(navhidden){
      navhidden = false;
      nav.show(); 
    } else {
      navhidden = true;
      nav.hide(); 
    }
  });

  $("#leaders").mouseover(function(e){
     navhidden = true;
     $("#nav").hide();
  });
  $("#companies").mouseover(function(e){
     navhidden = true;
     $("#nav").hide();
  });
  togglePages("companies");
}

function togglePages(pagename){
  if(pagename == "leaders"){
    $("#leaders").show();
    $("#companies").hide();
    $("#companydetails").hide();
  } else if(pagename == "companies"){
    $("#leaders").hide();
    $("#companies").show();
    $("#companydetails").hide();
  } else if(pagename == "companydetails"){
    $("#leaders").hide();
    $("#companies").hide();
    $("#companydetails").show();
  }

}
//////////////////////////////////////////////////////////////
$( document ).ready(function() {
  initNav();
})

