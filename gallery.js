// Gallery loader - automatically loads images from gallery-images.json
document.addEventListener('DOMContentLoaded', function() {
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;

  // Get which gallery this is from a data attribute
  const galleryName = galleryGrid.dataset.gallery;
  if (!galleryName) return;

  // Hide gallery initially
  galleryGrid.style.opacity = '0';

  // Load the images JSON
  fetch('gallery-images.json')
    .then(response => response.json())
    .then(data => {
      const images = data[galleryName];
      if (!images || images.length === 0) {
        galleryGrid.innerHTML = '<p>Ingen billeder fundet.</p>';
        galleryGrid.style.opacity = '1';
        return;
      }

      // Clear any existing content
      galleryGrid.innerHTML = '';

      let loadedCount = 0;
      const firstBatch = Math.min(6, images.length); // Wait for first 6 images

      // Create gallery items
      images.forEach((imagePath) => {
        const link = document.createElement('a');
        link.href = imagePath;
        link.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';

        // Track when first batch loads to show gallery
        img.onload = function() {
          loadedCount++;
          if (loadedCount === firstBatch) {
            galleryGrid.style.opacity = '1';
          }
        };

        link.appendChild(img);
        galleryGrid.appendChild(link);
      });

      // Fallback: show gallery after 2 seconds regardless
      setTimeout(() => {
        galleryGrid.style.opacity = '1';
      }, 2000);
    })
    .catch(error => {
      console.error('Error loading gallery:', error);
      galleryGrid.innerHTML = '<p>Kunne ikke indlæse billeder.</p>';
      galleryGrid.style.opacity = '1';
    });
});
