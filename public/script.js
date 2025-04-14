document.addEventListener("DOMContentLoaded", () => {
  const reviewForm = document.getElementById("review-form");
  const reviewsList = document.getElementById("reviews-list");
  const titleInput = document.getElementById("movie-title");
  const ratingInput = document.getElementById("rating");
  const reviewTextInput = document.getElementById("review-text");
  const reviewerInput = document.getElementById("reviewer");
  const imageInput = document.getElementById("image");

  let isEditMode = false;
  let editReviewId = null;

  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/reviews");
      const reviews = await response.json();
      displayReviews(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

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
        <p>${review.review}</p>
        <p><strong>Reviewer:</strong> ${review.name}</p>
        ${
          review.imagePath
            ? `<img src="${review.imagePath}" alt="${review.title}" width="150">`
            : ""
        }
      `;

      reviewsList.appendChild(reviewCard);
    });
  };

  reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", titleInput.value);
    formData.append("rating", ratingInput.value);
    formData.append("review", reviewTextInput.value);
    formData.append("name", reviewerInput.value);
    if (imageInput.files[0]) {
      formData.append("coverImage", imageInput.files[0]);
    }

    const url = isEditMode
      ? `http://localhost:8000/api/reviews/${editReviewId}`
      : "http://localhost:8000/api/reviews";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        reviewForm.reset();
        isEditMode = false;
        editReviewId = null;
        reviewForm.querySelector("button").textContent = "Submit Review";
        fetchReviews();
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

  fetchReviews();
});
