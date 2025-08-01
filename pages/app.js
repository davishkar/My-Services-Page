// Firebase Configuration
    const firebaseConfig = {
      apiKey: "AIzaSyAP-MhbZCeigYuKVSDlidl-SJPkwJnaiA8",
      authDomain: "avishkarstudio-82406.firebaseapp.com",
      projectId: "avishkarstudio-82406",
      storageBucket: "avishkarstudio-82406.firebasestorage.app",
      messagingSenderId: "365415246841",
      appId: "1:365415246841:web:858339693f2a1762d96b28",
      measurementId: "G-597DBSP668"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    let selectedRating = 5;

    // DOM Elements
    const stars = document.querySelectorAll('.star');
    const reviewForm = document.getElementById('reviewForm');
    const submitBtn = document.getElementById('submitBtn');
    const scrollTopBtn = document.getElementById('scrollTop');

    // Initialize Application
    document.addEventListener('DOMContentLoaded', function() {
      initializeStarRating();
      initializeScrollToTop();
      loadReviews();
      
      // Add form submission handler
      reviewForm.addEventListener('submit', handleFormSubmit);
    });

    // Star Rating Functionality
    function initializeStarRating() {
      stars.forEach(star => {
        star.addEventListener('click', () => {
          selectedRating = parseInt(star.dataset.rating);
          updateStarDisplay();
        });

        star.addEventListener('mouseenter', () => {
          const hoverRating = parseInt(star.dataset.rating);
          highlightStars(hoverRating);
        });
      });

      document.getElementById('starRating').addEventListener('mouseleave', () => {
        updateStarDisplay();
      });

      // Initialize with 5 stars selected
      updateStarDisplay();
    }

    function highlightStars(rating) {
      stars.forEach((star, index) => {
        if (index < rating) {
          star.classList.add('active');
        } else {
          star.classList.remove('active');
        }
      });
    }

    function updateStarDisplay() {
      highlightStars(selectedRating);
    }

    // Form Submission
    function handleFormSubmit(e) {
      e.preventDefault();
      submitReview();
    }

    function submitReview() {
      const name = document.getElementById("userName").value.trim();
      const email = document.getElementById("userEmail").value.trim();
      const review = document.getElementById("userReview").value.trim();
      
      // Validation
      if (!name || !email || !review) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
      }

      // Show loading state
      setSubmitButtonLoading(true);

      // Submit to Firebase
      db.collection("reviews").add({
        name: name,
        email: email,
        review: review,
        rating: selectedRating,
        timestamp: new Date(),
        approved: true // Auto-approve for now, you can add moderation later
      }).then(() => {
        // Success
        resetForm();
        setSubmitButtonLoading(false);
        showNotification('Thank you for your review! It has been submitted successfully.', 'success');
        loadReviews();
        
        // Scroll to reviews section
        setTimeout(() => {
          document.getElementById('reviewsList').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 1000);
      }).catch((error) => {
        console.error("Error adding review: ", error);
        setSubmitButtonLoading(false);
        showNotification('Error submitting review. Please try again.', 'error');
      });
    }

    function resetForm() {
      reviewForm.reset();
      selectedRating = 5;
      updateStarDisplay();
    }

    function setSubmitButtonLoading(loading) {
      if (loading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';
      } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Review';
      }
    }

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    // Load and Display Reviews
    function loadReviews() {
      const reviewsList = document.getElementById('reviewsList');
      
      db.collection("reviews")
        .where("approved", "==", true)
        .orderBy("timestamp", "desc")
        .get()
        .then(snapshot => {
          let total = 0, count = 0;
          const ratingCounts = {1:0, 2:0, 3:0, 4:0, 5:0};
          const reviewsHtml = [];

          if (snapshot.empty) {
            reviewsList.innerHTML = `
              <div class="no-reviews">
                <i class="fas fa-star-half-alt"></i>
                <div>No reviews yet. Be the first to share your experience!</div>
              </div>
            `;
            updateRatingDisplay(0, 0, ratingCounts);
            return;
          }

          snapshot.forEach(doc => {
            const data = doc.data();
            total += data.rating;
            count++;
            ratingCounts[data.rating]++;
            
            // Create review HTML
            const reviewDate = data.timestamp ? 
              formatDate(data.timestamp.toDate()) : 'Recent';
            const initials = getInitials(data.name);
            
            reviewsHtml.push(createReviewHTML(data, initials, reviewDate));
          });

          // Update displays
          updateRatingDisplay(total, count, ratingCounts);
          reviewsList.innerHTML = reviewsHtml.join('');
          
          // Add entrance animation to reviews
          animateReviews();
        })
        .catch((error) => {
          console.error("Error loading reviews: ", error);
          reviewsList.innerHTML = `
            <div class="no-reviews">
              <i class="fas fa-exclamation-triangle"></i>
              <div>Error loading reviews. Please refresh the page.</div>
            </div>
          `;
        });
    }

    function createReviewHTML(data, initials, reviewDate) {
      const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);
      
      return `
        <div class="review-item" style="animation-delay: ${Math.random() * 0.5}s">
          <div class="review-header">
            <div class="reviewer-info">
              <div class="reviewer-avatar">${initials}</div>
              <div class="reviewer-details">
                <h4>${escapeHtml(data.name)}</h4>
                <p><i class="fas fa-calendar-alt"></i> ${reviewDate}</p>
              </div>
            </div>
            <div class="review-rating" title="${data.rating} out of 5 stars">
              ${stars}
            </div>
          </div>
          <div class="review-text">${escapeHtml(data.review)}</div>
        </div>
      `;
    }

    function updateRatingDisplay(total, count, ratingCounts) {
      const avg = count ? (total / count).toFixed(1) : '0.0';
      
      // Update overall rating
      document.getElementById('overallRating').textContent = avg;
      document.getElementById('ratingText').textContent = 
        `Based on ${count} review${count !== 1 ? 's' : ''}`;
      
      // Update star display
      updateOverallStars(parseFloat(avg));
      
      // Update rating bars with animation
      Object.keys(ratingCounts).forEach(rating => {
        const percentage = count ? (ratingCounts[rating] / count * 100) : 0;
        const bar = document.getElementById(`bar-${rating}`);
        const countElement = document.getElementById(`count-${rating}`);
        
        // Animate bar width
        setTimeout(() => {
          bar.style.width = percentage + '%';
        }, 200);
        
        // Animate count
        animateNumber(countElement, 0, ratingCounts[rating], 1000);
      });
    }

    function updateOverallStars(rating) {
      const starsContainer = document.getElementById('overallStars');
      const fullStars = Math.floor(rating);
      const hasHalfStar = (rating % 1) >= 0.5;
      let starsHtml = '';
      
      for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
          starsHtml += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
          starsHtml += '<i class="fas fa-star-half-alt"></i>';
        } else {
          starsHtml += '<i class="far fa-star"></i>';
        }
      }
      
      starsContainer.innerHTML = starsHtml;
    }

    // Utility Functions
    function getInitials(name) {
      return name.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }

    function formatDate(date) {
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      return date.toLocaleDateString('en-US', options);
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function animateNumber(element, start, end, duration) {
      const range = end - start;
      const minTimer = 50;
      const stepTime = Math.abs(Math.floor(duration / range));
      const timer = Math.max(stepTime, minTimer);
      const startTime = new Date().getTime();
      const endTime = startTime + duration;
      
      function run() {
        const now = new Date().getTime();
        const remaining = Math.max((endTime - now) / duration, 0);
        const value = Math.round(end - (remaining * range));
        element.textContent = value;
        
        if (value === end) {
          clearInterval(counter);
        }
      }
      
      const counter = setInterval(run, timer);
      run();
    }

    function animateReviews() {
      const reviews = document.querySelectorAll('.review-item');
      reviews.forEach((review, index) => {
        review.style.animation = `scaleIn 0.6s ease-out ${index * 0.1}s both`;
      });
    }

    // Scroll to Top Functionality
    function initializeScrollToTop() {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          scrollTopBtn.classList.add('visible');
        } else {
          scrollTopBtn.classList.remove('visible');
        }
      });

      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // Notification System
    function showNotification(message, type = 'info') {
      // Remove existing notifications
      const existingNotifications = document.querySelectorAll('.notification');
      existingNotifications.forEach(n => n.remove());

      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">
          <i class="fas fa-times"></i>
        </button>
      `;

      // Add notification styles
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-gradient)' : 
                    type === 'error' ? 'var(--danger-gradient)' : 
                    'var(--primary-gradient)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
        animation: slideInRight 0.5s ease-out;
      `;

      document.body.appendChild(notification);

      // Close functionality
      const closeBtn = notification.querySelector('.notification-close');
      closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
      });

      // Auto close after 5 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.style.animation = 'slideOutRight 0.5s ease-out';
          setTimeout(() => notification.remove(), 500);
        }
      }, 5000);
    }

    // Add notification animations to CSS
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
      
      .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0.8;
        transition: opacity 0.2s;
        margin-left: auto;
      }
      
      .notification-close:hover {
        opacity: 1;
      }
    `;
    document.head.appendChild(notificationStyles);