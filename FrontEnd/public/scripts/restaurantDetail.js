

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/restaurants')
        .then(response => response.json())
        .then(data => {
            const restaurantList = document.getElementById('restaurant-list');

            
            if (!data || !Array.isArray(data)) {
                console.error('Error: Invalid data format received from API');
                return;
            }

            
            data.forEach(restaurant => {
                const restaurantItem = document.createElement('div');
                restaurantItem.classList.add('restaurant-item');
                restaurantItem.innerHTML = `<a href="/api/restaurants/${restaurant.id}">${restaurant.name}</a>`;
                restaurantList.appendChild(restaurantItem);
            });
        })
        .catch(error => console.error('Error fetching restaurant list:', error));
});


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id'); 
    fetch(`/api/restaurants/${restaurantId}`)
        .then(response => response.json())
        .then(data => {
            const restaurantDetails = document.getElementById('restaurant-details');
            const ratingText = data.user_rating ? data.user_rating.rating_text : 'Not Rated';
            const aggregateRating = data.user_rating ? data.user_rating.aggregate_rating : 'N/A';
            restaurantDetails.innerHTML = `
                <h2>${data.name}</h2>
                <p><strong>Cuisines:</strong> ${data.cuisines}</p>
                <p><strong>Rating:</strong> ${data.user_rating.rating_text} (${data.user_rating.aggregate_rating})</p>
                <p><strong>Votes:</strong> ${data.user_rating.votes}</p>
                <img src="${data.featured_image}" alt="Restaurant Image" style="max-width: 300px;">
                <p><a href="${data.url}" target="_blank">View on Zomato</a></p>
            `;
        })
        .catch(error => console.error('Error fetching restaurant details:', error));
});


