// main.js
require('dotenv').config();

async function fetchData() {
  try {
    const response = await fetch(process.env.MICROSERVICE_API_ENDPOINT);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    const resultElement = document.getElementById('result');
    resultElement.innerHTML = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

