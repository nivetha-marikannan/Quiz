async function fetchQuizQuestions() {
    const APIUrl = 'https://opentdb.com/api.php?amount=10&category=19&difficulty=hard&type=multiple';';
    try {
        const response = await fetch(APIUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log(data.results); 
        return data.results; 
    } catch (error) {
        console.error('Error fetching the quiz questions:', error);
    }
}
fetchQuizQuestions();
