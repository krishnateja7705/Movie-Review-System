document.addEventListener("DOMContentLoaded", loadReviews);

async function loadReviews() {
  const res = await fetch("/reviews");
  const reviews = await res.json();
  const container = document.getElementById("reviewsContainer");
  container.innerHTML = "";

  reviews.forEach((r) => {
    const card = document.createElement("div");
    card.className = "col-md-4";
    card.innerHTML = `
      <div class="card p-3 h-100 shadow-sm">
        <h5 class="card-title">${r.movie}</h5>
        <p class="card-text">⭐ Rating: <strong>${r.rating}/10</strong></p>
        <p>${r.comment}</p>
      </div>
    `;
    container.appendChild(card);
  });
}
