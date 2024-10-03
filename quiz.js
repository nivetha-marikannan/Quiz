let currentQuestionIndex = 0;
let questions = [];
let correctAnswersCount = 0;
let incorrectAnswersCount = 0;
const totalMarks = 10;

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

function loadQuestion(index) {
    const question = questions[index];
    document.getElementById('question').textContent = question.question; 
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    const allOptions = [...question.incorrect_answers, question.correct_answer];
    allOptions.sort(() => Math.random() - 0.5); 
    allOptions.forEach(option => {
        const optionContainer = document.createElement('div');
        optionContainer.className = 'option'; 
        optionContainer.textContent = option; 
        optionContainer.addEventListener('click', function() {
            checkAnswer(option, question.correct_answer, optionContainer);
        });
        optionsContainer.appendChild(optionContainer);
    });
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.appendChild(optionsContainer);

    document.getElementById('next-btn').style.display = index < questions.length - 1 ? 'block' : 'none';
}

function checkAnswer(selectedOption, correctAnswer, optionElement) {
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
    const optionsContainer = document.querySelector('.options-container');
    if (optionsContainer) {
        optionsContainer.remove();
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion(currentQuestionIndex);
    } else {
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('completion-container').style.display = 'block';
    }
});

document.getElementById('view-results-btn').addEventListener('click', function() {
    document.getElementById('completion-container').style.display = 'none';
    document.getElementById('results-container').style.display = 'block';
    
    document.getElementById('correct-count').textContent = correctAnswersCount;
    document.getElementById('incorrect-count').textContent = incorrectAnswersCount;
    document.getElementById('score').textContent = correctAnswersCount;
    document.getElementById('total-marks').textContent = totalMarks;
});
