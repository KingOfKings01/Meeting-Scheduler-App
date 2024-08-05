// Fetch and display available meeting times using Axios
async function fetchMeetingTimes() {
    try {
        const meetingTimesDiv = document.getElementById('meeting-times');
        meetingTimesDiv.innerHTML = '';
        const response = await axios.get('http://localhost:3000/api/meetings');
        response.data.forEach(meeting => {
            if(meeting.availableSlots > 0){
                const meetingDiv = document.createElement('div');
                meetingDiv.textContent = `Time: ${meeting.time} | Available: ${meeting.availableSlots}`;
                meetingDiv.style.cursor = 'pointer';
                meetingDiv.onclick = () => {
                    selectedTime = meeting.time;
                    bookingFormDiv.style.display = 'block';
                };
                meetingDiv.dataset.time = meeting.time;
                meetingDiv.dataset.slots = meeting.availableSlots;
                meetingTimesDiv.appendChild(meetingDiv);
            }
        });
    } catch (error) {
        console.error('Error fetching meetings:', error);
    }
}

// Fetch and display all users
async function fetchUsers() {
    try {
        const bookedMeetingsDiv = document.getElementById('booked-meetings');
        bookedMeetingsDiv.innerHTML = '';
        const response = await axios.get('http://localhost:3000/api/all');
        response.data.forEach(user => {
            addUserToBookedMeetings(user);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Handle form submission using Axios
async function handleFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (selectedTime) {
        try {
            const response = await axios.post('http://localhost:3000/api/book', { name, email, time: selectedTime });
            if (response.data.message) {
                alert(response.data.message);
            } else {
                addUserToBookedMeetings(response.data.user);
                updateMeetingSlots(selectedTime, -1);
                resetForm();
            }
        } catch (error) {
            console.error('Error booking meeting:', error);
        }
    }
}

// Function to add user to booked meetings list
function addUserToBookedMeetings(user) {
    if (!user) {
        console.error('Invalid user:', user);
        return;
    }
    const bookedMeetingsDiv = document.getElementById('booked-meetings');
    const bookedDiv = document.createElement('div');
    bookedDiv.textContent = `Name: ${user.name} | Email: ${user.email}`;
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = () => cancelMeeting(user.id, bookedDiv, user.meeting.time);
    bookedDiv.appendChild(cancelButton);
    bookedMeetingsDiv.appendChild(bookedDiv);
}

// Cancel a booked meeting using Axios
async function cancelMeeting(userId, bookedDiv, meetingTime) {
    try {
        const response = await axios.post(`http://localhost:3000/api/cancel/${userId}`);
        if (response.data.message) {
            alert(response.data.message);
        }
        bookedDiv.remove();
        updateMeetingSlots(meetingTime, 1);
    } catch (error) {
        console.error('Error canceling meeting:', error);
    }
}

// Function to update meeting slots dynamically
function updateMeetingSlots(time, change) {
    const meetingTimesDiv = document.getElementById('meeting-times');
    const meetingDivs = meetingTimesDiv.children;
    for (let meetingDiv of meetingDivs) {
        if (meetingDiv.dataset.time === time) {
            let slots = parseInt(meetingDiv.dataset.slots) + change;
            meetingDiv.dataset.slots = slots;
            meetingDiv.textContent = `Time: ${time} | Available: ${slots}`;
            if (slots <= 0) {
                meetingDiv.style.display = 'none';
            }
        }
    }
}

// Reset form after booking
function resetForm() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    const bookingFormDiv = document.getElementById('booking-form');
    bookingFormDiv.style.display = 'none';
    selectedTime = null;
}

// Initial setup: fetch and display all users and meeting times
let selectedTime = null;
fetchMeetingTimes();
fetchUsers();

// Event listeners
document.getElementById('form').addEventListener('submit', handleFormSubmit);
