import { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker,  } from '@react-google-maps/api';
import axios from 'axios'

// Set map container style
const containerStyle = {
  width: '100%',
  height: '400px',
};

// Set initial center coordinates
const center = {
  lat: 40.73061,  // New York City coordinates as default
  lng: -73.935242,
};



const MyMap = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,

  });

  const [markerPosition, setMarkerPosition] = useState(null);
  const [breweries, setBreweries] = useState([]) 
  // Handle user click on the map
  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    // console.log(`Latitude: ${lat}, Longitude: ${lng}`);
    const coordinates = [lng, lat]
    // console.log(coordinates)
    axios.get('http://localhost:3000/breweries/nearby.json', {
      params: { coordinates: coordinates}
    }).then(response => {
      setBreweries(response.data);
      // console.log(breweries);
      // console.log(response.data);
    })


    // axios.get('http://localhost:3000/breweries.json').then(
    //   response => {
    //     console.log(response.data)
    //   }
    // )
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onClick={handleMapClick}  // Event listener for map clicks
    >
      {/* {
      // console.log(breweries)
      
      // breweries.forEach(brewery => (
      //   console.log(brewery),
      //   console.log(parseFloat(brewery.lat) + 1)
      // )
      // )
} */}
      {breweries.map((brewery) => (
        // console.log(brewery)
        <Marker
          key={brewery.id}
          position={{lat:parseFloat(brewery.lat), lng:parseFloat(brewery.long)}}
        />
      ))}
      {markerPosition && <Marker position={markerPosition} />}
    </GoogleMap>
  );
};

export default MyMap;


