document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dataForm');
    const showDataBtn = document.getElementById('showDataBtn');
    const dataDisplay = document.getElementById('dataDisplay');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        age: formData.get('age'),
        email: formData.get('email')
      };
  
      try {
        const response = await fetch('http://localhost:3000/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
  
        if (!response.ok) {
          throw new Error('Failed to insert data');
        }
  
        const newData = await response.json();
        form.reset();
        alert('Data successfully submitted!');
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit data. Please try again.');
      }
    });
  
    showDataBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('http://localhost:3000/data');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
  
        const data = await response.json();
        dataDisplay.innerHTML = ''; // Clear existing data
        data.data.forEach(item => appendDataToDisplay(item));
        dataDisplay.style.display = 'block'; // Show the data display area
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch data. Please try again.');
      }
    });
  
    function appendDataToDisplay(data) {
      const newItem = document.createElement('div');
      newItem.classList.add('data-item');
      newItem.innerHTML = `
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Age:</strong> ${data.age}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <hr>
      `;
      dataDisplay.appendChild(newItem);
    }
  });
