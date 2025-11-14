// -----------------------------
// Firebase Database Reference
// -----------------------------
const db = firebase.database();
const scoresRef = db.ref("scores");

// Default score structure
let scores = {
  player1: 0,
  player2: 0,
  history: [] // each entry: { p1, p2, time }
};

// -----------------------------
// Load Data From Firebase
// -----------------------------
scoresRef.on("value", snapshot => {
  const data = snapshot.val();
  if (data) {
    scores = data;
  }
  updateUI();
  updateChart();
});

// -----------------------------
// Update Score UI
// -----------------------------
function updateUI() {
  document.getElementById("p1-score").textContent = scores.player1;
  document.getElementById("p2-score").textContent = scores.player2;
}

// -----------------------------
// Add Win Function (Called by buttons)
// -----------------------------
function addWin(player) {
  if (player === 1) {
    scores.player1++;
  } else if (player === 2) {
    scores.player2++;
  }

  scores.history.push({
    p1: scores.player1,
    p2: scores.player2,
    time: Date.now()
  });

  // Save to Firebase
  scoresRef.set(scores);
}

// -----------------------------
// Chart.js Graph
// -----------------------------
let scoreChart = null;

function updateChart() {
  const ctx = document.getElementById("scoreChart").getContext("2d");

  const labels = scores.history.map((entry, index) => "Game " + (index + 1));
  const p1Data = scores.history.map(entry => entry.p1);
  const p2Data = scores.history.map(entry => entry.p2);

  if (scoreChart) {
    scoreChart.destroy();
  }

  scoreChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Player 1",
          data: p1Data,
          borderWidth: 3,
          borderColor: "blue"
        },
        {
          label: "Player 2",
          data: p2Data,
          borderWidth: 3,
          borderColor: "red"
        }
      ]
    },
    options: {
      responsive: true,
      animation: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
