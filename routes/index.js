import { Router } from "express";
import ProductController from "../controllers/ProductController.js";

const router = Router();

router.post("/create-product", ProductController.createProduct);
router.get("/get-products", ProductController.getAllProducts);
router.get("/get-product/:id", ProductController.getProductById);
router.put("/update-product/:id", ProductController.updateProduct);
router.delete("/delete-product/:id", ProductController.deleteProduct);

export default router;