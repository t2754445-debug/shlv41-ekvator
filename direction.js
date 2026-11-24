/* Монтажные точки заданы словами из чистовых дублей. Время приходит из разбора MP3. */
(() => {
  const wide = (word, title = '') => ({ word, kind: 'wide', title });
  const host = word => ({ word, kind: 'host' });
  const reaction = word => ({ word, kind: 'reaction' });
  const score = (word, title, copy) => ({ word, kind: 'score', title, copy });
  const file = (word, title, copy) => ({ word, kind: 'file', title, copy });
  const ticket = (word, title, copy) => ({ word, kind: 'ticket', title, copy });
  const photo = (word, image, title, copy) => ({ word, kind: 'photo', image, title, copy });
  const record = (word, title, copy) => ({ word, kind: 'record', title, copy });
  const chat = (word, title, copy) => ({ word, kind: 'chat', title, copy });
  const lunch = (word, title, copy) => ({ word, kind: 'lunch', title, copy });
  const shots = [
    [wide('', 'Добрый вечер!'), score('четыре', '4 / 8', 'занятий пройдено'), host('бумажный'), wide('поаплодировать', 'Аплодисменты!')],
    [host(''), file('контролёр', 'Контролёр', 'вступил в дежурство'), score('хлопнул', 'ХЛОП × 2', 'аплодисменты учтены'), ticket('ссылка', 'А где ссылка?', 'подтверждение хлопков'), reaction('хлопки')],
    [host(''), photo('зал','room','Вот тебе и ссылка','Открытый урок · 18 ноября'), photo('привели','team','Пришли вместе','Снимок из ветки потока')],
    [host(''), photo('открытый','lesson','Открытый урок','Дмитрий Эснер в зале'), chat('отчёт','Отчёт куда кидать?','Как Бумажный представляет гостя')],
    [score('','11 003','сообщения · 6 758 реакций'), host('любимое'), lunch('сороковой','40-я минута','Обед на открытом уроке'), lunch('овощи','Вторая подача','Овощи, а за ними фрукты'), wide('дальше','А дальше что?')],
    [host(''), file('доступен','Доступ по подписке','Продолжение рассказа Михаила'), ticket('тарифе','Куратор','Тариф для чтения десертного меню'), host('только'), reaction('блядь'), wide('уже','Кто тут куратор?')],
    [file('','Два отчёта','Дело № 01'), host('терра'), chat('первую','Версия 1','Сообщение в Telegram'), record('исправленную','Версия 2','Исправленный отчёт в приложении')],
    [host(''), file('телеграме','Первая версия','Улика из Telegram'), reaction('позор'), ticket('режиссёрская','Режиссёрская версия','Отчёт · авторский монтаж')],
    [file('','Куда делся куратор?','Дело № 02'), photo('яна','heroes/k_yana','Яна Савина','Помогла с регламентом'), record('лена','Лена и Женя','Кураторы «Империи»'), host('спасибо')],
    [host(''), reaction('права'), ticket('категорию','Категория B','Удостоверение капитана · реквизит'), photo('эснер','afisha','А если бы Дмитрий?','Фантазия ведущих'), wide('мультик','Дежурный по раппорту')],
    [photo('','imperia','Империя влияния','Выступление команды'), record('выиграли','Мастермайнд','За гостей на открытом уроке'), host('бумажный')],
    [host(''), photo('влияторов','vliyatory','Влияторы','Выступление команды'), score('двенадцать','12 / 12','отчёты и домашка'), ticket('гардеробе','№ 012','Гардероб Влияторов')],
    [host(''), photo('вершителей','vershiteli','Вершители','Выступление команды'), record('благопроект','Едем вместе?','Предложение Ирины Сергеевой'), wide('память')],
    [photo('','energia','Энергия влияния','Выступление команды'), chat('сладких','Сладких снов!','Контролёр закончил дежурство'), host('мой'), chat('квартире','К квартире?!','Бумажный разбирается с доступом')],
    [wide('','Контролёры недели'), record('галина','Галина · Екатерина · Татьяна','Наговицына / Ткачёва / Суязова'), record('юлия','Юлия · Ирина','Шкурко / Леккерева'), record('боровская','Татьяна · Юрий','Боровская / Столбовский'), host('спасибо')],
    [host(''), ticket('собакам','В гости к собакам','Выезд Влияторов'), file('ночлежку','«Ночлежка» и конюшня','Обсуждение в «Империи»'), score('просроченного','0','просроченных отчётов у лошадей')],
    [photo('','award','Золотая Люсиль','Церемония награждения'), score('семьсот','707','Михаил Охотников · сообщений в своей ветке'), score('триста','390','Севиль · реакций в своей ветке'), host('бумажный')],
    [host(''), ticket('подарил','Запасной палец','Михаилу · от Бумажного'), reaction('тебе'), wide('отпуск','Отпуск от микрофона')],
    [host(''), ticket('бабу','Баба-яга','Идея Юли для выпускного'), wide('пишите','Есть история? Напиши Вове')],
    [host(''), file('ступа','Ступа и метла','Имущество артистки'), chat('доступ','Открой доступ','Избушка запрашивает разрешение'), wide('повернись','Избушка, повернись!'), ticket('пускает','Доступ открыт','До встречи во втором акте')]
  ];
  const palette = ['#a92143','#243784','#963f39','#256468','#4e3787','#136c69','#7a4224','#712757'];
  const norm = word => word.toLowerCase().replaceAll('ё','е').replace(/[^а-яa-z0-9]/g,'');
  const frame = document.createElement('div');
  frame.className = 'broadcast';
  frame.setAttribute('aria-hidden','true');
  frame.innerHTML = `<div class="b-scenery"></div><div class="b-floor"></div>
    <div class="b-cast"><div class="b-pixel"><img alt="" src="assets/negan/wave.png"></div>
    <div class="b-paper"><div class="b-body"></div><div class="b-lids"><i></i><i></i></div><div class="b-open"></div><div class="b-chin"></div></div>
    </div>
    <div class="b-insert"><img class="b-plate" alt=""><div class="b-card"><small></small><strong></strong><i></i></div>
    <div class="b-dish"><i></i><i></i><i></i></div></div>
    <div class="b-bug"><i></i> ЭКВАТОР <b>41</b></div>`;
  playerSet.insertBefore(frame,playerSet.firstChild);
  const card = frame.querySelector('.b-card');
  const pixel = frame.querySelector('.b-pixel img');
  const plate = frame.querySelector('.b-plate');
  const wordTimes = shots.map((row,i) => row.map((shot,j) => {
    const match = window.showTiming?.[i]?.words.find(w => norm(w[2]).startsWith(norm(shot.word)));
    return j===0 ? 0 : (match?.[0] ?? Infinity);
  }));
  let previousKey = '', anim = 0, lastSprite = '';
  // Короткие студийные шумы идут точно в склейку и обрываются вместе с эфиром.
  let mixer;
  const playingEffects = new Set();
  function armMixer() {
    if (!window.AudioContext) return;
    mixer ||= new AudioContext();
    if (mixer.state==='suspended') mixer.resume().catch(()=>{});
  }
  document.addEventListener('pointerdown',armMixer,{once:true,capture:true});
  document.addEventListener('keydown',armMixer,{once:true,capture:true});
  const soundSwitch = document.createElement('button');
  soundSwitch.type='button'; soundSwitch.textContent='♪'; soundSwitch.id='sound-switch';
  soundSwitch.title='Выключить звук'; soundSwitch.setAttribute('aria-label',soundSwitch.title);
  soundSwitch.setAttribute('aria-pressed','true');
  player.querySelector('.player-controls').prepend(soundSwitch);
  soundSwitch.addEventListener('click',()=>{
    const off=!showSound.muted;
    [showSound,showMusic,playerFilm].forEach(media=>{media.muted=off});
    if(off) stopEffects(); else armMixer();
    soundSwitch.textContent=off?'♩×':'♪'; soundSwitch.title=off?'Включить звук':'Выключить звук';
    soundSwitch.setAttribute('aria-label',soundSwitch.title);soundSwitch.setAttribute('aria-pressed',String(!off));
  });
  playerSet.addEventListener('click',event=>{
    if(!playerFilm.hidden || event.target.closest('button') || isFinished) return;
    togglePause();
  });
  function celebrate(node) {
    if(reduceMotion) return;
    const rect=node.getBoundingClientRect(), x=rect.left+rect.width/2,y=rect.top+Math.min(42,rect.height/2);
    for(let i=0;i<34;i++){
      const piece=document.createElement('i');
      piece.className='award-confetti';piece.style.left=x+'px';piece.style.top=y+'px';
      piece.style.background=['#ffc759','#ee4654','#4bdac4','#a087ff'][i%4];
      document.body.append(piece);
      const dx=(Math.random()-.5)*Math.min(580,innerWidth),dy=-50-Math.random()*120;
      const move=piece.animate([{transform:'translate(0,0)'},{transform:'translate('+dx*.55+'px,'+dy+'px) rotate(140deg)',offset:.42},{transform:'translate('+dx+'px,130px) rotate(370deg)',opacity:0}],{duration:690+Math.random()*220});
      move.onfinish=()=>piece.remove();
    }
  }
  document.addEventListener('click',event=>{
    const btn=event.target.closest('summary, #team-tabs button, #day-chart button');
    if(!btn || player.open) return;
    if(btn.parentElement.matches('.award') && !btn.parentElement.open) celebrate(btn);
    if(!mixer || showSound.muted || mixer.state!=='running') return;
    if(btn.parentElement.matches('.award') && !btn.parentElement.open) {
      for(let i=0;i<8;i++) hit(i*.047,.064,.14+i*.008,680+i*45,true);
      [392,494,659].forEach((note,i)=>hit(.38+i*.075,.22,.082,note));
    } else if(btn.parentElement.matches('.case-file')) {
      hit(0,.13,.25,105);hit(.014,.12,.24,1100,true);
    } else if(btn.closest('#team-tabs')) {hit(0,.1,.12,330);hit(.065,.12,.10,495);}
    else {hit(0,.08,.09,btn.closest('#day-chart')?680:460);}
  });
  function stopEffects() {
    for (const source of playingEffects) { try { source.stop(); } catch {} }
    playingEffects.clear();
  }
  function hit(at, duration, level, frequency, noise=false) {
    const start=mixer.currentTime+at, source=noise?mixer.createBufferSource():mixer.createOscillator();
    const gain=mixer.createGain(), filter=mixer.createBiquadFilter();
    if(noise) {
      const buffer=mixer.createBuffer(1,Math.ceil(duration*mixer.sampleRate),mixer.sampleRate);
      const data=buffer.getChannelData(0);
      for(let i=0;i<data.length;i++) data[i]=Math.random()*2-1;
      source.buffer=buffer;
      filter.type='bandpass'; filter.Q.value=.72;
    } else {source.type='triangle';source.frequency.value=frequency;filter.type='lowpass';}
    filter.frequency.value=noise?frequency:Math.max(1600,frequency*3);
    gain.gain.setValueAtTime(.0001,start);
    gain.gain.exponentialRampToValueAtTime(level,start+.006);
    gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
    source.connect(filter).connect(gain).connect(mixer.destination);
    source.onended=()=>{playingEffects.delete(source);source.disconnect();filter.disconnect();gain.disconnect()};
    playingEffects.add(source);source.start(start);source.stop(start+duration);
  }
  function cutSound(key) {
    if(!mixer || mixer.state!=='running' || showSound.paused || showSound.muted) return;
    if(key==='0-0') {
      [392,494,587].forEach((note,i)=>hit(i*.075,.17,.063,note));
    } else if(key==='1-2') {
      for(const t of [0,.21]) {hit(t,.12,.36,1550,true);hit(t+.019,.055,.16,800,true)}
    } else if(['5-3','6-0','8-0','19-4'].includes(key)) {
      hit(0,.12,.20,82);hit(.018,.085,.26,840,true);
    } else if(['2-1','10-1'].includes(key)) {
      hit(0,.047,.19,2650,true);hit(.087,.066,.14,1950,true);
    } else if(key==='16-0') {
      [392,494,587,784].forEach((note,i)=>hit(.08*i,.25,.07,note));
    } else if(key==='17-0') hit(0,.26,.25,2100,true);
  }
  showSound.addEventListener('pause',stopEffects);
  player.addEventListener('close',stopEffects);
  function draw() {
    if (!player.open) { anim=0; previousKey=''; return; }
    if (!playerFilm.hidden || isFinished) { anim=requestAnimationFrame(draw); return; }
    const line = voiceIndex, time = showSound.currentTime;
    let shotIndex = 0;
    for (let j=1;j<wordTimes[line].length;j++) if (time>=wordTimes[line][j]) shotIndex=j;
    const shot = shots[line][shotIndex], key = line+'-'+shotIndex;
    const role = episodeData.dialogue[line][0];
    if (key!==previousKey) {
      previousKey=key;
      cutSound(key);
      frame.dataset.plan=shot.kind; frame.dataset.role=role;
      frame.classList.toggle('b-vegetables',shot.kind==='lunch' && shotIndex===3);
      frame.style.setProperty('--back',palette[chapterIndex]);
      card.querySelector('strong').textContent=shot.title || '';
      card.querySelector('small').textContent=shot.copy || '';
      if (shot.image) {
        plate.src='assets/'+shot.image+'.jpg';
        frame.style.setProperty('--photo', 'url("'+plate.src+'")');
      }
      frame.classList.toggle('b-has-title',Boolean(shot.title));
      if (!reduceMotion) {
        card.animate([{opacity:.4,transform:'translateY(.45em) scale(.94)'},{opacity:1,transform:'none'}],{duration:155});
        if(shot.kind==='photo') plate.animate([{transform:'scale(1.035)'},{transform:'scale(1)'}],{duration:1300,fill:'both'});
      }
    }
    const level = isRunning ? Number(window.showTiming?.[line]?.jaw[Math.floor(time*30)] || 0)/9 : 0;
    frame.style.setProperty('--mouth',role==='paper'?level:0);
    const sprite = role==='pixel' ? (level>.18?'mic-talk':'mic-rest') : shot.kind==='reaction'?'blink':'idle';
    if(sprite!==lastSprite){pixel.src='assets/negan/'+sprite+'.png';lastSprite=sprite}
    anim=requestAnimationFrame(draw);
  }
  new MutationObserver(()=>{if(player.open && !anim) draw()}).observe(player,{attributes:true,attributeFilter:['open']});
})();
