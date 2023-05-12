/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready



document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}


var map = L.map('map').setView([44, 2], 14);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var options = {
    enableHighAccuracy: true,
    maximumAge: 3600000
}
//var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

function onSuccess(position) {

    map.setView([position.coords.latitude, position.coords.longitude ], 14);

};

function onError(error) {
    alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
}
let apiKey = "3265e6694d3fc0f59b2ac9fff276f76bb1e84699";

let markers = [];

afficherMarkers('lyon');

afficherButton();

function afficherButton()
{
    const request = new Request(`https://api.jcdecaux.com/vls/v3/contracts?apiKey=${apiKey}`);

    fetch(request)
    .then((response) => response.json())
    .then((json)=>
    {
        json.sort((a, b) => a.name.localeCompare(b.name));
        let div = document.getElementById('selectButton');
        json.forEach((element) =>
        {
            let button = document.createElement('button');
            button.innerHTML = element.name;
            button.classList.add('map-button');
            button.classList.add('w3-button');
            button.classList.add('w3-round-xlarge');
            button.classList.add('w3-large');
            button.classList.add('w3-white');
            button.classList.add('w3-border');
            button.classList.add('w3-border-blue');
            button.classList.add('w3-hover-blue');
            button.addEventListener('click', (e)=>
            {
                e.preventDefault();
                afficherMarkers(element.name)
            });

            div.appendChild(button);
        })

    })
}
 
function afficherMarkers(name)
{

    if(markers.length > 0)
    {
        markers.forEach((e)=>
        {
            map.removeLayer(e);
        })
        markers=[];
    }
    const request = new Request(`https://api.jcdecaux.com/vls/v3/stations?contract=${name}&apiKey=${apiKey}`);
    fetch(request)
    .then((response) => response.json())
    .then((json)=>
    {
       json.forEach((element) =>
       {
        let markup = L.marker([element.position.latitude, element.position.longitude]).addTo(map);
        markup.bindPopup(`<b>${element.name}</b><br>Adresse : ${element.address}<br>Status : ${element.status}<br>Nombre de place totales : ${element.mainStands.capacity}<br>Places vides : ${element.mainStands.capacity - element.mainStands.availabilities.bikes}<br>Vélos disponible : ${element.mainStands.capacity - element.mainStands.availabilities.stands}`);
        markers.push(markup);
       })

       deplacerCarte(markers);
    })
}


function deplacerCarte(liste)
{
    if(liste.length>0)
    {

        let latitude=0;
        let longitude =0;

        liste.forEach((e)=>
        {
            latitude += e._latlng.lat;
            longitude += e._latlng.lng;
        })

        latitude /= liste.length;

        longitude /= liste.length;

        map.setView([latitude,longitude],14);

    }

}



// api jcdecaux for developpers
// leaflet

// ionic- capacitor