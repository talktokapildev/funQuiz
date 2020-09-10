// const highScoresList = document.getElementById('highScoresList');
// const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

// highScoresList.innerHTML = highScores
//   .map((score) => {
//     return `<li class="high-score">${score.name} - ${score.score}</li>`;
//   })
//   .join('');

fetch('https://api.airtable.com/v0/app1JEi4uKqzZpZCe/Table%201?api_key=key2jvCfbL4nC6oLa')
  .then((res) => {
    return res.json();
  })
  .then((loadedScores) => {
    highScoresList.innerHTML = loadedScores.records
      .map((record) => {
        return `<li class="high-score">${record.fields.Name} - ${record.fields.Score}</li>`;
      })
      .join('');
  });
