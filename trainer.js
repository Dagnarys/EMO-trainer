const QUESTIONS = [
  { image: 'img/зелень.png', word: 'Зелень' },
  { image: 'img/тюмень.png', word: 'Тюмень' },
  { image: 'img/каток.png', word: 'Каток' },
  { image: 'img/каток2.png', word: 'Каток' },
  { image: 'img/ашан.png', word: 'Ашан' },
];

const QUESTIONS_COUNT = QUESTIONS.length;

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getQuestions() {
  return shuffleArray(QUESTIONS).slice(0, QUESTIONS_COUNT);
}

function saveProgress(questions, currentIndex, answers) {
  localStorage.setItem('trainer_questions', JSON.stringify(questions));
  localStorage.setItem('trainer_index', String(currentIndex));
  localStorage.setItem('trainer_answers', JSON.stringify(answers));
}

function loadProgress() {
  const questions = JSON.parse(localStorage.getItem('trainer_questions'));
  const index = Number(localStorage.getItem('trainer_index'));
  const answers = JSON.parse(localStorage.getItem('trainer_answers'));

  if (!questions || Number.isNaN(index) || !answers) {
    return null;
  }

  return { questions, index, answers };
}

function clearProgress() {
  localStorage.removeItem('trainer_questions');
  localStorage.removeItem('trainer_index');
  localStorage.removeItem('trainer_answers');
}

function initTrainer() {
  const progress = loadProgress();

  if (progress) {
    startTrainer(progress.questions, progress.index, progress.answers);
  } else {
    const questions = getQuestions();
    startTrainer(questions, 0, []);
  }
}

function startTrainer(questions, currentIndex, answers) {
  const input = document.querySelector('.input');
  const btn = document.querySelector('.btn-submit');
  const textInput = document.querySelector('.text-input');
  const image = document.querySelector('.header-image');

  if (!input || !btn || !textInput || !image) {
    return;
  }

  function showQuestion() {
    const question = questions[currentIndex];
    textInput.textContent = `Напечатай: ${question.word}`;
    image.src = question.image;
    input.value = '';
    btn.disabled = true;
    btn.classList.remove('active');

    document.querySelectorAll('.nav-btn').forEach((btn, index) => {
      btn.classList.toggle('active', index === currentIndex);
    });

    input.focus();
  }

  function highlightSidebarButton() {
    const activeBtn = document.querySelector('.nav-btn.active');
    if (activeBtn) {
      activeBtn.style.background = '#B480D3';
      activeBtn.style.borderColor = '#B480D3';
      activeBtn.style.color = '#fff';
    }
  }

  function saveAndNext() {
    const userAnswer = input.value.trim();
    if (!userAnswer) return;
    answers.push(userAnswer);

    highlightSidebarButton();

    const nextIndex = currentIndex + 1;

    if (nextIndex < questions.length) {
      currentIndex = nextIndex;
      saveProgress(questions, currentIndex, answers);
      showQuestion();
    } else {
      saveResults(questions, answers);
      window.location.href = 'result.html';
    }
  }

  btn.addEventListener('click', saveAndNext);

  input.addEventListener('input', () => {
    const isEmpty = input.value.trim() === '';
    btn.disabled = isEmpty;
    btn.classList.toggle('active', !isEmpty);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && input.value.trim() !== '') {
      saveAndNext();
    }
  });

  const restartBtn = document.querySelector('.restart-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      clearProgress();
      localStorage.removeItem('trainer_results');
      window.location.reload();
    });
  }

  showQuestion();
}

function saveResults(questions, answers) {
  localStorage.setItem('trainer_results', JSON.stringify({ questions, answers }));
}

function loadResults() {
  return JSON.parse(localStorage.getItem('trainer_results'));
}

function highlightVowels(text) {
    if (!text) return '';
    return text.replace(/([аеёиоуыэюя])/gi, '<span class="vowel-highlight">$1</span>');
}

function initResults() {
    const results = loadResults();

    if (!results) {
        window.location.href = 'index.html';
        return;
    }

    const headers = document.querySelectorAll('.result-table thead th');
    headers.forEach(header => {
        header.innerHTML = highlightVowels(header.textContent);
    });

    const { questions, answers } = results;
    const rows = document.querySelectorAll('.result-table tbody tr');

    rows.forEach((row, index) => {
        if (index < questions.length) {
            const question = questions[index];
            const userAnswer = answers[index] || '';
            const isCorrect = userAnswer.toLowerCase() === question.word.toLowerCase();

            row.querySelector('td:first-child').textContent = String(index + 1);

            const img = row.querySelector('.result-img');
            if (img) {
                img.src = question.image;
                img.alt = `Картинка ${index + 1}`;
            }

            const correctCell = row.querySelector('td:nth-child(3)');
            if (correctCell) {
                correctCell.innerHTML = highlightVowels(question.word);
            }

            const userCell = row.querySelector('.user-answer');
            if (userCell) {
                userCell.innerHTML = userAnswer ? highlightVowels(userAnswer) : '—';
            }

            const resultCell = row.querySelector('.result-icon');
            if (resultCell) {
                resultCell.innerHTML = isCorrect 
                    ? '<svg viewBox="0 0 71 68" fill="none" width="40" height="40"><path d="M29.538 65.452L1.685 26.2666C1.40163 25.868 1.44822 25.3228 1.79513 24.978L14.4429 12.4072C14.881 11.9718 15.6051 12.0337 15.963 12.5371L29.0503 30.9491C29.4448 31.5042 30.2667 31.5111 30.6705 30.9627L52.0672 1.90717C52.4022 1.45231 53.0471 1.36499 53.491 1.71439L68.4311 13.4752C68.856 13.8097 68.938 14.4213 68.6164 14.8559L31.1569 65.4675C30.7523 66.0141 29.932 66.0062 29.538 65.452Z" fill="#31A41C" stroke="black" stroke-width="3"/></svg>'
                    : '<svg viewBox="0 0 71 72" fill="none" width="40" height="40"><path d="M18.9592 36.7533L1.77439 54.8671C1.40133 55.2603 1.40947 55.8792 1.79275 56.2624L14.8785 69.3482C15.2762 69.7458 15.9233 69.7376 16.3106 69.3299L33.906 50.8084C34.29 50.4042 34.9303 50.3921 35.3294 50.7814L54.397 69.3839C54.7889 69.7663 55.4153 69.7624 55.8024 69.3753L68.8969 56.2808C69.2874 55.8903 69.2874 55.2571 68.8969 54.8666L50.8022 36.7719C50.4152 36.3849 50.4112 35.7586 50.7933 35.3667L68.9263 16.7688C69.3038 16.3816 69.3051 15.7645 68.9293 15.3757L55.8109 1.80498C55.4224 1.40312 54.78 1.39768 54.3848 1.79289L35.3111 20.8666C34.9206 21.2571 34.2874 21.2571 33.8969 20.8666L16.2863 3.256C15.9056 2.8753 15.2918 2.86435 14.8978 3.23122L1.83353 15.3945C1.43024 15.77 1.40668 16.4009 1.78085 16.8054L18.9679 35.386C19.3257 35.7729 19.3219 36.371 18.9592 36.7533Z" fill="#C30000" stroke="black" stroke-width="3"/></svg>';
                resultCell.style.color = isCorrect ? '#22c55e' : '#ef4444';
                resultCell.style.fontWeight = 'bold';
            }
        }
    });

    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', restartTrainer);
    }
}

function restartTrainer() {
  clearProgress();
  localStorage.removeItem('trainer_results');
  window.location.href = 'index.html';
}

if (window.location.pathname.endsWith('result.html') || document.querySelector('.result-table')) {
  document.addEventListener('DOMContentLoaded', initResults);
} else {
  document.addEventListener('DOMContentLoaded', initTrainer);
}
