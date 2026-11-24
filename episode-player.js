const showChapters = [
  { title: "Добрый вечер, сорок первый", from: 0, to: 3, image: "curtain", label: "Четыре занятия из восьми", color: "#a91e36" },
  { title: "Новости потока", from: 4, to: 5, image: "room", label: "11 003 сообщения · 6 758 реакций", color: "#2f58ad" },
  { title: "Скандалы, интриги, расследования", from: 6, to: 9, image: "crash", label: "Дело о двух отчётах", color: "#963747" },
  { title: "Мультвставка · Дежурный по раппорту", film: true, image: "cartoon", label: "Вымышленная сценка", color: "#26686a" },
  { title: "На сцене четыре команды", from: 10, to: 13, image: "team", label: "Влияторы · Вершители · Империя · Энергия", color: "#443aa5" },
  { title: "Контролёры и жизнь за пределами чата", from: 14, to: 15, image: "lesson", label: "Контролёры недели", color: "#286f7c" },
  { title: "Золотая Люсиль", from: 16, to: 17, image: "award", label: "Открываем конверты", color: "#9a5c25" },
  { title: "Что дальше", from: 18, to: 19, image: "stage", label: "Второй акт", color: "#693083" }
];

const player = document.querySelector("#episode-player");
const playerSet = document.querySelector("#player-set");
const playerFilm = document.querySelector("#player-video");
const progress = document.querySelector("#player-progress");
const pauseButton = document.querySelector("#player-pause");
const nextButton = document.querySelector("#player-next");
const prevButton = document.querySelector("#player-prev");
const speakerLabel = document.querySelector("#player-speaker");
const lineLabel = document.querySelector("#player-line");
const chapterLabel = document.querySelector("#player-chapter");
const showSound = new Audio();
const showMusic = new Audio("assets/music.mp3");
showMusic.loop = true;
showMusic.volume = 0.1;
const namesByRole = { pixel: "Пиксельный Ниган", paper: "Бумажный Ниган" };
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const filmProof = document.createElement("a");
filmProof.hidden = true;
filmProof.target = "_blank";
filmProof.rel = "noopener";
filmProof.className = "film-proof";
playerSet.append(filmProof);
filmProof.addEventListener("click", event => { event.stopPropagation(); playerFilm.pause(); });
playerFilm.addEventListener("timeupdate", () => {
  const t = playerFilm.currentTime;
  filmProof.hidden = playerFilm.hidden || t < 26.57;
  if (filmProof.hidden) return;
  const [address, label] = t < 36.45 ? ["1490/11971","Ответ Яны, 12 ноября"] : t < 40.5 ? ["22/14741","Фото с урока Эснера"] : ["1490/14884","Объявление победителей"];
  filmProof.href = "https://t.me/c/3934706992/" + address;
  filmProof.textContent = label + " ↗";
});

let chapterIndex = 0;
let voiceIndex = 0;
let currentChunks = [];
let isRunning = false;
let isFinished = false;
let playbackVersion = 0;
let curtainDelay = 0;
let nextDelay = 0;
let lastFocus = null;
let firstPageClick = false;
let rubricScrollPending = false;

const rubricsButton = document.createElement("button");
rubricsButton.type = "button";
rubricsButton.id = "player-rubrics";
rubricsButton.textContent = "К рубрикам ↓";
rubricsButton.setAttribute("aria-label", "Закрыть шоу и перейти к рубрикам выпуска");
player.querySelector(".player-top").insertBefore(rubricsButton, document.querySelector("#player-close"));

function setSubtitles(text) {
  if (lineLabel.textContent !== text) lineLabel.textContent = text;
}

function splitForScreen(text) {
  const timing = window.showTiming?.[voiceIndex];
  if (timing?.words?.length) {
    const spokenWords = text.trim().split(/\s+/);
    const timedWords = timing.words;
    const chunks = [];
    let phrase = [];
    for (let index = 0; index < spokenWords.length; index++) {
      phrase.push(spokenWords[index]);
      const boundary = /[.!?…»]$/.test(spokenWords[index]) && phrase.length >= 3;
      if (phrase.length >= 6 || boundary || index === spokenWords.length - 1) {
        const first = timedWords[Math.min(index - phrase.length + 1, timedWords.length - 1)] || timedWords[0];
        chunks.push([first ? first[0] / timing.duration : 0, phrase.join(" ")]);
        phrase = [];
      }
    }
    if (chunks.length) return chunks;
  }
  const parts = [];
  let chunk = "";
  for (const word of text.split(/\s+/)) {
    if (chunk.length + word.length > 74) {
      parts.push(chunk);
      chunk = word;
    } else {
      chunk = chunk ? chunk + " " + word : word;
    }
    if (chunk.length > 31 && /[.!?]$/.test(word)) {
      parts.push(chunk);
      chunk = "";
    }
  }
  if (chunk) parts.push(chunk);
  const total = parts.reduce((length, part) => length + part.length, 0);
  let passed = 0;
  return parts.map(part => {
    const cue = [passed / total, part];
    passed += part.length;
    return cue;
  });
}

function updateSubtitle(frac) {
  const active = currentChunks.findLast(chunk => chunk[0] <= frac);
  if (active) setSubtitles(active[1]);
}

function setRunning(running) {
  isRunning = running;
  pauseButton.textContent = running ? "Пауза" : "Продолжить";
  playerSet.dataset.speaking = String(running && playerFilm.hidden);
  if (running && playerFilm.hidden) showMusic.play().catch(() => {});
  else showMusic.pause();
}

function pausePlayback() {
  clearTimeout(nextDelay);
  showSound.pause();
  playerFilm.pause();
  setRunning(false);
}

function finish() {
  pausePlayback();
  isFinished = true;
  chapterLabel.textContent = "Конец выпуска";
  speakerLabel.textContent = "";
  setSubtitles("Если у тебя есть история для следующего выпуска, напиши Вове.");
  playerSet.classList.add("credits");
  nextButton.disabled = true;
  pauseButton.textContent = "Сначала";
  playerSet.classList.add("closed");
}

function resumeMedia(media, version) {
  setRunning(true);
  media.play().catch(() => {
    if (version !== playbackVersion || !player.open) return;
    setRunning(false);
    if (media === playerFilm) setSubtitles("Нажми «Продолжить» или запусти ролик в плеере.");
  });
}

function updatePlayerNavigation() {
  progress.querySelectorAll("button").forEach((button, index) => {
    button.style.removeProperty("--played");
    button.setAttribute("aria-current", String(index === chapterIndex));
    button.classList.toggle("past", index < chapterIndex);
  });
  nextButton.disabled = false;
  prevButton.disabled = chapterIndex === 0;
  nextButton.textContent = chapterIndex === showChapters.length - 1 ? "К финалу →" : "Дальше →";
}

function playVoice(n) {
  const chapter = showChapters[chapterIndex];
  if (n > chapter.to) return advanceChapter();
  voiceIndex = n;
  const [role, text] = episodeData.dialogue[n];
  playerSet.dataset.speaker = role;
  speakerLabel.textContent = namesByRole[role];
  currentChunks = splitForScreen(text);
  setSubtitles(currentChunks[0]?.[1] || text);
  updateSubtitle(0);
  const take = episodeData.voiceFiles?.[n] || String(n);
  showSound.src = "assets/episode-v2/" + take + ".mp3";
  showSound.onended = () => {
    const version = playbackVersion;
    nextDelay = setTimeout(() => {
      if (version === playbackVersion && player.open) playVoice(n + 1);
    }, n === 1 || n === 7 ? 120 : 55);
  };
  resumeMedia(showSound, playbackVersion);
}

function advanceChapter() {
  if (chapterIndex < showChapters.length - 1) openChapter(chapterIndex + 1);
  else finish();
}

function openChapter(index) {
  chapterIndex = index;
  isFinished = false;
  playbackVersion++;
  pausePlayback();
  showSound.onended = null;
  playerFilm.onended = null;
  chapterLabel.textContent = showChapters[index].title;
  updatePlayerNavigation();
  const chapter = showChapters[index];
  playerFilm.hidden = !chapter.film;
  filmProof.hidden = true;
  playerSet.classList.toggle("is-film", Boolean(chapter.film));
  playerSet.classList.remove("closed", "credits");
  playerSet.style.setProperty("--scene", chapter.color);
  if (chapter.film) {
    speakerLabel.textContent = "Мультвставка";
    setSubtitles(chapter.label);
    playerFilm.currentTime = 0;
    playerFilm.onended = advanceChapter;
    resumeMedia(playerFilm, playbackVersion);
  } else {
    playVoice(chapter.from);
  }
}

function beginShow(index) {
  if (player.open) return;
  showMusic.currentTime = 0;
  lastFocus = document.activeElement;
  document.querySelectorAll("main video").forEach(video => video.pause());
  player.showModal();
  document.body.classList.add("show-lock");
  openChapter(index);
  if (!reduceMotion) {
    playerSet.classList.add("closed");
    clearTimeout(curtainDelay);
    curtainDelay = setTimeout(() => playerSet.classList.remove("closed"), 90);
  }
  document.querySelector("#player-close").focus();
}

rubricsButton.addEventListener("click", () => {
  rubricScrollPending = true;
  player.close();
});
document.querySelector("#film-shortcut").addEventListener("click", () => openChapter(3));

function togglePause() {
  if (isFinished) return openChapter(0);
  if (isRunning) pausePlayback();
  else if (!playerFilm.hidden) resumeMedia(playerFilm, playbackVersion);
  else if (showSound.ended) playVoice(voiceIndex + 1);
  else resumeMedia(showSound, playbackVersion);
}

function updateElapsed() {
  if (!player.open || isFinished) return;
  const chapter = showChapters[chapterIndex];
  let fraction = 0;
  if (chapter.film) {
    if (playerFilm.duration > 0) fraction = playerFilm.currentTime / playerFilm.duration;
  } else if (showSound.duration > 0) {
    const current = showSound.currentTime / showSound.duration;
    updateSubtitle(current);
    const durations = window.showTiming.slice(chapter.from, chapter.to + 1).map(line => line.duration);
    const prev = durations.slice(0, voiceIndex - chapter.from).reduce((a, b) => a + b, 0);
    fraction = (prev + showSound.currentTime) / durations.reduce((a, b) => a + b, 0);
  }
  progress.children[chapterIndex].style.setProperty("--played", Math.min(100, fraction * 100) + "%");
}
showSound.addEventListener("timeupdate", updateElapsed);
playerFilm.addEventListener("timeupdate", updateElapsed);
showSound.addEventListener("error", () => {
  if (!player.open || !playerFilm.hidden) return;
  setRunning(false);
  setSubtitles("В этой главе не загрузилась дорожка. Можно перейти к следующей.");
});
playerFilm.addEventListener("playing", () => setRunning(true));
playerFilm.addEventListener("pause", () => {
  if (!playerFilm.hidden && !playerFilm.ended) setRunning(false);
});
playerFilm.addEventListener("error", () => {
  if (!player.open || playerFilm.hidden) return;
  setRunning(false);
  setSubtitles("Мультвставка не загрузилась. Можно перейти к следующей главе.");
});
showChapters.forEach((chapter, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.title = chapter.title;
  button.setAttribute("aria-label", chapter.title);
  button.addEventListener("click", () => openChapter(index));
  progress.append(button);
});
document.querySelectorAll("[data-show]").forEach(button => {
  button.addEventListener("click", () => beginShow(Number(button.dataset.show || 0)));
});
document.addEventListener("click", event => {
  if (!event.isTrusted || firstPageClick || player.open) return;
  if (event.button !== 0 && event.detail !== 0) return;
  firstPageClick = true;
  event.preventDefault();
  event.stopImmediatePropagation();
  beginShow(event.target.closest('a[href="#cartoon"]') ? 3 : 0);
}, { capture: true });
document.querySelector("#player-close").addEventListener("click", () => player.close());
prevButton.addEventListener("click", () => { if (chapterIndex > 0) openChapter(chapterIndex - 1); });
nextButton.addEventListener("click", advanceChapter);
pauseButton.addEventListener("click", togglePause);
player.addEventListener("close", () => {
  playbackVersion++;
  pausePlayback();
  clearTimeout(curtainDelay);
  document.body.classList.remove("show-lock");
  lastFocus?.focus();
  if (rubricScrollPending) {
    rubricScrollPending = false;
    requestAnimationFrame(() => {
      document.querySelector("#zal")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  }
});
player.addEventListener("keydown", event => {
  if (event.target === playerFilm) return;
  if (event.key === " " && !event.target.closest("button")) { event.preventDefault(); togglePause(); }
  if (event.key === "ArrowRight" && !isFinished) { event.preventDefault(); advanceChapter(); }
  if (event.key === "ArrowLeft" && chapterIndex > 0) { event.preventDefault(); openChapter(chapterIndex - 1); }
});

const scriptGrid = document.querySelector(".script-grid");
scriptGrid.replaceChildren(...showChapters.map(chapter => {
  const article = document.createElement("article");
  const title = document.createElement("h3");
  title.textContent = chapter.title;
  article.append(title);
  if (chapter.film) {
    const note = document.createElement("p");
    note.textContent = "Вставка «Дежурный по раппорту», затем обратно в студию.";
    article.append(note);
  } else {
    const list = document.createElement("ol");
    episodeData.dialogue.slice(chapter.from, chapter.to + 1).forEach(([role, text]) => {
      const item = document.createElement("li");
      const name = document.createElement("strong");
      name.textContent = namesByRole[role] + " ";
      item.append(name, text);
      list.append(item);
    });
    article.append(list);
  }
  return article;
}));

