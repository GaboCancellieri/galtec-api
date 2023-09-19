import { Storage } from "@google-cloud/storage";
const storage = new Storage();

export const uploadFile = async (bucketName: string, filePath: string) => {
  const result = await storage.bucket(bucketName).upload(filePath, {
    gzip: true,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });
  console.log({ result });
  console.log(`${filePath} uploaded to ${bucketName}.`);
  return result;
};

export const deleteFileFromGCS = async (
  bucketName: string,
  filename: string
) => {
  try {
    await storage.bucket(bucketName).file(filename).delete();
    console.log(`Successfully deleted file ${filename} from ${bucketName}`);
  } catch (error) {
    console.error(
      `Failed to delete file ${filename} from ${bucketName}.`,
      error
    );
    throw error;
  }
};
