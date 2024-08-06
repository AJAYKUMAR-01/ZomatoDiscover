let currentPage = 1; 
const totalPages = 100;

document.addEventListener("DOMContentLoaded", () => {
  const storedPage = localStorage.getItem("currentPage");
  if (storedPage) {
    currentPage = parseInt(storedPage);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const restaurantId = urlParams.get("id");
  if (restaurantId) {
    fetch(`/api/restaurants/${restaurantId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        const restaurantDetails = document.getElementById("restaurant-details");
        if (!data || !data.name) {
          restaurantDetails.innerHTML = "<p>Restaurant not found.</p>";
          return;
        }
        const ratingText = data.user_rating
          ? data.user_rating.rating_text
          : "Not Rated";
        const aggregateRating = data.user_rating
          ? data.user_rating.aggregate_rating
          : "N/A";

        restaurantDetails.innerHTML = `
        <div class="restaurant-detail">
        <div class="restaurant-image">
            <img src="${data.featured_image}" alt="Restaurant Image">
        </div>
        <div class="restaurant-info">
            <h1>${data.name}</h1>
            <p><strong>Cuisines :</strong> ${data.cuisines}</p>
            <p><strong>Address :</strong> ${data.location_address}</p>
            <p><strong>Average Cost for Two :</strong> ${data.average_cost_for_two}</p>
            <p>
              <strong>Rating :</strong>
              <span style="background-color: #${data.rating_color}; color: white; border-radius: 3px; padding: 1px 7px 1px 4px;">&starf; ${data.user_rating} </span>  
            </p>
            <p><strong>No. of People Rated :</strong> ${data.votes}</p>
            <p><strong>Has Online Delivery :</strong> ${data.has_online_delivery == 1 ? "Yes" : "No"}</p>
            <div class="view-zomato">
            <p><a href="${
              data.url
            }" target="_blank"><button>View on Zomato</button></a></p>
        </div>
        </div>        
        </div>
            `;
      })
      .catch((error) => {
        console.error("Error fetching restaurant details:", error);
        const restaurantDetails = document.getElementById("restaurant-details");
        restaurantDetails.innerHTML =
          "<p>Error fetching restaurant details.</p>";
      });
  }

  renderData();
});




function renderData() {
  fetch(`/api/restaurants/?page=${currentPage}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const restaurantList = document.getElementById("restaurant-list");
      restaurantList.innerHTML = '';

      if (!data || !Array.isArray(data)) {
        console.error("Error: Invalid data format received from API");
        return;
      }
      data.forEach((restaurant) => {
        const restaurantItem = document.createElement("div");
        restaurantItem.classList.add("restaurant-card");
        restaurantItem.innerHTML = `
                    <div class="card-image">
                        <img src="${restaurant.featured_image}" alt="Restaurant Image">
                    </div>
                    <div class="card-details">
                        <h1>${restaurant.name}</h1>
                        <p><strong>Rating :</strong> ${restaurant.user_rating}</p>
                        <p><strong>Cuisines :</strong> ${restaurant.cuisines}</p>
                        <a href="/details/?id=${restaurant.id}"><button>View Details</button></a>
                    </div>
                `;
        restaurantList.appendChild(restaurantItem);
      });

      renderPagination();
    })
    .catch((error) => console.error("Error fetching restaurant list:", error));

  // RandomRestaurant();
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.innerText = "Previous";
    prevButton.onclick = () => changePage(currentPage - 1);
    pagination.appendChild(prevButton);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.innerText = i;
    if (i === currentPage) {
      pageButton.classList.add("active");
    }
    pageButton.onclick = () => changePage(i);
    pagination.appendChild(pageButton);
  }

  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.innerText = "Next";
    nextButton.onclick = () => changePage(currentPage + 1);
    pagination.appendChild(nextButton);
  }
}

function changePage(page) {
  localStorage.setItem("currentPage", page);
  currentPage = page;
  renderData();

}

//-------------------------------------------------------------------------------------

function RandomRestaurant(){
  // console.log("Hello");
  if (true) {
    fetch(`/api/random`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        const restaurantDetails = document.getElementById("random-restaurant");
        if (!data || !data.name) {
          restaurantDetails.innerHTML = "<p>Restaurant not found.</p>";
          return;
        }

        restaurantDetails.innerHTML = `
        <div class="random-restaurant-detail">
        <div class="random-restaurant-image">
            <img src="${data.featured_image}" alt="Restaurant Image">
        </div>
        <div class="random-restaurant-info">
            <h1>${data.name}</h1>
            <p><strong>Cuisines :</strong> ${data.cuisines}</p>
            <p><strong>Address :</strong> ${data.location_address}</p>
            <p><strong>Average Cost for Two :</strong> ${data.average_cost_for_two}</p>
            <p>
              <strong>Rating :</strong>
              <span style="background-color: #${data.rating_color}; color: white; border-radius: 3px; padding: 1px 7px 1px 4px;">&starf; ${data.user_rating} </span>  
            </p>
            <p><strong>No. of People Rated :</strong> ${data.votes}</p>
            <p><strong>Has Online Delivery :</strong> ${data.has_online_delivery == 1 ? "Yes" : "No"}</p>
            <div class="view-zomato">
            <p><a href="${
              data.url
            }" target="_blank"><button>View on Zomato</button></a></p>
        </div>
        </div>        
        </div>
            `;
      })
      .catch((error) => {
        console.error("Error fetching restaurant details:", error);
        const restaurantDetails = document.getElementById("restaurant-details");
        restaurantDetails.innerHTML =
          "<p>Error fetching restaurant details.</p>";
      });
  }
};