// Quiz functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Progress bar animation
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const progress = progressBar.getAttribute('data-progress');
        if (progress) {
            setTimeout(() => {
                progressBar.style.width = progress + '%';
            }, 300);
        }
    }
    
    // Quiz form handling
    const quizForm = document.getElementById('quizForm');
    const nextBtn = document.getElementById('nextBtn');
    
    // Initialize button state
    if (nextBtn) {
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
    }
    
    if (quizForm && nextBtn) {
        const radioInputs = quizForm.querySelectorAll('input[type="radio"]');
        const checkboxInputs = quizForm.querySelectorAll('input[type="checkbox"]');
        
        // Handle radio buttons (single choice)
        radioInputs.forEach(radio => {
            radio.addEventListener('change', function() {
                nextBtn.disabled = false;
                nextBtn.style.opacity = '1';
                updateOptionSelection(this);
            });
        });
        
        // Handle checkboxes (multiple choice) - New simplified approach
        if (checkboxInputs.length > 0) {
            // Add click handlers to checkbox-style options
            const checkboxOptions = quizForm.querySelectorAll('.quiz-option.checkbox-style');
            checkboxOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const checkbox = this.querySelector('input[type="checkbox"]');
                    const isSelected = this.classList.contains('selected');
                    
                    if (isSelected) {
                        // Unselect
                        this.classList.remove('selected');
                        checkbox.checked = false;
                    } else {
                        // Select
                        this.classList.add('selected');
                        checkbox.checked = true;
                    }
                    
                    // Update button state
                    const checkedBoxes = quizForm.querySelectorAll('input[type="checkbox"]:checked');
                    nextBtn.disabled = checkedBoxes.length === 0;
                    nextBtn.style.opacity = checkedBoxes.length === 0 ? '0.5' : '1';
                });
            });
        }
        
        // Handle regular checkboxes (non-checkbox-style)
        checkboxInputs.forEach(checkbox => {
            if (!checkbox.closest('.checkbox-style')) {
                checkbox.addEventListener('change', function() {
                    const checkedBoxes = quizForm.querySelectorAll('input[type="checkbox"]:checked');
                    nextBtn.disabled = checkedBoxes.length === 0;
                    nextBtn.style.opacity = checkedBoxes.length === 0 ? '0.5' : '1';
                    updateOptionSelection(this);
                });
            }
        });
        
        // Form submission
        quizForm.addEventListener('submit', function(e) {
            const checkedRadio = quizForm.querySelector('input[type="radio"]:checked');
            const checkedBoxes = quizForm.querySelectorAll('input[type="checkbox"]:checked');
            const sliderInput = quizForm.querySelector('input[type="range"]');
            
            // Check if we have any valid selection
            const hasRadio = checkedRadio !== null;
            const hasCheckbox = checkedBoxes.length > 0;
            const hasSlider = sliderInput !== null;
            
            if (!hasRadio && !hasCheckbox && !hasSlider) {
                e.preventDefault();
                alert('Por favor, selecione uma opção antes de continuar.');
                return false;
            }
            
            // For multiple choice, convert to array
            if (checkboxInputs.length > 0) {
                const selectedValues = Array.from(checkedBoxes).map(cb => cb.value);
                
                // Remove existing answer inputs
                const existingAnswers = quizForm.querySelectorAll('input[name="answer"]');
                existingAnswers.forEach(input => {
                    if (input.type !== 'checkbox') {
                        input.remove();
                    }
                });
                
                // Add hidden inputs for each selected value
                selectedValues.forEach(value => {
                    const hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = 'answer';
                    hiddenInput.value = value;
                    quizForm.appendChild(hiddenInput);
                });
            }
        });
    }
    
    // Smooth scroll for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Add hover effects to quiz options
    const quizOptions = document.querySelectorAll('.quiz-option');
    quizOptions.forEach(option => {
        option.addEventListener('mouseenter', function() {
            const card = this.querySelector('.option-card');
            const input = this.querySelector('input');
            if (!input.checked && !card.classList.contains('special-pink')) {
                card.style.transform = 'translateY(-2px)';
                card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }
        });
        
        option.addEventListener('mouseleave', function() {
            const card = this.querySelector('.option-card');
            const input = this.querySelector('input');
            if (!input.checked) {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            }
        });
        
        // Click handler for better UX (only for non-checkbox-style options)
        option.addEventListener('click', function(e) {
            // Skip if this is a checkbox-style option (handled separately)
            if (this.classList.contains('checkbox-style')) return;
            
            // Prevent double triggering if clicking directly on input
            if (e.target.tagName === 'INPUT') return;
            
            const input = this.querySelector('input');
            
            if (input.type === 'radio') {
                input.checked = true;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            } else if (input.type === 'checkbox') {
                input.checked = !input.checked;
                input.dispatchEvent(new Event('change', { bubbles: true }));
                updateOptionSelection(input);
            }
        });
    });
    
    // Auto-submit after selection (optional)
    const autoSubmit = false; // Set to true if you want auto-submit
    if (autoSubmit && quizForm) {
        const radioInputs = quizForm.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(radio => {
            radio.addEventListener('change', function() {
                setTimeout(() => {
                    quizForm.submit();
                }, 500);
            });
        });
    }
    
    // Loading animation for form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Carregando...';
                submitBtn.disabled = true;
                
                // Re-enable after 5 seconds (fallback)
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 5000);
            }
        });
    });
    
    // Weight Slider functionality
    const weightSlider = document.getElementById('weight-slider');
    const weightValue = document.getElementById('weight-value');
    const weightUnit = document.getElementById('weight-unit');
    const sliderProgress = document.getElementById('slider-progress');
    const unitButtons = document.querySelectorAll('.unit-btn');
    
    if (weightSlider && weightValue && sliderProgress) {
        let currentUnit = 'kg';
        let kgValue = parseInt(weightSlider.value);
        
        // Convert kg to lb
        function kgToLb(kg) {
            return Math.round(kg * 2.20462);
        }
        
        // Convert lb to kg
        function lbToKg(lb) {
            return Math.round(lb / 2.20462);
        }
        
        // Update slider progress bar and triangle position
        function updateSliderProgress() {
            const min = parseInt(weightSlider.min);
            const max = parseInt(weightSlider.max);
            const value = parseInt(weightSlider.value);
            const percentage = ((value - min) / (max - min)) * 100;
            sliderProgress.style.width = percentage + '%';
            
            // Update triangle position
            const sliderWrapper = document.querySelector('.slider-wrapper');
            if (sliderWrapper) {
                // Calculate triangle position accounting for padding (1rem = 16px on each side)
                const padding = 16; // 1rem in pixels
                const wrapperWidth = sliderWrapper.offsetWidth;
                const sliderWidth = wrapperWidth - (padding * 2);
                const trianglePosition = padding + (sliderWidth * (percentage / 100));
                const trianglePercentage = (trianglePosition / wrapperWidth) * 100;
                
                sliderWrapper.style.setProperty('--triangle-position', trianglePercentage + '%');
            }
        }
        
        // Update weight display
        function updateWeightDisplay() {
            const currentValue = parseInt(weightSlider.value);
            weightValue.textContent = currentValue;
            updateSliderProgress();
            
            // Enable continue button for slider
            if (nextBtn) {
                nextBtn.disabled = false;
                nextBtn.style.opacity = '1';
            }
        }
        
        // Slider input event
        weightSlider.addEventListener('input', updateWeightDisplay);
        
        // Unit toggle functionality
        unitButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent any default behavior
                
                const newUnit = this.dataset.unit;
                
                if (newUnit === currentUnit) return;
                
                // Remove active class from all buttons
                unitButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const currentValue = parseInt(weightSlider.value);
                
                if (newUnit === 'lb' && currentUnit === 'kg') {
                    // Convert kg to lb
                    const lbValue = kgToLb(currentValue);
                    kgValue = currentValue; // Store kg value
                    weightSlider.min = kgToLb(40); // ~88 lb
                    weightSlider.max = kgToLb(150); // ~330 lb
                    weightSlider.value = lbValue;
                    if (weightUnit) weightUnit.textContent = 'lb';
                    
                    // Update markers
                    const markers = document.querySelectorAll('.slider-markers span');
                    if (markers.length >= 3) {
                        markers[0].textContent = kgToLb(40);
                        markers[1].textContent = kgToLb(95);
                        markers[2].textContent = kgToLb(150);
                    }
                } else if (newUnit === 'kg' && currentUnit === 'lb') {
                    // Convert lb to kg
                    const kgValueFromLb = lbToKg(currentValue);
                    weightSlider.min = 40;
                    weightSlider.max = 150;
                    weightSlider.value = kgValueFromLb;
                    if (weightUnit) weightUnit.textContent = 'kg';
                    
                    // Update markers
                    const markers = document.querySelectorAll('.slider-markers span');
                    if (markers.length >= 3) {
                        markers[0].textContent = 40;
                        markers[1].textContent = 95;
                        markers[2].textContent = 150;
                    }
                }
                
                currentUnit = newUnit;
                updateWeightDisplay();
            });
        });
        
        // Initialize
        updateSliderProgress();
        
        // Enable continue button initially for slider
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.style.opacity = '1';
        }
        
        // Initialize triangle position on load
        setTimeout(() => {
            updateSliderProgress();
        }, 100);
    }
});

// Function to update option visual selection
function updateOptionSelection(input) {
    const option = input.closest('.quiz-option');
    const card = option.querySelector('.option-card');
    const iconRight = option.querySelector('.option-icon-right');
    const checkboxIndicator = option.querySelector('.checkbox-indicator');
    
    if (input.checked) {
        if (!card.classList.contains('special-pink')) {
            card.style.borderColor = '#ec4899';
            if (!card.classList.contains('gradient-blue') && 
                !card.classList.contains('gradient-green') && 
                !card.classList.contains('gradient-purple') && 
                !card.classList.contains('gradient-pink')) {
                card.style.backgroundColor = '#fdf2f8';
            }
        }
        card.style.transform = 'translateY(-2px)';
        card.style.boxShadow = '0 4px 12px rgba(236, 72, 153, 0.2)';
        
        if (iconRight) {
            iconRight.style.backgroundColor = '#ec4899';
            iconRight.style.color = 'white';
        }
        
        if (checkboxIndicator) {
            checkboxIndicator.style.backgroundColor = '#ec4899';
            checkboxIndicator.style.borderColor = '#ec4899';
        }
    } else {
        if (!card.classList.contains('special-pink')) {
            card.style.borderColor = '#e5e7eb';
            if (!card.classList.contains('gradient-blue') && 
                !card.classList.contains('gradient-green') && 
                !card.classList.contains('gradient-purple') && 
                !card.classList.contains('gradient-pink')) {
                card.style.backgroundColor = 'white';
            }
        }
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
        
        if (iconRight) {
            iconRight.style.backgroundColor = card.classList.contains('special-pink') ? 'rgba(255, 255, 255, 0.2)' : '#f3f4f6';
            iconRight.style.color = card.classList.contains('special-pink') ? 'white' : '#6b7280';
        }
        
        if (checkboxIndicator) {
            checkboxIndicator.style.backgroundColor = 'white';
            checkboxIndicator.style.borderColor = '#d1d5db';
        }
    }
    
    // For radio buttons, clear other selections
    if (input.type === 'radio') {
        const form = input.closest('form');
        const otherRadios = form.querySelectorAll(`input[name="${input.name}"]`);
        otherRadios.forEach(radio => {
            if (radio !== input) {
                const otherOption = radio.closest('.quiz-option');
                const otherCard = otherOption.querySelector('.option-card');
                const otherIcon = otherOption.querySelector('.option-icon-right');
                
                if (!otherCard.classList.contains('special-pink')) {
                    otherCard.style.borderColor = '#e5e7eb';
                    if (!otherCard.classList.contains('gradient-blue') && 
                        !otherCard.classList.contains('gradient-green') && 
                        !otherCard.classList.contains('gradient-purple') && 
                        !otherCard.classList.contains('gradient-pink')) {
                        otherCard.style.backgroundColor = 'white';
                    }
                }
                otherCard.style.transform = 'translateY(0)';
                otherCard.style.boxShadow = 'none';
                
                if (otherIcon) {
                    otherIcon.style.backgroundColor = otherCard.classList.contains('special-pink') ? 'rgba(255, 255, 255, 0.2)' : '#f3f4f6';
                    otherIcon.style.color = otherCard.classList.contains('special-pink') ? 'white' : '#6b7280';
                }
            }
        });
    }
}

// Utility functions
function animateProgressBar(targetWidth, duration = 700) {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    
    let startWidth = 0;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentWidth = startWidth + (targetWidth - startWidth) * progress;
        progressBar.style.width = currentWidth + '%';
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// Analytics and tracking (optional)
function trackQuizStep(step, answer) {
    // Add your analytics tracking here
    console.log(`Quiz Step ${step}: ${answer}`);
    
    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', 'quiz_step', {
    //         step: step,
    //         answer: answer
    //     });
    // }
}

// Add event listeners for tracking
document.addEventListener('DOMContentLoaded', function() {
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(radio => {
        radio.addEventListener('change', function() {
            const step = this.form.querySelector('input[name="questionId"]')?.value;
            const answer = this.value;
            trackQuizStep(step, answer);
        });
    });
});
