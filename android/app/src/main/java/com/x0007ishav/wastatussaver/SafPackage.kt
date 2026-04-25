package com.x0007ishav.wastatussaver

import com.facebook.react.*
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class SafPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext)
    = listOf(SafModule(reactContext))

   override fun createViewManagers(
    reactContext: ReactApplicationContext
  ): List<ViewManager<*, *>> {
    return emptyList()
  }
}