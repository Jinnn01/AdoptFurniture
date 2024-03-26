module.exports.toGeoCode = async (request, response, next) => {
  const BingMapsKey = process.env.MAP_KEY;
  // geocode reuqest
  const geoLocationRequest = request.body.fLocation;
  const geocodeRequest =
    'http://dev.virtualearth.net/REST/v1/Locations?query=' +
    encodeURIComponent(geoLocationRequest) +
    '&key=' +
    BingMapsKey;

  try {
    // fetch data from the request
    const result = await fetch(geocodeRequest);
    // console.log('Response:', await result.text());
    const data = await result.json();
    // assume the result is the first one
    const geoLocation = data.resourceSets[0].resources[0].point;
    if (!geoLocation) {
      request.flash('error', 'Sorry, try again');
      return response.redirect(`/furnitures/new`);
    }

    response.locals.geoLocation = geoLocation;
  } catch (error) {
    console.error('Error fetching geocode data:', error);
  }
  next();
};
