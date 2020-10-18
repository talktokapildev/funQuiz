const question = document.getElementById('question');
const questionImage = document.getElementById('question_img');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const choiceImages = Array.from(document.getElementsByClassName('choice-image'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let answersGiven = 0;

let questions = [];

// fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple')
//   .then((res) => {
//     return res.json();
//   })

fetch('Qn.json')
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    // console.log(loadedQuestions);
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.question,
        questionImageUrl: loadedQuestion.questionImageUrl,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
      answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

      answerChoices.forEach((choice, index) => {
        formattedQuestion['choice' + (index + 1)] = choice.value;
        formattedQuestion['choice' + (index + 1) + '_image'] = choice.image;
        //formattedQuestion['choice' + (index + 1) + '_textDisplay'] = choice.textDisplay;
      });

      return formattedQuestion;
    });

    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

//CONSTANTS
const CORRECT_BONUS = 1;
const MAX_QUESTIONS = 15;

startGame = () => {
  questionCounter = 0;
  answersGiven = 0;
  score = 0;
  availableQuesions = [...questions];
  getNewQuestion();
  game.classList.remove('hidden');
  loader.classList.add('hidden');
};

getNewQuestion = () => {
  //   if (answersGiven < MAX_QUESTIONS) {
  //     return;
  //   }
  if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem('mostRecentScore', score);
    //go to the end page
    return window.location.assign('end.html');
  }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  //Update the progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  //const questionIndex = Math.floor(Math.random() * availableQuesions.length);
  const questionIndex = questionCounter - 1;
  currentQuestion = availableQuesions[questionIndex];
  question.innerHTML = currentQuestion.question;

  setQuestionImage();

  choices.forEach((choice) => {
    const number = choice.dataset['number'];
    choice.innerHTML = currentQuestion['choice' + number];

    const imageUrl = currentQuestion['choice' + number + '_image']?.url;

    if (!imageUrl) {
      choice.style.display = 'block';
    } else {
      choice.style.display = 'none';
    }
  });

  setAnswerImages();

  //availableQuesions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach((choice) => {
  console.log(choice.parentElement.parentElement);
  choice.parentElement.parentElement.addEventListener('click', (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = +selectedChoice.dataset['number'];
    console.log(currentQuestion.answer, selectedAnswer);
    const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

    if (classToApply === 'correct') {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

setQuestionImage = () => {
  // console.log(currentQuestion);
  if (currentQuestion.questionImageUrl) {
    questionImage.src = currentQuestion.questionImageUrl;
    questionImage.style.display = 'block';
  } else {
    questionImage.style.display = 'none';
  }
  questionImage.src = currentQuestion.questionImageUrl;
};

setAnswerImages = () => {
  choiceImages.forEach((choice) => {
    // console.log(choice);
    const number = choice.dataset['number'];
    const imgObj = currentQuestion['choice' + number + '_image'];
    //const { url, width, height } = imgObj;
    //choice.src = currentQuestion['choice' + number + '_imageUrl'];
    if (imgObj?.url) {
      choice.style.display = 'block';
      choice.src = imgObj?.url;
      choice.style.width = imgObj?.width;
      choice.style.height = imgObj?.height;
    } else {
      choice.style.display = 'none';
    }

    console.log(choice);
  });
};

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
