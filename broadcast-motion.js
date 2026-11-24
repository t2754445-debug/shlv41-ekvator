(() => {
  const broadcast = document.querySelector(".broadcast");
  if (!broadcast) return;

  const ribbons = document.createElement("div");
  ribbons.className = "m-ribbons";
  ribbons.setAttribute("aria-hidden", "true");
  const stars = document.createElement("div");
  stars.className = "m-stars";
  stars.setAttribute("aria-hidden", "true");
  for (let index = 0; index < 18; index++) {
    const star = document.createElement("i");
    const x = (index * 47 + 11) % 97;
    const y = (index * 31 + 7) % 91;
    const size = index % 5 === 0 ? 4 : 2;
    star.className = "m-star";
    star.style.cssText = `--x:${x}%;--y:${y}%;--size:${size}px;--speed:${2.2 + index % 5 * .6}s;--delay:${-index % 7 * .4}s`;
    stars.append(star);
  }
  const flash = document.createElement("div");
  flash.className = "m-flash";
  flash.setAttribute("aria-hidden", "true");
  const pause = document.createElement("div");
  pause.className = "m-pause";
  pause.setAttribute("aria-hidden", "true");
  pause.innerHTML = "<span><b>ПАУЗА</b><small>Продолжить можно кнопкой ниже</small></span>";
  broadcast.append(ribbons, stars, flash, pause);

  const card = broadcast.querySelector(".b-card");
  let cutTimer = 0;
  function cut() {
    broadcast.classList.remove("m-cut");
    void broadcast.offsetWidth;
    broadcast.classList.add("m-cut");
    clearTimeout(cutTimer);
    cutTimer = setTimeout(() => broadcast.classList.remove("m-cut"), 420);
  }
  new MutationObserver(cut).observe(card, { childList: true, characterData: true, subtree: true });

  function updatePause() {
    const videoPlaying = playerSet.classList.contains("is-film") && !playerFilm.paused && !playerFilm.ended;
    const voicePlaying = !playerSet.classList.contains("is-film") && playerSet.dataset.speaking === "true";
    const explicitlyPaused = player.open && !isFinished && pauseButton.textContent === "Продолжить" && !videoPlaying;
    broadcast.classList.toggle("m-paused", explicitlyPaused && !voicePlaying);
  }
  new MutationObserver(updatePause).observe(playerSet, { attributes: true, attributeFilter: ["class", "data-speaking"] });
  playerFilm.addEventListener("pause", updatePause);
  playerFilm.addEventListener("playing", updatePause);
  player.addEventListener("close", updatePause);
  pauseButton.addEventListener("click", () => requestAnimationFrame(updatePause));
  player.addEventListener("click", event => {
    if (event.target.closest("#player-set") && playerSet.classList.contains("is-film")) return;
    requestAnimationFrame(updatePause);
  });
})();
