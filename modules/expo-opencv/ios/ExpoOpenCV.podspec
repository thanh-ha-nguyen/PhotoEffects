Pod::Spec.new do |s|
  s.name           = 'ExpoOpenCV'
  s.version        = '1.0.0'
  s.summary        = 'OpenCV module for Expo'
  s.description    = 'This module provides OpenCV functionalities for Expo applications.'
  s.author         = 'Thanh Ha Nguyen'
  s.homepage       = 'https://github.com/thanh-ha-nguyen/PhotoEffects'
  s.platforms      = {
    :ios => '15.1',
    :tvos => '15.1'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'SDWebImage', '~> 5.21.0'
  s.dependency 'SDWebImageAVIFCoder', '~> 0.11.0'
  s.dependency 'SDWebImageSVGCoder', '~> 1.7.0'
  s.dependency 'SDWebImageWebPCoder', '~> 0.14.6'
  s.dependency 'libavif/libdav1d'
  
  s.vendored_frameworks = 'Frameworks/opencv/opencv2.xcframework'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "src/**/*.{h,m,mm,swift,hpp,cpp}"
end
