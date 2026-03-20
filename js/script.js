// Main JavaScript for SkyWings Airlines

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Set minimum date for departure and return
    setMinDates();
    
    // Add form submission handler
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearchForm);
    }
    
    // Add smooth scrolling for navigation links
    addSmoothScrolling();
    
    // Add scroll animations
    addScrollAnimations();
    
    // Initialize tooltips and popovers if Bootstrap is loaded
    if (typeof bootstrap !== 'undefined') {
        initializeBootstrapComponents();
    }
}

function setMinDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const departureInput = document.getElementById('departure');
    const returnInput = document.getElementById('return');
    
    if (departureInput) {
        departureInput.min = tomorrow.toISOString().split('T')[0];
    }
    
    if (returnInput) {
        returnInput.min = tomorrow.toISOString().split('T')[0];
    }
}

function handleSearchForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const searchData = {
        from: formData.get('from') || document.getElementById('from').value,
        to: formData.get('to') || document.getElementById('to').value,
        departure: formData.get('departure') || document.getElementById('departure').value,
        return: formData.get('return') || document.getElementById('return').value,
        passengers: formData.get('passengers') || document.getElementById('passengers').value,
        class: formData.get('class') || document.getElementById('class').value
    };
    
    // Validate form
    if (!validateSearchForm(searchData)) {
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    // Simulate API call (in real app, this would be an actual API request)
    setTimeout(() => {
        hideLoadingState();
        redirectToFlights(searchData);
    }, 1500);
}

function validateSearchForm(data) {
    if (!data.from || !data.to) {
        showAlert('Please select both departure and arrival cities.', 'warning');
        return false;
    }
    
    if (data.from === data.to) {
        showAlert('Departure and arrival cities cannot be the same.', 'warning');
        return false;
    }
    
    if (!data.departure) {
        showAlert('Please select a departure date.', 'warning');
        return false;
    }
    
    return true;
}

function showLoadingState() {
    const submitBtn = document.querySelector('#searchForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Searching...';
        submitBtn.disabled = true;
    }
}

function hideLoadingState() {
    const submitBtn = document.querySelector('#searchForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = 'Search Flights';
        submitBtn.disabled = false;
    }
}

function redirectToFlights(searchData) {
    // Store search data in sessionStorage for the flights page
    sessionStorage.setItem('flightSearch', JSON.stringify(searchData));
    window.location.href = 'flights.html';
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function addSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .destination-card');
    animateElements.forEach(el => observer.observe(el));
}

function initializeBootstrapComponents() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatTime(timeString) {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Export functions for use in other scripts
window.SkyWingsApp = {
    formatCurrency,
    formatDate,
    formatTime,
    showAlert,
    validateSearchForm
};
