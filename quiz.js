let currentQuestionIndex = 0;
let questions = [];
let correctAnswersCount = 0;
let incorrectAnswersCount = 0;
const totalMarks = 10;
let timerInterval;
const timerDuration = 20;

async function fetchQuizQuestions() {
    const APIUrl = 'https://opentdb.com/api.php?amount=10&category=19&difficulty=hard&type=multiple';
    try {
        const response = await fetch(APIUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching the quiz questions:', error);
        return [];
    }
}

document.getElementById('start-btn').addEventListener('click', function() {
    document.getElementById('landing-container').style.display = 'none';
    document.getElementById('instructions-container').style.display = 'block';
    document.body.style.backgroundImage = 'none';
});

document.getElementById('begin-quiz-btn').addEventListener('click', async function() {
    document.getElementById('instructions-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';

    questions = await fetchQuizQuestions();
    loadQuestion(currentQuestionIndex);
});

function startTimer() {
    let timeLeft = timerDuration;
    document.getElementById('timer').textContent = `Time Left: ${timeLeft}s`;

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    incorrectAnswersCount++;
    moveToNextQuestion();
}

function loadQuestion(index) {
    clearInterval(timerInterval);
    startTimer();

    const question = questions[index];
    document.getElementById('question').textContent = question.question;

    const optionsContainer = document.getElementById('answers');
    optionsContainer.innerHTML = '';
    const allOptions = [...question.incorrect_answers, question.correct_answer];
    allOptions.sort(() => Math.random() - 0.5);

    allOptions.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.addEventListener('click', function() {
            checkAnswer(option, question.correct_answer, optionElement);
        });
        optionsContainer.appendChild(optionElement);
    });

    document.getElementById('next-btn').style.display = index < questions.length - 1 ? 'block' : 'none';
}

function checkAnswer(selectedOption, correctAnswer, optionElement) {
    clearInterval(timerInterval);

    const options = document.querySelectorAll('.option');

    if (selectedOption === correctAnswer) {
        optionElement.classList.add('correct');
        correctAnswersCount++;
    } else {
        optionElement.classList.add('incorrect');
        incorrectAnswersCount++;
        options.forEach(option => {
            if (option.textContent === correctAnswer) {
                option.classList.add('correct');
            }
        });
    }

    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });

    document.getElementById('next-btn').style.display = 'block';
}

document.getElementById('next-btn').addEventListener('click', function() {
    moveToNextQuestion();
});

function moveToNextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion(currentQuestionIndex);
    } else {
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('completion-container').style.display = 'block';
    }
}

document.getElementById('view-results-btn').addEventListener('click', function() {
    document.getElementById('completion-container').style.display = 'none';
    document.getElementById('results-container').style.display = 'block';

    document.getElementById('correct-count').textContent = correctAnswersCount;
    document.getElementById('incorrect-count').textContent = incorrectAnswersCount;
    document.getElementById('score').textContent = correctAnswersCount;
    document.getElementById('total-marks').textContent = totalMarks;
});
