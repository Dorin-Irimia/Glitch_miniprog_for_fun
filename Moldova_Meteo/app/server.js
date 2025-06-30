const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

app.use(express.static('.'));

app.get('/forecast', async (req, res) => {
  const { lat, lon, days } = req.query;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_min,temperature_2m_max,precipitation_probability_max,weathercode,windspeed_10m_max&current_weather=true&timezone=auto&forecast_days=${days}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Nu s-au putut obține date meteo' });
  }
});

app.listen(PORT, () => console.log(`Serverul rulează la http://localhost:${PORT}`));


