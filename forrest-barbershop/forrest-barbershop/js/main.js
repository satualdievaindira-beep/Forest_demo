// Forrest Gump Barbershop — demo scripts
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // ---------- Год в футере ----------
  $("#year").textContent = new Date().getFullYear();

  // ---------- Мобильное меню ----------
  var burger = $("#burger");
  var nav = $("#nav");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  }
  burger.addEventListener("click", function () {
    setMenu(!nav.classList.contains("is-open"));
  });
  $$("a", nav).forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });

  // ---------- Счётчики ----------
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var div = parseFloat(el.dataset.div || 1);
    var start = null;
    var duration = 1200;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var val = (target * p) / div;
      el.textContent = div > 1 ? val.toFixed(1) : Math.round(val);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = $$("[data-count]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { io.observe(c); });
  } else {
    counters.forEach(animateCount);
  }

  // ---------- Вкладки цен ----------
  var tabs = $$(".tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
      });
      $$(".tabpane").forEach(function (p) { p.classList.remove("is-active"); });
      $("#pane-" + tab.dataset.tab).classList.add("is-active");
    });
  });

  // ---------- Отзывы ----------
  var reviews = $$(".review");
  var current = 0;
  function showReview(i) {
    current = (i + reviews.length) % reviews.length;
    reviews.forEach(function (r, idx) { r.classList.toggle("is-active", idx === current); });
    $("#review-count").textContent = (current + 1) + " / " + reviews.length;
  }
  $("#prev").addEventListener("click", function () { showReview(current - 1); });
  $("#next").addEventListener("click", function () { showReview(current + 1); });
  setInterval(function () { showReview(current + 1); }, 9000);

  // ---------- Галерея ----------
  var lightbox = $("#lightbox");
  function closeLightbox() { lightbox.hidden = true; }
  $$(".shot").forEach(function (shot) {
    shot.addEventListener("click", function () {
      $("#lightbox-title").textContent = shot.dataset.title + " — здесь будет фото";
      lightbox.hidden = false;
      $("#lightbox-close").focus();
    });
  });
  $("#lightbox-close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });

  // ---------- Форма записи ----------
  var form = $("#form");
  var dateInput = $("#f-date");
  var timeSelect = $("#f-time");

  var today = new Date();
  var iso = today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");
  dateInput.min = iso;
  dateInput.value = iso;

  // Слоты времени каждые 30 минут
  for (var h = 10; h < 21; h++) {
    ["00", "30"].forEach(function (m) {
      var opt = document.createElement("option");
      opt.textContent = String(h).padStart(2, "0") + ":" + m;
      timeSelect.appendChild(opt);
    });
  }

  function setError(input, errId, msg) {
    $(errId).textContent = msg;
    input.classList.toggle("bad", Boolean(msg));
    return !msg;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("#f-name");
    var phone = $("#f-phone");
    var okName = setError(name, "#e-name", name.value.trim().length < 2 ? "Введите имя" : "");
    var digits = phone.value.replace(/\D/g, "");
    var okPhone = setError(phone, "#e-phone", digits.length < 9 ? "Введите телефон полностью" : "");
    var okDate = setError(dateInput, "#e-date", dateInput.value ? "" : "Выберите дату");
    if (!(okName && okPhone && okDate)) return;

    var msg = $("#form-ok");
    msg.hidden = false;
    msg.textContent = name.value.trim() + ", заявка принята: " + $("#f-service").value +
      ", " + dateInput.value + " в " + timeSelect.value + ". Мы напишем вам для подтверждения.";
    form.reset();
    dateInput.value = iso;
  });
})();
