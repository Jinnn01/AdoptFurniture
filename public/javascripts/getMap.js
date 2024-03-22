function GetMap() {
  const map = new Microsoft.Maps.Map('#myMap', {});
  map.setView({
    credentials: 'Your Bing Maps Key',
    center: new Microsoft.Maps.Location(-34.3915, 150.85),
    mapTypeId: Microsoft.Maps.MapTypeId.aerial,
    zoom: 12,
  });

  // Function to add pins to the map with initial content
  function addPinsWithContent(longitude, latitude, suburb) {
    // Provide location to add pin on map
    const location = new Microsoft.Maps.Location(longitude, latitude);
    // Create a pin on the map
    const pin = new Microsoft.Maps.Pushpin(location, {
      title: suburb,
      subTitle: 'Description of furniture',
      text: '1',
    });
    // Add the pin to the map
    map.entities.push(pin);
  }
  // Function to update pin content based on zoom level
  function updatePinContentBasedOnZoomLevel(zoomLevel) {
    // Example: Update pin text based on zoom level
    const pin = map.entities.get(0); // Assuming only one pin is added to the map
    if (zoomLevel > 13.1) {
      pin.setOptions({
        text: 'More detailed content', // Update pin text with more detailed information
      });
    } else {
      pin.setOptions({
        text: '1', // Reset pin text to default if zoom level is less than or equal to 15
      });
    }
  }

  // Function to handle map zoom level change
  function handleZoomLevelChange() {
    const currentZoomLevel = map.getZoom(); // Get current zoom level of the map
    console.log(currentZoomLevel);
    // Update pin content based on current zoom level
    updatePinContentBasedOnZoomLevel(currentZoomLevel);
  }

  // Event listener for map zoom level change
  Microsoft.Maps.Events.addHandler(map, 'viewchange', handleZoomLevelChange);

  // Add pins to the map with initial content
  addPinsWithContent(-34.3915, 150.85, 'Dapto');
}
