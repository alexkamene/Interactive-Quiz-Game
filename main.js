const quizData = [
    { question: "What is the capital of France?", choices: ["Berlin", "Madrid", "Paris", "Lisbon"], correct: "Paris" },
    { question: "Who wrote 'To Kill a Mockingbird'?", choices: ["Harper Lee", "F. Scott Fitzgerald", "Jane Austen", "Mark Twain"], correct: "Harper Lee" },
    { question: "What is the largest planet in our solar system?", choices: ["Earth", "Mars", "Jupiter", "Saturn"], correct: "Jupiter" },
    { question: "What year did the Titanic sink?", choices: ["1912", "1905", "1898", "1920"], correct: "1912" },
    { question: "What is the chemical symbol for water?", choices: ["H2O", "CO2", "O2", "NaCl"], correct: "H2O" },
    { question: "Who painted the Mona Lisa?", choices: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"], correct: "Leonardo da Vinci" },
    { question: "Which element has the atomic number 1?", choices: ["Helium", "Oxygen", "Hydrogen", "Carbon"], correct: "Hydrogen" },
    { question: "What is the smallest prime number?", choices: ["0", "1", "2", "3"], correct: "2" },
    { question: "In which year did World War II end?", choices: ["1945", "1939", "1918", "1941"], correct: "1945" },
    { question: "Which planet is known as the Red Planet?", choices: ["Mars", "Venus", "Mercury", "Jupiter"], correct: "Mars" },
    { question: "What is the capital city of Japan?", choices: ["Beijing", "Seoul", "Tokyo", "Bangkok"], correct: "Tokyo" },
    { question: "Who discovered penicillin?", choices: ["Alexander Fleming", "Marie Curie", "Isaac Newton", "Albert Einstein"], correct: "Alexander Fleming" },
    { question: "Which is the longest river in the world?", choices: ["Nile", "Amazon", "Yangtze", "Mississippi"], correct: "Nile" },
    { question: "What is the hardest natural substance on Earth?", choices: ["Gold", "Iron", "Diamond", "Granite"], correct: "Diamond" },
    { question: "Who was the first person to walk on the Moon?", choices: ["Yuri Gagarin", "Buzz Aldrin", "Neil Armstrong", "Michael Collins"], correct: "Neil Armstrong" },
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 15;
let timer;
let incorrectAnswers = [];

const questionElement = document.getElementById("question");
const choicesElement = document.getElementById("choices");
const nextButton = document.getElementById("next-btn");
const scoreContainer = document.getElementById("score-container");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("time");
const timeDisplay = document.getElementById("timer");
const reviewContainer = document.createElement("div");

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffle(quizData);  // Shuffle questions for randomness

function loadQuestion() {
    clearInterval(timer);
    timer = setInterval(countDown, 1000);
    timeLeft = 15;
    timerElement.textContent = timeLeft;

    const currentQuizData = quizData[currentQuestion];
    questionElement.textContent = currentQuizData.question;
    choicesElement.innerHTML = "";

    currentQuizData.choices.forEach(choice => {
        const li = document.createElement("li");
        li.textContent = choice;
        li.addEventListener("click", selectAnswer);
        choicesElement.appendChild(li);
    });
}

function selectAnswer(event) {
    const selectedChoice = event.target;
    const selectedAnswer = selectedChoice.textContent;
    const correctAnswer = quizData[currentQuestion].correct;

    if (selectedAnswer === correctAnswer) {
        selectedChoice.style.backgroundColor = "lightgreen";
        score += 10;  // Award 10 points for each correct answer
    } else {
        selectedChoice.style.backgroundColor = "lightcoral";
        incorrectAnswers.push({
            question: quizData[currentQuestion].question,
            correctAnswer: correctAnswer,
            selectedAnswer: selectedAnswer
        });
    }

    clearInterval(timer);  // Stop the timer when an answer is selected
    nextButton.style.display = "block";
}

function nextQuestion() {
    currentQuestion++;
    nextButton.style.display = "none";

    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        clearInterval(timer);
        showScore();
    }
}

function countDown() {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(timer);
        alert("Time's up! You need to restart the quiz.");
        restartQuiz();
    }
}

function showScore() {
    document.getElementById("quiz").classList.add("hide");
    scoreContainer.classList.remove("hide");
    scoreElement.textContent = `Your score: ${score}`;

    const message = score >= quizData.length * 5 
        ? "Congratulations! You did a great job!" 
        : "You missed some questions. Click below to review the correct answers.";
    
    scoreContainer.innerHTML += `<p>${message}</p>`;


    if (score < quizData.length * 5) {
        timeDisplay.classList.add("hide");
        const reviewButton = document.createElement("button");
        reviewButton.textContent = "Review Answers";
        reviewButton.addEventListener("click", showReview);
        scoreContainer.appendChild(reviewButton);
    }
}

function showReview() {
    scoreContainer.classList.add("hide");
    reviewContainer.innerHTML = "<h2>Review Your Answers</h2>";
    incorrectAnswers.forEach(item => {
        const reviewItem = document.createElement("div");
        reviewItem.innerHTML = `<p><strong>Question:</strong> ${item.question}</p>
                                <p><strong>Your Answer:</strong> ${item.selectedAnswer}</p>
                                <p><strong>Correct Answer:</strong> ${item.correctAnswer}</p>
                                <hr>`;
        reviewContainer.appendChild(reviewItem);
    });

    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart Quiz";
    restartButton.addEventListener("click", restartQuiz);
    reviewContainer.appendChild(restartButton);

    document.body.appendChild(reviewContainer);
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    incorrectAnswers = [];
    shuffle(quizData);  // Shuffle questions again for a new attempt
    scoreContainer.classList.add("hide");
    reviewContainer.innerHTML = "";
    document.getElementById("quiz").classList.remove("hide");
    loadQuestion();
}

nextButton.addEventListener("click", nextQuestion);
document.getElementById("restart-btn").addEventListener("click", restartQuiz);

loadQuestion();
