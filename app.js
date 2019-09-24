//https://opentable.herokuapp.com/api/restaurants?city=chicago
//https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=AIzaSyCdcrwCTRbeNmrQP_5m6uApSo5jiWe-MP8
//==> https://developers-dot-devsite-v2-prod.appspot.com/maps/documentation/javascript/examples/map-simple?hl=fr

//----Openstreetmap-----------
//Je récupère les coordonnées GPS (lat, lon) d'une ville
//https://nominatim.openstreetmap.org/search?q=paris&format=json
//==> http://guillaume-rouan.net/blog/2016/08/17/integrez-une-carte-openstreetmap-a-votre-site-web/
//==>https://www.mapbox.com/



// --------------------------API OpenTable------------------------

const getCityAndRestaurant = (city) => {
  //Requête vers l'API Openstreetmap
  const URLCity = `https://nominatim.openstreetmap.org/search?q=${city}&format=json`;
    fetch(URLCity)
    .then(responseFromServer => responseFromServer.json())
    .then((dataJson) => {
        //-------------Affichage de la map Openstreetmap----------------
        document.querySelector('#map').innerHTML = '<div id="my_osm_widget_map"></div>';
        var mymap = L.map('my_osm_widget_map', { /* use the same name as your <div id=""> */
        center: [dataJson[0].lat, dataJson[0].lon], /* set GPS Coordinates */
        zoom: 13, /* define the zoom level */
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

        L.marker([dataJson[0].lat, dataJson[0].lon]).addTo(mymap); /* set your location's GPS Coordinates : [LAT,LON] */
    });
    //----------------------------------------------------------------




    //Requête vers l'API Opentable
    const URL = `https://opentable.herokuapp.com/api/restaurants?city=${city}`;
    fetch(URL)
    .then(response => response.json())
    .then((data) => {
      document.querySelector('.nb-resultat').innerHTML = '';
      document.querySelector('.nb-resultat').insertAdjacentHTML('beforeend', `<strong>${data.total_entries} restaurants</strong>`)
        listOfRestaurant.innerHTML = '';
        console.log(data.restaurants);
        data.restaurants.forEach(element => {
            console.log(element.name);
            listOfRestaurant.insertAdjacentHTML('beforeend', `
                <li>
                  <a href="${element.reserve_url}" style="text-decoration: none;">
                    <div class="card shadow mb-3">
                      <div class="row no-gutters">
                        <div class="col-md-4">
                          <img src="${element.image_url}" class="card-img" alt="...">
                          </div>
                          <div class="col-md-8">
                          <div class="card-body">
                            <h5 class="card-title">${element.name}</h5>
                            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                           <i class="far fa-heart"></i>
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
};



const callToAction = document.querySelector('#send');
const listOfRestaurant = document.querySelector('#list');
const gps = document.querySelector('#gps');

callToAction.addEventListener(('click'), (event) => {
    event.preventDefault();
    const userInput = document.querySelector('#userInput');
    if(userInput.value.length != 0){
      getCityAndRestaurant(userInput.value);
    }else{
      userInput.classList.add('is-invalid');
      userInput.value = 'Veuillez entrer une ville';
    }
    //--------------Appel de la fonction qui envoie des requêtes API et qui affichent les resultats----------

});

getCityAndRestaurant('chicago');
