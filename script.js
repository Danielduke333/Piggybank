document.addEventListener('DOMContentLoaded', () => {
    const goalInput = document.getElementById('goal');
    const slider = document.getElementById('savings-slider');
    const savingsAmount = document.getElementById('savings-amount');
    const savingsPercentage = document.getElementById('savings-percentage');
    const progress = document.getElementById('progress');
    const currencySelect = document.getElementById('currency');
    const goalDisplay = document.getElementById('goal-display');
    const closeButton = document.querySelector('.close-button');
    const welcomeMessage = document.getElementById('welcome-message');
    const celebrationMessage = document.getElementById('celebration-message');
    const floatingIndicators = document.getElementById('floating-indicators');
    const customPopup = document.getElementById('custom-popup');
    const popupClose = document.querySelector('.popup-close');
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const coinIcon = document.querySelector('.coin-icon');

    let lastPercentage = 0;
    let sliderStartValue = 0;

    // Position floating indicators container
    sliderWrapper.style.position = 'relative';
    
    function createFloatingIndicator(percentageChange) {
        const indicator = document.createElement('div');
        indicator.className = `floating-indicator ${percentageChange > 0 ? 'increase' : 'decrease'}`;
        indicator.textContent = `${percentageChange > 0 ? '+' : ''}${percentageChange}%`;
        
        // Calculate slider value position
        const sliderValue = parseInt(slider.value) || 0;
        const sliderMax = parseInt(slider.max) || 100;
        const percentage = (sliderValue / sliderMax) * 100;
        
        // Set initial position
        indicator.style.position = 'absolute';
        indicator.style.left = `${percentage}%`;
        
        sliderWrapper.appendChild(indicator);
        
        // Remove the indicator after animation completes
        setTimeout(() => {
            indicator.remove();
        }, 1500);
    }

    // Store initial value when slider interaction starts
    slider.addEventListener('mousedown', () => {
        sliderStartValue = parseInt(slider.value) || 0;
    });
    
    slider.addEventListener('touchstart', () => {
        sliderStartValue = parseInt(slider.value) || 0;
    });

    // Update savings during slider movement (without floating indicator)
    slider.addEventListener('input', () => updateSavings(false));

    // Show floating indicator when slider is released
    slider.addEventListener('mouseup', () => {
        const currentValue = parseInt(slider.value) || 0;
        const totalChange = calculatePercentageChange(sliderStartValue, currentValue);
        if (totalChange !== 0) {
            createFloatingIndicator(totalChange);
        }
    });

    slider.addEventListener('touchend', () => {
        const currentValue = parseInt(slider.value) || 0;
        const totalChange = calculatePercentageChange(sliderStartValue, currentValue);
        if (totalChange !== 0) {
            createFloatingIndicator(totalChange);
        }
    });

    // Handle popup close button
    popupClose.addEventListener('click', () => {
        customPopup.classList.remove('show');
    });

    // Handle close button click
    closeButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to close the piggy bank?')) {
            window.close();
        }
    });

    // Hide welcome message when user starts typing
    goalInput.addEventListener('focus', () => {
        welcomeMessage.classList.add('hide');
    });

    // Update display when goal changes
    goalInput.addEventListener('input', () => {
        const goal = parseInt(goalInput.value) || 0;
        const currency = currencySelect.value;
        
        // Enforce maximum limit of 10000
        if (goal > 10000) {
            goalInput.value = 10000;
            customPopup.classList.add('show');
            return;
        }
        
        if (goal > 0) {
            slider.max = goal;
            slider.disabled = false;
            goalDisplay.textContent = `Goal: ${currency}${goal}`;
            welcomeMessage.classList.add('hide');
            
            // Reset slider if goal is less than current value
            if (parseInt(slider.value) > goal) {
                slider.value = goal;
                updateSavings(false);
            }
        } else {
            slider.disabled = true;
            slider.value = 0;
            goalDisplay.textContent = 'Goal: 0';
            updateSavings(false);
        }
    });

    function updateCoinIcon(currency) {
        const coinSvg = `
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#FFD700" stroke="#FF9900" stroke-width="2"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="#FF9900">${currency}</text>
            </svg>
        `;
        coinIcon.src = `data:image/svg+xml,${encodeURIComponent(coinSvg)}`;
    }

    // Initialize with default currency
    updateCoinIcon(currencySelect.value);

    // Update coin icon when currency changes
    currencySelect.addEventListener('change', () => {
        const goal = parseInt(goalInput.value) || 0;
        const currency = currencySelect.value;
        goalDisplay.textContent = `Goal: ${currency}${goal}`;
        updateSavings(false);
        updateCoinIcon(currency);
    });

    function calculatePercentageChange(startValue, endValue) {
        const goal = parseInt(goalInput.value) || 0;
        if (goal === 0) return 0;
        
        const startPercentage = Math.round((startValue / goal) * 100);
        const endPercentage = Math.round((endValue / goal) * 100);
        return endPercentage - startPercentage;
    }

    function updateSavings(showIndicator = true) {
        const currentValue = parseInt(slider.value) || 0;
        const goal = parseInt(goalInput.value) || 0;
        const currency = currencySelect.value;
        
        // Update amount display with selected currency
        savingsAmount.textContent = `${currency}${currentValue}`;
        
        // Calculate and update percentage
        const percentage = goal > 0 ? Math.round((currentValue / goal) * 100) : 0;
        savingsPercentage.textContent = `${percentage}%`;
        
        // Update slider progress
        slider.style.setProperty('--slider-progress', `${percentage}%`);

        // Check if goal is reached
        if (goal > 0 && currentValue >= goal) {
            celebrationMessage.classList.add('show');
            triggerConfetti();
        } else {
            celebrationMessage.classList.remove('show');
        }
    }

    function triggerConfetti() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ffd700', '#ff9900', '#8a3cc8']
        });
    }

    // Format number input to prevent negative values
    goalInput.addEventListener('change', () => {
        if (goalInput.value < 0) {
            goalInput.value = 0;
        }
    });
}); 