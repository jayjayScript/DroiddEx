import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
// import fs from 'fs';

// Disable the default body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = formidable({ multiples: false });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Formidable error:', err);
      return res.status(500).json({ message: 'Error parsing form data' });
    }

    console.log('Fields:', fields);
    console.log('Files:', files);

    return res.status(200).json({ message: 'Upload successful', fields, files });
  });
}
