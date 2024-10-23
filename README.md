# Inventory Management API

## Overview
This project is a simple RESTful API built using **Node.js** and **Express** to manage an inventory system. The API is developed in **JavaScript** and utilizes **MongoDB** as the database for storing product information.

## Requirements
- **Node.js**: Ensure you have Node.js installed on your machine.
- **npm**: Node package manager comes bundled with Node.js. It is used to install dependencies for the project.
- **MongoDB**: You will need a MongoDB database. You can set it up locally or use a cloud provider like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

# Features
1. **Add New Products**  
   Implemented an endpoint to add new products to the inventory. Each product has the following properties:
   - **ID** (automatically generated)
   - **Name** (must be unique)
   - **Quantity** (must be >= 0)
   - **Category**

   If a product with the same name exists, a meaningful error message is returned.

2. **Update Product Quantity**  
   Implemented an endpoint to update the quantity of an existing product. 
   - The quantity must always be greater than or equal to 0.
   - Invalid updates (e.g., setting a negative quantity) are handled with appropriate error messages.

3. **Delete Products**  
   Implemented an endpoint to delete a product from the inventory.
   - A product cannot be deleted if its quantity is greater than 0. An error message is returned in such cases.

4. **Retrieve Product List**  
   Implemented an endpoint to retrieve a list of all products in the inventory.
   - Includes the ability to retrieve a specific product by its ID.

5. **Validation & Error Handling**  
   Validated all input data and ensured proper error handling for:
   - Duplicate product names.
   - Invalid product updates (e.g., negative quantities).
   - Attempting to delete a product with a non-zero quantity.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tuyizereerneste/inventory-management-api.git
   cd inventory-management-api

2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Create .env file in your root directory**:
   ```bash
   touch .env
   ```
   **Content of .env file:**
   ```bash
   PORT=3000
   DB_URI=your_mongo_db_connection_string. (eg: mongodb://localhost:27017/inventory)
   ```

4. **Start the server**:
   ```bash
   npm run dev
   ```

# Usage
## API Endpoints

 1. **Add a new product**:
   POST: `/create-product`

 2. **Update product quantity**:
   PUT: `/update-product/:id`

 3. **Delete a product**:
   DELETE: `/delete-product/:id`

 4. **Retrieve product list**:
   GET: `/get-products`

 5. **Retrieve a specific product**:
   GET: `/get-product/:id`

   ## Example Requests

 1. **Add a new product**:
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"name": "Product 1", "quantity": 10, "category": "Category 1"}' http://localhost:7000/create-product
   ```

 2. **Update product quantity**:
   ```bash
   curl -X PUT -H "Content-Type: application/json" -d '{"quantity": 5}' http://localhost:7000/update-product/id
   ```

 3. **Delete a product**:
   ```bash
   curl -X DELETE http://localhost:7000/delete-product/id
   ```

 4. **Retrieve product list**:
   ```bash
   curl http://localhost:7000/get-products
   ```

 5. **Retrieve a specific product**:
   ```bash
   curl http://localhost:7000/get-product/id
   ```

# License


### Instructions for Customization:
- Make sure to adjust the port and URL in the usage section to match your application.
- Add any additional details relevant to your project or any specific instructions for running tests, if applicable.

Feel free to comment on this project and modify any sections or add more information as needed!
