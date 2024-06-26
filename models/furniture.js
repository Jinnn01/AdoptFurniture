const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment');

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/c_scale,h_300,w_400');
});

const furnitureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: Number,
  description: String,
  suburb: String,
  city: String,
  geolocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  img: [ImageSchema],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

// if the furniture has been deleted, then all the comments in that furniture, should be deleted as well.
// TODO:if furniture has beed deleted, all the pic should be deleted as well
furnitureSchema.post('findOneAndDelete', async function (furniture) {
  if (furniture.comments.length) {
    const res = await Comment.deleteMany({ _id: { $in: furniture.comments } });
    console.log(res);
  }
  console.log('post', furniture);
});

const Furniture = mongoose.model('Furniture', furnitureSchema);
module.exports = Furniture;
