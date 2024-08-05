document.addEventListener('DOMContentLoaded', () => {
    const meetingTimesDiv = document.getElementById('meeting-times');
    const bookingFormDiv = document.getElementById('booking-form');
    const bookedMeetingsDiv = document.getElementById('booked-meetings');
    let selectedTime = null;

    // Fetch and display available meeting times using Axios
    axios.get('http://localhost:3000/api/meetings')
        .then(response => {
            response.data.forEach(meeting => {
                if(meeting.availableSlots > 0){
                    const meetingDiv = document.createElement('div');
                    meetingDiv.textContent = `Time: ${meeting.time} | Available: ${meeting.availableSlots}`;
                    meetingDiv.style.cursor = 'pointer';
                    meetingDiv.onclick = () => {
                        selectedTime = meeting.time;
                        bookingFormDiv.style.display = 'block';
                    };
                    meetingTimesDiv.appendChild(meetingDiv);
                }
            });
        })
        .catch(error => console.error('Error fetching meetings:', error));

    // Fetch and display all users
    function fetchUsers() {
        axios.get('http://localhost:3000/api/all')
            .then(response => {
                response.data.forEach(user => {
                    addUserToBookedMeetings(user);
                });
            })
            .catch(error => console.error('Error fetching users:', error));
    }

    // Handle form submission using Axios
    document.getElementById('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        if (selectedTime) {
            axios.post('http://localhost:3000/api/book', { name, email, time: selectedTime })
                .then(response => {
                    if (response.data.message) {
                        alert(response.data.message);
                    } else {
                        addUserToBookedMeetings(response.data.user);
                        resetForm();
                    }
                })
                .catch(error => console.error('Error booking meeting:', error));
        }
    });

    function addUserToBookedMeetings(user) {
        console.log('User data:', user); // Debugging
        if (!user || !user.id || !user.name || !user.email ) {
            console.error('Invalid user data:', user);
            return;
        }
        const bookedDiv = document.createElement('div');
        bookedDiv.textContent = `Name: ${user.name} | Email: ${user.email}`;
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.onclick = () => cancelMeeting(user.id, bookedDiv);
        bookedDiv.appendChild(cancelButton);
        bookedMeetingsDiv.appendChild(bookedDiv);
    }

    // Cancel a booked meeting using Axios
    function cancelMeeting(userId, bookedDiv) {
        axios.post(`http://localhost:3000/api/cancel/${userId}`)
            .then(response => {
                if (response.data.message) {
                    alert(response.data.message);
                }
                bookedDiv.remove();
                refreshMeetingTimes();
            })
            .catch(error => console.error('Error canceling meeting:', error));
    }

    // Refresh available meeting times after booking/canceling
    function refreshMeetingTimes() {
        meetingTimesDiv.innerHTML = '';
        axios.get('http://localhost:3000/api/meetings')
            .then(response => {
                response.data.forEach(meeting => {
                    const meetingDiv = document.createElement('div');
                    meetingDiv.textContent = `Time: ${meeting.time} | Available: ${meeting.availableSlots}`;
                    meetingDiv.style.cursor = 'pointer';
                    meetingDiv.onclick = () => {
                        selectedTime = meeting.time;
                        bookingFormDiv.style.display = 'block';
                    };
                    meetingTimesDiv.appendChild(meetingDiv);
                });
            })
            .catch(error => console.error('Error fetching meetings:', error));
    }

    // Reset form after booking
    function resetForm() {
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        bookingFormDiv.style.display = 'none';
    }

    // Fetch and display all users on page load
    fetchUsers();
});
