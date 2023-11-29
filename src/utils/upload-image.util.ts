import fetch from 'node-fetch';
import FormData from 'form-data';

export async function uploadImageToExternalService(image: Express.Multer.File): Promise<string> {
  const baseUrl = 'https://api.upload.io';
  const path = '/v2/accounts/12a1yT3/uploads/form_data'; // Replace with your accountId
  const apiKey = 'public_12a1yT33i6TGfac5csaUYpbaRXga'; // Replace with your API key

  const formData = new FormData();
  formData.append('file', image.buffer, image.originalname);

  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const result = await response.json();
  if (Math.floor(response.status / 100) !== 2) {
    throw new Error(`Upload API Error: ${JSON.stringify(result)}`);
  }

  // Assuming the response from the upload service contains the URL of the uploaded image
  return result.url;
}
