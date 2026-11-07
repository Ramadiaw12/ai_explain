(function () {
  "use strict";
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };

  /* ----- Thème clair / sombre ----- */
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function theme() { return root.getAttribute("data-theme") || (mq && mq.matches ? "dark" : "light"); }
  function label() { $("theme-label").textContent = theme() === "dark" ? "Mode clair" : "Mode sombre"; }
  label();
  $("theme").addEventListener("click", function () {
    var next = theme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    label();
  });

  /* ----- Barre de progression ----- */
  var bar = $("progress");
  function progress() {
    var h = root.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? window.scrollY / h : 0) + ")";
  }
  window.addEventListener("scroll", progress, { passive: true });
  progress();

  /* ----- Révélation au défilement ----- */
  var items = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* ----- Explorateur : quelle IA pour quel besoin ? ----- */
  var data = [
    { q: "Les règles sont connues et doivent être respectées à la lettre",
      t: "IA symbolique", href: "#symbolique",
      why: "Chaque décision doit pouvoir s’expliquer et se vérifier. Les règles écrites par des experts garantissent un résultat prévisible.",
      ex: "Un moteur de règles qui valide un dossier de crédit selon des critères précis." },
    { q: "J’ai beaucoup de données et je veux prédire ou classer",
      t: "Modèles pilotés par les données", href: "#apprentissage",
      why: "Le modèle apprend les régularités cachées dans vos exemples, avec ou sans étiquettes (apprentissage supervisé ou non supervisé).",
      ex: "Repérer les transactions bancaires frauduleuses à partir de l’historique." },
    { q: "Le système doit apprendre en essayant, avec des récompenses",
      t: "Apprentissage par renforcement", href: "#apprentissage",
      why: "Un agent teste des actions dans un environnement et améliore sa stratégie selon les récompenses reçues.",
      ex: "Un robot qui apprend à marcher, ou un programme qui maîtrise un jeu." },
    { q: "Un phénomène physique obéit à des équations connues",
      t: "Modèles guidés par la physique (PINN)", href: "#apprentissage",
      why: "Le réseau apprend des données tout en respectant les lois physiques, ce qui exige moins d’exemples et donne des résultats cohérents.",
      ex: "Simuler l’écoulement de l’air autour d’une aile." },
    { q: "Je veux produire du texte, des images, du son ou du code",
      t: "IA générative", href: "#generative",
      why: "Le modèle a appris la structure de très grands corpus et sait créer de nouveaux contenus réalistes.",
      ex: "Rédiger un résumé, illustrer une idée, proposer du code." },
    { q: "Je veux qu’une IA accomplisse une tâche de bout en bout",
      t: "IA agentique", href: "#generative",
      why: "L’agent perçoit, raisonne, planifie puis utilise des outils pour atteindre l’objectif fixé.",
      ex: "Un assistant qui cherche des informations, remplit un formulaire et envoie le résultat." }
  ];
  var needs = $("needs"), answer = $("answer");
  function show(i) {
    var d = data[i];
    Array.prototype.forEach.call(needs.children, function (b, k) { b.setAttribute("aria-pressed", k === i ? "true" : "false"); });
    answer.innerHTML = "<h3></h3><dl><dt>Pourquoi</dt><dd class=\"w\"></dd><dt>Exemple</dt><dd class=\"e\"></dd></dl><a></a>";
    answer.querySelector("h3").textContent = d.t;
    answer.querySelector(".w").textContent = d.why;
    answer.querySelector(".e").textContent = d.ex;
    var a = answer.querySelector("a"); a.href = d.href; a.textContent = "Voir la section";
    answer.classList.remove("swap"); void answer.offsetWidth; answer.classList.add("swap");
  }
  data.forEach(function (d, i) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "need-btn"; b.textContent = d.q;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", function () { show(i); });
    needs.appendChild(b);
  });
  show(0);

  /* ----- Réseau de neurones animé ----- */
  var svg = $("nn"), ns = "http://www.w3.org/2000/svg";
  var layers = [[45, 90, 135], [25, 68, 112, 155], [60, 120]], xs = [40, 150, 260], pts = [];
  function el(n, a) { var e = document.createElementNS(ns, n); for (var k in a) e.setAttribute(k, a[k]); return e; }
  layers.forEach(function (ys, l) { pts.push(ys.map(function (y) { return [xs[l], y]; })); });
  for (var l = 0; l < pts.length - 1; l++)
    pts[l].forEach(function (p) { pts[l + 1].forEach(function (q) { svg.appendChild(el("line", { x1: p[0], y1: p[1], x2: q[0], y2: q[1] })); }); });
  var n = 0;
  pts.forEach(function (layer) {
    layer.forEach(function (p) {
      var c = el("circle", { cx: p[0], cy: p[1], r: 7 });
      c.style.animationDelay = (n++ % 5) * 0.35 + "s";
      svg.appendChild(c);
    });
  });
})();