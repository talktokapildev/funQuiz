const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
  saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
  e.preventDefault();

  // const score = {
  //     score: mostRecentScore,
  //     name: username.value,
  // };
  // highScores.push(score);
  // highScores.sort((a, b) => b.score - a.score);
  // highScores.splice(5);

  // localStorage.setItem('highScores', JSON.stringify(highScores));
  // window.location.assign('/');

  const data = {
    records: [
      {
        fields: {
          Name: username.value,
          Score: mostRecentScore,
        },
      },
    ],
  };

  fetch('https://api.airtable.com/v0/app1JEi4uKqzZpZCe/Table%201?api_key=key2jvCfbL4nC6oLa', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      window.location.assign('./');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};
