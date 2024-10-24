import { Router } from "express";
import ProductController from "../controllers/ProductController.js";
import ProductFilter from "../controllers/ProductFilter.js";

const router = Router();

router.post("/create-product", ProductController.createProduct);
router.get("/get-products", ProductController.getAllProducts);
router.get("/get-product/:id", ProductController.getProductById);
router.put("/update-product/:id", ProductController.updateProduct);
router.delete("/delete-product/:id", ProductController.deleteProduct);
router.get("/products/filter", ProductFilter.getFilteredProducts);

export default router;