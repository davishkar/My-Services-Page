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
const DEVICE_REVIEW_KEY = 'avishkar_review_submitted';

function hasDeviceSubmittedReview() {
  return localStorage.getItem(DEVICE_REVIEW_KEY) === 'true';
}

function markDeviceAsSubmitted() {
  localStorage.setItem(DEVICE_REVIEW_KEY, 'true');
}

function checkDeviceStatus() {
  if (hasDeviceSubmittedReview()) {
    disableReviewForm();
    showAlreadySubmittedMessage();
  }
}

function disableReviewForm() {
  const form = document.getElementById('reviewForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !submitBtn) return;

  const inputs = form.querySelectorAll('input, textarea, button');
  inputs.forEach(input => input.disabled = true);

  submitBtn.innerHTML = '<i class="fas fa-ban"></i> Review Already Submitted';
  submitBtn.style.backgroundColor = '#6c757d';
  submitBtn.style.cursor = 'not-allowed';
}

function showAlreadySubmittedMessage() {
  const formTitle = document.querySelector('.form-title');
  if (!formTitle) return;

  const messageDiv = document.createElement('div');
  messageDiv.className = 'already-submitted-message';
  messageDiv.innerHTML = `
    <div style="background: linear-gradient(135deg, #ff6b6b, #ee5a52); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);">
      <i class="fas fa-info-circle" style="font-size: 24px; margin-bottom: 10px;"></i>
      <h4 style="margin: 10px 0; font-size: 18px;">Review Already Submitted</h4>
      <p style="margin: 0; opacity: 0.9;">You have already submitted a review from this device. Thank you for your feedback!</p>
    </div>`;

  formTitle.insertAdjacentElement('afterend', messageDiv);
}

const stars = document.querySelectorAll('.star');
if (stars.length) {
  stars.forEach(star => {
    star.addEventListener('click', () => {
      if (!hasDeviceSubmittedReview()) {
        selectedRating = parseInt(star.dataset.rating);
        updateStarDisplay();
      }
    });
    star.addEventListener('mouseenter', () => {
      if (!hasDeviceSubmittedReview()) {
        highlightStars(parseInt(star.dataset.rating));
      }
    });
  });
}

const starRating = document.getElementById('starRating');
if (starRating) {
  starRating.addEventListener('mouseleave', () => {
    if (!hasDeviceSubmittedReview()) updateStarDisplay();
  });
}

function highlightStars(rating) {
  stars.forEach((star, index) => {
    star.classList.toggle('active', index < rating);
  });
}

function updateStarDisplay() {
  highlightStars(selectedRating);
}

updateStarDisplay();

const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
  reviewForm.addEventListener('submit', function(e) {
    e.preventDefault();
    submitReview();
  });
}

function submitReview() {
  if (hasDeviceSubmittedReview()) {
    alert('You have already submitted a review from this device.');
    return;
  }

  const name = document.getElementById("userName")?.value.trim();
  const email = document.getElementById("userEmail")?.value.trim();
  const review = document.getElementById("userReview")?.value.trim();

  if (!name || !email || !review) {
    alert('Please fill in all required fields.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
  const originalContent = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

  db.collection("reviews").add({
    name, email, review,
    rating: selectedRating,
    timestamp: new Date(),
    deviceId: generateDeviceId()
  }).then(() => {
    markDeviceAsSubmitted();
    reviewForm.reset();
    selectedRating = 5;
    updateStarDisplay();
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalContent;
    alert('Thank you for your review!');
    loadReviews();
    setTimeout(() => {
      disableReviewForm();
      showAlreadySubmittedMessage();
    }, 1000);
  }).catch(error => {
    console.error("Error adding review:", error);
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalContent;
    alert('Error submitting review. Please try again.');
  });
}

function generateDeviceId() {
  let deviceId = localStorage.getItem('avishkar_device_id');
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('avishkar_device_id', deviceId);
  }
  return deviceId;
}

function loadReviews() {
  db.collection("reviews").orderBy("timestamp", "desc").get().then(snapshot => {
    let total = 0, count = 0;
    const ratingCounts = {1:0,2:0,3:0,4:0,5:0};
    const reviewsHtml = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      total += data.rating;
      count++;
      ratingCounts[data.rating]++;

      let reviewDate = 'Recent';
      if (data.timestamp) {
        reviewDate = formatReviewDateDetailed(data.timestamp.toDate());
      }
      const initials = data.name.split(' ').map(n => n[0]).join('').toUpperCase();

      reviewsHtml.push(`
        <div class="review-item animate__animated animate__fadeInUp">
          <div class="review-header">
            <div class="reviewer-info">
              <div class="reviewer-avatar">${initials}</div>
              <div class="reviewer-details">
                <h4>${escapeHtml(data.name)}</h4>
                <p>${reviewDate}</p>
              </div>
            </div>
            <div class="review-rating">
              ${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)}
            </div>
          </div>
          <div class="review-text">${escapeHtml(data.review)}</div>
        </div>
      `);
    });

    const avg = count ? (total / count).toFixed(1) : 0;
    document.getElementById('overallRating').textContent = avg;
    document.getElementById('ratingText').textContent = `Based on ${count} review${count !== 1 ? 's' : ''}`;
    updateOverallStars(parseFloat(avg));

    Object.keys(ratingCounts).forEach(rating => {
      const percentage = count ? (ratingCounts[rating] / count * 100) : 0;
      const bar = document.getElementById(`bar-${rating}`);
      if (bar) {
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.transition = 'width 1s ease-in-out';
          bar.style.width = percentage + '%';
        }, 200);
      }
      const countElem = document.getElementById(`count-${rating}`);
      if (countElem) countElem.textContent = ratingCounts[rating];
    });

    const reviewsList = document.getElementById('reviewsList');
    if (reviewsList) {
      reviewsList.innerHTML = reviewsHtml.length > 0
        ? reviewsHtml.join('')
        : '<div class="no-reviews">No reviews yet. Be the first to share your experience!</div>';
    }
  }).catch(error => {
    console.error("Error loading reviews:", error);
    const reviewsList = document.getElementById('reviewsList');
    if (reviewsList) {
      reviewsList.innerHTML = '<div class="no-reviews">Error loading reviews. Please refresh the page.</div>';
    }
  });
}

function updateOverallStars(rating) {
  const starsContainer = document.getElementById('overallStars');
  if (!starsContainer) return;

  const fullStars = Math.floor(rating);
  const hasHalfStar = (rating % 1) >= 0.5;
  let starsHtml = '';

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) starsHtml += '<i class="fas fa-star"></i>';
    else if (i === fullStars && hasHalfStar) starsHtml += '<i class="fas fa-star-half-alt"></i>';
    else starsHtml += '<i class="far fa-star"></i>';
  }

  starsContainer.innerHTML = starsHtml;
}

function formatReviewDateDetailed(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', function () {
  checkDeviceStatus();
  loadReviews();
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', function () {
      if (!hasDeviceSubmittedReview()) {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.2s ease';
      }
    });
    input.addEventListener('blur', function () {
      this.style.transform = 'scale(1)';
    });
  });
});
db.collection("reviews").orderBy("timestamp", "desc").get().then(snapshot => {
  const firebaseReviews = [];

  snapshot.forEach(doc => {
    const data = doc.data();

    firebaseReviews.push({
      name: data.name,
      rating: data.rating,
      text: data.review,
      date: data.timestamp?.toDate() || new Date()
    });
  });

  // Pass reviews to index.html slider
  if (typeof window.onFirebaseReviewsLoaded === 'function') {
    window.onFirebaseReviewsLoaded(firebaseReviews);
  } else {
    console.warn("onFirebaseReviewsLoaded not found.");
  }
});
