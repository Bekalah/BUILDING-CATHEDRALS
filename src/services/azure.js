import { BlobServiceClient } from '@azure/storage-blob';

const connectionString = import.meta.env.VITE_AZURE_STORAGE_CONNECTION;
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

export async function uploadToAzure(teacherId, blob, metadata) {
  const containerClient = blobServiceClient.getContainerClient('cathedral-outputs');
  const blobName = `${teacherId}/${Date.now()}.png`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  
  await blockBlobClient.upload(blob, blob.size, { metadata });
  return blockBlobClient.url;
}
