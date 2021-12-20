/*
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
import "./style.css";
const axios = require('axios');



// @ts-nocheck TODO(jpoehnelt) remove when fixed

let map: google.maps.Map;
let marker: google.maps.Marker;
let geocoder: google.maps.Geocoder;
let responseDiv: HTMLDivElement;
let response: HTMLPreElement;

response = document.createElement("pre");
response.id = "response";
response.innerText = "";



function initMap(): void {
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    zoom: 16,
    center:  { lat:  -33.45542141014204, lng: -70.5935302864372  },
    mapTypeControl: false,
  });
  geocoder = new google.maps.Geocoder();
  const texto_shell='Bienvenidos a bici Ruta, aqui aparecan los tiempos de cada ruta';
  console.dir(texto_shell);


  const inputText = document.createElement("input");

  inputText.type = "text";
  inputText.placeholder = "Ingrese dirección";

  const submitButton = document.createElement("input");

  submitButton.type = "button";
  submitButton.value = "Buscar";
  submitButton.classList.add("button", "button-primary");

  const clearButton = document.createElement("input");

  clearButton.type = "button";
  clearButton.value = "Clear";
  clearButton.classList.add("button", "button-secondary");

  //response = document.createElement("pre");
  //response.id = "response";
  //response.innerText = "";

  responseDiv = document.createElement("div");
  responseDiv.id = "response-container";
  responseDiv.appendChild(response);

  const instructionsElement = document.createElement("p");

  instructionsElement.id = "instructions";

  instructionsElement.innerHTML =
    "<strong>Bici Ruta</strong>: Rutas para moverse seguro en bicileta <p style='font-size:12px;'> *Prototipo te hace partir desde plaza ñuñoa </p> <p style='font-size:10px;'> **click derecho -> inspeccionar -> consola para ver tiempos de ruta </p>";

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(clearButton);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(instructionsElement);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(responseDiv);

  //console.log('vamos la u que no bajo a 2da !!');

  marker = new google.maps.Marker({
    map,
  });

  map.addListener("click", (e: google.maps.MapMouseEvent) => {
    geocode({ location: e.latLng });
  });

  submitButton.addEventListener("click", () =>
    geocode({ address: inputText.value })
    
  );

  clearButton.addEventListener("click", () => {
    clear();
  });

  clear();

  
    
  }




function clear() {
  marker.setMap(null);
  responseDiv.style.display = "none";
}





function geocode(request: google.maps.GeocoderRequest): void {
  clear();

  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;

      map.setCenter(results[0].geometry.location);
      marker.setPosition(results[0].geometry.location);
      marker.setMap(map);
      responseDiv.style.display = "block";

    
      
      
      //response.innerText = JSON.stringify(results[0].geometry.location.lat(), null, 2);
        
      //console.log('results[0]')
      //console.log(response.innerText);


    //const destination_lat = '-33.46228821216377'
    //const destination_long= '-70.60614238142935'

    const destination_lat = JSON.stringify(results[0].geometry.location.lat, null, 2);
    const destination_long= JSON.stringify(results[0].geometry.location["lat"], null, 2);
    //console.log('destination_log')
    //console.log(destination_long)

    //await new Promise(resolve => setTimeout(resolve, 5000));

    const url= 'https://api.tomtom.com/routing/1/calculateRoute/-33.45542141014204%2C-70.5935302864372%3A'+ JSON.stringify(results[0].geometry.location.lat(), null, 2)+'%2C'+JSON.stringify(results[0].geometry.location.lng(), null, 2)+'/json?maxAlternatives=5&routeRepresentation=polyline&computeTravelTimeFor=all&travelMode=bicycle&vehicleCommercial=false&key=abJCAnLkNLY5PtA5TbKV0J6Ds6X8Ut5H'
    //console.log(url)
    
    // Make a request for a user with a given ID
    axios.get(url)
        .then(function (response) {
        // handle success
        //console.log(response);
        //console.log(typeof response);
        //return response

        //console.log(response)
        let  route = response.data.routes[1]['legs'][0]['points']
        //console.log('route')
        //console.log(route);

        var flightPlanCoordinates = [] as any;

        for (let i = 0; i < route.length; i++) {
            
          flightPlanCoordinates.push({"lat":route[i]['latitude'],"lng":route[i]['longitude']})
        }

        let  route2 = response.data.routes[2]['legs'][0]['points']

        var flightPlanCoordinates2 = [] as any;

        for (let i = 0; i < route2.length; i++) {
        
          flightPlanCoordinates2.push({"lat":route2[i]['latitude'],"lng":route2[i]['longitude']})
        }

        let  route3 = response.data.routes[3]['legs'][0]['points']

        var flightPlanCoordinates3 = [] as any;

        for (let i = 0; i < route3.length; i++) {
        
          flightPlanCoordinates3.push({"lat":route3[i]['latitude'],"lng":route3[i]['longitude']})
        }

        
        

    
      
      const flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: "#B91646",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });


      const flightPath2 = new google.maps.Polyline({
        path: flightPlanCoordinates2,
        geodesic: true,
        strokeColor: "#4E8397",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });


      const flightPath3 = new google.maps.Polyline({
        path: flightPlanCoordinates3,
        geodesic: true,
        strokeColor: "#845EC2",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      
      
      flightPath.setMap(map);
      flightPath2.setMap(map);
      flightPath3.setMap(map);

      //response.innerText = "sdfgsg";
   
      console.log('tiempo ruta roja:'+response.data.routes[1].summary.travelTimeInSeconds.toString()+' s')
      console.log('tiempo ruta verde:'+response.data.routes[2].summary.travelTimeInSeconds.toString()+' s')
      console.log('tiempo ruta morada:'+response.data.routes[3].summary.travelTimeInSeconds.toString()+' s')



      return response
        })
        .catch(function (error) {
        // handle error
        console.log(error);
        })
        .then(function (response) {
        //console.log(typeof response);
            return response 
      //var flightPlanCoordinates = JSON.parse(old); //convert back to array      
    });
      return results;
    })
    .catch((e) => {
      alert("Geocode was not successful for the following reason: " + e);
    });



    
}

//function removeLine(): void {
  //  flightPath.setMap(null);}






export { initMap };





