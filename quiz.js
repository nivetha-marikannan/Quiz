async function fetchQuizQuestions() {
    const APIUrl = 'https://opentdb.com/api.php?amount=10&category=19&difficulty=hard&type=multiple';
    try {
        const response = await fetch(APIUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        console.log('Fetched quiz questions:', data.results);
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

    const questions = await fetchQuizQuestions();
    loadFirstQuestion(questions);
});

function loadFirstQuestion(questions) {
    if (questions.length > 0) {
        document.getElementById('question').textContent = questions[0].question; 
    } else {
        document.getElementById('question').textContent = "No questions available."; 
    }
}
