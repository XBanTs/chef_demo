// Sample data for chefs (including latitude and longitude)
// Sample chefs data with rates and ratings
const chefs = [
    {
        name: "Chef John",
        image: "images/chef1.jpg",
        description: "Specializes in Italian Cuisine",
        services: ["Private Dinner", "Cooking Class"],
        latitude: 40.7128,   // Example coordinates (New York City)
        longitude: -74.0060, // New York City
        rate: "$100 per hour", // Adding the rate for Chef John
        rating: 4.5 // Adding the rating (average rating)
    },
    {
        name: "Chef Sarah",
        image: "images/chef2.jpg",
        description: "Vegan & Plant-Based Dishes",
        services: ["Vegan Catering", "Meal Delivery"],
        latitude: 34.0522,   // Example coordinates (Los Angeles)
        longitude: -118.2437, // Los Angeles
        rate: "$80 per hour", // Adding the rate for Chef Sarah
        rating: 4.0 // Adding the rating (average rating)
    },
    {
        name: "Chef Maria",
        image: "images/chef3.jpg",
        description: "Expert in Mediterranean Cuisine",
        services: ["Private Dining", "Event Catering"],
        latitude: 51.5074,   // Example coordinates (London)
        longitude: -0.1278,  // London
        rate: "$120 per hour", // Adding the rate for Chef Maria
        rating: 4.8 // Adding the rating (average rating)
    }
];

// Function to render chefs with rates and star ratings
function renderChefs() {
    const chefList = document.getElementById('chef-list'); // Get the container for the chef cards

    chefs.forEach(chef => {
        // Create a new chef card div
        const chefCard = document.createElement('div');
        chefCard.classList.add('chef-card');
        
        // Create and append the chef image
        const chefImg = document.createElement('img');
        chefImg.src = chef.image; // Path to the chef's image
        chefImg.alt = `Image of ${chef.name}`;
        chefImg.classList.add('chef-img');
        chefCard.appendChild(chefImg);
        
        // Create and append the chef name
        const chefName = document.createElement('h3');
        chefName.textContent = chef.name;
        chefCard.appendChild(chefName);
        
        // Create and append the chef description
        const chefDescription = document.createElement('p');
        chefDescription.textContent = chef.description;
        chefCard.appendChild(chefDescription);

        // Create and append the services list
        const chefServices = document.createElement('ul');
        chef.services.forEach(service => {
            const serviceItem = document.createElement('li');
            serviceItem.textContent = service;
            chefServices.appendChild(serviceItem);
        });
        chefCard.appendChild(chefServices);

        // Create and append the rate
        const chefRate = document.createElement('p');
        chefRate.classList.add('chef-rate');
        chefRate.textContent = chef.rate;
        chefCard.appendChild(chefRate);
        
        // Create the star rating
        const starRating = document.createElement('div');
        starRating.classList.add('star-rating');
        
        // Generate filled and empty stars based on rating
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.classList.add('star');
            
            if (i <= Math.floor(chef.rating)) {
                star.innerHTML = '&#9733;';  // Filled star
            } else if (i === Math.ceil(chef.rating) && chef.rating % 1 !== 0) {
                star.innerHTML = '&#9733;';  // Filled star for the decimal part
                star.style.color = '#ff9800'; // Color the partially filled star
            } else {
                star.innerHTML = '&#9734;';  // Empty star
            }
            starRating.appendChild(star);
        }

        // Add the rating number in parentheses
        const ratingNumber = document.createElement('span');
        ratingNumber.classList.add('rating-number');
        ratingNumber.textContent = `(${chef.rating.toFixed(1)})`;
        starRating.appendChild(ratingNumber);

        chefCard.appendChild(starRating);

        // Append the chef card to the chef list container
        chefList.appendChild(chefCard);
    });
}

// Call the function to render chefs when the page loads
window.onload = renderChefs;



// Display chefs dynamically on page load
window.onload = function() {
    const chefList = document.getElementById('chef-list');
    chefs.forEach(chef => {
        const chefCard = document.createElement('div');
        chefCard.className = "chef-card";
        chefCard.innerHTML = `
            <img src="${chef.image}" alt="${chef.name}">
            <h3>${chef.name}</h3>
            <p>${chef.description}</p>
            <button onclick="showBookingModal('${chef.name}')">Book Chef</button>
        `;
        chefList.appendChild(chefCard);
    });

    getLocation(); // Get user's location on load
};

// Geolocation API to get the user's current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayLocation, showError);
    } else {
        document.getElementById("location").innerHTML = "Geolocation is not supported by this browser.";
    }
}

// Display Location
function displayLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const location = `Latitude: ${latitude}, Longitude: ${longitude}`;
    document.getElementById("location").innerHTML = location;

    // Store user location globally for later use
    window.userLocation = { latitude, longitude };
}

// Handle Geolocation Errors
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById("location").innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById("location").innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById("location").innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById("location").innerHTML = "An unknown error occurred.";
            break;
    }
}

// Haversine formula to calculate distance between two points (in kilometers)
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

// Find chefs within 50km of the user's location
function findNearbyChefs() {
    if (!window.userLocation) {
        alert("Unable to fetch your location.");
        return;
    }

    const userLat = window.userLocation.latitude;
    const userLon = window.userLocation.longitude;

    const nearbyChefs = chefs.filter(chef => {
        const distance = haversine(userLat, userLon, chef.latitude, chef.longitude);
        return distance <= 50; // Only chefs within 50 kilometers
    });

    displayNearbyChefs(nearbyChefs);
}

// Display chefs who are nearby
function displayNearbyChefs(nearbyChefs) {
    const nearbyChefsDiv = document.getElementById('nearbyChefs');
    nearbyChefsDiv.innerHTML = ''; // Clear previous results

    if (nearbyChefs.length === 0) {
        nearbyChefsDiv.innerHTML = "<p>No chefs found within 50 km of your location.</p>";
        return;
    }

    nearbyChefs.forEach(chef => {
        const chefCard = document.createElement('div');
        chefCard.className = "chef-card";
        chefCard.innerHTML = `
            <img src="${chef.image}" alt="${chef.name}">
            <h3>${chef.name}</h3>
            <p>${chef.description}</p>
            <button onclick="showBookingModal('${chef.name}')">Book Chef</button>
        `;
        nearbyChefsDiv.appendChild(chefCard);
    });
}

// Search functionality (filter chefs by name or description)
function searchChefs() {
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();
    const filteredChefs = chefs.filter(chef =>
        chef.name.toLowerCase().includes(searchQuery) || chef.description.toLowerCase().includes(searchQuery)
    );
    
    displayChefs(filteredChefs);
}

// Display filtered chefs based on search query
function displayChefs(filteredChefs) {
    const chefList = document.getElementById('chef-list');
    chefList.innerHTML = ''; // Clear current list

    filteredChefs.forEach(chef => {
        const chefCard = document.createElement('div');
        chefCard.className = "chef-card";
        chefCard.innerHTML = `
            <img src="${chef.image}" alt="${chef.name}">
            <h3>${chef.name}</h3>
            <p>${chef.description}</p>
            <button onclick="showBookingModal('${chef.name}')">Book Chef</button>
        `;
        chefList.appendChild(chefCard);
    });
}

// Modal for booking a chef
function showBookingModal(chefName) {
    document.getElementById('bookingModal').style.display = "block";
    document.getElementById('bookingForm').chefName.value = chefName;
}

function closeModal() {
    document.getElementById('bookingModal').style.display = "none";
}

// Handle booking form submission (placeholder)
document.getElementById('bookingForm').onsubmit = function(e) {
    e.preventDefault();
    alert("Your booking has been placed!");
    closeModal();
};

// Function to open the booking modal and set the chef's name
function showBookingModal(cuisineName) {
    document.getElementById('bookingModal').style.display = "block";
    document.getElementById('chef-name').innerText = cuisineName;
    document.getElementById('chefName').value = cuisineName;
}

// Close the modal
function closeModal() {
    document.getElementById('bookingModal').style.display = "none";
}

// Handle booking form submission (placeholder)
document.getElementById('bookingForm').onsubmit = function(e) {
    e.preventDefault();
    alert("Your booking has been placed for " + document.getElementById('chefName').value + "!");
    closeModal();
};

function toggleNavbar() {
    const navbarLinks = document.querySelector('.navbar-links');
    navbarLinks.classList.toggle('active');
}

