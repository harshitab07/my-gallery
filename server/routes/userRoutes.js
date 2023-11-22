import express from 'express';
import imageModel from '../models/imageModel.js';
import formidable from 'express-formidable';
import fs from "fs";

export const uploadImagesController = async (req, res) => {
    try {
        const { photo } = req.files;
      if (!photo) {
        return res.status(400).send({ message: 'No image provided' });
      }
  
      const img = new imageModel({...req.fields});
      if (photo) {
        img.photo.data = fs.readFileSync(photo.path);
        img.photo.contentType = photo.type;
      }
      await img.save();
  
      return res.status(200).send({
        success: true,
        message: 'Image uploaded successfully!'
      });
    } catch (err) {
      console.error(err);
  
      return res.status(500).send({
        success: false,
        message: 'Unable to upload image',
        error: err?.message || err
      });
    }
  };

  export const getImages = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.send({ message: 'Email is required' });
      }
  
      const images = await imageModel.find({ email });
  
      return res.status(200).send({
        success: true,
        images,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: 'Unable to fetch images',
        error: error?.message || error,
      });
    }
  };

const router = express.Router();

router.post('/images', getImages);

router.post('/upload-image', formidable(), uploadImagesController);

export default router;