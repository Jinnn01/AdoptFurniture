const Furniture = require('../models/furniture');
const User = require('../models/user');
const Comment = require('../models/comment');
const { cloudinary } = require('../cloudinary/index');

module.exports.index = async (request, response) => {
  const allFurnitures = await Furniture.find({});
  response.render('furnitures', { allFurnitures });
};

module.exports.newForm = (request, response) => {
  response.render('furnitures/new');
};

module.exports.createFurniture = async (request, response, next) => {
  const currentGeoCode = response.locals.geoLocation;
  const furnitureImg = request.files.map((image) => ({
    url: image.path,
    filename: image.filename,
  }));
  const currentUserID = response.locals.currentUser._id;
  const { fName, fLocation, fPrice, fDescription } = request.body;
  const newFurniture = new Furniture({
    name: fName,
    location: fLocation,
    price: fPrice,
    description: fDescription,
    img: furnitureImg,
    geolocation: currentGeoCode,
  });
  // add furniture in that user.furnitures
  const user = await User.findById(currentUserID);
  user.furnitures.push(newFurniture._id);
  const savingUser = await user.save();
  const savingFurniture = await newFurniture.save();
  request.flash('success', 'Successfully add a new furniture!');
  response.redirect(`${newFurniture._id}`);
};

module.exports.displayDetails = async (request, response) => {
  const id = request.params.id;
  const furniture = await Furniture.findById(id).populate('comments');
  const commentersID = furniture.comments.map((comment) => comment.user);
  if (!furniture) {
    request.flash('error', "Can't find the furniture");
    return response.redirect('/furnitures');
  }
  // find who post this furniture
  const poster = await User.findOne({ furnitures: { $eq: id } });
  // find all the comments based on the furniture, and populate the user info asscociate with this comment
  const comments = await Comment.find({ furniture: { $eq: id } }).populate(
    'user'
  );
  response.render('furnitures/detail', { furniture, poster, comments });
};

module.exports.editForm = async (request, response) => {
  const id = request.params.id;
  const furniture = await Furniture.findById(id);
  if (!furniture) {
    request.flash('error', "Sorry, we can't find the furniture");
    return response.redirect(`/furnitures`);
  }
  response.render('furnitures/edit', { furniture });
};

module.exports.updateFurniture = async (request, response) => {
  const id = request.params.id;
  const {
    fName,
    fLocation,
    fPrice,
    fDescription,
    DeleteImgs = [],
  } = request.body;
  const furnitureImg = request.files.map((image) => ({
    url: image.path,
    filename: image.filename,
  }));
  const editedFurniture = await Furniture.findByIdAndUpdate(id, {
    name: fName,
    location: fLocation,
    price: fPrice,
    description: fDescription,
  });
  // to add
  editedFurniture.img.push(...furnitureImg);
  // to delete
  if (DeleteImgs.length) {
    for (let filename of DeleteImgs) {
      await cloudinary.uploader.destroy(filename);
    }
    await editedFurniture.updateOne({
      $pull: { img: { filename: { $in: DeleteImgs } } },
    });
  }

  await editedFurniture.save();

  if (!editedFurniture) {
    request.flash('error', "Cant't update the furniture");
  }
  request.flash('success', 'Successfully updated a furniture!');
  response.redirect(`/furnitures/${id}`);
};

module.exports.delete = async (request, response) => {
  const id = request.params.id;
  const deletedFurniture = await Furniture.findByIdAndDelete(id);
  request.flash('success', 'Successfully deleted a furniture!');
  response.redirect('/furnitures');
};
