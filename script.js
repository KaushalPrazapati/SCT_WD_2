class ModernStopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.lapCount = 1;
        
        // DOM elements
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.millisecondsElement = document.getElementById('milliseconds');
        this.lapsListElement = document.getElementById('lapsList');
        
        // Buttons
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapBtn = document.getElementById('lapBtn');
        
        // Event listeners
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.recordLap());
        
        // Initialize
        this.updateButtonStates();
    }
    
    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(() => this.updateTime(), 10);
            this.isRunning = true;
            this.updateButtonStates();
            
            // Add animation to time display
            document.querySelector('.time-display').classList.add('active');
        }
    }
    
    pause() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.elapsedTime = Date.now() - this.startTime;
            this.isRunning = false;
            this.updateButtonStates();
            
            // Remove animation
            document.querySelector('.time-display').classList.remove('active');
        }
    }
    
    reset() {
        this.pause();
        this.elapsedTime = 0;
        this.lapCount = 1;
        this.displayTime(0);
        
        // Clear laps
        this.lapsListElement.innerHTML = '';
        
        // Add reset animation
        const timeDisplay = document.querySelector('.time-display');
        timeDisplay.classList.add('reset-animation');
        setTimeout(() => {
            timeDisplay.classList.remove('reset-animation');
        }, 500);
    }
    
    recordLap() {
        if (this.isRunning) {
            const lapTime = this.formatTime(this.elapsedTime);
            const lapItem = document.createElement('div');
            lapItem.classList.add('lap-item');
            
            // Highlight fastest lap with special styling
            const laps = Array.from(this.lapsListElement.children);
            const isFirstLap = laps.length === 0;
            
            lapItem.innerHTML = `
                <span class="lap-number">Lap ${this.lapCount}</span>
                <span class="lap-time">${lapTime}</span>
            `;
            
            // Add animation
            lapItem.style.animation = 'lapFade 0.5s ease';
            
            this.lapsListElement.prepend(lapItem);
            this.lapCount++;
            
            // Add lap recorded animation
            this.lapBtn.classList.add('recorded');
            setTimeout(() => {
                this.lapBtn.classList.remove('recorded');
            }, 300);
        }
    }
    
    updateTime() {
        this.elapsedTime = Date.now() - this.startTime;
        this.displayTime(this.elapsedTime);
    }
    
    displayTime(time) {
        const formattedTime = this.formatTime(time);
        const [minutes, seconds, milliseconds] = formattedTime.split(':');
        
        this.minutesElement.textContent = minutes;
        this.secondsElement.textContent = seconds;
        this.millisecondsElement.textContent = milliseconds;
    }
    
    formatTime(time) {
        // Calculate minutes, seconds, and milliseconds
        const minutes = Math.floor(time / (1000 * 60));
        const seconds = Math.floor((time % (1000 * 60)) / 1000);
        const milliseconds = Math.floor((time % 1000) / 10);
        
        // Format with leading zeros
        return [
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0'),
            milliseconds.toString().padStart(2, '0')
        ].join(':');
    }
    
    updateButtonStates() {
        this.startBtn.disabled = this.isRunning;
        this.pauseBtn.disabled = !this.isRunning;
        
        // Visual feedback for state changes
        if (this.isRunning) {
            this.startBtn.style.opacity = '0.5';
            this.pauseBtn.style.opacity = '1';
        } else {
            this.startBtn.style.opacity = '1';
            this.pauseBtn.style.opacity = '0.5';
        }
    }
}

// Initialize the stopwatch when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const stopwatch = new ModernStopwatch();
    
    // Add initial animation to elements
    const timeDisplay = document.querySelector('.time-display');
    const controls = document.querySelector('.controls');
    
    setTimeout(() => {
        timeDisplay.style.opacity = '1';
        timeDisplay.style.transform = 'translateY(0)';
    }, 300);
    
    setTimeout(() => {
        controls.style.opacity = '1';
        controls.style.transform = 'translateY(0)';
    }, 600);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                if (stopwatch.isRunning) {
                    stopwatch.pause();
                } else {
                    stopwatch.start();
                }
                break;
            case 'KeyL':
                e.preventDefault();
                stopwatch.recordLap();
                break;
            case 'KeyR':
                e.preventDefault();
                stopwatch.reset();
                break;
        }
    });
    
    // Add touch feedback for mobile devices
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('touchstart', function() {
            this.classList.add('touch-feedback');
        });
        
        btn.addEventListener('touchend', function() {
            this.classList.remove('touch-feedback');
        });
    });
});