import mongoose from "mongoose";

/**
 * Mongoose schema for an EventLog document.
 *
 * @typedef {Object} EventLogSchema
 * @property {String} eventType - Type of the event
 * @property {Date} timestamp - Timestamp of the event
 * @property {String} user - User who triggered the event
 * @property {String} productId - Product ID associated with the event
 * @property {Object} data - Data associated with the event
 * @property {String} description - Description of the event
 * 
 */
const eventLogSchema = new mongoose.Schema({
    eventType: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

export default mongoose.model("EventLog", eventLogSchema);