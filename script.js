
mapboxgl.accessToken = 'pk.eyJ1IjoibWlzdGVybGludXgiLCJhIjoiY2tnams0OGtzMDhqejJ4bGxmdWhia255YSJ9.htJI3nLHJoB62eOycK9KMA'

navigator.geolocation.getCurrentPosition( async ( {coords: {latitude, longitude}} ) => {
    //cen is just an array of the coordinates as an array
    placing( longitude, latitude, [[ longitude, latitude] ], 17 , 70)
  }, ()=>{
    placing( 12.4886930452 , 41.8874314503, [[ 12.4886930452, 41.8874314503 ] ], 17 , 70)
  }
)


async function placing( x, y, cen= 0, zoon= 13.25, pit= 50){

//cen is the number of places that the API gets, its 10 coordinates markers
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/misterlinux/cl9ff489l003r14mqp7si3ef4',
    center: [x, y],
    zoom: zoon,
    pitch: pit,
    antialias: true,
    projection: 'globe'
  });

  map.dragRotate.disable();
  //disable map rotation with the doulbe touch
  map.touchZoomRotate.disableRotation();
  //we can disable the zoom on mouse scroll
  map.scrollZoom.disable()
  //no idea what box zoom could be
  map.boxZoom.disable()
  map.doubleClickZoom.disable()
  //dragpan is the one to disable drag with mouse or finger drag
  map.dragPan.disable()
  map.touchZoomRotate.disable()
  
  if(cen){
    for( let ln of cen ){
      new mapboxgl.Marker()
        .setLngLat( [ ln[0], ln[1] ] )    
        .addTo(map);   
    }
  }
  
  //wont rotate the 10 markers on the map
  if( cen.length <= 1){

    function rotateCamera(timestamp) {
      //I hav no idea frm where timestamp originates
      //the lover the / is the faster is
      map.rotateTo( (timestamp / 100) % 360 , { duration: 0 } );
      //.rotateTo is mapbox method, it taks the bearing (and option, event) in his parameters
      // Request the next frame of the animation.
      requestAnimationFrame(rotateCamera);
    }
  
    map.on('load', () => {
      // Start the animation when loaded map
      rotateCamera(0);
    })
  }

}

let fourstore= document.getElementById("four")
let city= document.getElementById("posto")
//we get the button with the fourstore

let foursquare= 'https://api.foursquare.com/v2/venues/explore?near=';
let access= 'OZATO4USDMG5ZYJMKY54YTK4Y2TPDWK34PSUG3GIV0RULAXP';

let accesspri= 'OSXQJ50AFX20J2HNOHKFGPWKVVNYNSP13IOGOB5YETXLPLR4'; 

let results= document.getElementById("results")

let mappa= document.getElementById("mappa")
let vedere= document.getElementById("vedere")
let vedere1= document.getElementById("vedere1")

let listing;

let centro= []
let posti = []
let zoomato= 0

//we gonna use the geo only to fuel the flyTo effect
let gravita= [];
const APIKEY = "1313cd4c0f364f82aa120509835e4786";
let URL = `https://api.weatherbit.io/v2.0/current?key=${APIKEY}`;

fourstore.addEventListener("click", async ()=>{

  if( centro.length !== 0 ){
    
    listing.innerHTML= ""
    centro = []
    posti = []
    gravita= []
    //if centro is not empty remove the markers
    //results.removeChild( span )    
  }

  let cit= city.value    //name, we can also choose the &limit=__
  const urlToFetch = `${foursquare}${cit}&limit=10&client_id=${access}&client_secret=${accesspri}&v=20180101`;

  let four= await fetch(urlToFetch)
  let square= await four.json()
  let lista= await square.response.groups[0].items.map((item) => item.venue)


  let risposta= await fetch( `${URL}&city=` + cit )
  let dati= await risposta.json()

  let { lat, lon } = dati.data[0]

  gravita.push( lon, lat )
//we are gonna use gravity ONLY for the FlyTo effect


  mappa.classList= "col-sm-9 p-sm-0"

//we select specific HTML tags depending on the screen
//remember that on desktop the map get smaller for the sidebar 
//proportion being 3/4 due to the CSS
mappa.getBoundingClientRect().width< 600 ? 
  listing = document.getElementById("listing1") : 
  listing= document.getElementById("listing")

//kept both in the same event
  mappa.getBoundingClientRect().width< 600 ? vedere1.style.display= "block" : vedere.style.display= "block"

  lista.forEach(element => {

//we use just col- if we just need fixed columns
    let primo= document.createElement("div")
    primo.classList = "row select"

    let secondo= document.createElement("div")
    secondo.classList= "col-10 px-2 py-1"
    secondo.id= "clicka"

    let ico= document.createElement("div")
    ico.classList= "col-2 px-1"

    let srcicon= document.createElement("img")
    srcicon.classList= "img-fluid my-2 small"

    listing.appendChild(primo)
    primo.appendChild(secondo)

    ico.appendChild(srcicon)
    primo.appendChild(ico)

    secondo.innerHTML= "<b>" + element.name +  "</b>"
    srcicon.src= `${element.categories[0].icon.prefix}bg_64${element.categories[0].icon.suffix}`

    let address= document.createElement("p")
    secondo.appendChild(address)
    address.style.fontSize= "12px"

    if( element.location.address ){
      address.innerText= element.location.address
    }else{
      address.innerText= element.name
    }

    /*
    Addeventlisteners is a built in function avascript
    What is the Event in javascript, it handles the responses from the webpage
    and the event listeners act upon event happening, 
    also inside the primo we would get only ethe clicked one as primo
    */
    primo.addEventListener("click", ()=>{

      const activeItem = document.getElementsByClassName('active');

      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }

      primo.classList.add('active');

      const map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/misterlinux/cl9ff489l003r14mqp7si3ef4',
        center: [ gravita[0] , gravita[1] ],
        zoom: 17,
        pitch: 20
      });

      function rotateCamera(timestamp) {
          //I hav no idea frm where timestamp originates
          //the lover the / is the faster is
          map.rotateTo( (timestamp / 100) % 360 , { duration: 0 } );
          //.rotateTo is mapbox method, it taks the bearing (and option, event) in his parameters
          // Request the next frame of the animation.
          requestAnimationFrame(rotateCamera);
      }

      map.on('load', () => {
        // Start the animation when loaded map
        rotateCamera(0);
      })

      map.flyTo({
        //Latitude needs to be between 90/-90 whilE longitude is 180
        center: [element.location.lng , element.location.lat ],
        pitch: 70,
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
        //we can also modify map properties like pitch
      });

    new mapboxgl.Marker()
      .setLngLat( [ element.location.lng , element.location.lat ] )
      .addTo(map)
    
    map.dragRotate.disable();
    //disable map rotation with the doulbe touch
    map.touchZoomRotate.disableRotation();
    //we can disable the zoom on mouse scroll
    map.scrollZoom.disable()
    //no idea what box zoom could be
    map.boxZoom.disable()
    map.doubleClickZoom.disable()
    //dragpan is the one to disable drag with mouse or finger drag
    map.dragPan.disable()
    map.touchZoomRotate.disable()
  
    })

    //we are gonna use TURF to get the middle point between all 10 locations
    //we first may use turf.points to make the coordinates workable
    centro.push( [ element.location.lng, element.location.lat ] )

    posti.push( [ element.location.lng, element.location.lat ] )
  });

  let features = turf.points( centro )
  let centrato = turf.center( features )

  //zoom level function
  zoomato= lontano( posti, turf.center( turf.points(centro) ) )

  //we use placing for the zoom and 10 markers on teh map
  placing( centrato.geometry.coordinates[0], centrato.geometry.coordinates[1], centro, zoomato )

})

let distanze= []

function lontano(lista, apice){

  lista.forEach( x=>{
    distanze.push( turf.distance( apice, turf.point( x )) )
  })

  let logarit;
  
  mappa.getBoundingClientRect().width< 500 ? 
    logarit= Math.pow(2, 11)/ (( Math.max( ...distanze )*2 )/10) : 
    logarit= Math.pow(2, 11)/ (( Math.max( ...distanze )*2 )/19) 

  return (Math.log( logarit )/ Math.log(2) )

//you can reduce the 18 to 10 when smaller screen, 
}

/*
window.addEventListener("resize", function() {
  console.log( window.innerWidth )

  window.innerWidth < 600 ? location.reload() : console.log("reloading for change")

});
*/
