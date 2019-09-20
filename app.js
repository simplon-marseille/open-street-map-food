//https://opentable.herokuapp.com/api/restaurants?city=chicago
//https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=AIzaSyCdcrwCTRbeNmrQP_5m6uApSo5jiWe-MP8
//==> https://developers-dot-devsite-v2-prod.appspot.com/maps/documentation/javascript/examples/map-simple?hl=fr

//----Openstreetmap-----------
//Je récupère les coordonnées GPS (lat, lon) d'une ville
//https://nominatim.openstreetmap.org/search?q=paris&format=json
//==> http://guillaume-rouan.net/blog/2016/08/17/integrez-une-carte-openstreetmap-a-votre-site-web/
//==>https://www.mapbox.com/




//-------------Affichage de la map Openstreetmap
var mymap = L.map('my_osm_widget_map', { /* use the same name as your <div id=""> */
  center: [51.505, -0.09], /* set GPS Coordinates */
  zoom: 17, /* define the zoom level */
  zoomControl: false, /* false = no zoom control buttons displayed */
  scrollWheelZoom: false /* false = scrolling zoom on the map is locked */
});

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWNhcmRuaWNvbGFzOTEiLCJhIjoiY2swcnl3Ymt4MDFpMTNkcDVrdzRvMmQ5MyJ9.Jmw2gfO6CTF4yjmOkGm49w', { /* set your personal MapBox Access Token */
  maxZoom: 20, /* zoom limit of the map */
  attribution: 'Données &copy; Contributeurs <a href="http://openstreetmap.org">OpenStreetMap</a> + ' +
    '<a href="http://mapbox.com">Mapbox</a> | ' +
    '<a href="https://creativecommons.org/licenses/by/2.0/">CC-BY</a> ' +
    'Guillaume Rouan 2016', /* set the map's caption */
    id: 'mapbox.streets' /* mapbox.light / dark / streets / outdoors / satellite */
}).addTo(mymap);

L.marker([51.505, -0.09]).addTo(mymap); /* set your location's GPS Coordinates : [LAT,LON] */

// --------------------------API OpenTable------------------------

const callToAction = document.querySelector('#send');
const listOfRestaurant = document.querySelector('#list');
//https://opentable.herokuapp.com/api/restaurants?city=chicago
const gps = document.querySelector('#gps');
callToAction.addEventListener(('click'), (event) => {
    event.preventDefault();
    const userInput = document.querySelector('#userInput');
    const URLCity = `https://nominatim.openstreetmap.org/search?q=${userInput.value}&format=json`;
    fetch(URLCity)
    .then(responseFromServer => responseFromServer.json())
    .then((dataJson) => {
        console.log(dataJson[0].lat);
        console.log(dataJson[0].lon);
        gps.insertAdjacentHTML('beforeend', `<div id="mapcoords" data-lat="${dataJson[0].lat}" data-lng="${dataJson[0].lon}"></div>`)
        
    });

    const URL = `https://opentable.herokuapp.com/api/restaurants?city=${userInput.value}`;
    fetch(URL)
    .then(response => response.json())
    .then((data) => {
        console.log(data.restaurants);
        data.restaurants.forEach(element => {
            console.log(element.name);
            listOfRestaurant.insertAdjacentHTML('beforeend', `
                <li>
                <a href="${element.reserve_url}" style="text-decoration: none;">
                <div class="card shadow mb-3" style="max-width: 540px;">
                <div class="row no-gutters">
                    <div class="col-md-4">
                    <img src="${element.image_url}" class="card-img" alt="...">
                    </div>
                    <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${element.name}</h5>
                        <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                    </div>
                    </div>
                </div>
                </div>
                </a>
                </li>
            `)
        });
    })
    .catch((error) => {
        console.log(error.message);
    })

});