/* Hamburger menu (mobile) */
(function () {
  var nav = document.querySelector(".nav");
  if (!nav) return;

  var btn = document.createElement("button");
  btn.className = "hamburger";
  btn.setAttribute("aria-label", "Menu");
  btn.innerHTML = "<span></span><span></span><span></span>";

  var langToggle = nav.querySelector(".lang-toggle");
  if (langToggle) {
    nav.insertBefore(btn, langToggle.nextSibling);
  } else {
    nav.appendChild(btn);
  }

  var navLinks = nav.querySelector(".nav-links");

  btn.addEventListener("click", function () {
    btn.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      btn.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });
})();

(function () {
  var nav = document.querySelector(".nav-links");
  var indicator = nav.querySelector(".nav-indicator");
  var links = nav.querySelectorAll("a");
  var activeLink = nav.querySelector("a.active");

  function moveIndicator(el) {
    var rect = el.getBoundingClientRect();
    var navRect = nav.getBoundingClientRect();
    var width = rect.width * 0.6;
    var left = rect.left - navRect.left + (rect.width - width) / 2;
    indicator.style.left = left + "px";
    indicator.style.width = width + "px";
  }

  if (activeLink) {
    indicator.style.transition = "none";
    moveIndicator(activeLink);
    // Force reflow before re-enabling transition
    indicator.offsetHeight;
    indicator.style.transition = "";
  }

  links.forEach(function (link) {
    link.addEventListener("mouseenter", function () {
      moveIndicator(link);
    });
  });

  nav.addEventListener("mouseleave", function () {
    if (activeLink) {
      moveIndicator(activeLink);
    }
  });
})();

/* Hero slideshow */
(function () {
  var slides = document.querySelectorAll(".hero-slide");
  if (slides.length < 2) return;

  var current = 0;
  setInterval(function () {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    // Load deferred image on first show
    if (slides[current].dataset.src) {
      slides[current].src = slides[current].dataset.src;
      delete slides[current].dataset.src;
    }
    slides[current].classList.add("active");
  }, 5000);
})();

/* Gallery lightbox with prev/next */
(function () {
  var grid = document.querySelector(".gallery-grid");
  if (!grid) return;

  var currentIndex = 0;

  var lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML =
    '<button class="lightbox-close">&times;</button>' +
    '<button class="lightbox-prev">&#10094;</button>' +
    '<img src="" alt="">' +
    '<button class="lightbox-next">&#10095;</button>';
  document.body.appendChild(lightbox);

  var lbImg = lightbox.querySelector("img");
  var lbClose = lightbox.querySelector(".lightbox-close");
  var lbPrev = lightbox.querySelector(".lightbox-prev");
  var lbNext = lightbox.querySelector(".lightbox-next");

  function getItems() {
    return grid.querySelectorAll(".gallery-item");
  }

  function show(index) {
    var items = getItems();
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    currentIndex = index;
    lbImg.src = items[currentIndex].href;
    lightbox.classList.add("open");
  }

  function close() {
    lightbox.classList.remove("open");
  }

  grid.addEventListener("click", function (e) {
    var item = e.target.closest(".gallery-item");
    if (!item) return;
    e.preventDefault();
    var items = getItems();
    for (var i = 0; i < items.length; i++) {
      if (items[i] === item) { show(i); return; }
    }
  });

  lbClose.addEventListener("click", close);
  lbPrev.addEventListener("click", function () { show(currentIndex - 1); });
  lbNext.addEventListener("click", function () { show(currentIndex + 1); });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(currentIndex - 1);
    if (e.key === "ArrowRight") show(currentIndex + 1);
  });
})();
