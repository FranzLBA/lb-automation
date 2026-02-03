// Gallery loader - automatically loads images from gallery-images.json
document.addEventListener('DOMContentLoaded', function() {
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;

  // Get which gallery this is from a data attribute
  const galleryName = galleryGrid.dataset.gallery;
  if (!galleryName) return;

  // Load the images JSON
  fetch('gallery-images.json')
    .then(response => response.json())
    .then(data => {
      const images = data[galleryName];
      if (!images || images.length === 0) {
        galleryGrid.innerHTML = '<p>Ingen billeder fundet.</p>';
        return;
      }

      // Clear any existing content
      galleryGrid.innerHTML = '';

      // Create gallery items
      images.forEach(imagePath => {
        const link = document.createElement('a');
        link.href = imagePath;
        link.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';

        link.appendChild(img);
        galleryGrid.appendChild(link);
      });
    })
    .catch(error => {
      console.error('Error loading gallery:', error);
      galleryGrid.innerHTML = '<p>Kunne ikke indlæse billeder.</p>';
    });
});
