const weatherIcons = { 0: "☀️",1: "🌤️",2: "⛅",3: "☁️",45: "🌫️",48: "🌫️❄️",51: "🌦️",53: "🌧️",
                      55: "🌧️",56: "🌧️❄️",57: "🌧️❄️",61: "🌦️",63: "🌧️",65: "🌧️💧",66: "🌧️❄️",
                      67: "🌧️❄️",71: "🌨️",73: "🌨️",75: "❄️🌨️",77: "🌨️",80: "🌦️",81: "🌧️",82: "⛈️",
                      85: "🌨️",86: "❄️🌨️",95: "🌩️",96: "⛈️🌨️",99: "⛈️❄️"
                    };


// Orașe cu coordonate
const cities = {
  "Chișinău": { lat: 47.0105, lon: 28.8638 },
  "Bălți": { lat: 47.7571, lon: 27.9188 },
  "Tiraspol": { lat: 46.8427, lon: 29.6225 },
  "Bender": { lat: 46.8303, lon: 29.4763 },  // Tighina
  "Rîbnița": { lat: 47.7856, lon: 29.0044 },
  "Soroca": { lat: 48.1590, lon: 28.2911 },
  "Cahul": { lat: 45.9044, lon: 28.1919 },
  "Ungheni": { lat: 47.1994, lon: 27.7961 },
  "Căușeni": { lat: 46.7453, lon: 29.4370 },
  "Orhei": { lat: 47.3639, lon: 28.8250 },
  "Strășeni": { lat: 47.2624, lon: 28.6882 },
  "Edineț": { lat: 48.1736, lon: 27.3103 },
  "Glodeni": { lat: 47.8070, lon: 27.5120 },
  "Hîncești": { lat: 46.8656, lon: 28.5311 },
  "Cimișlia": { lat: 46.4762, lon: 29.0543 },
  "Șoldănești": { lat: 48.0220, lon: 28.3196 },
  "Florești": { lat: 47.9570, lon: 28.2920 },
  "Rezina": { lat: 47.6841, lon: 28.8534 },
  "Basarabeasca": { lat: 46.3301, lon: 28.1558 },
  "Briceni": { lat: 48.3745, lon: 27.0813 },
  "Taraclia": { lat: 45.8540, lon: 28.6719 },
  "Ștefan Vodă": { lat: 46.5157, lon: 29.2587 },
  "Călărași": { lat: 46.2803, lon: 28.3576 },
  "Anenii Noi": { lat: 46.9581, lon: 29.0339 },
  "Leova": { lat: 46.4893, lon: 28.1561 },
  "Dubăsari": { lat: 47.4495, lon: 29.1591 },
  "Sângerei": { lat: 47.4910, lon: 28.0892 }
};


// Elemente DOM
const weatherInfo = document.getElementById('weather-info');
const cityName = document.getElementById('city-name');
const weatherDetails = document.getElementById('weather-details');
const tabs = document.querySelectorAll('.tabs button');

// Oraș selectat curent
let selectedCity = null;

// Încarcă vremea curentă pentru butoanele din hartă
window.addEventListener('DOMContentLoaded', async () => {
  for (const city in cities) {
    const { lat, lon } = cities[city];
    try {
      const data = await fetchWeather(lat, lon, 1);
      const temp = data.daily.temperature_2m_max[0];
      const code = data.daily.weathercode[0];
      const icon = weatherIcons[code] || "❓";

      // Caută butonul cu numele orașului în SVG și actualizează conținutul
      const divs = document.querySelectorAll('.city-button');
      divs.forEach(div => {
        if (div.textContent.includes(city)) {
          div.innerHTML = `${icon} ${temp}°C<br/>${city}`;
        }
      });
    } catch (err) {
      console.error(`Eroare la orașul ${city}:`, err);
    }
  }
});

// Butoane tab-uri zile
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if (!selectedCity) return;
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const days = tab.getAttribute('data-days');
    loadWeather(selectedCity, days);
  });
});

// Funcție pentru a afișa vremea când utilizatorul dă click pe un oraș
window.showWeather = function(city) {
  if (!cities[city]) return;

  selectedCity = city;
  cityName.innerText = `📍 ${city}`;
  weatherDetails.classList.remove('hidden');
  tabs.forEach(t => t.classList.remove('active'));
  tabs[0].classList.add('active');
  loadWeather(city, 3);
};

// Preia datele meteo de la Open-Meteo
async function fetchWeather(lat, lon, days) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max,windspeed_10m_max&timezone=Europe/Bucharest&forecast_days=${days}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Eroare API");
  return await res.json();
}

// Încarcă și afișează detaliile vremii în tabel
async function loadWeather(cityNameStr, days) {
  const { lat, lon } = cities[cityNameStr];
  weatherInfo.innerHTML = "Se încarcă...";
  try {
    const data = await fetchWeather(lat, lon, days);
    let html = `
      <table>
        <tr><th>Zi</th><th>Cod</th><th>Min</th><th>Max</th><th>Ploaie</th><th>Vânt</th></tr>
    `;
    for (let i = 0; i < data.daily.time.length; i++) {
      const icon = weatherIcons[data.daily.weathercode[i]] || "❓";
      html += `<tr>
        <td>${new Date(data.daily.time[i]).toLocaleDateString('ro-RO', { weekday: 'short' })}</td>
        <td>${icon}</td>
        <td>${data.daily.temperature_2m_min[i]}°C</td>
        <td>${data.daily.temperature_2m_max[i]}°C</td>
        <td>${data.daily.precipitation_probability_max[i]}%</td>
        <td>${data.daily.windspeed_10m_max[i]} km/h</td>
      </tr>`;
    }
    html += '</table>';
    weatherInfo.innerHTML = html;
  } catch (err) {
    weatherInfo.innerHTML = "Eroare la încărcarea datelor.";
    console.error(err);
  }
}

// Actualizare ceas
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  document.getElementById('time').textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock(); // apel inițial

async function displayExchangeRateMDL() {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/EUR');
    if (!response.ok) throw new Error("Eroare la preluarea datelor");
    const data = await response.json();
    const rate = data.rates.MDL;
    document.getElementById('eur-mdl').textContent = `${rate.toFixed(4)} MDL`;
  } catch (error) {
    console.error('Eroare la preluarea cursului valutar MDL:', error);
    document.getElementById('eur-mdl').textContent = 'Eroare la încărcare';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  displayExchangeRateMDL();
});

function showWeather(city) {
      document.getElementById('city-name').innerText = city;
      document.getElementById('weather-details').classList.remove('hidden');
  

    }

  function getCityFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('city');
  }

  window.addEventListener('DOMContentLoaded', () => {
  const city = getCityFromURL();
  if (city) {
    showWeather(city);
  }
});


document.addEventListener("DOMContentLoaded", function() {
  showWeather('Chișinău');
});
