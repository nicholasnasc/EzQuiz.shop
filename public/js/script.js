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
    
    if (quizForm && nextBtn) {
        const radioInputs = quizForm.querySelectorAll('input[type="radio"]');
        
        // Enable/disable next button based on selection
        radioInputs.forEach(radio => {
            radio.addEventListener('change', function() {
                nextBtn.disabled = false;
                nextBtn.style.opacity = '1';
            });
        });
        
        // Form submission
        quizForm.addEventListener('submit', function(e) {
            const checkedRadio = quizForm.querySelector('input[type="radio"]:checked');
            if (!checkedRadio) {
                e.preventDefault();
                alert('Por favor, selecione uma opção antes de continuar.');
                return false;
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
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });
        
        option.addEventListener('mouseleave', function() {
            const card = this.querySelector('.option-card');
            const radio = this.querySelector('input[type="radio"]');
            if (!radio.checked) {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
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
    
});

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
