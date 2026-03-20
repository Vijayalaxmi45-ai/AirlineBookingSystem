// Booking Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize booking page
    initBookingPage();
});

function initBookingPage() {
    // Load flight data from sessionStorage
    const flightData = loadFlightData();
    
    // Display flight summary
    displayFlightSummary(flightData);
    
    // Initialize form functionality
    initializeForm();
    
    // Initialize add passenger functionality
    initializeAddPassenger();
    
    // Initialize insurance functionality
    initializeInsurance();
    
    // Set minimum date for date of birth
    setMinDateOfBirth();
}

function loadFlightData() {
    const flightData = sessionStorage.getItem('selectedFlight');
    if (flightData) {
        return JSON.parse(flightData);
    } else {
        // Redirect to flights page if no flight is selected
        window.location.href = 'flights.html';
        return null;
    }
}

function displayFlightSummary(flight) {
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
    
    const flightSummary = document.getElementById('flightSummary');
    if (flightSummary) {
        flightSummary.innerHTML = `
            <div class="flight-detail">
                <div class="route">
                    <h6>${cityNames[flight.from]}</h6>
                    <small>${flight.departureTime}</small>
                </div>
                <div class="arrow">
                    <i class="fas fa-arrow-right"></i>
                </div>
                <div class="route">
                    <h6>${cityNames[flight.to]}</h6>
                    <small>${flight.arrivalTime}</small>
                </div>
            </div>
            <div class="flight-info mb-3">
                <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted">Flight:</span>
                    <span class="fw-bold">${flight.airline} ${flight.flightNumber}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted">Date:</span>
                    <span>${formatDate(flight.departureDate)}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted">Duration:</span>
                    <span>${flight.duration}</span>
                </div>
                <div class="d-flex justify-content-between">
                    <span class="text-muted">Class:</span>
                    <span>${flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}</span>
                </div>
            </div>
        `;
    }
    
    // Update price breakdown
    updatePriceBreakdown(flight.price);
}

function updatePriceBreakdown(basePrice) {
    const taxes = Math.round(basePrice * 0.15); // 15% taxes
    const insurance = 0; // Will be updated when insurance is selected
    
    document.getElementById('baseFare').textContent = `$${basePrice}`;
    document.getElementById('taxes').textContent = `$${taxes}`;
    document.getElementById('insurance').textContent = `$${insurance}`;
    document.getElementById('totalPrice').textContent = `$${basePrice + taxes + insurance}`;
}

function initializeForm() {
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
    
    // Add real-time validation
    addFormValidation();
}

function initializeAddPassenger() {
    const addPassengerBtn = document.getElementById('addPassenger');
    if (addPassengerBtn) {
        addPassengerBtn.addEventListener('click', addPassenger);
    }
}

function initializeInsurance() {
    const insuranceCheckbox = document.getElementById('travelInsurance');
    if (insuranceCheckbox) {
        insuranceCheckbox.addEventListener('change', updateInsurancePrice);
    }
}

function setMinDateOfBirth() {
    const dobInput = document.getElementById('dob');
    if (dobInput) {
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        dobInput.max = maxDate.toISOString().split('T')[0];
    }
}

function addPassenger() {
    const additionalPassengers = document.getElementById('additionalPassengers');
    const passengerCount = additionalPassengers.children.length + 1;
    
    const passengerHtml = `
        <div class="additional-passenger" data-passenger-id="${passengerCount}">
            <button type="button" class="remove-passenger" onclick="removePassenger(${passengerCount})">
                <i class="fas fa-times"></i>
            </button>
            <h5 class="passenger-title">
                <i class="fas fa-user me-2"></i>Passenger ${passengerCount + 1}
            </h5>
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">First Name *</label>
                    <input type="text" class="form-control" name="passenger_${passengerCount}_firstName" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Last Name *</label>
                    <input type="text" class="form-control" name="passenger_${passengerCount}_lastName" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Date of Birth *</label>
                    <input type="date" class="form-control" name="passenger_${passengerCount}_dob" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Passport Number</label>
                    <input type="text" class="form-control" name="passenger_${passengerCount}_passport" placeholder="Optional">
                </div>
            </div>
        </div>
    `;
    
    additionalPassengers.insertAdjacentHTML('beforeend', passengerHtml);
    
    // Set max date for new passenger's DOB
    const newDobInput = additionalPassengers.lastElementChild.querySelector('input[type="date"]');
    if (newDobInput) {
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        newDobInput.max = maxDate.toISOString().split('T')[0];
    }
    
    // Update add passenger button text
    updateAddPassengerButton();
}

function removePassenger(passengerId) {
    const passengerElement = document.querySelector(`[data-passenger-id="${passengerId}"]`);
    if (passengerElement) {
        passengerElement.remove();
        updateAddPassengerButton();
        reorderPassengerNumbers();
    }
}

function updateAddPassengerButton() {
    const addPassengerBtn = document.getElementById('addPassenger');
    const passengerCount = document.getElementById('additionalPassengers').children.length;
    
    if (addPassengerBtn) {
        if (passengerCount >= 4) { // Maximum 5 passengers total (1 primary + 4 additional)
            addPassengerBtn.disabled = true;
            addPassengerBtn.innerHTML = '<i class="fas fa-ban me-2"></i>Maximum Passengers Reached';
        } else {
            addPassengerBtn.disabled = false;
            addPassengerBtn.innerHTML = '<i class="fas fa-plus me-2"></i>Add Another Passenger';
        }
    }
}

function reorderPassengerNumbers() {
    const passengers = document.querySelectorAll('.additional-passenger');
    passengers.forEach((passenger, index) => {
        const passengerId = index + 1;
        passenger.setAttribute('data-passenger-id', passengerId);
        
        const title = passenger.querySelector('.passenger-title');
        if (title) {
            title.innerHTML = `<i class="fas fa-user me-2"></i>Passenger ${passengerId + 1}`;
        }
        
        // Update input names
        const inputs = passenger.querySelectorAll('input');
        inputs.forEach(input => {
            const currentName = input.getAttribute('name');
            if (currentName) {
                const newName = currentName.replace(/passenger_\d+/, `passenger_${passengerId}`);
                input.setAttribute('name', newName);
            }
        });
    });
}

function updateInsurancePrice() {
    const insuranceCheckbox = document.getElementById('travelInsurance');
    const insuranceElement = document.getElementById('insurance');
    const totalPriceElement = document.getElementById('totalPrice');
    
    if (insuranceCheckbox && insuranceElement && totalPriceElement) {
        const basePrice = parseInt(document.getElementById('baseFare').textContent.replace('$', ''));
        const taxes = parseInt(document.getElementById('taxes').textContent.replace('$', ''));
        const passengerCount = document.getElementById('additionalPassengers').children.length + 1;
        
        if (insuranceCheckbox.checked) {
            const insuranceCost = passengerCount * 25;
            insuranceElement.textContent = `$${insuranceCost}`;
            totalPriceElement.textContent = `$${basePrice + taxes + insuranceCost}`;
        } else {
            insuranceElement.textContent = '$0';
            totalPriceElement.textContent = `$${basePrice + taxes}`;
        }
    }
}

function addFormValidation() {
    const requiredFields = document.querySelectorAll('input[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing validation classes
    field.classList.remove('is-valid', 'is-invalid');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
    
    // Validation rules
    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    } else if (field.type === 'tel') {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    } else if (field.type === 'date') {
        if (field.id === 'dob') {
            const selectedDate = new Date(value);
            const today = new Date();
            const minAge = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
            
            if (selectedDate > minAge) {
                isValid = false;
                errorMessage = 'Passenger must be at least 18 years old';
            }
        }
    } else if (field.type === 'text') {
        if (value.length < 2) {
            isValid = false;
            errorMessage = 'This field must be at least 2 characters long';
        }
    }
    
    // Apply validation result
    if (isValid && value) {
        field.classList.add('is-valid');
    } else if (!isValid) {
        field.classList.add('is-invalid');
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = errorMessage;
        field.parentNode.appendChild(errorDiv);
    }
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    // Validate all required fields
    const requiredFields = document.querySelectorAll('input[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            validateField(field);
            if (field.classList.contains('is-invalid')) {
                isValid = false;
            }
        }
    });
    
    if (!isValid) {
        showAlert('Please fill in all required fields correctly.', 'warning');
        return;
    }
    
    // Check terms and conditions
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        showAlert('Please agree to the Terms and Conditions to continue.', 'warning');
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    // Simulate form submission (in real app, this would be an API call)
    setTimeout(() => {
        hideLoadingState();
        
        // Store booking data
        const bookingData = collectFormData();
        sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
        
        // Show success message
        showSuccessMessage();
        
        // Redirect to payment page (in real app)
        setTimeout(() => {
            // For demo purposes, show a success alert
            alert('Booking submitted successfully! In a real application, you would be redirected to the payment page.');
        }, 2000);
    }, 2000);
}

function collectFormData() {
    const formData = new FormData(document.getElementById('bookingForm'));
    const data = {};
    
    // Primary passenger data
    data.primaryPassenger = {
        firstName: formData.get('firstName') || document.getElementById('firstName').value,
        lastName: formData.get('lastName') || document.getElementById('lastName').value,
        email: formData.get('email') || document.getElementById('email').value,
        phone: formData.get('phone') || document.getElementById('phone').value,
        dob: formData.get('dob') || document.getElementById('dob').value,
        passport: formData.get('passport') || document.getElementById('passport').value
    };
    
    // Additional passengers
    data.additionalPassengers = [];
    const additionalPassengers = document.querySelectorAll('.additional-passenger');
    additionalPassengers.forEach((passenger, index) => {
        const passengerId = index + 1;
        const passengerData = {
            firstName: formData.get(`passenger_${passengerId}_firstName`),
            lastName: formData.get(`passenger_${passengerId}_lastName`),
            dob: formData.get(`passenger_${passengerId}_dob`),
            passport: formData.get(`passenger_${passengerId}_passport`)
        };
        data.additionalPassengers.push(passengerData);
    });
    
    // Contact information
    data.contact = {
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value
    };
    
    // Special requests
    data.specialRequests = {
        wheelchair: document.getElementById('wheelchair').checked,
        meal: document.getElementById('meal').checked,
        unaccompanied: document.getElementById('unaccompanied').checked,
        pet: document.getElementById('pet').checked,
        notes: document.getElementById('specialNotes').value
    };
    
    // Marketing preference
    data.marketing = document.getElementById('marketing').checked;
    
    // Insurance
    data.insurance = document.getElementById('travelInsurance').checked;
    
    // Flight data
    data.flight = loadFlightData();
    
    return data;
}

function showLoadingState() {
    const submitBtn = document.getElementById('submitBooking');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...';
    }
}

function hideLoadingState() {
    const submitBtn = document.getElementById('submitBooking');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-credit-card me-2"></i>Proceed to Payment';
    }
}

function showSuccessMessage() {
    const form = document.getElementById('bookingForm');
    if (form) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = '<i class="fas fa-check-circle"></i>Your booking has been submitted successfully!';
        form.insertBefore(successDiv, form.firstChild);
    }
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

function formatDate(dateString) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Export functions for global access
window.removePassenger = removePassenger;
