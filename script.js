const startScreen = document.querySelector('#startScreen')
const endScreen = document.querySelector('#endScreen')

// grab each question by using questions[i]
const questions = document.getElementsByClassName('question');

// variables for each question - testing purposes only
const questionOne = document.querySelector('#questionOneScreen')
const questionTwo = document.querySelector('#questionTwoScreen')
const questionThree = document.querySelector('#questionThreeScreen')
const startButton = document.querySelector('#startButton')

const timeDisplay = document.querySelector('#timeDisplaySpan');
const viewHighScores = document.querySelector('#viewHighScores');
const initialsInput = document.querySelector('#initialsInput')
const highScores = document.querySelector('#highScores')
const highScoresTable = document.querySelector('#highScoresTable')

const submitButton = document.querySelector('#submitButton');
const goBackButton = document.querySelector('#goBack');
const clearHighScoresButton = document.querySelector('#clearHighScores')

let secondsLeft = 75;

timeDisplaySpan.textContent = secondsLeft;
let finished = false;
let score;
let onQuestion;
let currentScreen = startScreen;

function toggle(screenName) {


    if (screenName === endScreen || screenName === highScores) {
        finished = true;
    }

    if (getComputedStyle(screenName).display === 'block' && screenName !== highScores) {
        console.log(screenName.id + ' is already displayed')
    } else if (getComputedStyle(screenName).display === 'none') {

        for (i = 0; i < questions.length; i++) {
            questions[i].style.display = 'none';
        }

        startScreen.style.display = 'none';
        endScreen.style.display = 'none';
        highScores.style.display = 'none';

        screenName.style.display = 'block';
        console.log('Displaying ' + screenName.id);
        currentScreen = screenName.id;

    }

    if (localStorage.key(0) !== null) {
        if (screenName === highScores) {
            highScoresTable.innerHTML =
                '<tr> <td>' + localStorage.key(0) + '</td><td>' + localStorage.getItem('NK') + '</td> </tr>'
        }
    } else {
        if (screenName === highScores) {
            highScoresTable.innerHTML = ''
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
                timeDisplaySpan.textContent = secondsLeft;
                clearInterval(timer);
                toggle(endScreen);
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

            let wrongDisplayEl = document.createElement('h5');
            wrongDisplayEl.textContent = 'Wrong!'
            wrongDisplayEl.setAttribute('class', 'wrongDisplay');

            questions[onQuestion].append(wrongDisplayEl);

            setTimeout(function () {
                document.querySelector('.wrongDisplay').remove();
            }, 1000)

        } else {

            console.log('wrong');

            let wrongDisplayEl = document.createElement('h5');
            wrongDisplayEl.textContent = 'Wrong!'
            wrongDisplayEl.setAttribute('class', 'wrongDisplay');

            endScreen.append(wrongDisplayEl);

            setTimeout(function () {
                document.querySelector('.wrongDisplay').remove();
            }, 1000)

        }

    }

    if (status === 'wrong') {
        wrongDisplay();
    } else if (status === 'correct') {
        correctDisplay();
    }

    // End of wrongDisplay();


    // if (questions[onQuestion] !== undefined) {

    //     let buttons = questions[onQuestion].getElementsByClassName('option');

    //     for (b = 0; b < buttons.length; b++) {
    //         buttons[b].addEventListener('click', function (event) {
    //             event.stopPropagation();
    //             if (event.target.classList.contains('correct')) {
    //                 correctDisplay();
    //             } else if (event.target.classList.contains('wrong')) {
    //                 wrongDisplay();
    //             }
    //         })
    //         if (questions[onQuestion + 1] !== undefined) {
    //             buttons[b].addEventListener('click', nextQuestion)
    //         } else {
    //             buttons[b].addEventListener('click', function () {
    //                 toggle(endScreen);
    //             })
    //         }
    //     };
    // };
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
    localStorage.setItem(initialsInput.value, score)
    toggle(highScores);
})

goBackButton.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    toggle(startScreen);
    secondsLeft = 75;
})

clearHighScoresButton.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    localStorage.clear();
    toggle(highScores);
})

