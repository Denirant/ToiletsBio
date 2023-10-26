// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { YMaps, Map, Placemark } from 'react-yandex-maps';

// function MapComponent({ selectedAddress, handleMapClick }) {

//     const [mapCenter, setMapCenter] = useState();

//     useEffect(() => {
//         // Проверяем, есть ли выбранный адрес, и обновляем центр карты
//         if (selectedAddress) {
//             // const [lat, lon] = selectedAddress.split(',').map(parseFloat);
//             setMapCenter(selectedAddress);
//         }
//     }, [selectedAddress]);

//   return (
//     <YMaps>
//       <div>
//         <Map
//           width="400px"
//           height="400px"
//           defaultState={{ 
//             center: mapCenter, // Координаты Дворцовой площади
//             zoom: 10, // Масштаб карты (чем больше число, тем ближе)
//           }}
//           state={{
//             center: mapCenter,
//             zoom: 10
//           }}
//           onClick={handleMapClick}
//         >
//           {selectedAddress && (
//             <Placemark geometry={selectedAddress} />
//           )}
//         </Map>
//       </div>
//     </YMaps>
//   );
// }


// export default MapComponent;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { YMaps, Map, Placemark, FullscreenControl, GeolocationControl, ZoomControl } from 'react-yandex-maps';

function MapComponent({ selectedAddress, handleMapClick, width, height }) {

    const [mapCenter, setMapCenter] = useState([59.939095, 30.315868]);

    useEffect(() => {
        // Проверяем, есть ли выбранный адрес, и обновляем центр карты
        if (selectedAddress) {
          console.log(selectedAddress)
            // const [lat, lon] = selectedAddress.split(',').map(parseFloat);
            setMapCenter(selectedAddress);
        }
    }, [selectedAddress]); 
    
    const style = {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%'
    };
  

  return (
    <YMaps >
      <div className='map_container' style={{width:'100%', height:'100%', position:'relative'}}>
        <Map
          // width="100%"
          // height="100%"   
          style={style}  
          state={{
            center: mapCenter,
            zoom: 10,
            controls: []
          }}
          onClick={handleMapClick}
        >
            <FullscreenControl />
            <ZoomControl options={{size: "small", position: {top: 10, left: 10}}}/>
          {selectedAddress && (
            <Placemark geometry={selectedAddress} />
          )}
        </Map>
      </div>
    </YMaps>
  );
}


export default MapComponent;