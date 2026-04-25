package com.x0007ishav.wastatussaver

import android.content.ContentResolver
import android.net.Uri
import android.os.ParcelFileDescriptor
import com.facebook.react.bridge.*
import java.io.File
import java.io.FileOutputStream

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
    val fileName = "wa_status_" + System.currentTimeMillis() + ext
    val file = File(reactApplicationContext.cacheDir, fileName)
    val output = FileOutputStream(file)

         input.copyTo(output)

      input.close()
      output.close()

    promise.resolve(file.absolutePath)
  } catch (e: Exception) {
    promise.reject("ERR", e.message)
  }
}

}