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



//BEGIN SOCKET CODE

//HEY YOU! person who is trying to debug my code! check this out : http://socket.io/get-started/chat/
//also good luck lol

//socket global varible
var socket = io.connect();

//this stuff happens when the server sends the client something

/*
socket.on('connect', function () {
  $scope.setName();
});

socket.on('message', function (msg) {
  $scope.messages.push(msg);
  $scope.$apply();
});
*/


//this happens when our lovely user smashes that submit button
//we are sending the code to the server in this part
function submitCode(){
	socket.emit('code submit', editor.getValue());
	console.log("successfully sent code :)");
}