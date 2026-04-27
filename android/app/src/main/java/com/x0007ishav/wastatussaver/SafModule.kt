package com.x0007ishav.wastatussaver

import android.content.ContentResolver
import android.net.Uri
import android.os.ParcelFileDescriptor
import com.facebook.react.bridge.*
import java.io.File
import java.io.FileOutputStream

import android.content.ContentValues
import android.os.Environment
import android.provider.MediaStore
import java.io.OutputStream


class SafModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "SafModule"

  @ReactMethod
  fun getFileDescriptor(uriString: String, promise: Promise) {
    try {
      val uri = Uri.parse(uriString)
      val resolver: ContentResolver = reactApplicationContext.contentResolver

      val pfd: ParcelFileDescriptor? =
        resolver.openFileDescriptor(uri, "r")

      if (pfd != null) {
        val fd = pfd.detachFd()
        promise.resolve(fd.toString())
      } else {
        promise.reject("ERR", "Cannot open file")
      }
    } catch (e: Exception) {
      promise.reject("ERR", e.message)
    }
  }

  @ReactMethod
fun copyToCache(uriString: String, type: String, promise: Promise) {
  try {
    val uri = Uri.parse(uriString)
    val resolver: ContentResolver = reactApplicationContext.contentResolver
 
    val input = resolver.openInputStream(uri)
    if (input == null) {
        promise.reject("ERR", "Input stream null")
        return
      }

    val ext = if (type === "video") ".mp4" else ".jpg";
    val fileName = "wa_status_${System.currentTimeMillis()}$ext"
    val file = File(reactApplicationContext.cacheDir, fileName)
    val output = FileOutputStream(file)

    input.copyTo(output)

     output.flush()
      input.close()
      output.close()

    promise.resolve(file.absolutePath)
  } catch (e: Exception) {
    promise.reject("ERR", e.message)
  }
}

@ReactMethod
fun saveToGalleryNative(filePath: String, type: String, promise: Promise) {
  try {
    val file = File(filePath)
    if (!file.exists()) {
      promise.reject("ERR", "File not found")
      return
    }

    val resolver = reactApplicationContext.contentResolver

    val mimeType = if (type == "video") "video/mp4" else "image/jpeg"

    val contentValues = ContentValues().apply {
      put(MediaStore.MediaColumns.DISPLAY_NAME, file.name)
      put(MediaStore.MediaColumns.MIME_TYPE, mimeType)
      put(
        MediaStore.MediaColumns.RELATIVE_PATH,
        if (type == "video") "Movies/StatusSaver" else "Pictures/StatusSaver"
      )
      put(MediaStore.MediaColumns.IS_PENDING, 1)
    }

    val collection = if (type == "video") {
      MediaStore.Video.Media.EXTERNAL_CONTENT_URI
    } else {
      MediaStore.Images.Media.EXTERNAL_CONTENT_URI
    }

    val uri = resolver.insert(collection, contentValues)
    ?: run {
        promise.reject("ERR", "Failed to create media entry")
        return
      }


 val outputStream = resolver.openOutputStream(uri)
      ?: run {
        resolver.delete(uri, null, null)
        promise.reject("ERR", "Output stream null")
        return
      }
      
      val inputStream = file.inputStream()

    inputStream.copyTo(outputStream)

    outputStream.flush()
    inputStream.close()
    outputStream.close()

       val updateValues = ContentValues().apply {
      put(MediaStore.MediaColumns.IS_PENDING, 0)
    }

    resolver.update(uri, updateValues, null, null)

    promise.resolve(true)

  } catch (e: Exception) {
    promise.reject("ERR", e.message)
  }
}

@ReactMethod
fun deleteFile(uriString: String, promise: Promise) {
  try {
    val uri = Uri.parse(uriString)
    val resolver: ContentResolver = reactApplicationContext.contentResolver

    val rowsDeleted = resolver.delete(uri, null, null)

    if (rowsDeleted > 0) {
      promise.resolve(true)
    } else {
      promise.resolve(false)
    }
  } catch (e: Exception) {
    promise.reject("ERR", e.message)
  }
}
}