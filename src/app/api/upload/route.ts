import { NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
	api_key: process.env.CLOUDINARY_API_KEY!,
	api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const files = formData.getAll('files') as File[];

		if (!files || files.length === 0) {
			return NextResponse.json(
				{ error: 'No files found' },
				{ status: 400 }
			);
		}

		if (files.length > MAX_FILES) {
			return NextResponse.json(
				{ error: `Maximum ${MAX_FILES} files allowed` },
				{ status: 400 }
			);
		}

		// Validate file sizes
		for (const file of files) {
			if (file.size > MAX_FILE_SIZE) {
				return NextResponse.json(
					{ error: `File ${file.name} exceeds 5MB limit` },
					{ status: 400 }
				);
			}
		}

		// Upload all files
		const uploadPromises = files.map(async (file) => {
			const bytes = await file.arrayBuffer();
			const buffer = Buffer.from(bytes);

			const uploaded: UploadApiResponse = await new Promise(
				(resolve, reject) => {
					cloudinary.uploader
						.upload_stream(
							{ folder: 'products' },
							(err, result) => {
								if (err) reject(err);
								else resolve(result as UploadApiResponse);
							}
						)
						.end(buffer);
				}
			);

			return uploaded.secure_url;
		});

		const urls = await Promise.all(uploadPromises);

		// Return array of URLs, first one is the primary image
		return NextResponse.json({
			urls,
			url: urls[0], // For backward compatibility
		});
	} catch (error) {
		console.error('Upload error:', error);
		const errorMessage =
			error instanceof Error ? error.message : 'Failed to upload images';
		return NextResponse.json(
			{ error: errorMessage, details: String(error) },
			{ status: 500 }
		);
	}
}
