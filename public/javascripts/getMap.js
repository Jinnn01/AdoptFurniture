function GetMap() {
  var map = new Microsoft.Maps.Map('#myMap', {
    credentials: 'Your Bing Maps Key',
    center: new Microsoft.Maps.Location(-34.3915, 150.85),
    mapTypeId: Microsoft.Maps.MapTypeId.aerial,
    zoom: 12,
  });
}
