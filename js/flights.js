// Flights Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize flights page
    initFlightsPage();
});

function initFlightsPage() {
    // Load search data from sessionStorage
    const searchData = loadSearchData();
    
    // Initialize filters and event listeners
    initializeFilters();
    
    // Load and display flights
    loadFlights(searchData);
    
    // Initialize sort functionality
    initializeSorting();
    
    // Initialize load more functionality
    initializeLoadMore();
}

function loadSearchData() {
    const searchData = sessionStorage.getItem('flightSearch');
    if (searchData) {
        const data = JSON.parse(searchData);
        displaySearchSummary(data);
        return data;
    } else {
        // Default search data if none exists
        return {
            from: 'NYC',
            to: 'LAX',
            departure: new Date().toISOString().split('T')[0],
            passengers: 1,
            class: 'economy'
        };
    }
}

function displaySearchSummary(data) {
    const cityNames = {
        'DEL': 'New Delhi (DEL)',
        'BOM': 'Mumbai (BOM)',
        'BLR': 'Bengaluru (BLR)',
        'MAA': 'Chennai (MAA)',
        'HYD': 'Hyderabad (HYD)',
        'LON': 'London (LHR)',
        'DXB': 'Dubai (DXB)',
        'SIN': 'Singapore (SIN)',
        'NYC': 'New York (JFK)',
        'SYD': 'Sydney (SYD)'
    };
    
    const routeElement = document.getElementById('searchRoute');
    const dateElement = document.getElementById('searchDate');
    
    if (routeElement) {
        routeElement.textContent = `${cityNames[data.from]} → ${cityNames[data.to]}`;
    }
    
    if (dateElement) {
        const departureDate = new Date(data.departure);
        dateElement.textContent = departureDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    }
}

function initializeFilters() {
    // Price range slider
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            priceValue.textContent = `$${this.value}`;
            applyFilters();
        });
    }
    
    // Checkbox filters
    const filterCheckboxes = document.querySelectorAll('.filters-card input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Radio button filters
    const filterRadios = document.querySelectorAll('.filters-card input[type="radio"]');
    filterRadios.forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

function initializeSorting() {
    const sortButtons = document.querySelectorAll('[data-sort]');
    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            sortButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const sortBy = this.getAttribute('data-sort');
            sortFlights(sortBy);
        });
    });
}

function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreFlights);
    }
}

    // Sample flight data (India-origin → international destinations)
const sampleFlights = [
    {
        id: 1,
        airline: 'SkyWings Airlines',
        flightNumber: 'SW201',
        from: 'DEL',
        to: 'LON',
        departureTime: '02:00',
        arrivalTime: '07:30',
        duration: '9h 30m',
        price: 450,
        stops: 0,
        aircraft: 'Boeing 787',
        departureDate: '2026-04-10',
        class: 'economy'
    },
    {
        id: 2,
        airline: 'SkyWings Airlines',
        flightNumber: 'SW202',
        from: 'BOM',
        to: 'DXB',
        departureTime: '05:00',
        arrivalTime: '07:30',
        duration: '3h 0m',
        price: 220,
        stops: 0,
        aircraft: 'Airbus A320',
        departureDate: '2026-04-11',
        class: 'economy'
    },
    {
        id: 3,
        airline: 'SkyWings Airlines',
        flightNumber: 'SW203',
        from: 'BLR',
        to: 'SIN',
        departureTime: '09:00',
        arrivalTime: '16:00',
        duration: '6h 0m',
        price: 300,
        stops: 0,
        aircraft: 'Boeing 737',
        departureDate: '2026-04-12',
        class: 'economy'
    },
    {
        id: 4,
        airline: 'Partner Airlines',
        flightNumber: 'PA301',
        from: 'HYD',
        to: 'NYC',
        departureTime: '02:00',
        arrivalTime: '14:30',
        duration: '16h 30m',
        price: 900,
        stops: 1,
        aircraft: 'Airbus A350',
        departureDate: '2026-04-15',
        class: 'economy'
    },
    {
        id: 5,
        airline: 'SkyWings Airlines',
        flightNumber: 'SW204',
        from: 'MAA',
        to: 'SYD',
        departureTime: '21:00',
        arrivalTime: '11:30',
        duration: '12h 30m',
        price: 750,
        stops: 0,
        aircraft: 'Boeing 787',
        departureDate: '2026-04-20',
        class: 'economy'
    }
];

let currentFlights = [...sampleFlights];
let displayedFlights = 3;

function loadFlights(searchData) {
    // Filter flights based on search criteria
    filterFlightsBySearch(searchData);
    
    // Display initial flights
    displayFlights(currentFlights.slice(0, displayedFlights));
    
    // Update result count
    updateResultCount();
}

function filterFlightsBySearch(searchData) {
    currentFlights = sampleFlights.filter(flight => {
        return flight.from === searchData.from && 
               flight.to === searchData.to &&
               flight.departureDate === searchData.departure;
    });
}

function displayFlights(flights) {
    const flightList = document.getElementById('flightList');
    
    if (!flightList) return;
    
    if (flights.length === 0) {
        flightList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-plane-slash"></i>
                <h5>No flights found</h5>
                <p>We couldn't find any flights matching your criteria. Try adjusting your search or dates.</p>
                <a href="index.html" class="btn btn-primary">New Search</a>
            </div>
        `;
        return;
    }
    
    flightList.innerHTML = flights.map(flight => createFlightCard(flight)).join('');
    
    // Add event listeners to book buttons
    addBookingEventListeners();
}

function createFlightCard(flight) {
    const cityNames = {
        'NYC': 'New York (JFK)',
        'LAX': 'Los Angeles (LAX)',
        'CHI': 'Chicago (ORD)',
        'MIA': 'Miami (MIA)',
        'LON': 'London (LHR)',
        'PAR': 'Paris (CDG)',
        'TOK': 'Tokyo (NRT)'
    };
    
    const stopText = flight.stops === 0 ? 'Direct' : 
                    flight.stops === 1 ? '1 Stop' : 'Multi-Stop';
    
    return `
        <div class="flight-card" data-flight-id="${flight.id}">
            <div class="flight-header">
                <div class="airline-info">
                    <div class="airline-logo">
                        <i class="fas fa-plane"></i>
                    </div>
                    <div class="airline-details">
                        <h6>${flight.airline}</h6>
                        <small>Flight ${flight.flightNumber} • ${stopText}</small>
                    </div>
                </div>
                <div class="flight-price">
                    <div class="price">$${flight.price}</div>
                    <div class="per-person">per person</div>
                </div>
            </div>
            
            <div class="flight-route">
                <div class="route-segment">
                    <h5>${flight.departureTime}</h5>
                    <small>${cityNames[flight.from]}</small>
                </div>
                <div class="route-arrow">
                    <i class="fas fa-arrow-right"></i>
                    <div class="flight-duration">${flight.duration}</div>
                </div>
                <div class="route-segment">
                    <h5>${flight.arrivalTime}</h5>
                    <small>${cityNames[flight.to]}</small>
                </div>
            </div>
            
            <div class="flight-details">
                <div class="flight-info">
                    <div class="info-item">
                        <i class="fas fa-plane"></i>
                        <span>${flight.aircraft}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>${stopText}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-suitcase"></i>
                        <span>2 bags included</span>
                    </div>
                </div>
                <div class="flight-actions">
                    <button class="btn btn-details" onclick="showFlightDetails(${flight.id})">
                        <i class="fas fa-info-circle me-2"></i>Details
                    </button>
                    <button class="btn btn-book" onclick="bookFlight(${flight.id})">
                        <i class="fas fa-ticket-alt me-2"></i>Book Now
                    </button>
                </div>
            </div>
        </div>
    `;
}

function addBookingEventListeners() {
    const bookButtons = document.querySelectorAll('.btn-book');
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const flightCard = this.closest('.flight-card');
            const flightId = flightCard.getAttribute('data-flight-id');
            bookFlight(flightId);
        });
    });
}

function applyFilters() {
    const priceRange = document.getElementById('priceRange');
    const skywingsChecked = document.getElementById('skywings').checked;
    const partnerChecked = document.getElementById('partner1').checked;
    const directChecked = document.getElementById('direct').checked;
    const oneStopChecked = document.getElementById('oneStop').checked;
    const multiStopChecked = document.getElementById('multiStop').checked;
    const morningChecked = document.getElementById('morning').checked;
    const afternoonChecked = document.getElementById('afternoon').checked;
    const eveningChecked = document.getElementById('evening').checked;
    
    let filteredFlights = [...sampleFlights];
    
    // Price filter
    if (priceRange) {
        const maxPrice = parseInt(priceRange.value);
        filteredFlights = filteredFlights.filter(flight => flight.price <= maxPrice);
    }
    
    // Airline filter
    if (!skywingsChecked || !partnerChecked) {
        filteredFlights = filteredFlights.filter(flight => {
            if (!skywingsChecked && !partnerChecked) return false;
            if (!skywingsChecked) return flight.airline !== 'SkyWings Airlines';
            if (!partnerChecked) return flight.airline === 'SkyWings Airlines';
            return true;
        });
    }
    
    // Stops filter
    if (directChecked || oneStopChecked || multiStopChecked) {
        filteredFlights = filteredFlights.filter(flight => {
            if (directChecked && flight.stops === 0) return true;
            if (oneStopChecked && flight.stops === 1) return true;
            if (multiStopChecked && flight.stops > 1) return true;
            return false;
        });
    }
    
    // Time filter
    if (morningChecked || afternoonChecked || eveningChecked) {
        filteredFlights = filteredFlights.filter(flight => {
            const hour = parseInt(flight.departureTime.split(':')[0]);
            if (morningChecked && hour >= 6 && hour < 12) return true;
            if (afternoonChecked && hour >= 12 && hour < 18) return true;
            if (eveningChecked && (hour >= 18 || hour < 6)) return true;
            return false;
        });
    }
    
    currentFlights = filteredFlights;
    displayedFlights = 3;
    displayFlights(currentFlights.slice(0, displayedFlights));
    updateResultCount();
}

function clearAllFilters() {
    // Reset price range
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.value = 2000;
        document.getElementById('priceValue').textContent = '$2000';
    }
    
    // Reset checkboxes
    const checkboxes = document.querySelectorAll('.filters-card input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
    
    // Reset radio buttons
    const radios = document.querySelectorAll('.filters-card input[type="radio"]');
    radios.forEach(radio => radio.checked = false);
    
    // Check default options
    document.getElementById('skywings').checked = true;
    document.getElementById('direct').checked = true;
    
    // Reload flights without filters
    const searchData = loadSearchData();
    filterFlightsBySearch(searchData);
    displayedFlights = 3;
    displayFlights(currentFlights.slice(0, displayedFlights));
    updateResultCount();
}

function sortFlights(sortBy) {
    const sortedFlights = [...currentFlights];
    
    switch (sortBy) {
        case 'price':
            sortedFlights.sort((a, b) => a.price - b.price);
            break;
        case 'duration':
            sortedFlights.sort((a, b) => {
                const durationA = parseInt(a.duration.split('h')[0]);
                const durationB = parseInt(b.duration.split('h')[0]);
                return durationA - durationB;
            });
            break;
        case 'departure':
            sortedFlights.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
            break;
    }
    
    currentFlights = sortedFlights;
    displayedFlights = 3;
    displayFlights(currentFlights.slice(0, displayedFlights));
}

function loadMoreFlights() {
    displayedFlights += 3;
    displayFlights(currentFlights.slice(0, displayedFlights));
    
    // Hide load more button if all flights are displayed
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn && displayedFlights >= currentFlights.length) {
        loadMoreBtn.style.display = 'none';
    }
}

function updateResultCount() {
    const resultCount = document.getElementById('resultCount');
    if (resultCount) {
        resultCount.textContent = `${currentFlights.length} flights found`;
    }
}

function showFlightDetails(flightId) {
    const flight = sampleFlights.find(f => f.id === flightId);
    if (flight) {
        // In a real app, this would show a modal with detailed flight information
        alert(`Flight Details for ${flight.airline} ${flight.flightNumber}\n\n` +
              `Aircraft: ${flight.aircraft}\n` +
              `Duration: ${flight.duration}\n` +
              `Stops: ${flight.stops === 0 ? 'Direct' : flight.stops + ' stop(s)'}\n` +
              `Class: ${flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}`);
    }
}

function bookFlight(flightId) {
    const flight = sampleFlights.find(f => f.id === flightId);
    if (flight) {
        // Store flight data for booking page
        sessionStorage.setItem('selectedFlight', JSON.stringify(flight));
        // Redirect to booking page
        window.location.href = 'booking.html';
    }
}

// Export functions for global access
window.showFlightDetails = showFlightDetails;
window.bookFlight = bookFlight;
