function getUserInput() {
  const username = document.getElementById("userInputField").value;
  redirectTogame(username);
}

function redirectTogame(username) {
  window.location.href =
    "templates/game.html?username=" + encodeURIComponent(username);
}
