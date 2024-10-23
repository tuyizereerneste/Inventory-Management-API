import mongoose from "mongoose";

/**
 * Mongoose schema for a Product document.
 *
 * @typedef {Object} ProductSchema
 * @property {String} name - Unique name of the product (required)
 * @property {Number} quantity - Quantity of the product (required, non-negative)
 * @property {String} category - Category of the product (required)
 */

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, 'Quantity cannot be negative'],
    },
    category: {
        type: String,
        required: true,
    }
});

export default mongoose.model("Product", productSchema);