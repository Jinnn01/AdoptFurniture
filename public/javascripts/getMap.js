function GetMap() {
  const map = new Microsoft.Maps.Map('#myMap', {});
  map.setView({
    credentials: 'Your Bing Maps Key',
    center: new Microsoft.Maps.Location(-34.3915, 150.85),
    mapTypeId: Microsoft.Maps.MapTypeId.aerial,
    zoom: 12,
  });
  const center = map.getCenter();
  const location = new Microsoft.Maps.Location(-34.3689, 150.8932);
  // create a pin on the map
  const pin = new Microsoft.Maps.Pushpin(location, {
    title: 'Corrimal',
    subTitle: 'Des of furniture',
    text: '1',
  });
  // add to the map
  map.entities.push(pin);
}
