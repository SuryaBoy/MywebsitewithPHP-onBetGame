
	// console.log(window.scrollX + document.querySelector('.window').getBoundingClientRect().left);
	// console.log(window.scrollX + document.querySelector('.track').getBoundingClientRect().right);
	console.log(window.innerWidth);
	var mywindow = {};
	const myframe = document.getElementById('scroll');
	mywindow.left = myframe.scrollLeft;
	mywindow.right = myframe.scrollLeft + myframe.offsetWidth;
	// console.log(mywindow);
	const bushes = document.getElementsByClassName('bush');
	// console.log(bushes.length);
	// for (i=0; i<bushes.length; i++) {
	// 	console.log(window.scrollX + bushes[i].getBoundingClientRect().left);
	// 	console.log(bushes[i].offsetWidth);
	// }
	const horses = document.getElementsByClassName('horse');
	// for (i=0; i< horses.length; i++) {
	// 	console.log(window.scrollX + horses[i].getBoundingClientRect().left)
	// }

// variables for game
	var horse1 = document.getElementById('horse1');
	var horse2 = document.getElementById('horse2');
	var horse3 = document.getElementById('horse3');
	var horse4 = document.getElementById('horse4');

	var scroller = document.getElementById('scroll');

	var finishLine = document.getElementById('finishline');

	var horseResult = document.getElementsByClassName('horseResult');

	// postion of horses respectively
	var position = [0,0,0,0];
	// speed of respectives horses
	var speed = [0,0,0,0];
	// constant speed the horses will run no matter what
	var const_speed=0.145;
	// maximum and minimum values for assinging random speed to horses
	var max=0.02;
	var min=0;

	var max1 , max2 , max3 , max4 ;

	var gameLooper;

	var frameRight = document.querySelector('.window').getBoundingClientRect().right;
	var backgroundScrollSpeed = 2;
	var trackRight = document.querySelector('.track').getBoundingClientRect().right;
	var initialTrackPosition = scroller.scrollLeft;
	const distanceInterval = (trackRight - scroller.scrollLeft)/7;
	assignNewSpeed();
	var cash = 100;
	var mostCashMade = 100;
	const betBoard = document.getElementById('bet');
	const genrModal = document.getElementById('generalModal');
	const askModal = document.getElementById('askModal');
	const modalHeadText = document.getElementById('modal-head-text');
	const modalBodyText = document.getElementById('modal-body-text');
	const modalFooterText = document.getElementById('modal-footer-text');
	const askModalHeadText = document.getElementById('ask-modal-head-text');
	const askModalBodyText = document.getElementById('ask-modal-body-text');
	const yesBtn = document.getElementById('yes-btn');
	const noBtn = document.getElementById('no-btn');
	var betOption = document.getElementById('amount');
	var betAmount = 0;
	var betHorse = document.getElementById('bethorse');
	var finalResult = [];
	var horseFinisherCount = 0;
	displayCash();
	var gallopSound = document.getElementById("gallop");
	var crowdSound = document.getElementById("crowd");
	// variables for game
	const startBtn = document.getElementById("start");

	if(window.innerWidth <= 512) {
		const_speed = 0.47;
		max=0.07;
	}
	else if(window.innerWidth < 768 && window.innerWidth > 512) {
		const_speed = 0.27;
		max=0.04;
	}
	window.onresize = resize;
	// When the user clicks on the start button, start the game
	startBtn.onclick = function() {
		if(checkInputs() == true) {
		  //disable the start button
		  startBtn.disabled = true;
			gameStart();
		}
	}

function resetGame() {
	// postion of horses respectively
	position = [0,0,0,0];
	// speed of respectives horses
	speed = [0,0,0,0];
	// constant speed the horses will run no matter what

	for (i=0; i< horses.length; i++) {
		horses[i].classList.remove('runRight');
		horses[i].style.left = 2+'vw';
	}
	clearInterval(gameLooper);
	scroller.scrollLeft = 0;
	initialTrackPosition = scroller.scrollLeft;
	finalResult = [];
	horseFinisherCount = 0;
	resetResultDisplay();
	inputEnable();
	assignNewSpeed();
	displayCash();
	// enable the start button
	startBtn.disabled = false;
}


function gameStart(){
	if(!bet()) {
		resetGame();
	} else {
		gallopSound.loop = true;
		crowdSound.currentTime = 0;
		crowdSound.loop = true;
		crowdSound.volume = 0.1;
		gameTrackSoundChange(true);
		// give the running effect when game starts by adding class runRight
		horse1.classList.add('runRight');
		horse2.classList.add('runRight');
		horse3.classList.add('runRight');
		horse4.classList.add('runRight');

		// for animation
		gameLooper = setInterval(frame, 8);

		function frame(){
				checkTrackScroll();
				for(i=0; i<position.length; i++) {
					position[i] = position[i] + const_speed + speed[i];
				}

				for (j=0; j<horses.length; j++) {
					var collision = false;
					for (i=0; i< bushes.length; i++) {
						x1 = window.scrollX + bushes[i].getBoundingClientRect().left;
						w1 = bushes[i].offsetWidth;
						x2 = window.scrollX + horses[j].getBoundingClientRect().left;
						w2 = horses[j].offsetWidth;
						if (collisionDetector(x1,w1,x2,w2)) {
							horseJump(horses[j]);
							collision = true;
						}
					}
					if (!collision) {
						horses[j].classList.remove('jump');
					}

					if (horses[j].getBoundingClientRect().left > finishLine.getBoundingClientRect().right) {
						if(horses[j].classList.contains('runRight')) {
							horses[j].classList.remove('runRight');
							horses[j].classList.add('finish');
							finalResult.push(j);
							horseFinisherCount++;
						}
					} else {
						horses[j].style.left = position[j] + 'vw' ;
					}

				}

			// for scrolling the background
			trackScroller();

			if(gameFinish()) {
				gameTrackSoundChange(false);
				clearInterval(gameLooper);
				resultDisplay();
				gameDirector();
			}

		}
	}

}

function horseJump(jumper){
	jumper.classList.add('jump');
}

// function to generate arpitrary random number
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function collisionDetector(x1,w1,x2,w2) {
	if(x1 < x2+w2 && x1+w1 > x2) {
		return true;
	}
	return false;
}

function gameFinish() {
	if(horseFinisherCount > 3) {
		return true;
	}
	else {
		return false;
	}
}

function trackScroller() {
	// if the track right position is not inside the frame then keep scrolling the track because the track is finished
	trackRight = document.querySelector('.track').getBoundingClientRect().right;
	if(frameRight < trackRight)
	{
		// for scrolling the background
		scroller.scrollLeft = scroller.scrollLeft + backgroundScrollSpeed;
	}
}

function checkTrackScroll() {
	var partialDist = scroller.scrollLeft - initialTrackPosition;
	if(partialDist >= distanceInterval) {
		assignNewSpeed();
		initialTrackPosition = scroller.scrollLeft;
	}
}

function assignNewSpeed() {
	for(i=0;i<speed.length;i++) {
		speed[i] = getRandomArbitrary(min, max);
	}
}

function displayCash() {
	document.getElementById('funds').innerHTML = cash;
}

function bet() {
	betAmount = betOption.options[betOption.selectedIndex].value;
	if(betAmount > cash) {
		addBorderAnim(betBoard);
		addBorderAnim(betOption);
		displayModal('Sorry', "But your bet is more then you have !! \<br\>Please lower the bet amount", "Thank You");
		return false;
	} else {
		cash = cash - betAmount;
		displayCash();
		inputDisable();
		return true;
	}
}

function inputDisable() {
	betOption.disabled = true;
	betHorse.disabled = true;
}

function inputEnable() {
	betOption.disabled = false;
	betHorse.disabled = false;
}

function resultDisplay() {
	for(i=0;i<finalResult.length;i++) {
		horseResult[i].classList.add('horse'+(finalResult[i]+1));
	}
}

function resetResultDisplay() {
	for(i=0;i<horseResult.length;i++) {
		horseResult[i].className = 'horseResult';
	}
}

function checkWinner() {
	if(betHorse.options[betHorse.selectedIndex].value == finalResult[0]) {
		return true;
	}
	return false;
}

function gameDirector() {
	if (checkWinner()) {
		cash = cash + (betAmount*2);
		mostCashMadeLog();
	}

	if (cash <= 0) {
		// alert('Too Bad!,You Lost All Your Money');
		confirmation("Hey There!!","Too Bad!,You Lost All Your Money</br>Want to Play Again",scoreCheck,scoreCheck);
		//score check ajax call
		//leaderboard display
		// displayLeaderBoard();
		// playAgain();
	}
	else if( cash >= 500) {
		// alert('We now declare you: \"The Luckiest Person in the Whole Planet\"');
		confirmation("Hey There!!","We now declare you:</br>\"The Luckiest Person in the Whole Planet\"</br>Want to Play Again",scoreCheck,scoreCheck);
		//score check ajax call
		//leaderboard display
		// displayLeaderBoard();
		// playAgain();
	}
	else {
		gameContinue();
	}
}

function gameContinue() {
	const goodMsg = "Wow Your Horse Won !!! \<br\> Start Next Race ?";
	const badMsg = "Bad bet you still have chance. \<br\> Start Next Race ?";
	var msg;
	if (checkWinner()) {
		msg = goodMsg;
	}
	else {
		msg = badMsg;
	}
	confirmation("Hello There", msg, resetGame,scoreCheck);
}

function playAgain() {
	confirmation("Hello There", "Want to Play Again", resetGameWithCash,scoreCheck);
}

function resetGameWithCash() {
	cash = 100;
	mostCashMade = 100;
	resetGame();
}

function gameTrackSoundChange(onOf) {
	if (onOf) {
		gallopSound.play();
		crowdSound.play();
	} else {
		gallopSound.pause();
		crowdSound.pause();	
	}
}

function checkInputs() {
	amt = betOption.options[betOption.selectedIndex].value;
	hrs = betHorse.options[betHorse.selectedIndex].value;
	if(amt == '' || hrs == '') {
		if(amt == '') {
			addBorderAnim(betOption);
		}
		if(hrs == '') {
			addBorderAnim(betHorse);
		}
		addBorderAnim(betBoard);
		displayModal('Excuse Me','Please place your bet first before starting the race !!! \<br\> Bet board is on the lower left corner', 'Thank You');
		return false;
	}
	removeBorderAnim(betOption);
	removeBorderAnim(betHorse);
	removeBorderAnim(betBoard);
	return true;
}

function addBorderAnim(ele) {
	ele.classList.add('borderanim');
}

function removeBorderAnim(ele) {
	ele.classList.remove('borderanim');
}

function displayModal(header='',body='',footer='') {
	modalHeadText.innerHTML = header;
	modalBodyText.innerHTML = body;
	modalFooterText.innerHTML = footer;
	genrModal.style.display = "block";
}

function confirmation(header='Confirm The Action',message='Are You Sure ?',callback1,callback2=resetGameWithCash) {
	askModalHeadText.innerHTML = header;
	askModalBodyText.innerHTML = message;
	askModal.style.display = "block";
	yesBtn.onclick = function() {
		callback1();
		askModal.style.display = "none";
	}
	noBtn.onclick = function() {
		askModal.style.display = "none";
		callback2();
		// scoreCheck();
		// displayLeaderBoard();
		// score check 
		// if score in top ten
		// give message your score is the top ten score
		// please write your name so that we can put you in the leader board
		// leader board display
	}
}

function resize() {
	if(window.innerWidth <= 512) {
		frameRight = document.querySelector('.window').getBoundingClientRect().right;
		const_speed = 0.47;
		max=0.07;
	}
	else if(window.innerWidth < 768 && window.innerWidth > 512) {
		frameRight = document.querySelector('.window').getBoundingClientRect().right;
		const_speed = 0.27;
		max=0.04;
	}
	else {
		frameRight = document.querySelector('.window').getBoundingClientRect().right;
		const_speed = 0.145;
		max=0.02;	
	}
}
// document.addEventListener('DOMContentLoaded', horseRun);

function displayLeaderBoard() {
	loadScore();
}

function loadScore() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     	let scores = JSON.parse(this.responseText).data;
     	let tableText ="<table class=\"leader\"><tr><th>Rank</th><th>Name</th><th>Time</th><th>Score</th></tr>";
     	let count = 0;
		for (let i in scores) {
		    // console.log(scores[i])
		    count++;
		    tableText = tableText + "<tr><td>"+count+"</td><td>"+ scores[i].name +"</td>"+"<td>"+ scores[i].time +"</td>"+"<td>"+ scores[i].score +"</td></tr>";
		}
		tableText = tableText + "</table>";
        displayModal(header="<b>Leader Board</b>", body=tableText, footer='You might want to have your name on top');
        // console.log(tableText);
    }
  };
  xhttp.open("GET", "./api/player/read.php", true);
  xhttp.send();
}

function scoreCheck() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     	let scores = JSON.parse(this.responseText).data;
		if(mostCashMade >= Number(scores[scores.length - 1].score)) {
			// alert("It seems you have made top 10 most amount of cash in the history of this game. Would you like to write your name in Leaderboard");
			// console.log(tableText);
			let bodyText = "It seems you have made top 10 most amount of cash in the history of this game. Would you like to write your name in Leaderboard";
			confirmation("Hello There !!", bodyText,displayFormModel);
		} else {
			resetGameWithCash();
			displayLeaderBoard();
		}
    }
  };
  xhttp.open("GET", "./api/player/read.php", true);
  xhttp.send();
}

function displayFormModel() {
	let formText = "<form id='nameForm'><label for='name'>Name:</label><input type='text' id='name' name='name' placeholder='enter name' required><br><input type='button' value='Submit' onclick='uploadScore()'></form>";
	displayModal(header="<b>Please Write Your Name</b>", body=formText, footer='Your name is being carved in the golden history of this game.');
}

function uploadScore() {
  	if(validityCheck()) {
		fetch("./api/player/create.php", {
		    method: 'post',
		    body: extractFormValues(),
		    headers: {
		        'Accept': 'application/json',
		        'Content-Type': 'application/json'
		    }
		}).then((response) => {
		    return response.json();
		}).then((resp) => {
			genrModal.style.display = "none";
		    // alert(JSON.stringify(resp.message));
		    // displayModal("Hello There !!",resp.message,"Congratultions!!");
		    confirmation(resp.message,"Would you like to view the Leaderboard",displayLeaderBoard);
		    resetGameWithCash();
		}).catch((error) => {
		    alert(error);
		})
  	}
	else {
		alert("Please Enter your name correctly");
	}
}

function mostCashMadeLog() {
	if (cash > mostCashMade) {
		mostCashMade = cash;
	}
}
//entered name check
function validityCheck() {
	if(document.getElementById("name").checkValidity()) {
		return true;
	}
	else {
		return false ;
	}
}
// extracting value from form
function extractFormValues() {
	let nam = document.getElementById("name").value;
	let player = {"name":nam,"score":mostCashMade};
	return (JSON.stringify(player));
}