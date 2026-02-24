import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  secure_url: string
  public_id: string
  format: string
  width?: number
  height?: number
  resource_type: string
}

export interface SignedUploadParams {
  signature: string
  timestamp: number
  cloudName: string
  apiKey: string
  folder: string
}

/**
 * Generate signed upload parameters for client-side uploads
 */
export function generateSignedUploadParams(folder: string = "applications"): SignedUploadParams {
  const timestamp = Math.round(new Date().getTime() / 1000)

  const paramsToSign = {
    timestamp,
    folder,
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  )

  return {
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    folder,
  }
}

/**
 * Upload a file to Cloudinary (server-side)
 */
export async function uploadToCloudinary(
  file: Buffer | string,
  options: {
    folder?: string
    resourceType?: "image" | "raw" | "auto"
    publicId?: string
  } = {}
): Promise<UploadResult> {
  const { folder = "applications", resourceType = "auto", publicId } = options

  return new Promise((resolve, reject) => {
    const uploadOptions: Record<string, unknown> = {
      folder,
      resource_type: resourceType,
    }

    if (publicId) {
      uploadOptions.public_id = publicId
    }

    if (typeof file === "string" && file.startsWith("data:")) {
      // Base64 data URL
      cloudinary.uploader.upload(file, uploadOptions, (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            resource_type: result.resource_type,
          })
        }
      })
    } else if (Buffer.isBuffer(file)) {
      // Buffer upload using upload_stream
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error)
          } else if (result) {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              width: result.width,
              height: result.height,
              resource_type: result.resource_type,
            })
          }
        }
      )
      uploadStream.end(file)
    } else {
      reject(new Error("Invalid file format"))
    }
  })
}

/**
 * Delete a file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result.result === "ok"
  } catch {
    return false
  }
}

export default cloudinary
