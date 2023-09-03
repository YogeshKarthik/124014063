
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000; // You can choose any available port

app.use(express.json());

// Replace these with your actual credentials
const CLIENT_ID = 'b46118f0-fbde-4b16-a461-6ae-6ad718b27';
const CLIENT_SECRET = 'XOyoloORPasKWOdAN';
const ACCESS_TOKEN = 'XGgVsc';

// Middleware to add authorization header
app.use((req, res, next) => {
    req.headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
    next();
});

// GET /trains route
app.get('/trains', async (req, res) => {
    try {
        // Make a request to John Doe Railway's API to get train details
        const response = await axios.get('http://20.244.56.144/train/trains');
        const trains = response.data;

        // Filter and sort the trains as per your requirements
        const filteredTrains = trains
            .filter((train) => train.delayedBy > 30) // Filter out trains departing in the next 30 minutes
            .sort((a, b) => {
                // Sort based on price, tickets, and departure time
                const priceA = a.price.sleeper + a.price.AC;
                const priceB = b.price.sleeper + b.price.AC;
                if (priceA !== priceB) return priceA - priceB;
                const ticketsA = a.seatsAvailable.sleeper + a.seatsAvailable.AC;
                const ticketsB = b.seatsAvailable.sleeper + b.seatsAvailable.AC;
                if (ticketsA !== ticketsB) return ticketsB - ticketsA;
                const departureTimeA = a.departureTime.Hours * 60 + a.departureTime.Minutes + a.delayedBy;
                const departureTimeB = b.departureTime.Hours * 60 + b.departureTime.Minutes + b.delayedBy;
                return departureTimeA - departureTimeB;
            });

        res.json(filteredTrains);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
