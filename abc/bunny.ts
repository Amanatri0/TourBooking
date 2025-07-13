// require('dotenv').config();
// const https = require('https');
// const path = require('path');
// const sharp = require('sharp');
// const { Readable } = require('stream');

// const REGION = ''; // Bunny default (Germany)
// const BASE_HOSTNAME = 'storage.bunnycdn.com';
// const HOSTNAME = REGION ? ${REGION}.${BASE_HOSTNAME} : BASE_HOSTNAME;

// const STORAGE_ZONE = process.env.CDN_STORAGE_ZONE;
// const ACCESS_KEY = process.env.CDN_STORAGE_API_KEY;
// const CDN_URL = process.env.BUNNY_CDN_URL;

// function sanitizeFilename(name) {
//   return name
//     // .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
//     .replace(/\s+/g, '_')
//     .replace(/[^a-zA-Z0-9_-]/g, '');
// }

// async function uploadImageToBunny({safeName, file , folder }) {

//   if (!file?.mimetype?.startsWith('image/')) {
//     throw new Error('Only images are allowed!');
//   }

//   if (file.size > 5 * 1024 * 1024) {
//     throw new Error('Image exceeds 5MB');
//   }

//   if (!STORAGE_ZONE || !ACCESS_KEY || !CDN_URL) {
//     throw new Error('Bunny config missing from environment');
//   }

//   const filename = ${safeName}_${Date.now()}.webp;
//   const remotePath = images/${folder}/${filename};
//   const publicUrl = ${CDN_URL}/${remotePath};

//   const processedBuffer = await sharp(file.buffer)
//     .resize({ width: 800, height: 600, fit: 'inside' })
//     .webp({ quality: 80 })
//     .toBuffer();

//   const stream = Readable.from(processedBuffer);

//   const options = {
//     method: 'PUT',
//     host: HOSTNAME,
//     path: /${STORAGE_ZONE}/${remotePath},
//     headers: {
//       AccessKey: ACCESS_KEY,
//       'Content-Type': 'application/octet-stream',
//       'Content-Length': processedBuffer.length,
//     },
//   };

//   await new Promise((resolve, reject) => {
//     const req = https.request(options, (res) => {
//       let body = '';
//       res.on('data', (chunk) => (body += chunk.toString()));
//       res.on('end', () => {
//         const response = safeJson(body);
//         if (res.statusCode !== 201) {
//           return reject(new Error(Upload failed: ${response?.Message || res.statusCode}));
//         }
//         resolve();
//       });
//     });

//     req.on('error', reject);
//     stream.pipe(req);
//   });

//   return publicUrl;
// }

// async function deleteImageFromBunny(filePath) {
//   if (!filePath || typeof filePath !== 'string') {
//     throw new Error('Invalid file path for Bunny delete');
//   }
//   if (!STORAGE_ZONE || !ACCESS_KEY) {
//     throw new Error('Bunny config missing from environment');
//   }

//   const remotePath = /${STORAGE_ZONE}/${filePath};

//   const options = {
//     method: 'DELETE',
//     host: HOSTNAME,
//     path: remotePath,
//     headers: {
//       AccessKey: ACCESS_KEY
//     }
//   };

//   return new Promise((resolve, reject) => {
//     const req = https.request(options, (res) => {
//       if (res.statusCode !== 200) {
//         return reject(new Error(Failed to delete file. HTTP ${res.statusCode}));
//       }

//       resolve({ success: true, message: Deleted: ${filePath} });
//     });

//     req.on('error', (err) => {
//       reject(new Error(Request error: ${err.message}));
//     });

//     req.end();
//   });
// }

// function safeJson(str) {
//   try {
//     return JSON.parse(str);
//   } catch {
//     return { error: 'Invalid JSON', raw: str };
//   }
// }

// module.exports = {
//   uploadImageToBunny,
//   deleteImageFromBunny
// };
