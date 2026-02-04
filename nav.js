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

/* Gallery lightbox */
(function () {
  var items = document.querySelectorAll(".gallery-item");
  if (!items.length) return;

  // Create lightbox element
  var lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = '<button class="lightbox-close">&times;</button><img src="" alt="">';
  document.body.appendChild(lightbox);

  var lbImg = lightbox.querySelector("img");
  var lbClose = lightbox.querySelector(".lightbox-close");

  items.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      lbImg.src = item.href;
      lightbox.classList.add("open");
    });
  });

  lbClose.addEventListener("click", function () {
    lightbox.classList.remove("open");
  });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      lightbox.classList.remove("open");
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      lightbox.classList.remove("open");
    }
  });
})();
