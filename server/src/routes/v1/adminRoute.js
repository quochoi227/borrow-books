import express from "express";
import adminController from "../../controllers/adminController.js";

const Router = express.Router();

Router.post("/register", adminController.register);
Router.post("/login", adminController.login);
Router.delete("/logout", adminController.logOut);
Router.put("/update", adminController.updateUser);

export const adminRoute = Router;
