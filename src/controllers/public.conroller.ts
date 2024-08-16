import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export const getAvatarController = async (req: Request, res: Response) => {
    const imageId = req.params.id;
    const imagePath = path.join(__dirname, "../../uploads", imageId)
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.redirect("https://mobtwintest.com")
    }

}

export const getAppsImageController = async (req: Request, res: Response) => {
    const imageId = req.params.id;
    const imagePath = path.join(__dirname, "../../uploads", imageId)
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.redirect("https://mobtwintest.com")
    }

}
