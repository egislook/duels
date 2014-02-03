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

function timer(){
    var length = document.getElementsByClassName("time-left").length;
    var timeLeft=0;
    for(var i=0; i<length; i++){
        timeLeft = parseInt(document.getElementsByClassName("time-left")[i].textContent);
        timeChanger(timeLeft, i);
        timeLeft = 0;
    }
}

function timeChanger(t, i){
    t = t-1;
    var h = Math.floor(t / 3600);
    var m = Math.floor((t - (h * 3600)) / 60);
    var s = t - (h * 3600) - (m * 60);
    if (h   < 10) {h   = "0"+h;}
    if (m < 10) {m = "0"+m;}
    if (s < 10) {s = "0"+s;}
    document.getElementsByClassName("time-left")[i].innerHTML = h+":"+m+":"+s;
    if(t>0)
        setTimeout(function(){timeChanger(t, i)},1000);
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