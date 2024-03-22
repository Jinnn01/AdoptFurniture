module.exports.viewMap = async (request, response) => {
  const GetMap = function () {
    map = new Microsoft.Maps.Map('#myMap');
  };
  response.render('maps/mapView');
};
