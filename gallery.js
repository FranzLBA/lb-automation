// Gallery loader - loads images individually as the user scrolls
document.addEventListener('DOMContentLoaded', function() {
  var galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;

  var galleryName = galleryGrid.dataset.gallery;
  if (!galleryName) return;

  var BATCH = 9;
  var allImages;
  var nextIndex = 0;

  function createImageObserver(link, img, src) {
    var obs = new IntersectionObserver(function(entries) {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      img.src = src;
      img.onload = function() { link.classList.add('visible'); };
    }, { rootMargin: '100px' });
    obs.observe(link);
  }

  function addBatch() {
    var end = Math.min(nextIndex + BATCH, allImages.length);
    for (var i = nextIndex; i < end; i++) {
      var link = document.createElement('a');
      link.href = allImages[i];
      link.className = 'gallery-item';

      var img = document.createElement('img');
      img.alt = '';
      img.decoding = 'async';
      img.loading = 'lazy';

      link.appendChild(img);
      galleryGrid.appendChild(link);

      createImageObserver(link, img, allImages[i]);
    }
    nextIndex = end;

    if (nextIndex < allImages.length) {
      watchLastItem();
    }
  }

  function watchLastItem() {
    var sentinel = galleryGrid.lastElementChild;
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        obs.disconnect();
        addBatch();
      }
    }, { rootMargin: '400px' });
    obs.observe(sentinel);
  }

  fetch('/gallery-images.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      allImages = data[galleryName];
      if (!allImages || allImages.length === 0) {
        galleryGrid.innerHTML = '<p>Ingen billeder fundet.</p>';
        return;
      }
      galleryGrid.innerHTML = '';
      addBatch();
    })
    .catch(function(err) {
      console.error('Error loading gallery:', err);
      galleryGrid.innerHTML = '<p>Kunne ikke indlæse billeder.</p>';
    });
});
