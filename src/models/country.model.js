import mongoose, { Schema } from "mongoose";


const countrySchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  phoneCode: { type: String, required: true },
  flag: { type: String, required: true },
});

const CountryModel = mongoose.model("Country", countrySchema);

export default CountryModel;