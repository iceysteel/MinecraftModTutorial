function load(){
	for (i=1;i<document.getElementsByClassName("dir").length;i++){
		document.getElementsByClassName("dir")[i].style.display = "none";
	}
}

function next(n){
	document.getElementsByClassName("dir")[n-1].style.display = "none";
	document.getElementsByClassName("dir")[n].style.display = "block";
}

function previous(n){
	document.getElementsByClassName("dir")[n-1].style.display = "none";
	document.getElementsByClassName("dir")[n-2].style.display = "block";
}

function step1(){
	document.getElementsByClassName("dir")[document.getElementsByClassName("dir").length-1].style.display = "none";
	previous(2);
}