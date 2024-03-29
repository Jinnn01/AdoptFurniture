// not working
async function GetMap() {
  const map = new Microsoft.Maps.Map('#myMap', {});
  map.setView({
    credentials: 'Your Bing Maps Key',
    center: new Microsoft.Maps.Location(-34.3915, 150.85),
    mapTypeId: Microsoft.Maps.MapTypeId.aerial,
    zoom: 12,
  });
  // store each suburbs's furniture amount
  let suburbs = {};

  // Function to add pins to the map with initial content
  function addPinsWithContent(longitude, latitude, suburb, count) {
    // Provide location to add pin on map
    const location = new Microsoft.Maps.Location(longitude, latitude);
    // Create a pin on the map

    const pin = new Microsoft.Maps.Pushpin(location, {
      title: suburb,
      subTitle: '',
      text: count,
      color: '#3468C0',
    });

    // Add the pin to the map
    map.entities.push(pin);
    // store furniture counts
    suburbs[suburb] = count;
  }

  // Add pins to the map with initial content
  // to do display sum of the furnitures in each suburb
  // TODO: when user create new furniture, update the geolocations
  const groupedFurnitures = Object.groupBy(
    allFurnitures,
    ({ location }) => location
  );
  for (let suburb in groupedFurnitures) {
    const furniture = groupedFurnitures[suburb];
    const funritureNumber = String(furniture.length);
    const coordinate = furniture[0].geolocation.coordinates;
    addPinsWithContent(coordinate[0], coordinate[1], suburb, funritureNumber);
  }

  // Function to update pin content based on zoom level
  function updatePinContentBasedOnZoomLevel(zoomLevel, content) {
    // Example: Update pin text based on zoom level
    const pinNumber = map.entities.getLength();
    for (let i = 0; i < pinNumber; i++) {
      const pin = map.entities.get(i);
      const suburb = pin.getTitle();
      if (zoomLevel > 13.1) {
        pin.setOptions({
          text: 'TBA', // Update pin text with more detailed information, sort by suburb?
        });
      } else {
        pin.setOptions({
          text: content[suburb],
        });
      }
    }
  }

  // Function to handle map zoom level change
  function handleZoomLevelChange() {
    const currentZoomLevel = map.getZoom(); // Get current zoom level of the map
    // Update pin content based on current zoom level
    updatePinContentBasedOnZoomLevel(currentZoomLevel, suburbs);
  }

  // Event listener for map zoom level change
  Microsoft.Maps.Events.addHandler(map, 'viewchange', handleZoomLevelChange);
}
