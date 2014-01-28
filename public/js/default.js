function mouseon(x){
	x.getElementsByTagName("div")[0].style.display="block";
}

function mouseout(x){
	x.getElementsByTagName("div")[0].style.display="none";
}

function descripon(x){
	x.getElementsByClassName("descrip").style.display="block";
}

function descripout(x){
	x.getElementsByClassName("descrip").style.display="none";
}

function showitems(x){
  var items = document.getElementsByClassName("items")[0].style.display;
  console.log(items);
  	if(items=="none" || !items)
		document.getElementsByClassName("items")[0].style.display="block";
  	else if(items=="block")
      	document.getElementsByClassName("items")[0].style.display="none"
    if (document.getElementsByClassName("selected")[0])
      document.getElementsByClassName("selected")[0].classList.remove("selected");
    x.classList.add("selected");
  	
        
}

function itemselect(x){
  	var img = x.getElementsByTagName("img")[0].src;
  	var alt = x.getElementsByTagName("img")[0].alt;
	document.getElementsByClassName("selected")[0].getElementsByTagName("img")[0].src=img;
  	document.getElementsByClassName("selected")[0].getElementsByTagName("input")[0].value=alt;
  console.log(alt);
}
/*function menuon(x){
  	x.classList.add("list_hover");
  	x.classList.remove("list");
  console.log(x);
}

function menuout(x){
  	x.classList.add("list");
  	x.classList.remove("list_hover");
}*/