const doc = document;
const weatherWrap = doc.getElementById('weatherWrap');
const searchInput = doc.getElementById('searchInput');
const applocation = doc.getElementById('applocation');
const date = doc.getElementById('date');
const temp = doc.getElementById('temp');
const weather = doc.getElementById('weather');

const weatherApp = {
    proxy: "https://cors-anywhere.herokuapp.com/",
    api_key: "5eb5e1eed1a24e1d7a2f34e9e87fbb98",
    query: {},
    url_base() {
        return `https://api.openweathermap.org/data/2.5/weather?q=${this.query}&appid=${this.api_key}`
    },
    putData() {

    }
}

searchInput.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
        weatherWrap.classList.remove('active');

        weatherApp.query = this.value;
        async function getResponse() {
            let data = await fetch(weatherApp.url_base());

            if (!data.ok) {
                throw new Error(`Could not fetch ${url}, received ${data.status}`)
            }

            let content = await data.json();
            return content;
        }
        getResponse()
            .then(data => {
                let res = data;
                console.log(res);

                let city = `${res.name}`
                let icon = `${res.weather[0].icon}`
                let description = `${res.weather[0].description}`;
                let humidity = `${res.weather[0].humidity}`;
                let temperature = `${parseInt(res.main.temp - 273.15)}`;
                let wind = `${res.wind.speed}`;

                temp.style.display = 'inline-block';
                weather.style.display = 'block';

                weatherWrap.classList.add('active');

                applocation.innerHTML = city;
                temp.innerHTML = temperature;
                weather.innerHTML = description;
            })
            .catch(err => { 
                temp.style.display = 'none';
                weather.style.display = 'none';

                weatherWrap.classList.add('active');
                applocation.innerHTML = 'Unknown city. Try input another city';
                console.log('Could not fetch: ' + err)
             })
    }
})

