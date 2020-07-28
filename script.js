const startScreen = document.querySelector('#startScreen')
const gameOverScreen = document.querySelector('#gameOverScreen')
const endScreen = document.querySelector('#endScreen')

// grab each question by using questions[i]
const questions = document.getElementsByClassName('question');

// variables for each question - testing purposes only
const questionOne = document.querySelector('#questionOneScreen')
const questionTwo = document.querySelector('#questionTwoScreen')
const questionThree = document.querySelector('#questionThreeScreen')
const questionFour = document.querySelector('#questionFourScreen')
const startButton = document.querySelector('#startButton')

const timeDisplay = document.querySelector('#timeDisplaySpan');
const viewHighScores = document.querySelector('#viewHighScores');
const initialsInput = document.querySelector('#initialsInput')
const highScoresScreen = document.querySelector('#highScores')
const highScoresTable = document.querySelector('#highScoresTable')

const tryAgainButton = document.querySelector('#tryAgainButton')
const submitButton = document.querySelector('#submitButton');
const goBackButton = document.querySelector('#goBack');
const clearHighScoresButton = document.querySelector('#clearHighScores')

let secondsLeft = 75;

timeDisplaySpan.textContent = secondsLeft;
let finished = false;
let score;
let onQuestion;
let currentScreen = startScreen;

let highScoresObj = {}

if (JSON.parse(localStorage.getItem('highScores')) !== null) {
    highScoresObj = JSON.parse(localStorage.getItem('highScores'));
};

function toggle(screenName) {


    if (screenName === endScreen || screenName === highScoresScreen) {
        finished = true;
        initialsInput.value = ''
    }

    if (screenName === startScreen) {
        timeDisplay.textContent = '75';
    }

    if (getComputedStyle(screenName).display === 'block' && screenName !== highScoresScreen) {
        console.log(screenName.id + ' is already displayed')
    } else if (getComputedStyle(screenName).display === 'none') {

        for (i = 0; i < questions.length; i++) {
            questions[i].style.display = 'none';
        }

        startScreen.style.display = 'none';
        gameOverScreen.style.display = 'none';
        endScreen.style.display = 'none';
        highScoresScreen.style.display = 'none';

        screenName.style.display = 'block';
        console.log('Displaying ' + screenName.id);
        currentScreen = screenName.id;

    }

    if (screenName === highScoresScreen) {
        localStorage.setItem('highScores', JSON.stringify(highScoresObj));

        highScoresTable.innerHTML = ''

        for (let key in highScoresObj) {
            let newRow = document.createElement('tr');
            let initialsData = document.createElement('td');
            let scoreData = document.createElement('td');

            initialsData.textContent = key;

            scoreData.textContent = highScoresObj[key]

            highScoresTable.appendChild(newRow);
            newRow.appendChild(initialsData);
            newRow.appendChild(scoreData);
        }
    }
}




function startTimer() {
    secondsLeft = 75;
    timer = setInterval(function () {
        if (finished === false) {
            if (secondsLeft > 1) {
                secondsLeft--;
                timeDisplaySpan.textContent = secondsLeft;
            } else {
                secondsLeft--;
                if (secondsLeft < 0) {
                    secondsLeft = 0;
                }
                timeDisplaySpan.textContent = secondsLeft;
                clearInterval(timer);
                toggle(gameOverScreen);
            }
        } else {
            clearInterval(timer);
            toggle(endScreen);
            score = secondsLeft;
        };

    }, 1000)
}


// Beginning of nextQuestion()
function nextQuestion(status) {

    onQuestion++;

    if (questions[onQuestion] !== undefined) {
        toggle(questions[onQuestion]);
    } else if (questions[onQuestion] === undefined) {
        toggle(endScreen)
    }


    // Beginning of correctDisplay()
    function correctDisplay() {

        if (questions[onQuestion] !== undefined) {

            console.log('correct');

            let correctDisplayEl = document.createElement('h5');
            correctDisplayEl.textContent = 'Correct!'
            correctDisplayEl.setAttribute('class', 'correctDisplay');

            questions[onQuestion].append(correctDisplayEl);

            setTimeout(function () {
                document.querySelector('.correctDisplay').remove();
            }, 1000)

        } else {

            console.log('correct');

            let correctDisplayEl = document.createElement('h5');
            correctDisplayEl.textContent = 'Correct!';
            correctDisplayEl.setAttribute('class', 'correctDisplay');

            endScreen.append(correctDisplayEl);

            setTimeout(function () {
                document.querySelector('.correctDisplay').remove();
            }, 1000)

        }

    }
    // End of correctDisplay();

    // Beginning of wrongDisplay();
    function wrongDisplay() {

        if (questions[onQuestion] !== undefined) {

            console.log('wrong');

            secondsLeft = secondsLeft - 10;

            if (secondsLeft < 0) {
                secondsLeft = 0;
            }

            timeDisplaySpan.textContent = secondsLeft;

            let wrongDisplayEl = document.createElement('h5');
            wrongDisplayEl.textContent = 'Wrong!'
            wrongDisplayEl.setAttribute('class', 'wrongDisplay');

            questions[onQuestion].append(wrongDisplayEl);

            setTimeout(function () {
                document.querySelector('.wrongDisplay').remove();
            }, 1000)

        } else {

            console.log('wrong');

            secondsLeft = secondsLeft - 10;

            timeDisplaySpan.textContent = secondsLeft;

            let wrongDisplayEl = document.createElement('h5');
            wrongDisplayEl.textContent = 'Wrong!'
            wrongDisplayEl.setAttribute('class', 'wrongDisplay');

            endScreen.append(wrongDisplayEl);

            setTimeout(function () {
                document.querySelector('.wrongDisplay').remove();
            }, 1000)

        }

    }
    // End of wrongDisplay();


    if (status === 'wrong') {
        wrongDisplay();
    } else if (status === 'correct') {
        correctDisplay();
    }

}
// End of nextQuestion;


function startQuiz() {
    let timer;
    finished = false;
    startTimer();

    onQuestion = -1;

    nextQuestion();

}

startButton.addEventListener('click', startQuiz)

viewHighScores.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    toggle(highScores)
})

submitButton.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (highScoresObj[initialsInput.value] === undefined) {
        highScoresObj[(initialsInput.value).toUpperCase()] = score;
        toggle(highScores);
    } else if (highScoresObj[initialsInput.value] !== undefined) {
        let differentName = document.createElement('h5');
        differentName.textContent = 'This name has already been claimed! Try entering a new one!'
        differentName.setAttribute('class', 'wrongDisplay');

        endScreen.append(differentName);

        setTimeout(function () {
            document.querySelector('.wrongDisplay').remove();
        }, 4000)
    }

})

goBackButton.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    toggle(startScreen);
    secondsLeft = 75;
})

tryAgainButton.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    toggle(startScreen);
    secondsLeft = 75;
})

clearHighScoresButton.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    localStorage.clear();
    highScoresObj = {}
    toggle(highScores);
})

