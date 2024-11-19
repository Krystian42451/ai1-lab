const API_KEY = '7ded80d91f2b280ec979100cc8bbba94';
const BASE_URL_CURRENT = 'https://api.openweathermap.org/data/2.5/weather';
const BASE_URL_FORECAST = 'https://api.openweathermap.org/data/2.5/forecast';

document.getElementById('getWeather').addEventListener('click', () => {
    const city = document.getElementById('city').value.trim();
    if (!city) {
        alert('Proszę wpisać nazwę miasta.');
        return;
    }
    fetchCurrentWeather(city);
    fetchForecast(city);
});

// Pobierz bieżącą pogodę za pomocą XMLHttpRequest
function fetchCurrentWeather(city) {
    const xhr = new XMLHttpRequest();
    const url = `${BASE_URL_CURRENT}?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

    console.log(`Wysyłanie żądania do Current Weather API: ${url}`);

    xhr.open('GET', url, true); // Ustawienie metody i adresu URL
    xhr.onload = function () { // Obsługa odpowiedzi
        if (xhr.status === 200) { // Sprawdzenie kodu statusu
            console.log('Otrzymano odpowiedź z Current Weather API:');
            console.log(xhr.responseText); // Wyświetlenie odpowiedzi w konsoli

            const data = JSON.parse(xhr.responseText); // Parsowanie JSON
            displayCurrentWeather(data); // Wyświetlenie danych
        } else {
            console.error(`Błąd podczas pobierania bieżącej pogody: Kod statusu ${xhr.status}`);
            alert('Nie udało się pobrać bieżącej pogody. Sprawdź nazwę miasta.');
        }
    };
    xhr.onerror = function () {
        console.error('Wystąpił błąd podczas komunikacji z Current Weather API.');
    };
    xhr.send(); // Wysłanie żądania
    console.log('Żądanie zostało wysłane.');
}


// Pobierz prognozę na 5 dni za pomocą Fetch API
function fetchForecast(city) {
    const url = `${BASE_URL_FORECAST}?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

    console.log(`Wysyłanie żądania do Forecast API: ${url}`); // Log wysyłanego URL

    fetch(url)
        .then(response => {
            console.log('Otrzymano odpowiedź z Forecast API:', response); // Log pełnej odpowiedzi HTTP

            if (!response.ok) {
                console.error(`Błąd podczas pobierania prognozy pogody: Kod statusu ${response.status}`); // Log błędu
                throw new Error('Nie udało się pobrać prognozy pogody.');
            }
            return response.json(); // Parsowanie odpowiedzi jako JSON
        })
        .then(data => {
            console.log('Dane prognozy pogodowej (parsowane):', data); // Log sparsowanych danych JSON
            displayForecast(data); // Wyświetlenie danych
        })
        .catch(error => {
            console.error('Wystąpił błąd podczas przetwarzania prognozy pogody:', error); // Log błędów
            alert(error.message);
        });

    console.log('Żądanie zostało wysłane.'); // Log potwierdzający wysłanie żądania
}


// Wyświetl bieżącą pogodę
function displayCurrentWeather(data) {
    const container = document.getElementById('currentWeather');
    container.innerHTML = `
        <p><strong>Miasto:</strong> ${data.name}</p>
        <p><strong>Temperatura:</strong> ${data.main.temp}°C</p>
        <p><strong>Warunki:</strong> ${data.weather[0].description}</p>
    `;
}

// Wyświetl prognozę na 5 dni (po jednej na dzień, zaczynając od jutra)
function displayForecast(data) {
    const container = document.getElementById('forecast');
    container.innerHTML = '';

    const forecastList = data.list;
    const dailyForecast = {};

    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toISOString().split('T')[0]; // Pobierz datę w formacie YYYY-MM-DD

        if (!dailyForecast[day]) {
            dailyForecast[day] = item; // Zapisz pierwszy wynik dla tego dnia
        }
    });

    const days = Object.keys(dailyForecast);
    const today = new Date().toISOString().split('T')[0]; // Dzisiejsza data
    let displayedDays = 0;

    // Wyświetl maksymalnie 5 dni, zaczynając od jutra
    for (let i = 0; i < days.length; i++) {
        if (days[i] > today && displayedDays < 5) {
            const forecast = dailyForecast[days[i]];
            const forecastDate = new Date(forecast.dt * 1000);

            container.innerHTML += `
                <div>
                    <p><strong>Data:</strong> ${forecastDate.toLocaleDateString('pl-PL')}</p>
                    <p><strong>Temperatura:</strong> ${forecast.main.temp}°C</p>
                    <p><strong>Warunki:</strong> ${forecast.weather[0].description}</p>
                </div>
                <hr>
            `;
            displayedDays++;
        }
    }
}
