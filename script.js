const movieData = {
    Me_Before_You: {
        title: "Me Before You",
        price: 10,
        rows: 8,
        seatsPerRow: 12
    },
    joker: {
        title: "Joker",
        price: 8,
        rows: 6,
        seatsPerRow: 10
    },
    anaabilla: {
        title: "Anaabilla",
        price: 12,
        rows: 10,
        seatsPerRow: 14
    },
    spider_man: {
        title: "Spider Man",
        price: 10,
        rows: 7,
        seatsPerRow: 8
    }
};

let selectedMovie = null;
let selectedSeats = [];
let occupiedSeats = {};

const movieSelect = document.getElementById('movie-select');
const movieTitle = document.getElementById('movie-title');
const moviePrice = document.getElementById('movie-price');
const legend = document.getElementById('legend');
const screenContainer = document.getElementById('screen-container');
const seatingArea = document.getElementById('seating-area');
const bookingSummary = document.getElementById('booking-summary');
const selectedSeatsCount = document.getElementById('selected-seats-count');
const totalPrice = document.getElementById('total-price');
const controls = document.getElementById('controls');
const resetBtn = document.getElementById('reset-btn');
const submitBtn = document.getElementById('submit-btn');
const modalsuccess = document.getElementById('modal-success');
const closeModal = document.getElementById('close-modal');
const modalOk = document.getElementById('modal-ok');


document.addEventListener('DOMContentLoaded', function() {
    loadOccupiedSeats();
    setupEventListeners();
    
    // if already any movie
    restoreSelectedMovie();
});


function setupEventListeners() {
    movieSelect.addEventListener('change', handleMovieSelection);
    resetBtn.addEventListener('click', resetSelection);
    submitBtn.addEventListener('click', submitBooking);
    closeModal.addEventListener('click', hideModal);
    modalOk.addEventListener('click', hideModal);
    modalsuccess.addEventListener('click', function(e) {
        if (e.target === modalsuccess) {
            hideModal();
        }
    });
}


function handleMovieSelection() {
    const selectedValue = movieSelect.value;
    
    if (!selectedValue) {
        hideAllSections();
        selectedMovie = null;
        saveOccupiedSeats(); 
        return;
    }
    
    selectedMovie = selectedValue;
    selectedSeats = [];
    
    const movie = movieData[selectedValue];
    
    showAllSections();
    
    generateSeats();
    
    updateBookingSummary();
    
    saveOccupiedSeats();
}


function showAllSections() {
    legend.style.display = 'flex';
    screenContainer.style.display = 'block';
    bookingSummary.style.display = 'block';
    controls.style.display = 'flex';
}


function hideAllSections() {
    legend.style.display = 'none';
    screenContainer.style.display = 'none';
    seatingArea.innerHTML = '';
    bookingSummary.style.display = 'none';
    controls.style.display = 'none';
}


function generateSeats() {
    const movie = movieData[selectedMovie];
    seatingArea.innerHTML = '';
    
    for (let row = 0; row < movie.rows; row++) {
        const seatRow = document.createElement('div');
        seatRow.className = 'seat-row';
        
        
        const rowLabel = document.createElement('div');
        rowLabel.className = 'row-label';
        rowLabel.textContent = String.fromCharCode(65 + row); 
        seatRow.appendChild(rowLabel);
        
        for (let seat = 1; seat <= movie.seatsPerRow; seat++) {
            const seatElement = document.createElement('div');
            const seatId = `${String.fromCharCode(65 + row)}${seat}`;
            
            seatElement.className = 'seat';
            seatElement.dataset.seatId = seatId;
            seatElement.textContent = seat;
            
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


function toggleSeat(seatId, seatElement) {
    if (seatElement.classList.contains('occupied')) {
        return;
    }
    
    if (seatElement.classList.contains('selected')) {
        
        seatElement.classList.remove('selected');
        seatElement.classList.add('available');
        selectedSeats = selectedSeats.filter(seat => seat !== seatId);
    } else {
        
        seatElement.classList.remove('available');
        seatElement.classList.add('selected');
        selectedSeats.push(seatId);
    }
    
    updateBookingSummary();
}


function updateBookingSummary() {
    const movie = movieData[selectedMovie];
    const count = selectedSeats.length;
    const total = count * movie.price;
    
    selectedSeatsCount.textContent = count;
    totalPrice.textContent = total;
    
    
    submitBtn.disabled = count === 0;
}


function resetSelection() {
    selectedSeats = [];
    const selectedSeatElements = document.querySelectorAll('.seat.selected');
    selectedSeatElements.forEach(seat => {
        seat.classList.remove('selected');
        seat.classList.add('available');
    });
    
    updateBookingSummary();
}


function submitBooking() {
    if (selectedSeats.length === 0) {
        alert('Please select at least one seat.');
        return;
    }
    
    selectedSeats.forEach(seatId => {
        markSeatAsOccupied(selectedMovie, seatId);
    });
    
    saveOccupiedSeats();
    
    showSuccessModal();
    
    selectedSeats = [];
    
    generateSeats();
    updateBookingSummary();
}

function markSeatAsOccupied(movieId, seatId) {
    if (!occupiedSeats[movieId]) {
        occupiedSeats[movieId] = [];
    }
    if (!occupiedSeats[movieId].includes(seatId)) {
        occupiedSeats[movieId].push(seatId);
    }
}

function isOccupied(movieId, seatId) {
    return occupiedSeats[movieId] && occupiedSeats[movieId].includes(seatId);
}

function saveOccupiedSeats() {
    try {
        const dataToSave = {
            occupiedSeats: occupiedSeats,
            selectedMovie: selectedMovie
        };
        localStorage.setItem('movieBookingData', JSON.stringify(dataToSave));
    } catch (error) {
        console.error('Error saving occupied seats:', error);
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

function loadOccupiedSeats() {
    try {
        
        const savedData = localStorage.getItem('movieBookingData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            occupiedSeats = parsedData.occupiedSeats || {};
            return;
        }
        
        const sessionData = sessionStorage.getItem('movieBookingData');
        if (sessionData) {
            const parsedData = JSON.parse(sessionData);
            occupiedSeats = parsedData.occupiedSeats || {};
            return;
        }
    } catch (error) {
        console.error('Error loading occupied seats:', error);
    }
}


function restoreSelectedMovie() {
    try {
        let savedData = localStorage.getItem('movieBookingData');
        if (!savedData) {
            savedData = sessionStorage.getItem('movieBookingData');
        }
        
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData.selectedMovie) {
                movieSelect.value = parsedData.selectedMovie;
                handleMovieSelection();
            }
        }
    } catch (error) {
        console.error('Error restoring selected movie:', error);
    }
}

function showSuccessModal() {
    const movie = movieData[selectedMovie];
    const total = selectedSeats.length * movie.price;
    
    document.getElementById('modal-movie').textContent = movie.title;
    document.getElementById('modal-seats').textContent = selectedSeats.join(', ');
    document.getElementById('modal-price').textContent = total;

    modalsuccess.classList.add('show');
    document.body.style.overflow = 'hidden';
}


function hideModal() {
    modalsuccess.classList.remove('show');
    document.body.style.overflow = 'auto';
}


window.addEventListener('beforeunload', function() {
    saveOccupiedSeats();
});

function submitBooking() {
    if (selectedSeats.length === 0) {
        alert('Please select at least one seat.');
        return;
    }
    
    selectedSeats.forEach(seatId => {
        markSeatAsOccupied(selectedMovie, seatId);
    });
    
    saveOccupiedSeats();
    

    showSuccessModal();
    
    selectedSeats = [];
    
    
    generateSeats();
    updateBookingSummary();
}