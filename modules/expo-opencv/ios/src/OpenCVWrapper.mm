//
//  OpenCVWrapper.m
//  ExpoOpenCV
//
//  Created by Thanh Ha Nguyen on 20.2.2026.
//

#ifdef NO
#undef NO
#endif

#import <opencv2/opencv.hpp>
#import <opencv2/imgcodecs/ios.h>
#import "OpenCVWrapper.h"

@interface UIImage (Conversion)
- (cv::Mat)toCVMat;
+ (UIImage *)fromCVMat:(cv::Mat)cvMat;
@end

@implementation UIImage (Conversion)

- (cv::Mat)toCVMat {
    CGColorSpaceRef colorSpace = CGImageGetColorSpace(self.CGImage);
    CGFloat cols = self.size.width;
    CGFloat rows = self.size.height;
    
    cv::Mat cvMat(rows, cols, CV_8UC4); // 8 bits per component, 4 channels (color channels + alpha)
    
    CGContextRef contextRef = CGBitmapContextCreate(cvMat.data,                 // Pointer to  data
                                                    cols,                       // Width of bitmap
                                                    rows,                       // Height of bitmap
                                                    8,                          // Bits per component
                                                    cvMat.step[0],              // Bytes per row
                                                    colorSpace,                 // Colorspace
                                                    kCGImageAlphaNoneSkipLast |
                                                    kCGBitmapByteOrderDefault); // Bitmap info flags
    
    CGContextDrawImage(contextRef, CGRectMake(0, 0, cols, rows), self.CGImage);
    CGContextRelease(contextRef);
    
    return cvMat;
}

+ (UIImage *)fromCVMat:(cv::Mat)cvMat {
    NSData *data = [NSData dataWithBytes:cvMat.data length:cvMat.elemSize()*cvMat.total()];
    CGColorSpaceRef colorSpace;
    
    if (cvMat.elemSize() == 1) {
        colorSpace = CGColorSpaceCreateDeviceGray();
    } else {
        colorSpace = CGColorSpaceCreateDeviceRGB();
    }
    
    CGDataProviderRef provider = CGDataProviderCreateWithCFData((__bridge CFDataRef)data);
    
    // Creating CGImage from cv::Mat
    CGImageRef imageRef = CGImageCreate(cvMat.cols,                                 //width
                                        cvMat.rows,                                 //height
                                        8,                                          //bits per component
                                        8 * cvMat.elemSize(),                       //bits per pixel
                                        cvMat.step[0],                              //bytesPerRow
                                        colorSpace,                                 //colorspace
                                        kCGImageAlphaNone|kCGBitmapByteOrderDefault,// bitmap info
                                        provider,                                   //CGDataProviderRef
                                        NULL,                                       //decode
                                        false,                                      //should interpolate
                                        kCGRenderingIntentDefault                   //intent
                                        );
    
    // Getting UIImage from CGImage
    UIImage *image = [UIImage imageWithCGImage:imageRef];
    CGImageRelease(imageRef);
    CGDataProviderRelease(provider);
    CGColorSpaceRelease(colorSpace);
    
    return image;
}

@end

@implementation UIImage (OpenCV)

#if !(EXTRACT_JSON)
#define EXTRACT_JSON(options, name, nstype, default) nstype *name = (nstype *)[options valueForKey:@#name] ?: @(default);
#endif

- (UIImage *)withEffects:(NSArray *)effects {
    if (effects == nil || effects.count == 0) {
        return self;
    }
    
    cv::Mat mat = [self toCVMat];
    for (int index = 0; index < effects.count; index++)
    {
        id effect = effects[index];
        
        NSString *name;
        NSDictionary *options;
        if ([effect isKindOfClass:[NSString class]])
        {
            name = effect;
            options = nil;
        }
        else
        {
            NSDictionary *effectInfo = (NSDictionary *)effect;
            name = [effectInfo valueForKey:@"name"];
            options = [effectInfo valueForKey:@"options"];
        }
        
        try
        {
            NSString *methodSelector = [name stringByAppendingString:@":withOptions:"];
            SEL selector = NSSelectorFromString(methodSelector);
            IMP method = [UIImage methodForSelector:selector];
            cv::Mat (*effectMethod)(id, SEL, cv::Mat, NSDictionary *) = (cv::Mat (*) (id, SEL, cv::Mat, NSDictionary *))method;
            mat = effectMethod(self, selector, mat, options);
        }
        catch (cv::Exception exception)
        {
            NSString *errorMessage = [NSString stringWithCString:exception.msg.c_str() encoding:[NSString defaultCStringEncoding]];
            NSLog(@"An exception has occurred while applying effect %@. Code = %d, Message = %@.",
                  name, exception.code, errorMessage);
        }
    }
    return [UIImage fromCVMat:mat];
}

+ (cv::Mat)grayscale:(cv::Mat)mat withOptions:(NSDictionary *)options {
    cv::cvtColor(mat, mat, cv::COLOR_RGB2GRAY);
    return mat;
}

+ (cv::Mat)blur:(cv::Mat)mat withOptions:(NSDictionary *)options
{
    EXTRACT_JSON(options, anchorPointX, NSNumber, -1);
    EXTRACT_JSON(options, anchorPointY, NSNumber, -1);
    EXTRACT_JSON(options, borderType, NSNumber, cv::BORDER_DEFAULT);
    EXTRACT_JSON(options, ksizeWidth, NSNumber, 3);
    EXTRACT_JSON(options, ksizeHeight, NSNumber, 3);
    EXTRACT_JSON(options, iterations, NSNumber, 1);

    cv::Size2i ksize([ksizeWidth intValue], [ksizeHeight intValue]);
    cv::Point2i anchor([anchorPointX intValue], [anchorPointY intValue]);
    
    for (int i = 0; i < [iterations intValue]; i++) {
        cv::blur(mat, mat, ksize, anchor, cv::BorderTypes([borderType intValue]));
    }
    
    return mat;
}
@end
