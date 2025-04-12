const BASE_URL = 'http://localhost:3000'; // Replace with your backend URL

document.addEventListener('DOMContentLoaded', () => {
    // Fetch initial data
     fetchDashboardData();
    fetchAmbulances();
    fetchHospitals();

    // Add event listeners to the menu items to switch sections
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const section = link.dataset.section;
            showSection(section);
        });
    });

    // Form submission for adding a new ambulance
    document.getElementById('addAmbulanceForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('ambulanceUsername').value;
        const password = document.getElementById('ambulancePassword').value;
        const licenseNumber = document.getElementById('ambulanceLicense').value;
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${BASE_URL}/ambulances`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username,
                    password,
                    license_number: licenseNumber
                })
            });

            if (response.ok) {
                closeModal('ambulance');
                fetchAmbulances(); // Refresh the ambulance table
                 fetchDashboardData();
            } else {
                const errorData = await response.json();
                alert(`Error adding ambulance: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error adding ambulance:', error);
            alert('Failed to add ambulance. Please try again.');
        }
    });

    // Form submission for adding a new hospital
    document.getElementById('addHospitalForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('hospitalUsername').value;
        const password = document.getElementById('hospitalPassword').value;
        const hospitalName = document.getElementById('hospitalName').value;
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${BASE_URL}/hospitals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username,
                    password,
                    hospital_name: hospitalName
                })
            });

            if (response.ok) {
                closeModal('hospital');
                fetchHospitals(); // Refresh the hospital table
                fetchDashboardData();
            } else {
                const errorData = await response.json();
                alert(`Error adding hospital: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error adding hospital:', error);
            alert('Failed to add hospital. Please try again.');
        }
    });

    async function fetchDashboardData() {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${BASE_URL}/dashboard-data`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }
            const data = await response.json();
            document.getElementById('total-ambulances').textContent = data.activeAmbulances;
            document.getElementById('total-hospitals').textContent = data.hospitalsOnline;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }

});

function showSection(sectionId) {
    document.querySelectorAll('.table-container').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(`${sectionId}-section`).style.display = 'block';
}

async function fetchAmbulances() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${BASE_URL}/ambulances`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch ambulances');
        }
        const ambulances = await response.json();
        updateAmbulanceTable(ambulances);

    } catch (error) {
        console.error('Error fetching ambulances:', error);
        alert('Failed to fetch ambulances. Check the console for more details.');
    }
}

async function fetchHospitals() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${BASE_URL}/hospitals`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch hospitals');
        }
        const hospitals = await response.json();
        updateHospitalTable(hospitals);

    } catch (error) {
        console.error('Error fetching hospitals:', error);
        alert('Failed to fetch hospitals. Check the console for more details.');
    }
}

function updateAmbulanceTable(ambulances) {
    const tableBody = document.getElementById('ambulance-table').querySelector('tbody');
    tableBody.innerHTML = '';
    ambulances.forEach(ambulance => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = ambulance.id;
        row.insertCell().textContent = ambulance.username;
        row.insertCell().textContent = ambulance.license_number;
        const actionsCell = row.insertCell();
        actionsCell.innerHTML = `
            <button onclick="editAmbulance(${ambulance.id})">Edit</button>
            <button onclick="deleteAmbulance(${ambulance.id})">Delete</button>
        `;
    });
}

function updateHospitalTable(hospitals) {
    const tableBody = document.getElementById('hospital-table').querySelector('tbody');
    tableBody.innerHTML = '';
    hospitals.forEach(hospital => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = hospital.id;
        row.insertCell().textContent = hospital.username;
        row.insertCell().textContent = hospital.hospital_name;
        const actionsCell = row.insertCell();
        actionsCell.innerHTML = `
            <button onclick="editHospital(${hospital.id})">Edit</button>
            <button onclick="deleteHospital(${hospital.id})">Delete</button>
        `;
    });
}


function openModal(modalType) {
    document.getElementById(`${modalType}Modal`).style.display = "block";
}

function closeModal(modalType) {
    document.getElementById(`${modalType}Modal`).style.display = "none";
}

function editAmbulance(id) {
    alert(`Edit ambulance with ID: ${id}`);
}

async function deleteAmbulance(id) {
    if (confirm('Are you sure you want to delete this ambulance?')) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${BASE_URL}/ambulances/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                fetchAmbulances();
            } else {
                alert('Failed to delete ambulance');
            }
        } catch (error) {
            console.error('Error deleting ambulance:', error);
            alert('Failed to delete ambulance. Check the console for more details.');
        }
    }
}

function editHospital(id) {
    alert(`Edit hospital with ID: ${id}`);
}

async function deleteHospital(id) {
    if (confirm('Are you sure you want to delete this hospital?')) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${BASE_URL}/hospitals/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                fetchHospitals();
            } else {
                alert('Failed to delete hospital');
            }
        } catch (error) {
            console.error('Error deleting hospital:', error);
            alert('Failed to delete hospital. Check the console for more details.');
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
}
