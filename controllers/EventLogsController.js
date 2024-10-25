import EventLogs from "../models/EventLogs.js";

/**
 * Controller for creating and fetching EventLogs.
 *
 * @class EventLogsController
 */

class EventLogsController {

    /**
     * Creates a new EventLog in the database.
     * @parsms {string} eventType - Type of the event
     * @param {Date} timestamp - Timestamp of the event
     * @param {string} user - User who triggered the event
     * @param {string} productId - Product ID associated with the event
     * @param {object} data - Data associated with the event
     * @param {string} description - Description of the event
     */

    static async logEventDirectly({ eventType, timestamp, user, productId, data, description }) {
        try {
          // Check for duplicates (optional based on timestamp or other criteria)
          const eventLogExists = await EventLogs.findOne({ timestamp });
          if (eventLogExists) {
            console.log("Event log already exists for this timestamp");
            return;
          }
    
          // Create and save the new event log
          const eventLog = new EventLogs({ eventType, timestamp, user, productId, data, description });
          await eventLog.save();
          console.log("Event log created successfully");
        } catch (error) {
          console.error("Failed to create event log:", error);
        }
      }

    /**
     * Retrieves all EventLogs from the database.
     *
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     *
     * @returns {Promise<void>} Resolves with a JSON response containing all EventLogs.
     */
    static async getAllEventLogs(request, response) {
        try {
            const eventLogs = await EventLogs.find().sort({ timestamp: -1 });
            response.status(200).json(eventLogs);
        } catch (error) {
            console.error(error);
            console.log("Failed to retrieve EventLogs");
            response.status(500).json({ message: "Internal server error" });
        }
    }

}
export default EventLogsController;