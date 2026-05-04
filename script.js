const feeds = [
  "https://www.bleepingcomputer.com/feed/",
  "https://www.cnil.fr/rss.xml",
  "https://www.zdnet.fr/feeds/rss/securite/",
  "https://www.it-connect.fr/feed/",
  "https://www.lemondeinformatique.fr/flux-rss/rss.xml",
];

let allArticles = [];
let displayed = 0;

function getSource(url) {
  if (url.includes("bleepingcomputer")) return "Bleeping Computer";
  if (url.includes("cnil")) return "CNIL";
  if (url.includes("zdnet")) return "ZDNet";
  if (url.includes("it-connect")) return "IT-Connect";
  if (url.includes("lemondeinformatique")) return "Le Monde Informatique";
  return "Source";
}

function isRelevant(item) {
  const text = (item.title + item.description).toLowerCase();

  return (
    text.includes("nis2") ||
    text.includes("cyber") ||
    text.includes("sécurité") ||
    text.includes("directive") ||
    text.includes("anssi") ||
    text.includes("rgpd") ||
    text.includes("attaque") ||
    text.includes("entreprise") ||
    text.includes("cloud") ||
    text.includes("incident") ||
    text.includes("réglementation") ||
    text.includes("europe") ||
    text.includes("anssi")
  );
}

function loadFeeds() {
  document.getElementById("rss").innerHTML = "";
  allArticles = [];
  displayed = 0;

  feeds = feeds.filter(f => f.trim() !== "");

  feeds.forEach(feed => {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`)
      .then(res => res.json())
      .then(data => {

        data.items.forEach(item => {
          if (isRelevant(item)) {
            item.source = getSource(item.link);
            allArticles.push(item);
          }
        });

        allArticles.sort((a,b) => new Date(b.pubDate) - new Date(a.pubDate));

        displayArticles();
      });
  });
}

function displayArticles() {
  const container = document.getElementById("rss");

  const nextItems = allArticles.slice(displayed, displayed + 10);

  nextItems.forEach(item => {
    container.innerHTML += `
      <div class="card">
        <h3>${item.title}</h3>
        <p>${new Date(item.pubDate).toLocaleDateString()}</p>
        <div class="source">${item.source}</div>
        <a href="${item.link}" target="_blank">Lire l'article →</a>
      </div>
    `;
  });

  displayed += 10;
}

function loadMore() {
  displayArticles();
}

loadFeeds();