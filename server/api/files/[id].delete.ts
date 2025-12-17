import { requireAuth } from '../../utils/session'
import { getFileById, deleteFile } from '../../utils/db'
import { deleteStoredFile } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'File ID is required'
    })
  }

  const file = getFileById(id)

  if (!file) {
    throw createError({
      statusCode: 404,
      message: 'File not found'
    })
  }

  // Delete from storage
  deleteStoredFile(file.stored_name)

  // Delete from database
  deleteFile(id)

  return { success: true }
})
