const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  name: {
    type: String
  },
  link:{
    type : String
  },
  createdAt:{
    type : Date,
    default:Date.now()
}
});

const userExerciseSchema = new mongoose.Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  week: {
    sunday: [exerciseSchema],
    monday: [exerciseSchema],
    tuesday: [exerciseSchema],
    wednesday: [exerciseSchema],
    thursday: [exerciseSchema],
    friday: [exerciseSchema],
    saturday: [exerciseSchema],
  },
});



module.exports= mongoose.model('UserExercise', userExerciseSchema);

