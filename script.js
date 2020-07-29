// Main Screen Variables
const startScreen = document.querySelector('#startScreen');
const gameOverScreen = document.querySelector('#gameOverScreen');
const endScreen = document.querySelector('#endScreen');
const highScoresScreen = document.querySelector('#highScores');

// All elements with the class 'question' will be sorted into an array
const questions = document.getElementsByClassName('question');

// Input and Display Data
const timeDisplay = document.querySelector('#timeDisplaySpan');
const viewHighScores = document.querySelector('#viewHighScores');
const initialsInput = document.querySelector('#initialsInput');
const highScoresTable = document.querySelector('#highScoresTable');

// Button Variables
const startButton = document.querySelector('#startButton');
const tryAgainButton = document.querySelector('#tryAgainButton');
const submitButton = document.querySelector('#submitButton');
const goBackButton = document.querySelector('#goBack');
const clearHighScoresButton = document.querySelector('#clearHighScores');

// Default values for global variables
let secondsLeft = 75;
let finished = false;
let score;
let onQuestion;
let currentScreen = startScreen;

// Display proper secondsLeft variable 
timeDisplaySpan.textContent = secondsLeft;

// Clear the highScoresObj as a precaution
let highScoresObj = {}

// to avoid setting the highScoresObj to 'null', this check is put in place
if (JSON.parse(localStorage.getItem('highScores')) !== null) {
    // Sets the highScoresObj to the locally stored object
    highScoresObj = JSON.parse(localStorage.getItem('highScores'));
};

// toggle function declaration
function toggle(screenName) {

    // When either of these screens are toggled, finish the quiz and empty the input
    if (screenName === endScreen || screenName === highScoresScreen) {
        finished = true;
        initialsInput.value = ''
    }

    // When the start screen is toggled, reset the time display
    if (screenName === startScreen) {
        timeDisplay.textContent = '75';
    }

    // Checks if the screen is already displayed
    if (getComputedStyle(screenName).display === 'block' && screenName !== highScoresScreen) {
        console.log(screenName.id + ' is already displayed')
    } else if (getComputedStyle(screenName).display === 'none') {

        // hides all questions
        for (i = 0; i < questions.length; i++) {
            questions[i].style.display = 'none';
        }

        // hides all non-question screens
        startScreen.style.display = 'none';
        gameOverScreen.style.display = 'none';
        endScreen.style.display = 'none';
        highScoresScreen.style.display = 'none';

        // displays the toggled screen
        screenName.style.display = 'block';
        console.log('Displaying ' + screenName.id);
        currentScreen = screenName; // used for viewHighScores() functionality

    }

    // creates and displays the highScores table
    if (screenName === highScoresScreen) { // if the toggled screen is highScoresScreen

        /* 
            The next five groups of code sorts the highScoresObj key/value pairs by score
            The key/value pairs are also sorted from the top down
        */

            // sorts the scores in highScoresObj into an ordered array
            let highScoresArray = Object.values(highScoresObj).sort(function(a,b){
                return b-a;
            });

            // a function that returns a key,value pairs based on the given object and value
            let newObjFunc = (object, value) => {
                return Object.keys(object).find(key => object[key] === value)
            }

            // create an empty object
            let newObj = {};

            // for every score in highScoresArray
            highScoresArray.forEach(value => {
                // adds the return value of newObjFunc to newObj
                newObj[newObjFunc(highScoresObj, value)] = value;
            })
        
            // Copies newObj into highScoresObj
            highScoresObj = newObj;

        // sets the highScores item in local storage to the new, organized highScores object
        localStorage.setItem('highScores', JSON.stringify(highScoresObj));

        // clears the existing highScores table
        highScoresTable.innerHTML = ''

        // creates the new highScores table
        for (let key in highScoresObj) { // for every key in the highScores object
            
            // creates the necessary table row and table data elements
            let newRow = document.createElement('tr');
            let initialsData = document.createElement('td');
            let scoreData = document.createElement('td');

            // displays the initials in the proper cell
            initialsData.textContent = key;

            // displays the score in the proper cell
            scoreData.textContent = highScoresObj[key]

            // adds the table row and table data to the document
            highScoresTable.appendChild(newRow);
            newRow.appendChild(initialsData);
            newRow.appendChild(scoreData);
        }
    }
}

// timer function declaration
function startTimer() {
    // sets the secondsLeft to its default value
    secondsLeft = 75;
    // starts the timer
    timer = setInterval(function () {
        // checks if the quiz has finished
        if (finished === false) {
            // Prevents the timer from going below 0
            if (secondsLeft > 1) {
                secondsLeft--;
                timeDisplaySpan.textContent = secondsLeft;
            } else {
                secondsLeft--;
                // If the time goes below zero, it sets the time to zero
                if (secondsLeft < 0) {
                    secondsLeft = 0;
                }
                timeDisplaySpan.textContent = secondsLeft;
                // stops the timer
                clearInterval(timer);
                toggle(gameOverScreen); // game over man
            }
        } else {
            // If the quiz is finished, stop the timer
            clearInterval(timer);
            toggle(endScreen);
            score = secondsLeft; // sets the score to the time left
        };

    }, 1000)
}


// nextQuestion function declared
function nextQuestion(status) {

    // onQuestion is used to toggle the correct screen
    onQuestion++;

    // correctDisplay function declaration
    function correctDisplay() {

        // Displays 'correct' on the proper screen
        if (questions[onQuestion] !== undefined) { // checks if the questions exists

            // creates the 'correct' display
            let correctDisplayEl = document.createElement('h5');
            correctDisplayEl.textContent = 'Correct!'
            correctDisplayEl.setAttribute('class', 'correctDisplay');

            // adds the correct display to the question div
            questions[onQuestion].append(correctDisplayEl);

            // removes the correct display from the document after one second
            setTimeout(function () {
                document.querySelector('.correctDisplay').remove();
            }, 1000)

        } else { // if the question doesn't exist

            // creates the correct display
            let correctDisplayEl = document.createElement('h5');
            correctDisplayEl.textContent = 'Correct!';
            correctDisplayEl.setAttribute('class', 'correctDisplay');

            // adds the correct display to the end screen div
            endScreen.append(correctDisplayEl);

            // removes the correct display from the document after one second
            setTimeout(function () {
                document.querySelector('.correctDisplay').remove();
            }, 1000)

        }

    }

    // wrongDisplay function declared 
    function wrongDisplay() {

        // Displays 'correct' on the proper screen
        if (questions[onQuestion] !== undefined) { // checks if the questions exists

            // subtracts time from the clock based on how many questions there are
            secondsLeft = secondsLeft - Math.floor(75 / (questions.length - 1));

            // If the timer goes below zero, this corrects that
            if (secondsLeft < 0) {
                secondsLeft = 0;
            }

            // updates the time display
            timeDisplaySpan.textContent = secondsLeft;

            // creates the 'wrong' display
            let wrongDisplayEl = document.createElement('h5');
            wrongDisplayEl.textContent = 'Wrong!'
            wrongDisplayEl.setAttribute('class', 'wrongDisplay');

            // adds the 'wrong' display to the question div
            questions[onQuestion].append(wrongDisplayEl);

            // removes the 'wrong' display after one second
            setTimeout(function () {
                document.querySelector('.wrongDisplay').remove();
            }, 1000)

        } else { // if the question does not exist

            // subtracts time from the clock based on how many questions there are
            secondsLeft = secondsLeft - Math.floor(75 / (questions.length - 1));

            // If the timer goes below zero, this corrects that
            if (secondsLeft < 0) {
                secondsLeft = 0;
            }

            // updates the time display
            timeDisplaySpan.textContent = secondsLeft;

            // creates the 'wrong' display
            let wrongDisplayEl = document.createElement('h5');
            wrongDisplayEl.textContent = 'Wrong!'
            wrongDisplayEl.setAttribute('class', 'wrongDisplay');

            // adds the 'wrong' display to the end screen div
            endScreen.append(wrongDisplayEl);

            // removes the 'wrong' display after one second
            setTimeout(function () {
                document.querySelector('.wrongDisplay').remove();
            }, 1000)

        }

    }

    // status is the input given by the html buttons
    if (status === 'wrong') {
        wrongDisplay();
    } else if (status === 'correct') {
        correctDisplay();
    }

    // toggles proper screen
    if (questions[onQuestion] !== undefined) {
        toggle(questions[onQuestion]);
    } else if (questions[onQuestion] === undefined && secondsLeft !== 0) {
        toggle(endScreen)
    } else { // if the timer hits zero, you get sent to the game over screen, not the end screen
        toggle(gameOverScreen)
    }

}

// startQuiz function declared
function startQuiz() {
    // creates and updates the necessary variables
    let timer;
    finished = false;
    onQuestion = -1;

    // starts the timer
    startTimer();

    // goes to the next question
    nextQuestion();

};

// start button triggers startQuiz()
startButton.addEventListener('click', startQuiz);

// view high scores button triggers this function
viewHighScores.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();


    // Does not function if the user is not viewing one of these screens
    if (currentScreen.id === 'startScreen' || currentScreen.id === 'endScreen' || currentScreen.id === 'gameOverScreen') {
        toggle(highScores);
    }
});

// submit button triggers this function
submitButton.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    // If the user doesn't enter anything
    if (initialsInput.value === '') {
        // lets the user know they need to enter something
        let enterSomething = document.createElement('h5');
        enterSomething.textContent = 'Your initials cannot be blank!'
        enterSomething.setAttribute('class', 'correctDisplay');
        endScreen.append(enterSomething);
        setTimeout(function () {
            document.querySelector('.correctDisplay').remove();
        }, 1300)

        // break out of the function
        return;
    }

    // Disallows reusing initials
    if (highScoresObj[initialsInput.value] === undefined) { // if the entered intials don't exist

        // adds the users initials and score to the highScores object as a key,value pair
        highScoresObj[(initialsInput.value).toUpperCase()] = score;
        toggle(highScores);

    } else if (highScoresObj[initialsInput.value] !== undefined) { // if the entered intials already exist

        // let the user know they have already been claimed
        let differentName = document.createElement('h5');
        differentName.textContent = 'Those intials have already been claimed! Try entering a new one!'
        differentName.setAttribute('class', 'wrongDisplay');

        endScreen.append(differentName);

        setTimeout(function () {
            document.querySelector('.wrongDisplay').remove();
        }, 4000)

        // break out of the function
        return;
    }

});

// go back button triggers this function
goBackButton.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    // toggles the start screen and resets secondsLeft
    toggle(startScreen);
    secondsLeft = 75;
});

// try again button
tryAgainButton.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    // toggles the start screen and resets secondsLeft
    toggle(startScreen);
    secondsLeft = 75;
});

// clear high scores button triggers this function
clearHighScoresButton.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    // clears the local storage
    localStorage.clear();
    // clears the highScores object
    highScoresObj = {}
    // refreshes the highScores screen
    toggle(highScores);
});

