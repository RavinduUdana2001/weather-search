import express from "express";
import axios from "axios";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'; // Importing `dirname` and `join` from `path` module

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Replace with your previous API key
const apiKey = "ad8c692f519d33b2e1ce98df7642952f";

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views')); // Using `join` from `path` to set correct views directory

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/weather", async (req, res) => {
    const location = req.query.location;
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    try {
        const result = await axios.get(url);
        const weatherData = result.data;
        const tomorrowWeather = weatherData.list[8];
        const weatherDes = tomorrowWeather.weather[0].description;
        const temp = tomorrowWeather.main.temp;
        const willrain = weatherDes.includes('rain');

        res.render("index.ejs", {
            location,
            weather: `Tomorrow's weather: ${weatherDes}, Temperature: ${temp}°C. Will it rain? ${willrain ? 'Yes' : 'No'}.`
        });

    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Error fetching weather data.');
    }
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
