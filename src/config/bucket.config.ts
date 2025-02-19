import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";
import { environment } from "../utils/loadEnvironment";
import { generateRandomCharacters } from "../utils/string.format";
import { Request } from "express";
import { processImage } from "../utils/images";

const credentials64 = environment.GCP_CREDENTIALS_BASE64;
const credentials = JSON.parse(Buffer.from(credentials64, 'base64').toString('utf-8')) ;

const storage = new Storage({credentials});

const bucketName = environment.GCP_BUCKET_NAME;
/**
 * Upload images to Google Cloud Storage and convert them to WebP format
 * @param req - Express request object
 * @param path - Folder path in the bucket
 * @returns - Array of public URLs for the uploaded files
 */
export const uploadImagesToGoogleCloud = async (
  req: Request,
  path: string
): Promise<string[]> => {
  const files = req.files as Express.Multer.File[]; // Assuming files are uploaded using middleware like multer
  const file = req.file as Express.Multer.File;

  if ((!files || files.length === 0) && !file) {
    throw new Error("No files provided");
  }

  const arrOfFiles = files || [file];

  const uploadPromises = arrOfFiles.map(async (file) => {
    // Validate the file MIME type
    if (!file.mimetype.startsWith("image/")) {
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }

    const fileKey = `${path}/${generateRandomCharacters(16)}.webp`;

    try {
      const fileObj = storage.bucket(bucketName).file(fileKey);


      // Create a WebP version of the image using Sharp
      const webpBuffer = await processImage(file.buffer);
      // Upload the file directly to Google Cloud Storage
      await fileObj.save(webpBuffer, {
        metadata: {
          contentType: "image/webp",
        },
      });

      return fileKey;
    } catch (error: any) {
      console.error(
        `Error processing file ${file.originalname}:`,
        error.message
      );
      throw new Error(`Error processing file ${file.originalname}`);
    }
  });

  try {
    const results = await Promise.all(uploadPromises);
    return results; // Return an array of URLs for the uploaded files
  } catch (error: any) {
    console.error("Error uploading files:", error.message);
    throw new Error(`Error uploading files: ${error.message}`);
  }
};
export const uploadAudiosToGoogleCloud = async (
  req: Request,
  path: string
): Promise<string[]> => {
  const files = req.files as Express.Multer.File[]; // Assuming files are uploaded using middleware like multer
  const file = req.file as Express.Multer.File;

  if ((!files || files.length === 0) && !file) {
    throw new Error("No files provided");
  }

  const arrOfFiles = files || [file];

  const uploadPromises = arrOfFiles.map(async (file) => {


    const fileKey = `${path}/${generateRandomCharacters(16)}.${file.mimetype.split('/')[1]}`;

    try {
      const fileObj = storage.bucket(bucketName).file(fileKey);

      // Upload the file directly to Google Cloud Storage
      await fileObj.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      return fileKey;
    } catch (error: any) {
      console.error(
        `Error processing file ${file.originalname}:`,
        error.message
      );
      throw new Error(`Error processing file ${file.originalname}`);
    }
  });

  try {
    const results = await Promise.all(uploadPromises);
    return results; // Return an array of URLs for the uploaded files
  } catch (error: any) {
    console.error("Error uploading files:", error.message);
    throw new Error(`Error uploading files: ${error.message}`);
  }
};
export const uploadVideosToGoogleCloud = async (
  req: Request,
  path: string
): Promise<string[]> => {
  const files = req.files as Express.Multer.File[]; // Assuming files are uploaded using middleware like multer
  const file = req.file as Express.Multer.File;

  if ((!files || files.length === 0) && !file) {
    throw new Error("No files provided");
  }

  const arrOfFiles = files || [file];

  const uploadPromises = arrOfFiles.map(async (file) => {


    const fileKey = `${path}/${generateRandomCharacters(16)}.${file.mimetype.split('/')[1]}`;

    try {
      const fileObj = storage.bucket(bucketName).file(fileKey);

      // Upload the file directly to Google Cloud Storage
      await fileObj.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      return fileKey;
    } catch (error: any) {
      console.error(
        `Error processing file ${file.originalname}:`,
        error.message
      );
      throw new Error(`Error processing file ${file.originalname}`);
    }
  });

  try {
    const results = await Promise.all(uploadPromises);
    return results; // Return an array of URLs for the uploaded files
  } catch (error: any) {
    console.error("Error uploading files:", error.message);
    throw new Error(`Error uploading files: ${error.message}`);
  }
};

/**
 * Generate a signed URL for a private file
 * @param fileKey - The file's key (path) in the bucket
 * @param expiresIn - Expiration time in minutes (e.g., 60 for 1 hour)
 * @returns The signed URL that grants temporary access to the file
 */
export const generateSignedUrl = async (fileKey: string, expiresIn: number = 60): Promise<string> => {
    const options:GetSignedUrlConfig = {
      version: 'v4',
      action: 'read', // This grants permission to read the file
      expires: Date.now() + expiresIn * 60 * 1000, // Expiration time in milliseconds
    };
  
    try {
      // Get a reference to the file in the bucket
      const file = storage.bucket(bucketName).file(fileKey);
      
      // Generate the signed URL
      const [url] = await file.getSignedUrl(options);
  
      return url;
    } catch (error: any) {
      console.error(`Error generating signed URL:`, error.message);
      throw new Error(`Error generating signed URL: ${error.message}`);
    }
  };
