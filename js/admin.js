// Admin JS: manage flights via API
document.addEventListener('DOMContentLoaded', function() {
    loadFlights();
    const form = document.getElementById('flightForm');
    if (form) form.addEventListener('submit', submitFlight);
});

async function loadFlights() {
    const list = document.getElementById('flightsList');
    list.textContent = 'Loading...';
    try {
        const res = await fetch('/api/flights');
        if (!res.ok) throw new Error('Network error');
        const flights = await res.json();
        if (!flights.length) {
            list.innerHTML = '<div class="text-muted">No flights yet.</div>';
            return;
        }
        list.innerHTML = flights.map(f => `
            <div class="flight-item">
                <strong>${f.airline} ${f.flight_number}</strong>
                <div class="text-muted small">${f.origin} → ${f.destination} • $${f.price}</div>
            </div>
        `).join('');
    } catch (err) {
        list.innerHTML = '<div class="text-danger">Unable to load flights.</div>';
    }
}

async function submitFlight(e) {
    e.preventDefault();
    const payload = {
        flight_number: document.getElementById('flightNumber').value.trim(),
        airline: document.getElementById('airline').value.trim(),
        origin: document.getElementById('origin').value.trim(),
        destination: document.getElementById('destination').value.trim(),
        departure: document.getElementById('departure').value.trim(),
        arrival: document.getElementById('arrival').value.trim(),
        seats: parseInt(document.getElementById('seats').value,10)||0,
        price: parseFloat(document.getElementById('price').value)||0
    };

    try {
        const res = await fetch('/api/flights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to add');
        // reset and reload
        e.target.reset();
        loadFlights();
        alert('Flight added');
    } catch (err) {
        alert('Error adding flight');
    }
}
