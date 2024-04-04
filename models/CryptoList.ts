import mongoose, { Document, Schema, Model } from "mongoose";

mongoose.Promise = global.Promise;

export interface CryptoListDocument extends Document {
  listname: string;
  currency: string;
  price: number;
}

const cryptoListSchema = new Schema(
  {
    listname: String,
    currency: String,
    price: Number,
  },
  {
    timestamps: true,
  }
);

const CryptoList: Model<CryptoListDocument> =
  mongoose.models.CryptoList ||
  mongoose.model<CryptoListDocument>("CryptoList", cryptoListSchema);

cryptoListSchema.statics.findUniqueListNames = async function () {
  const listNames = await this.distinct("listname");
  return listNames;
};

export default CryptoList;
