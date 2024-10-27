import Product from "../models/Products.js";

/**
 * Controller for filtering products by category.
 *
 * @class ProductFilter
 */
class ProductFilter {
    /**
     * Filters products by category or quantity.
     * This method should be an instance or static method within the class.
     * @param {Object} filters - Filters to apply.
     * @param {String} [filters.category] - Category of the product.
     * @param {Number} [filters.quantity] - Maximum quantity of the product.
     * 
     * @returns {Promise<Array>} Array of filtered products.
     */
    static async filterProducts(filters) {
        const { category, quantity } = filters;
        const query = {};
        
        if (quantity) {
            query.quantity = { $lt: Number(quantity) };
        }

        // Add category filter if provided
        if (category) {
            // Case-insensitive regex search for category
            query.category = { $regex: new RegExp(category, 'i') };
        }

        // Query the products collection based on the built filter
        const products = await Product.find(query).exec();
        return products;
    }

    /**
     * Retrieves filtered products from the database.
     *
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {String} [req.query.category] - Category of the product.
     * @param {Number} [req.query.quantity] - Maximum quantity of the product.
     *
     * @returns {Promise<void>} Resolves with a JSON response containing the filtered products.
     */
    static async getFilteredProducts(request, response) {
       const { category, quantity } = request.query;

       try {
           const filteredProducts = await ProductFilter.filterProducts({ category, quantity });
           console.log('Filtered Products:', filteredProducts);
           response.status(200).json(filteredProducts);
       } catch (error) {
           console.error(error);
           console.log("Failed to retrieve filtered products");
           response.status(500).json({ message: "Internal server error" });
       }
    }
}

export default ProductFilter;