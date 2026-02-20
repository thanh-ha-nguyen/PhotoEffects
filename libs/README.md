# Setup third-party libraries and frameworks

## OpenCV framework

### For iOS

#### Prerequisites

- [CMake](https://cmake.org/download/) 2.8.8 or higher
- [Xcode](https://developer.apple.com/xcode/) 4.2 or higher
- `python` is heavily used in build scripts, but it has been deprecated and removed since MacOS Montery 12.3. You may have to alias it to `python3` in case you face any issue while building.

```shell
sudo ln -s /usr/bin/python3 /usr/local/bin/python
sudo ln -s /Library/Developer/CommandLineTools/usr/bin/python3 /Library/Developer/CommandLineTools/usr/bin/python
```

#### Building OpenCV from Source, using CMake and Command Line

There are detailed instructions at [Installation in iOS](https://docs.opencv.org/4.x/d5/da3/tutorial_ios_install.html) tutorial, but it seems out-dated because there are lots of errors due to deprecated tools. For example, issue regarding `python` replaced by `python3` mentioned above. 

Thanks to Vangos Pterneas, from his [OpenCV for Apple Vision Pro, iPhone, iPad, Mac, and Simulators (2024)](https://lightbuzz.com/opencv/) post, I find another more recent build command that works at the moment

```shell
python3 libs/opencv/platforms/apple/build_xcframework.py \
  --out modules/expo-opencv/ios/Frameworks/opencv \
  --iphoneos_deployment_target 26.1 \
  --iphoneos_archs arm64 \
  --iphonesimulator_archs arm64,x86_64 \
  --build_only_specified_args True \
  --without objc
```

If everything’s fine, the build process will create `modules/expo-opencv/ios/Frameworks/opencv`.
