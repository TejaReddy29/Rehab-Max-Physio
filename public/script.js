// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('show');
});

// Smooth scroll for nav links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navMenu.classList.remove('show');
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Populate time select with 9am to 6pm in 30 min intervals
const timeSelect = document.getElementById('time');
function populateTimeOptions() {
  const startHour = 9;
  const endHour = 18;
  for (let hour = startHour; hour <= endHour; hour++) {
    ['00', '30'].forEach(min => {
      if (hour === endHour && min === '30') return; // no 6:30pm
      const hour12 = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const timeStr = `${hour.toString().padStart(2,'0')}:${min}`;
      const displayStr = `${hour12}:${min} ${ampm}`;
      const option = document.createElement('option');
      option.value = timeStr;
      option.textContent = displayStr;
      timeSelect.appendChild(option);
    });
  }
}
populateTimeOptions();

// Validate date input to allow only Mon-Sat
const dateInput = document.getElementById('date');
dateInput.addEventListener('input', () => {
  const date = new Date(dateInput.value);
  if (date.getDay() === 0) { // Sunday
    dateInput.setCustomValidity('Please select a date from Monday to Saturday.');
  } else {
    dateInput.setCustomValidity('');
  }
});

// Form submission
const form = document.getElementById('appointment-form');
const formMessage = document.getElementById('form-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formMessage.textContent = '';
  
  // Basic validation
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  // Additional date validation (Mon-Sat)
  const selectedDate = new Date(dateInput.value);
  if (selectedDate.getDay() === 0) {
    formMessage.style.color = 'red';
    formMessage.textContent = 'Please select a date from Monday to Saturday.';
    return;
  }
  
  // Prepare data
  const data = {
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    place: form.place.value.trim(),
    date: form.date.value,
    time: form.time.value,
    mobile: form.mobile.value.trim()
  };
  
  try {
    const response = await fetch('/api/book-appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (response.ok) {
      formMessage.style.color = 'green';
      formMessage.textContent = `Appointment booked successfully! Your unique code is ${result.uniqueCode}.`;
      form.reset();
    } else {
      formMessage.style.color = 'red';
      formMessage.textContent = result.error || 'Failed to book appointment.';
    }
  } catch (error) {
    formMessage.style.color = 'red';
    formMessage.textContent = 'Error submitting form. Please try again later.';
  }
});