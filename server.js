require("lunar-interceptor");
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Function to get a random item from an array
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

app.get('/get-info', async (req, res) => {
    let dadJokeResponse = '';
    let httpbinResponseMessage = '';
    let pokemonResponseMessage = '';

    try {
        // Fetching the dad joke
        const jokeResponse = await axios.get('https://icanhazdadjoke.com/', {
            headers: { 'Accept': 'application/json' }
        });
        dadJokeResponse = `Dad Joke: ${jokeResponse.data.joke}`;
    } catch (error) {
        dadJokeResponse = "Failed to fetch dad joke.";
    }

    try {
        // Randomly selecting a status code and HTTP method
        const statusCodes = [200, 300, 400, 500];
        const methods = ['delete', 'get', 'put', 'post'];
        const randomStatusCode = getRandomItem(statusCodes);
        const randomMethod = getRandomItem(methods);

        // Making a request to httpbin.org with validation disabled for status codes
        await axios.request({
            method: randomMethod,
            url: `https://httpbin.org/status/${randomStatusCode}`,
            validateStatus: () => true // Do not throw error for status codes outside 2xx
        });

        httpbinResponseMessage = `A ${randomMethod.toUpperCase()} request was made to httpbin and the status code response was: ${randomStatusCode}`;
    } catch (error) {
        httpbinResponseMessage = "Failed to interact with httpbin.";
    }

    try {
        // Fetching a random Pokemon
        const randomPokemonNumber = Math.floor(Math.random() * 151) + 1;
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemonNumber}`);
        const pokemonName = pokemonResponse.data.name;
        const pokemonNumber = pokemonResponse.data.id;

        pokemonResponseMessage = `A random pokemon from the original 151 is ${pokemonName} and its number is ${pokemonNumber}`;
    } catch (error) {
        pokemonResponseMessage = "Failed to fetch a random pokemon.";
    }

    // Sending the combined response
    res.send([dadJokeResponse, httpbinResponseMessage, pokemonResponseMessage].join('<br>'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
