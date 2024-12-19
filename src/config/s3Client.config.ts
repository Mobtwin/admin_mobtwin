import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { environment } from "../utils/loadEnvironment";
import { generateRandomCharacters } from "../utils/string.format";
import { Request } from "express";
import sharp from "sharp";

const s3Client = new S3Client({
  endpoint: `https://fra1.digitaloceanspaces.com`, // Replace <your-space-region>
  region: "fra1", // Replace with your region
  credentials: {
    accessKeyId: environment.DIGITAL_OCEAN_ACCESS_KEY, // Replace with your Access Key
    secretAccessKey: environment.DIGITAL_OCEAN_SECRET_KEY, // Replace with your Secret Key
  },
});

async function createFolder(bucketName: string, folderName: string) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: `${folderName}/`, // The trailing `/` indicates a folder
  });

  try {
    await s3Client.send(command);
    console.log(`Folder '${folderName}' created successfully.`);
  } catch (err) {
    console.error("Error creating folder:", err);
  }
}

/**
 * Function to upload multiple files to DigitalOcean Spaces
 * @param req Express request object after multer middleware
 * @param folder Folder name inside the space, e.g., 'avatars', 'appVideos'
 * @returns URLs of uploaded files
 */
export const uploadFilesToSpaces = async (
  req: Request,
  folder: string
): Promise<string[]> => {
  const files = req.files as Express.Multer.File[]; // Assuming files are uploaded using middleware like multer

  const file = req.file as Express.Multer.File;

  if ((!files || files.length === 0) && !file) {
    throw new Error("No files provided");
  }

  const arrOfFiles = files || [file];

  const uploadPromises = arrOfFiles.map(async (file) => {
    const fileKey = `${folder}/${generateRandomCharacters(48)}.webp`; // Define the file path in Spaces

    // Convert and compress the image to WebP format
    const webpBuffer = await sharp(file.buffer)
      .webp({ quality:80, }) // Convert to WebP with specified quality
      .toBuffer();

    const command = new PutObjectCommand({
        Bucket: environment.DIGITAL_OCEAN_BUCKET_NAME,
        Key: fileKey,
        Body: webpBuffer,
        ContentType: 'image/webp',
        ACL: "public-read",
    });
    await s3Client.send(command);

    const url = `https://${process.env.DIGITAL_OCEAN_BUCKET_NAME}.fra1.digitaloceanspaces.com/${fileKey}`;
    return url;
  });

  try {
    const results = await Promise.all(uploadPromises);
    return results; // Return an array of URLs for the uploaded files
  } catch (error: any) {
    throw new Error(`Error uploading files: ${error.message}`);
  }
};
