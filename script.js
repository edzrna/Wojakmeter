const moods = [
  { name:"Euphoria", score:90, file:"euphoria.svg" },
  { name:"Content", score:75, file:"content.svg" },
  { name:"Optimism", score:60, file:"optimism.svg" },
  { name:"Neutral", score:45, file:"neutral.svg" },
  { name:"Doubt", score:30, file:"doubt.svg" },
  { name:"Concern", score:15, file:"concern.svg" },
  { name:"Frustration", score:0, file:"frustration.svg" },
];

function getMood(score){
  for(let m of moods){
    if(score >= m.score) return m;
  }
  return moods[moods.length - 1];
}

function update(score){
  let mood = getMood(Number(score));

  document.getElementById("heroScore").innerText = score;
  document.getElementById("heroMood").innerText = mood.name;
  document.getElementById("heroWojak").src = "assets/wojaks/" + mood.file;
}

document.getElementById("scoreSlider").addEventListener("input", e => {
  update(e.target.value);
});

function buildTweet(score){
  let mood = getMood(Number(score));
  let macro = document.getElementById("macroDriver").value;

  return `🚨 WojakMeter Alert

Mood: ${mood.name}
Score: ${score}/100
Macro driver: ${macro}

wojakmeter.com
@WojakMeter`;
}

function buildPrompt(score){
  let mood = getMood(Number(score));
  let macro = document.getElementById("macroDriver").value;

  return `Create a crypto meme.

Mood: ${mood.name}
Macro driver: ${macro}

Include Wojak reacting to market.
Add branding: wojakmeter.com and @WojakMeter bottom-right.`;
}

document.getElementById("tweetBtn").onclick = () => {
  let s = document.getElementById("scoreSlider").value;
  document.getElementById("tweetOutput").value = buildTweet(s);
};

document.getElementById("memeBtn").onclick = () => {
  let s = document.getElementById("scoreSlider").value;
  document.getElementById("memeOutput").value = buildPrompt(s);
};

update(64);