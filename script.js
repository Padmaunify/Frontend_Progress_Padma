// Movie data with different seating arrangements
const movieData = {
    avengers: {
        title: "Avengers: Endgame",
        price: 15,
        timing: "7:30 PM - 10:45 PM",
        venue: "AMC Theater - Screen 1",
        rows: 8,
        seatsPerRow: 12
    },
    joker: {
        title: "Joker",
        price: 12,
        timing: "6:00 PM - 8:30 PM",
        venue: "Cineplex - Screen 2",
        rows: 6,
        seatsPerRow: 10
    },
    inception: {
        title: "Inception",
        price: 18,
        timing: "9:00 PM - 11:30 PM",
        venue: "IMAX Theater - Screen 1",
        rows: 10,
        seatsPerRow: 14
    },
    titanic: {
        title: "Titanic",
        price: 10,
        timing: "5:00 PM - 8:30 PM",
        venue: "Classic Cinema - Screen 3",
        rows: 7,
        seatsPerRow: 8
    }
};

// Global variables
let selectedMovie = null;
let selectedSeats = [];
let occupiedSeats = {};

// DOM elements
const movieSelect = document.getElementById('movie-select');
const movieInfo = document.getElementById('movie-info');
const movieTitle = document.getElementById('movie-title');
const moviePrice = document.getElementById('movie-price');
const movieTiming = document.getElementById('movie-timing');
const movieVenue = document.getElementById('movie-venue');
const legend = document.getElementById('legend');
const screenContainer = document.getElementById('screen-container');
const seatingArea = document.getElementById('seating-area');
const bookingSummary = document.getElementById('booking-summary');
const selectedSeatsCount = document.getElementById('selected-seats-count');
const totalPrice = document.getElementById('total-price');
const controls = document.getElementById('controls');
const resetBtn = document.getElementById('reset-btn');
const submitBtn = document.getElementById('submit-btn');
const modalOverlay = document.getElementById('modal-overlay');
const closeModal = document.getElementById('close-modal');
const modalOk = document.getElementById('modal-ok');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadOccupiedSeats();
    setupEventListeners();
    
    // If there was a previously selected movie, restore it
    restoreSelectedMovie();
});

// Setup event listeners
function setupEventListeners() {
    movieSelect.addEventListener('change', handleMovieSelection);
    resetBtn.addEventListener('click', resetSelection);
    submitBtn.addEventListener('click', submitBooking);
    closeModal.addEventListener('click', hideModal);
    modalOk.addEventListener('click', hideModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            hideModal();
        }
    });
}

// Handle movie selection
function handleMovieSelection() {
    const selectedValue = movieSelect.value;
    
    if (!selectedValue) {
        hideAllSections();
        selectedMovie = null;
        saveOccupiedSeats(); // Save the state change
        return;
    }
    
    selectedMovie = selectedValue;
    selectedSeats = [];
    
    const movie = movieData[selectedValue];
    
    // Update movie info
    movieTitle.textContent = movie.title;
    moviePrice.textContent = movie.price;
    movieTiming.textContent = movie.timing;
    movieVenue.textContent = movie.venue;
    
    // Show all sections
    showAllSections();
    
    // Generate seating arrangement
    generateSeats();
    
    // Update summary
    updateBookingSummary();
    
    // Save the current state
    saveOccupiedSeats();
}

// Show all sections
function showAllSections() {
    movieInfo.style.display = 'block';
    legend.style.display = 'flex';
    screenContainer.style.display = 'block';
    bookingSummary.style.display = 'block';
    controls.style.display = 'flex';
}

// Hide all sections
function hideAllSections() {
    movieInfo.style.display = 'none';
    legend.style.display = 'none';
    screenContainer.style.display = 'none';
    seatingArea.innerHTML = '';
    bookingSummary.style.display = 'none';
    controls.style.display = 'none';
}

// Generate seats based on selected movie
function generateSeats() {
    const movie = movieData[selectedMovie];
    seatingArea.innerHTML = '';
    
    for (let row = 0; row < movie.rows; row++) {
        const seatRow = document.createElement('div');
        seatRow.className = 'seat-row';
        
        // Add row label
        const rowLabel = document.createElement('div');
        rowLabel.className = 'row-label';
        rowLabel.textContent = String.fromCharCode(65 + row); // A, B, C, etc.
        seatRow.appendChild(rowLabel);
        
        // Add seats
        for (let seat = 1; seat <= movie.seatsPerRow; seat++) {
            const seatElement = document.createElement('div');
            const seatId = `${String.fromCharCode(65 + row)}${seat}`;
            
            seatElement.className = 'seat';
            seatElement.dataset.seatId = seatId;
            seatElement.textContent = seat;
            
            // Check if seat is occupied
            if (isOccupied(selectedMovie, seatId)) {
                seatElement.classList.add('occupied');
            } else {
                seatElement.classList.add('available');
                seatElement.addEventListener('click', () => toggleSeat(seatId, seatElement));
            }
            
            seatRow.appendChild(seatElement);
        }
        
        seatingArea.appendChild(seatRow);
    }
}

// Toggle seat selection
function toggleSeat(seatId, seatElement) {
    if (seatElement.classList.contains('occupied')) {
        return;
    }
    
    if (seatElement.classList.contains('selected')) {
        // Deselect seat
        seatElement.classList.remove('selected');
        seatElement.classList.add('available');
        selectedSeats = selectedSeats.filter(seat => seat !== seatId);
    } else {
        // Select seat
        seatElement.classList.remove('available');
        seatElement.classList.add('selected');
        selectedSeats.push(seatId);
    }
    
    updateBookingSummary();
}

// Update booking summary
function updateBookingSummary() {
    const movie = movieData[selectedMovie];
    const count = selectedSeats.length;
    const total = count * movie.price;
    
    selectedSeatsCount.textContent = count;
    totalPrice.textContent = total;
    
    // Enable/disable submit button
    submitBtn.disabled = count === 0;
}

// Reset selection
function resetSelection() {
    selectedSeats = [];
    
    // Reset all selected seats to available
    const selectedSeatElements = document.querySelectorAll('.seat.selected');
    selectedSeatElements.forEach(seat => {
        seat.classList.remove('selected');
        seat.classList.add('available');
    });
    
    updateBookingSummary();
}

// Submit booking
function submitBooking() {
    if (selectedSeats.length === 0) {
        alert('Please select at least one seat.');
        return;
    }
    
    // Mark seats as occupied
    selectedSeats.forEach(seatId => {
        markSeatAsOccupied(selectedMovie, seatId);
    });
    
    // Save occupied seats to storage
    saveOccupiedSeats();
    
    // Show success modal
    showSuccessModal();
    
    // Reset selection
    selectedSeats = [];
    
    // Regenerate seats to show newly occupied seats
    generateSeats();
    updateBookingSummary();
}

// Mark seat as occupied
function markSeatAsOccupied(movieId, seatId) {
    if (!occupiedSeats[movieId]) {
        occupiedSeats[movieId] = [];
    }
    if (!occupiedSeats[movieId].includes(seatId)) {
        occupiedSeats[movieId].push(seatId);
    }
}

// Check if seat is occupied
function isOccupied(movieId, seatId) {
    return occupiedSeats[movieId] && occupiedSeats[movieId].includes(seatId);
}

// Save occupied seats to localStorage to persist on refresh
function saveOccupiedSeats() {
    try {
        const dataToSave = {
            occupiedSeats: occupiedSeats,
            selectedMovie: selectedMovie
        };
        localStorage.setItem('movieBookingData', JSON.stringify(dataToSave));
    } catch (error) {
        console.error('Error saving occupied seats:', error);
        // Fallback to session storage if localStorage fails
        try {
            const dataToSave = {
                occupiedSeats: occupiedSeats,
                selectedMovie: selectedMovie
            };
            sessionStorage.setItem('movieBookingData', JSON.stringify(dataToSave));
        } catch (sessionError) {
            console.error('Error saving to session storage:', sessionError);
        }
    }
}

// Load occupied seats from localStorage
function loadOccupiedSeats() {
    try {
        // Try to load from localStorage first
        const savedData = localStorage.getItem('movieBookingData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            occupiedSeats = parsedData.occupiedSeats || {};
            // Don't restore selectedMovie here, do it separately
            return;
        }
        
        // Fallback to sessionStorage
        const sessionData = sessionStorage.getItem('movieBookingData');
        if (sessionData) {
            const parsedData = JSON.parse(sessionData);
            occupiedSeats = parsedData.occupiedSeats || {};
            return;
        }
    } catch (error) {
        console.error('Error loading occupied seats:', error);
    }
    
    // Initialize with some pre-occupied seats for demonstration if no saved data
    occupiedSeats = {
        avengers: ['A1', 'A2', 'B5', 'C10'],
        joker: ['A3', 'B7', 'D2'],
        inception: ['F8', 'F9', 'G12', 'H1'],
        titanic: ['C4', 'D3', 'E6']
    };
    
    // Save the initial data
    saveOccupiedSeats();
}

// Restore previously selected movie after page refresh
function restoreSelectedMovie() {
    try {
        // Try to load from localStorage first
        let savedData = localStorage.getItem('movieBookingData');
        if (!savedData) {
            // Fallback to sessionStorage
            savedData = sessionStorage.getItem('movieBookingData');
        }
        
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData.selectedMovie) {
                // Set the dropdown to the previously selected movie
                movieSelect.value = parsedData.selectedMovie;
                // Trigger the change event to restore the movie display
                handleMovieSelection();
            }
        }
    } catch (error) {
        console.error('Error restoring selected movie:', error);
    }
}

// Show success modal
function showSuccessModal() {
    const movie = movieData[selectedMovie];
    const total = selectedSeats.length * movie.price;
    const bookingId = generateBookingId();
    
    // Populate modal with booking details
    document.getElementById('modal-movie').textContent = movie.title;
    document.getElementById('modal-seats').textContent = selectedSeats.join(', ');
    document.getElementById('modal-price').textContent = total;
    document.getElementById('modal-timing').textContent = movie.timing;
    document.getElementById('modal-venue').textContent = movie.venue;
    document.getElementById('modal-booking-id').textContent = bookingId;
    
    // Show modal
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Hide modal
function hideModal() {
    modalOverlay.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Generate booking ID
function generateBookingId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `BK${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`;
}

// Handle page refresh - retain occupied seats
window.addEventListener('beforeunload', function() {
    saveOccupiedSeats();
});

// Also save seats immediately after each booking
function submitBooking() {
    if (selectedSeats.length === 0) {
        alert('Please select at least one seat.');
        return;
    }
    
    // Mark seats as occupied
    selectedSeats.forEach(seatId => {
        markSeatAsOccupied(selectedMovie, seatId);
    });
    
    // Save occupied seats immediately to ensure persistence
    saveOccupiedSeats();
    
    // Show success modal
    showSuccessModal();
    
    // Reset selection
    selectedSeats = [];
    
    // Regenerate seats to show newly occupied seats
    generateSeats();
    updateBookingSummary();
}