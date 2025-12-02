let currentLevel = 0;
let timer;
let timeLeft = 30;
let selectedOption = null;
let fiftyFiftyUsed = false;
let hintUsed = false;
let gameOver = false;
let currentQuestion = null;

const levels = [1000, 2000, 3000, 5000, 10000, 20000, 40000, 80000, 160000, 320000, 640000, 1250000, 2500000, 5000000, 70000000];

async function startGame() {
    currentLevel = 0;
    await loadQuestion();
    updateLadder();
}

async function loadQuestion() {
    currentQuestion = await generateQuestion(currentLevel);
    document.getElementById('question').textContent = currentQuestion.question;
    document.getElementById('A').textContent = currentQuestion.options[0];
    document.getElementById('B').textContent = currentQuestion.options[1];
    document.getElementById('C').textContent = currentQuestion.options[2];
    document.getElementById('D').textContent = currentQuestion.options[3];
    resetOptions();
    startTimer();
    document.getElementById('result').textContent = '';
    document.getElementById('link').style.display = 'none';
    document.getElementById('next').style.display = 'none';
}

function resetOptions() {
    const options = document.querySelectorAll('.option');
    options.forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
        opt.disabled = false;
    });
    selectedOption = null;
}

function selectOption(option) {
    if (gameOver) return;
    resetOptions();
    option.classList.add('selected');
    selectedOption = option.id;
}

function lockAnswer() {
    if (!selectedOption || gameOver) return;
    clearInterval(timer);
    const correct = currentQuestion.answer;
    const selected = document.getElementById(selectedOption);
    if (selectedOption === correct) {
        selected.classList.remove('selected');
        selected.classList.add('correct');
        document.getElementById('result').textContent = 'Correct!';
        document.getElementById('link').href = currentQuestion.link;
        document.getElementById('link').style.display = 'block';
        document.getElementById('next').style.display = 'block';
        // Celebrate with rupee rain for every correct answer
        const currentRupee = levels[currentLevel];
        createEmojiRain('₹');
        document.getElementById('result').textContent = `Correct! You won ₹${currentRupee.toLocaleString()}!`;
    } else {
        selected.classList.remove('selected');
        selected.classList.add('incorrect');
        document.getElementById(correct).classList.add('correct');
        const correctOptionText = currentQuestion.options[['A', 'B', 'C', 'D'].indexOf(correct)];
        document.getElementById('result').textContent = `Incorrect! The correct answer is ${correct}. ${correctOptionText}. Game Over.`;
        document.getElementById('link').href = currentQuestion.link;
        document.getElementById('link').style.display = 'block';
        gameOver = true;
        updatePerformance();
        // Show sad emoji for losing
        createEmojiRain('😢');
    }
}

async function nextQuestion() {
    currentLevel++;
    if (currentLevel < levels.length) {
        await loadQuestion();
        updateLadder();
    } else {
        document.getElementById('result').textContent = 'Congratulations! You won!';
        gameOver = true;
        updatePerformance();
    }
}

function startTimer() {
    timeLeft = 30;
    document.getElementById('timer').textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById('result').textContent = 'Time\'s up! Game Over.';
            gameOver = true;
            updatePerformance();
        }
    }, 1000);
}

function useFiftyFifty() {
    if (fiftyFiftyUsed || gameOver) return;
    fiftyFiftyUsed = true;
    document.getElementById('fifty-fifty').disabled = true;
    const correct = currentQuestion.answer;
    const options = ['A', 'B', 'C', 'D'].filter(opt => opt !== correct);
    const toRemove = options.sort(() => 0.5 - Math.random()).slice(0, 2);
    toRemove.forEach(opt => {
        document.getElementById(opt).disabled = true;
        document.getElementById(opt).textContent = '';
    });
}

function useHint() {
    if (hintUsed || gameOver) return;
    hintUsed = true;
    document.getElementById('hint').disabled = true;
    alert(currentQuestion.hint);
}

function speakQuestion() {
    const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
    // Try to set voice to Indian English if available
    const voices = speechSynthesis.getVoices();
    const indianVoice = voices.find(voice => voice.lang.includes('en-IN') || voice.name.includes('Indian'));
    if (indianVoice) utterance.voice = indianVoice;
    speechSynthesis.speak(utterance);
}

function updateLadder() {
    document.querySelectorAll('.amount').forEach((amt, index) => {
        amt.classList.remove('active');
        if (index === currentLevel) amt.classList.add('active');
    });
    updateCashDashboard();
}

function updateCashDashboard() {
    document.querySelectorAll('.cash-item').forEach((item, index) => {
        item.classList.remove('active');
        if (index === currentLevel) item.classList.add('active');
    });
}

function updatePerformance() {
    const today = new Date().toDateString();
    const week = getWeekStart();
    const month = new Date().getMonth() + '-' + new Date().getFullYear();
    let perf = JSON.parse(localStorage.getItem('kbcPerformance')) || { today: {}, week: {}, month: {}, total: 0 };
    perf.today[today] = (perf.today[today] || 0) + 1;
    perf.week[week] = (perf.week[week] || 0) + 1;
    perf.month[month] = (perf.month[month] || 0) + 1;
    perf.total++;
    localStorage.setItem('kbcPerformance', JSON.stringify(perf));
}

function getWeekStart() {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff)).toDateString();
}

function createEmojiRain(emoji) {
    const container = document.body;
    for (let i = 0; i < 50; i++) {
        const emojiElement = document.createElement('div');
        emojiElement.textContent = emoji;
        emojiElement.style.position = 'fixed';
        emojiElement.style.left = Math.random() * 100 + 'vw';
        emojiElement.style.top = '-10px';
        emojiElement.style.fontSize = '2rem';
        emojiElement.style.pointerEvents = 'none';
        emojiElement.style.zIndex = '1000';
        emojiElement.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        container.appendChild(emojiElement);
        setTimeout(() => {
            emojiElement.remove();
        }, 5000);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.option').forEach(opt => {
        opt.addEventListener('click', () => selectOption(opt));
    });
    document.getElementById('lock').addEventListener('click', lockAnswer);
    document.getElementById('next').addEventListener('click', nextQuestion);
    document.getElementById('fifty-fifty').addEventListener('click', useFiftyFifty);
    document.getElementById('hint').addEventListener('click', useHint);
    document.getElementById('voice').addEventListener('click', speakQuestion);
    startGame();
});
