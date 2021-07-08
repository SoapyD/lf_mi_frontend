


const account = process.env.STORAGE_ACCOUNT;
const accountKey = process.env.STORAGE_KEY;
const container = process.env.STORAGE_CONTAINER;
const blob_path = process.env.STORAGE_BLOBPATH;


exports.saveBlob = async(content, filename) => {
     
    console.log("SAVING BLOB")
    const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
    
    // Enter your storage account name and shared key

     
    // Use StorageSharedKeyCredential with storage account and account key
    // StorageSharedKeyCredential is only available in Node.js runtime, not in browsers
    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);    
     
    const blobServiceClient = new BlobServiceClient(
        `https://${account}.blob.core.windows.net`,
        sharedKeyCredential
    );

    const containerName = container;
     
    // async function main() {
    const containerClient = blobServiceClient.getContainerClient(containerName);
     
    // const content = "Hello world!";
    const blobName = blob_path+filename //+".docx"
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    if(content !== undefined)
    {
        const uploadBlobResponse = await blockBlobClient.upload(content, content.length);
        console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    }

}