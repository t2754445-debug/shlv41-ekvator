const integer = new Intl.NumberFormat("ru-RU");
const authors = [
  ["Севиль Яхьяева", "", "390 реакций в своей ветке", "Бумажный уже в курсе, кто поднимает шум с пользой."],
  ["Маргарита Лебедева", "margo", "Капитан «Влияторов»", "20 ноября собрала новый список. Виктор нашёлся у неё."],
  ["Юлия Шкурко", "", "Вершители · контроль отчётов", "Свела домашки и отчёты. На выпускной предложила сыграть Бабу-ягу."],
  ["Екатерина Ткачёва", "", "Влияторы · 12 из 12", "16 ноября сверила оба списка: отчёты и домашнее задание."],
  ["Ирина Леккерева", "", "Энергия влияния · контроль", "Закрыла пятницу и отправила всей команде порцию тепла и сладких снов."],
  ["Виктор Иванилов", "viktor", "На экваторе сменил команду", "В ноябрьском списке «Влияторов» уже рядом с новыми бадди."],
  ["Яна Савина", "k_yana", "Помогла с регламентом", "Ответила, кто у «Империи» куратор, в разгар следствия о правах капитана."],
  ["Ирина Сергеева", "", "Вершители · благопроект", "Позвала всю команду ехать вместе и предложила снять общий видеотчёт."]
];

function element(tag, text, css) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (css) node.className = css;
  return node;
}

const hall = document.querySelector("#hall");
for (const [name, picture, role, remark] of authors) {
  const detail = document.createElement("details");
  const heading = document.createElement("summary");
  const avatar = picture ? document.createElement("img") : element("div", name.split(" ").map(part => part[0]).join(""), "avatar");
  if (picture) {
    avatar.src = "assets/heroes/" + picture + ".jpg";
    avatar.alt = "";
    avatar.loading = "lazy";
  } else {
    avatar.setAttribute("aria-hidden", "true");
  }
  heading.append(avatar, element("span", name), element("small", role));
  detail.append(heading, element("p", remark));
  hall.append(detail);
}

const chart = document.querySelector("#day-chart");
const dayDetail = document.querySelector("#day-detail");
const peak = Math.max(...episodeData.days.map(([, count]) => count));
let selectedDay = null;
for (const [day, count] of episodeData.days) {
  const bar = document.createElement("button");
  bar.type = "button";
  const text = day + " · " + integer.format(count) + " сообщений";
  bar.title = text;
  bar.setAttribute("aria-label", text);
  bar.setAttribute("aria-pressed", "false");
  bar.style.setProperty("--height", Math.round(count / peak * 100) + "%");
  const pick = () => {
    selectedDay?.setAttribute("aria-pressed", "false");
    selectedDay = bar;
    bar.setAttribute("aria-pressed", "true");
    dayDetail.textContent = text;
  };
  bar.addEventListener("click", pick);
  if (count === peak) pick();
  chart.append(bar);
}

const teams = Array.from(document.querySelectorAll(".team-grid .team"));
const tabs = document.querySelector("#team-tabs");
const teamFacts = {
  "Влияторы": [["Движуха", "Собрались к собакам на благопроект.", 1491, 17126], ["Как разрулили", "Екатерина Ткачёва сверила по порядку ДЗ и отчёты. Дважды 12 из 12.", 1491, 13395], ["Прикол", "Сами предложили собираться «как вентиляторы».", 1491, 15244]],
  "Вершители": [["Движуха", "Ирина предложила идти на благопроект всем составом.", 1493, 12160], ["Как разрулили", "Юлия разделила отчёт по ДЗ и сводку ежедневных отчётов.", 1493, 13442], ["За кулисами", "Для выпускного Юля уже предложила костюм Бабы-яги.", 16091, 17505]],
  "Империя влияния": [["Движуха", "Выиграли мастермайнд с Дмитрием.", 1490, 14884], ["Как разрулили", "С Яной согласовали, что и когда сверяет контролёр.", 1490, 11916], ["Прикол", "Капитан уточнил, какие права у него есть. Вопрос ушёл в мульт.", 1490, 11960]],
  "Энергия влияния": [["Движуха", "Анна позвала команду на кофе и предложила экскурсию в красную комнату.", 1492, 11615], ["Как разрулили", "Алексей и Роман подхватили руководство командой.", 1492, 12184], ["Прикол", "Вместо ночного «а где отчёт» Ирина доставила команде порцию тепла.", 1492, 12062]]
};
const teamBanter = {
  "Влияторы": ["Двенадцать из двенадцати, дважды. Вот это Пиксельный называет точностью.", "А потом они ещё и на собак собрались. У контролёра теперь лапы в расписании."],
  "Вершители": ["Они едут на благопроект всем составом и снимут общий отчёт.", "Главное, чтобы Баба-яга не забыла приложить отчёт к полёту."],
  "Империя влияния": ["Открытый урок, гости и мастермайнд с Дмитрием. Команда хорошо сработала.", "Наконец-то приз, который не надо заносить в табличку отчётности."],
  "Энергия влияния": ["Ирина закрыла пятницу и отпустила команду отдыхать.", "Впервые дедлайн закончился словами «сладких снов». Подозрительно гуманно."]
};
const teamBanterNode = document.querySelector("#team-banter");
teams.forEach((panel, index) => {
  const name = panel.querySelector("h3").textContent;
  const button = element("button", name);
  button.type = "button";
  panel.id = "team-panel-" + index;
  button.setAttribute("aria-controls", panel.id);
  const evidence = element("div", "", "team-evidence");
  const list = document.createElement("ul");
  for (const [label, quote, topic, message] of teamFacts[name]) {
    const item = document.createElement("li");
    const link = element("a", "Ветка ↗");
    link.href = "https://t.me/c/3934706992/" + topic + "/" + message;
    item.append(element("strong", label + ". "), quote + " ", link);
    list.append(item);
  }
  evidence.append(list);
  panel.append(evidence);
  panel.hidden = index !== 0;
  button.setAttribute("aria-pressed", String(index === 0));
  button.addEventListener("click", () => {
    teams.forEach((item, position) => { item.hidden = position !== index; });
    Array.from(tabs.children).forEach((tab, position) => tab.setAttribute("aria-pressed", String(position === index)));
    const [pixel, paper] = teamBanter[name];
    teamBanterNode.replaceChildren(element("strong", "Пиксельный: "), document.createTextNode(pixel + " "), element("span", ""));
    teamBanterNode.lastElementChild.append(element("strong", "Бумажный: "), document.createTextNode(paper));
  });
  tabs.append(button);
});

const awardBanter = [
  ["Семьсот семь сообщений Михаила в одной командной ветке. Миш, тебе слово.", "Слово, Миш. Одно. У нас аренда зала до десяти."],
  ["390 реакций Севиль в ветке «Влияторов», 419 — во всех ветках вместе.", "Зал хлопает кнопкой. Хоть кто-то здесь понимает механику."],
  ["Екатерина сверила 12 отчётов и 12 домашних заданий.", "Наконец список, который не просит ещё одну сверку."],
  ["Ирина закрыла пятницу и пожелала команде сладких снов.", "Рабочий чат, который сам отправил людей спать. Фантастика."],
  ["Яна помогла команде договориться о формате контроля.", "Без фанфар, зато теперь ясно, кто что сверяет."],
  ["«Империя» собрала гостей и выиграла мастермайнд с Дмитрием.", "Тут даже я аплодирую. Только верните микрофон после."]
];
const awardBanterNode = document.querySelector("#award-banter");
document.querySelectorAll(".award").forEach((award, index) => {
  award.addEventListener("toggle", () => {
    if (!award.open) return;
    const [pixel, paper] = awardBanter[index];
    awardBanterNode.replaceChildren(element("strong", "Пиксельный: "), document.createTextNode(pixel + " "), element("span", ""));
    awardBanterNode.lastElementChild.append(element("strong", "Бумажный: "), document.createTextNode(paper));
  });
});

const search = document.querySelector("#rank-search");
const teamFilter = document.querySelector("#rank-team");
const order = document.querySelector("#rank-order");
const rankBody = document.querySelector("#rank-body");
const rankStatus = document.querySelector("#rank-status");
const more = document.querySelector("#rank-more");
const initialLimit = 12;
let expanded = false;
Object.keys(episodeData.team).forEach(team => teamFilter.add(new Option(team, team)));
const normalize = value => value.toLocaleLowerCase("ru").replaceAll("ё", "е").trim();

function renderRating() {
  const query = normalize(search.value);
  const sortColumn = Number(order.value);
  const records = episodeData.rank.filter(([name, group]) => normalize(name).includes(query) && (!teamFilter.value || group === teamFilter.value));
  records.sort((a, b) => b[sortColumn] - a[sortColumn] || a[0].localeCompare(b[0], "ru"));
  const visible = expanded ? records : records.slice(0, initialLimit);
  rankBody.replaceChildren(...visible.map(([name, group, postCount, reactions]) => {
    const row = document.createElement("tr");
    row.append(element("td", name), element("td", group), element("td", integer.format(postCount)), element("td", integer.format(reactions)));
    return row;
  }));
  rankStatus.textContent = records.length ? "Показано " + visible.length + " из " + records.length : "По этому запросу никого не нашли.";
  const mikhail = document.querySelector("#rank-mikhail");
  mikhail.hidden = !query || !normalize("Михаил Охотников").includes(query) || (teamFilter.value && teamFilter.value !== "Вершители");
  if (!mikhail.hidden && !records.length) rankStatus.textContent = "Совпадение среди героев выпуска";
  more.hidden = records.length <= initialLimit;
  more.textContent = expanded ? "Свернуть рейтинг" : "Показать всех";
}

[search, teamFilter, order].forEach(field => field.addEventListener("input", () => {
  expanded = false;
  renderRating();
}));
more.addEventListener("click", () => {
  expanded = !expanded;
  renderRating();
});
renderRating();
document.querySelector("#open-mikhail").addEventListener("click", () => {
  const envelope=document.querySelector("#awards .award");
  envelope.open=true;
  envelope.scrollIntoView({block:"center"});
  envelope.querySelector("summary").focus({preventScroll:true});
});

const chaptersByOldIndex = { 3: 2, 4: 1, 6: 6, 8: 7 };
for (const button of document.querySelectorAll(".voice[data-start]")) {
  button.dataset.show = String(chaptersByOldIndex[button.dataset.start]);
}
const opener = document.querySelector("#play");
opener.dataset.show = "0";
opener.removeAttribute("aria-pressed");

const cartoon = document.querySelector("#cartoon-video");
function revealCartoon() {
  document.querySelector("#cinema").hidden = false;
}
cartoon.addEventListener("loadedmetadata", revealCartoon);
if (cartoon.readyState >= 1) revealCartoon();
