document.addEventListener('DOMContentLoaded', function() {
  // Function to find and modify the grid links
  function disableFacultyLinks() {
    // Target all links in the quarto-listing grid
    const gridLinks = document.querySelectorAll('.quarto-listing-container-grid a[href*=".html"]');
    
    gridLinks.forEach(function(link) {
      // Create a div to replace the link
      const div = document.createElement('div');
      // Copy the innerHTML from the link
      div.innerHTML = link.innerHTML;
      // Copy any classes from the link
      if (link.className) {
        div.className = link.className;
      }
      
      // Replace the link with the div
      link.parentNode.replaceChild(div, link);
    });
    
    console.log('Faculty links disabled:', gridLinks.length);
  }
  
  // Initial run
  disableFacultyLinks();
  
  // Run again after a short delay to catch any dynamically loaded content
  setTimeout(disableFacultyLinks, 500);
});