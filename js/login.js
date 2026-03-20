// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize login page
    initLoginPage();
});

function initLoginPage() {
    // Initialize forms
    initializeLoginForm();
    initializeRegisterForm();
    
    // Initialize password toggles
    initializePasswordToggles();
    
    // Initialize password strength checker
    initializePasswordStrength();
    
    // Initialize phone number formatting
    initializePhoneFormatting();
    
    // Initialize form validation
    addFormValidation();
}

function initializeLoginForm() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', handleLoginFormSubmission);
    }
}

function initializeRegisterForm() {
    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', handleRegisterFormSubmission);
    }
}

function initializePasswordToggles() {
    // Login password toggle
    const toggleLoginBtn = document.getElementById('toggleLoginPassword');
    const loginPassword = document.getElementById('loginPassword');
    
    if (toggleLoginBtn && loginPassword) {
        toggleLoginBtn.addEventListener('click', function() {
            togglePasswordVisibility(loginPassword, this);
        });
    }
    
    // Register password toggle
    const toggleRegisterBtn = document.getElementById('toggleRegisterPassword');
    const registerPassword = document.getElementById('registerPassword');
    
    if (toggleRegisterBtn && registerPassword) {
        toggleRegisterBtn.addEventListener('click', function() {
            togglePasswordVisibility(registerPassword, this);
        });
    }
}

function togglePasswordVisibility(passwordField, toggleBtn) {
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordField.type = 'password';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

function initializePasswordStrength() {
    const passwordField = document.getElementById('registerPassword');
    if (passwordField) {
        passwordField.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }
}

function checkPasswordStrength(password) {
    const strengthBar = document.getElementById('passwordStrength');
    const strengthText = document.getElementById('passwordStrengthText');
    
    if (!strengthBar || !strengthText) return;
    
    let strength = 0;
    let feedback = '';
    
    // Check length
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    
    // Check for lowercase letters
    if (/[a-z]/.test(password)) strength += 25;
    
    // Check for uppercase letters
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Check for numbers
    if (/[0-9]/.test(password)) strength += 25;
    
    // Check for special characters
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    // Cap at 100%
    strength = Math.min(strength, 100);
    
    // Update progress bar
    strengthBar.style.width = strength + '%';
    
    // Remove existing classes
    strengthBar.className = 'progress-bar';
    
    // Add appropriate class and text
    if (strength < 25) {
        strengthBar.classList.add('weak');
        feedback = 'Very Weak';
    } else if (strength < 50) {
        strengthBar.classList.add('weak');
        feedback = 'Weak';
    } else if (strength < 75) {
        strengthBar.classList.add('medium');
        feedback = 'Medium';
    } else if (strength < 100) {
        strengthBar.classList.add('strong');
        feedback = 'Strong';
    } else {
        strengthBar.classList.add('very-strong');
        feedback = 'Very Strong';
    }
    
    strengthText.textContent = feedback;
}

function initializePhoneFormatting() {
    const phoneField = document.getElementById('registerPhone');
    if (phoneField) {
        phoneField.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
}

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

function addFormValidation() {
    // Login form validation
    const loginFields = document.querySelectorAll('#loginForm input[required]');
    loginFields.forEach(field => {
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
    
    // Register form validation
    const registerFields = document.querySelectorAll('#registerForm input[required], #registerForm select[required]');
    registerFields.forEach(field => {
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
    } else if (field.type === 'password') {
        if (field.id === 'registerPassword') {
            if (value.length < 8) {
                isValid = false;
                errorMessage = 'Password must be at least 8 characters long';
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

function handleLoginFormSubmission(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateLoginForm()) {
        return;
    }
    
    // Show loading state
    showLoginLoadingState();
    
    // Simulate login (in real app, this would be an API call)
    setTimeout(() => {
        hideLoginLoadingState();
        
        // Collect login data
        const loginData = {
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value,
            rememberMe: document.getElementById('rememberMe').checked,
            timestamp: new Date().toISOString()
        };
        
        // Store login data (in real app, this would be handled by authentication service)
        localStorage.setItem('userLogin', JSON.stringify(loginData));
        
        // Show success message
        showLoginSuccessMessage();
        
        // Redirect to dashboard or home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }, 2000);
}

function validateLoginForm() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    if (!email || !password) {
        showAlert('Please fill in all required fields.', 'warning');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Please enter a valid email address.', 'warning');
        return false;
    }
    
    return true;
}

function handleRegisterFormSubmission(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateRegisterForm()) {
        return;
    }
    
    // Show loading state
    showRegisterLoadingState();
    
    // Simulate registration (in real app, this would be an API call)
    setTimeout(() => {
        hideRegisterLoadingState();
        
        // Collect registration data
        const registerData = {
            firstName: document.getElementById('registerFirstName').value,
            lastName: document.getElementById('registerLastName').value,
            email: document.getElementById('registerEmail').value,
            phone: document.getElementById('registerPhone').value,
            password: document.getElementById('registerPassword').value,
            newsletter: document.getElementById('newsletterSignup').checked,
            timestamp: new Date().toISOString()
        };
        
        // Store registration data (in real app, this would be sent to server)
        localStorage.setItem('userRegistration', JSON.stringify(registerData));
        
        // Show success message
        showRegisterSuccessMessage();
        
        // Switch to login tab
        setTimeout(() => {
            const loginTab = document.getElementById('login-tab');
            if (loginTab) {
                loginTab.click();
            }
        }, 2000);
    }, 2000);
}

function validateRegisterForm() {
    const firstName = document.getElementById('registerFirstName').value.trim();
    const lastName = document.getElementById('registerLastName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showAlert('Please fill in all required fields.', 'warning');
        return false;
    }
    
    if (!agreeTerms) {
        showAlert('Please agree to the Terms and Conditions.', 'warning');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Please enter a valid email address.', 'warning');
        return false;
    }
    
    // Validate password length
    if (password.length < 8) {
        showAlert('Password must be at least 8 characters long.', 'warning');
        return false;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        showAlert('Passwords do not match.', 'warning');
        return false;
    }
    
    return true;
}

function showLoginLoadingState() {
    const submitBtn = document.getElementById('loginSubmit');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing In...';
    }
}

function hideLoginLoadingState() {
    const submitBtn = document.getElementById('loginSubmit');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Sign In';
    }
}

function showRegisterLoadingState() {
    const submitBtn = document.getElementById('registerSubmit');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating Account...';
    }
}

function hideRegisterLoadingState() {
    const submitBtn = document.getElementById('registerSubmit');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-user-plus me-2"></i>Create Account';
    }
}

function showLoginSuccessMessage() {
    const form = document.getElementById('loginForm');
    if (form) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = '<i class="fas fa-check-circle"></i>Login successful! Redirecting...';
        form.insertBefore(successDiv, form.firstChild);
    }
}

function showRegisterSuccessMessage() {
    const form = document.getElementById('registerForm');
    if (form) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = '<i class="fas fa-check-circle"></i>Account created successfully! Please sign in.';
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

// Social login handlers (placeholder functions)
function handleGoogleLogin() {
    showAlert('Google login functionality would be implemented here.', 'info');
}

function handleFacebookLogin() {
    showAlert('Facebook login functionality would be implemented here.', 'info');
}

function handleAppleLogin() {
    showAlert('Apple login functionality would be implemented here.', 'info');
}

// Initialize social login buttons
document.addEventListener('DOMContentLoaded', function() {
    const socialButtons = document.querySelectorAll('.social-login .btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.textContent.trim();
            
            switch (provider) {
                case 'Google':
                    handleGoogleLogin();
                    break;
                case 'Facebook':
                    handleFacebookLogin();
                    break;
                case 'Apple':
                    handleAppleLogin();
                    break;
            }
        });
    });
});

// Export functions for global access
window.handleGoogleLogin = handleGoogleLogin;
window.handleFacebookLogin = handleFacebookLogin;
window.handleAppleLogin = handleAppleLogin;
