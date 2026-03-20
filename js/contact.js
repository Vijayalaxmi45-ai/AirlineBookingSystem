// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact page
    initContactPage();
});

function initContactPage() {
    // Initialize contact form
    initializeContactForm();
    
    // Add form validation
    addFormValidation();
    
    // Initialize FAQ accordion
    initializeFAQ();
}

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleContactFormSubmission);
    }
}

function initializeFAQ() {
    // FAQ accordion is handled by Bootstrap
    // Add any custom FAQ functionality here if needed
}

function addFormValidation() {
    const requiredFields = document.querySelectorAll('#contactForm input[required], #contactForm select[required], #contactForm textarea[required]');
    
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
        if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    } else if (field.tagName === 'SELECT') {
        if (!value) {
            isValid = false;
            errorMessage = 'Please select a subject';
        }
    } else if (field.tagName === 'TEXTAREA') {
        if (value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
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

function handleContactFormSubmission(event) {
    event.preventDefault();
    
    // Validate all required fields
    const requiredFields = document.querySelectorAll('#contactForm input[required], #contactForm select[required], #contactForm textarea[required]');
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
    
    // Show loading state
    showLoadingState();
    
    // Simulate form submission (in real app, this would be an API call)
    setTimeout(() => {
        hideLoadingState();
        
        // Collect form data
        const formData = collectContactFormData();
        
        // Store contact data (in real app, this would be sent to server)
        localStorage.setItem('contactSubmission', JSON.stringify(formData));
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        resetContactForm();
        
        // Show confirmation alert
        setTimeout(() => {
            alert('Thank you for your message! We will get back to you within 24 hours.');
        }, 2000);
    }, 2000);
}

function collectContactFormData() {
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        newsletter: document.getElementById('newsletter').checked,
        timestamp: new Date().toISOString()
    };
    
    return formData;
}

function resetContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.reset();
        
        // Remove validation classes
        const fields = form.querySelectorAll('.form-control, .form-select');
        fields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
        
        // Remove error messages
        const errorMessages = form.querySelectorAll('.invalid-feedback');
        errorMessages.forEach(error => error.remove());
    }
}

function showLoadingState() {
    const submitBtn = document.getElementById('submitContact');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';
    }
}

function hideLoadingState() {
    const submitBtn = document.getElementById('submitContact');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
    }
}

function showSuccessMessage() {
    const form = document.getElementById('contactForm');
    if (form) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = '<i class="fas fa-check-circle"></i>Your message has been sent successfully! We will get back to you soon.';
        form.insertBefore(successDiv, form.firstChild);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
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

// Phone number formatting
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.length <= 3) {
            value = `(${value}`;
        } else if (value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }
    
    input.value = value;
}

// Initialize phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
});

// Auto-resize textarea
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

// Initialize textarea auto-resize
document.addEventListener('DOMContentLoaded', function() {
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        messageTextarea.addEventListener('input', function() {
            autoResizeTextarea(this);
        });
    }
});

// Subject change handler
function handleSubjectChange() {
    const subject = document.getElementById('subject').value;
    const messageTextarea = document.getElementById('message');
    
    if (messageTextarea) {
        switch (subject) {
            case 'booking':
                messageTextarea.placeholder = 'Please describe your booking issue or question...';
                break;
            case 'technical':
                messageTextarea.placeholder = 'Please describe the technical issue you are experiencing...';
                break;
            case 'complaint':
                messageTextarea.placeholder = 'Please describe your complaint in detail...';
                break;
            case 'feedback':
                messageTextarea.placeholder = 'We would love to hear your feedback about our service...';
                break;
            default:
                messageTextarea.placeholder = 'Please describe your inquiry or issue...';
        }
    }
}

// Initialize subject change handler
document.addEventListener('DOMContentLoaded', function() {
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
        subjectSelect.addEventListener('change', handleSubjectChange);
    }
});

// Export functions for global access
window.handleSubjectChange = handleSubjectChange;
