import { post, upload } from './request'

/**
 * 上传文档（PDF，最多10个，单文件≤20MB）
 * POST /api/v1/app/project/upload/documents
 * 返回 [{ fileName, fileUrl, contentType, size }]
 */
export function uploadDocuments(files) {
  return upload('/api/v1/app/project/upload/documents', files)
}

/**
 * 上传图片（jpg/jpeg/png/webp，最多20个，单文件≤10MB）
 * POST /api/v1/app/project/upload/images
 * 返回 [{ fileName, fileUrl, contentType, size }]
 */
export function uploadImages(files) {
  return upload('/api/v1/app/project/upload/images', files)
}

/**
 * 提交项目
 * POST /api/v1/app/project
 */
export function submitProject(payload) {
  return post('/api/v1/app/project', payload)
}
