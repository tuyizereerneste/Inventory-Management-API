import Product from "../models/Products.js";
import EventLogsController from "./EventLogsController.js";

/**
 * Controller for creating and fetching products.
 *
 * @class ProductController
 */
class ProductController {
  /**
   * Creates a new product in the database.
   */

  /**
   * Creates a new product in the database.
   *
   * @param {Object} request - Express request object.
   * @param {Object} response - Express response object.
   * @param {String} request.body.name - Unique name of the product.
   * @param {Number} request.body.quantity - Quantity of the product.
   * @param {String} request.body.category - Category of the product.
   *
   * @returns {Promise<void>} Resolves with a JSON response containing the created product.
   * @throws {Error} If the product with the same name already exists, it throws an error with a 400 status code.
   */
  static async createProduct(request, response) {
    try {
      const { name, quantity, category } = request.body;
      const nameExists = await Product.findOne({ name });
      if (nameExists) {
        return response.status(400).json({ message: "Product already exists" });
      }
      if (quantity < 0) {
        return response.status(400).json({ message: "Quantity cannot be negative" });
      }
      const product = new Product({ name, quantity, category });
      await product.save();
      await EventLogsController.logEventDirectly({ eventType: "CREATE_PRODUCT", timestamp: new Date(), user: "admin", productId: product._id, data: product, description: "Product created successfully" });
      response.status(201).json(product);
      console.log("Product created successfully");
    } catch (error) {
      console.error(error);
      console.log("Failed to create new product");
      response.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Retrieves all products from the database.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   *
   * @returns {Promise<void>} Resolves with a JSON response containing all products.
   */
  static async getAllProducts(request, response) {
    try {
      const products = await Product.find();
      response.status(200).json(products);
    } catch (error) {
      console.error(error);
      console.log("Failed to retrieve products");
      response.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Retrieves a single product by ID from the database.
   * 
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {String} req.params.id - ID of the product to retrieve.
   *
   * @returns {Promise<void>} Resolves with a JSON response containing the retrieved product.
   */
  static async getProductById(request, response) {
    try {
      const { id } = request.params;
      const product = await Product.findById(id);
      if (!product) {
        return response.status(404).json({ message: "Product not found" });
      }
      response.status(200).json(product);
    } catch (error) {
        console.log("Failed to retrieve product");
        console.error(error);
        response.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Updates a product in the database.
   *
   * @param {Object} request - Express request object.
   * @param {Object} response - Express response object.
   * @param {String} request.params.id - ID of the product to update.
   * @param {Number} request.body.quantity - Quantity of the product.
   *
   * @returns {Promise<void>} Resolves with a JSON response containing the updated product.
   */
  static async updateProduct(request, response) {
    try {
      const { id } = request.params;
      const { quantity } = request.body;
      const product = await Product.findById(id);
      if (!product) {
        console.log("Product not found");
        return response.status(404).json({ message: "Product not found" });
      }
      if (quantity < 0) {
        console.log("Quantity cannot be negative");
        return response.status(400).json({ message: "Quantity cannot be negative" });
      }
      product.quantity = quantity;
      await product.save();
      await EventLogsController.logEventDirectly({ eventType: "UPDATE_PRODUCT", timestamp: new Date(), user: "admin", productId: product._id, data: product.quantity, description: "Product updated successfully" });
      
      response.status(200).json(product);
      console.log("Product updated successfully");
    } catch (error) {
      console.error(error);
      console.log("Failed to update product");
      response.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Deletes a product from the database.
   *
   * @param {Object} request - Express request object.
   * @param {Object} response - Express response object.
   * @param {String} request.params.id - ID of the product to delete.
   * Product can not be deleted id its quantity is greater than zero.
   * @returns {Promise<void>} Resolves with a JSON response containing the deleted product.
   */
  static async deleteProduct(request, response) {
    try {
      const { id } = request.params;
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        console.log("Product not found");
        return response.status(404).json({ message: "Product not found" });
      }
      if (product.quantity > 0) {
        console.log("Product can not be deletedits quantity is greater than zero");
        return response.status(400).json({ message: "Product can not be deleted its quantity is greater than zero" });
      }
      console.log("Product deleted successfully");
      await EventLogsController.logEventDirectly({ eventType: "DELETE_PRODUCT", timestamp: new Date(), user: "admin", productId: product._id, data: product, description: "Product deleted successfully" });
      response.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error(error);
      console.log("Failed to delete product");
      response.status(500).json({ message: "Internal server error" });
    }
  }
}

export default ProductController;