document.addEventListener("DOMContentLoaded", () => {
  const reviewForm = document.getElementById("review-form");
  const reviewsList = document.getElementById("reviews-list");

  // Function to fetch and display reviews
  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/reviews");
      const reviews = await response.json();
      displayReviews(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Function to display reviews in the UI
  const displayReviews = (reviews) => {
    reviewsList.innerHTML = "";
    if (reviews.length === 0) {
      reviewsList.innerHTML = "<p>No reviews yet.</p>";
      return;
    }
    reviews.forEach((review) => {
      const reviewCard = document.createElement("div");
      reviewCard.classList.add("review-card");
      reviewCard.innerHTML = `
                <h3>${review.title}</h3>
                <p class="rating">Rating: ${review.rating}/5</p>
                <p>${review.text}</p>
            `;
      reviewsList.appendChild(reviewCard);
    });
  };

  // Event listener for submitting a new review
  reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("movie-title").value;
    const rating = document.getElementById("rating").value;
    const text = document.getElementById("review-text").value;

    const newReview = { title, rating: parseInt(rating), text };

    try {
      const response = await fetch("http://localhost:8000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        reviewForm.reset();
        fetchReviews(); // Refresh the review list
      } else {
        const errorData = await response.json();
        console.error("Error submitting review:", errorData);
        alert("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  });

  // Initial fetch of reviews when the page loads
  fetchReviews();
});
