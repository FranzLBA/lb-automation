// Gallery loader - images fetched only as they scroll into view via native lazy loading
document.addEventListener('DOMContentLoaded', function() {
  var galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;

  var galleryName = galleryGrid.dataset.gallery;
  if (!galleryName) return;

  fetch('/gallery-images.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var images = data[galleryName];
      if (!images || images.length === 0) {
        galleryGrid.innerHTML = '<p>Ingen billeder fundet.</p>';
        return;
      }
      galleryGrid.innerHTML = '';
      images.forEach(function(src) {
        var link = document.createElement('a');
        link.href = src;
        link.className = 'gallery-item';

        var img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.decoding = 'async';
        img.loading = 'lazy';
        img.onload = function() { link.classList.add('visible'); };

        link.appendChild(img);
        galleryGrid.appendChild(link);
      });
    })
    .catch(function(err) {
      console.error('Error loading gallery:', err);
      galleryGrid.innerHTML = '<p>Kunne ikke indlæse billeder.</p>';
    });
});
