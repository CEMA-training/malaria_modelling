{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // JavaScript for participant popup functionality\
document.addEventListener('DOMContentLoaded', function() \{\
  // Create the modal HTML and add it to the body\
  const modalHTML = `\
    <div id="participantModal" class="participant-modal">\
      <div class="participant-modal-content">\
        <span class="participant-modal-close">&times;</span>\
        <div class="participant-modal-header">\
          <img src="" alt="" class="participant-modal-image" id="modal-participant-image">\
          <h2 id="modal-participant-name"></h2>\
          <h3 id="modal-participant-role"></h3>\
        </div>\
        <div class="participant-modal-details">\
          <div class="participant-modal-bio">\
            <h4>About Me</h4>\
            <div id="modal-participant-content"></div>\
          </div>\
          <div class="participant-modal-info">\
            <h4>Contact Information</h4>\
            <div id="modal-participant-contact"></div>\
          </div>\
        </div>\
      </div>\
    </div>\
  `;\
  \
  // Add modal HTML to body\
  document.body.insertAdjacentHTML('beforeend', modalHTML);\
  \
  // Get modal elements\
  const modal = document.getElementById('participantModal');\
  const modalClose = document.querySelector('.participant-modal-close');\
  const modalImage = document.getElementById('modal-participant-image');\
  const modalName = document.getElementById('modal-participant-name');\
  const modalRole = document.getElementById('modal-participant-role');\
  const modalContent = document.getElementById('modal-participant-content');\
  const modalContact = document.getElementById('modal-participant-contact');\
  \
  // Function to setup click events on grid items\
  function setupGridItems() \{\
    const gridItems = document.querySelectorAll('#attendees .quarto-grid-item');\
    \
    gridItems.forEach(item => \{\
      item.addEventListener('click', function() \{\
        // Get the link to the participant's page\
        const link = this.querySelector('a').getAttribute('href');\
        \
        // Get basic info from the card\
        const name = this.querySelector('.listing-title').textContent.trim();\
        const role = this.querySelector('.listing-subtitle').textContent.trim();\
        const image = this.querySelector('.card-img').getAttribute('src');\
        \
        // Set the basic info in the modal\
        modalImage.src = image;\
        modalImage.alt = name;\
        modalName.textContent = name;\
        modalRole.textContent = role;\
        \
        // Fetch the participant's page to get more details\
        fetch(link)\
          .then(response => response.text())\
          .then(html => \{\
            const parser = new DOMParser();\
            const doc = parser.parseFromString(html, 'text/html');\
            \
            // Get the content from the participant's page\
            const mainContent = doc.querySelector('main');\
            \
            // Remove the title (we already have it in the modal header)\
            const title = mainContent.querySelector('h1');\
            if (title) title.remove();\
            \
            // Clean up any metadata\
            const metadata = mainContent.querySelector('.quarto-title-meta');\
            if (metadata) metadata.remove();\
            \
            // Set content in modal\
            modalContent.innerHTML = mainContent.innerHTML;\
            \
            // Try to find contact information\
            let contactHTML = '';\
            const contactHeading = Array.from(mainContent.querySelectorAll('h2, h3, h4')).find(\
              heading => heading.textContent.toLowerCase().includes('contact')\
            );\
            \
            if (contactHeading) \{\
              // Get the contact section content\
              let nextElement = contactHeading.nextElementSibling;\
              contactHTML = '<ul>';\
              \
              while (nextElement && nextElement.tagName !== 'H2' && \
                     nextElement.tagName !== 'H3' && nextElement.tagName !== 'H4') \{\
                if (nextElement.tagName === 'UL') \{\
                  // If it's a list, use its HTML\
                  contactHTML = nextElement.outerHTML;\
                  break;\
                \} else if (nextElement.tagName === 'P') \{\
                  // If it's a paragraph, add as list item\
                  contactHTML += `<li>$\{nextElement.innerHTML\}</li>`;\
                \}\
                nextElement = nextElement.nextElementSibling;\
              \}\
              \
              if (!nextElement || (nextElement.tagName !== 'UL')) \{\
                contactHTML += '</ul>';\
              \}\
            \} else \{\
              // If no contact section found, show a message\
              contactHTML = '<p>No contact information available.</p>';\
            \}\
            \
            modalContact.innerHTML = contactHTML;\
            \
            // Show the modal\
            modal.style.display = 'block';\
          \})\
          .catch(error => \{\
            console.error('Error fetching participant details:', error);\
            // If fetch fails, just show basic info\
            modalContent.innerHTML = '<p>Loading details failed. Please try again.</p>';\
            modalContact.innerHTML = '<p>Contact information unavailable.</p>';\
            modal.style.display = 'block';\
          \});\
      \});\
    \});\
  \}\
  \
  // Close modal when clicking close button\
  modalClose.addEventListener('click', function() \{\
    modal.style.display = 'none';\
  \});\
  \
  // Close modal when clicking outside content\
  window.addEventListener('click', function(event) \{\
    if (event.target === modal) \{\
      modal.style.display = 'none';\
    \}\
  \});\
  \
  // Close modal with Escape key\
  document.addEventListener('keydown', function(event) \{\
    if (event.key === 'Escape' && modal.style.display === 'block') \{\
      modal.style.display = 'none';\
    \}\
  \});\
  \
  // Set up initial grid items\
  setupGridItems();\
  \
  // Use MutationObserver to detect when new grid items are added (pagination)\
  const observer = new MutationObserver(function(mutations) \{\
    mutations.forEach(function(mutation) \{\
      if (mutation.type === 'childList') \{\
        setupGridItems();\
      \}\
    \});\
  \});\
  \
  // Start observing the grid for changes\
  const attendeesContainer = document.getElementById('attendees');\
  if (attendeesContainer) \{\
    observer.observe(attendeesContainer, \{ childList: true, subtree: true \});\
  \}\
\});}