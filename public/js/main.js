const userForm = document.getElementById('user-form');
const exerciseForm = document.getElementById('exercise-form');
const logContainer = document.getElementById('log');

userForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = userForm.elements.username.value;
  if (!username) {
    alert('Please enter a username');
    return;
  }
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });
  const data = await res.json();
  console.log(data);
  userForm.elements.username.value = '';
});

exerciseForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = exerciseForm.elements._id.value;
  const description = exerciseForm.elements.description.value;
  const duration = exerciseForm.elements.duration.value;
  const date = exerciseForm.elements.date.value;
  if (!userId || !description || !duration) {
    alert('Please fill out all required fields');
    return;
  }
  const res = await fetch(`/api/users/${userId}/exercises`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description, duration, date }),
  });
  const data = await res.json();
  console.log(data);
  exerciseForm.elements._id.value = '';
  exerciseForm.elements.description.value = '';
  exerciseForm.elements.duration.value = '';
  exerciseForm.elements.date.value = '';
});

async function getLogs() {
  const userId = prompt('Enter user ID');
  if (!userId) return;
  let url = `/api/users/${userId}/logs`;
  const from = prompt('From? (yyyy-mm-dd)');
  const to = prompt('To? (yyyy-mm-dd)');
  const limit = prompt('Limit?');
  const params = new URLSearchParams();
  if (from) params.append('from', from);
  if (to) params.append('to', to);
  if (limit) params.append('limit', limit);
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  const res = await fetch(url);
  const data = await res.json();
  logContainer.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

document.getElementById('log-container').addEventListener('click', getLogs);
