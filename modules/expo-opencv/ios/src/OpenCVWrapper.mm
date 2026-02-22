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

@interface UIImage (Normalization)
- (UIImage *)normalize;
@end

@implementation UIImage (Normalization)

- (UIImage *)normalize
{
    if (self.imageOrientation == UIImageOrientationUp) return self;

    bool isOpaque = CGColorSpaceGetNumberOfComponents(CGImageGetColorSpace(self.CGImage)) <= 3;
    UIGraphicsBeginImageContextWithOptions(self.size, isOpaque, self.scale);
    @try {
        [self drawInRect:CGRectMake(0, 0, self.size.width, self.size.height)];
        return UIGraphicsGetImageFromCurrentImageContext();
    }
    @finally {
        UIGraphicsEndImageContext();
    }
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
    
    UIImage *image = [self normalize];
    
    bool hasAlpha = CGColorSpaceGetNumberOfComponents(CGImageGetColorSpace(image.CGImage)) > 3;
    cv::Mat mat;
    UIImageToMat(image, mat, hasAlpha);
    
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
            if (![UIImage respondsToSelector:selector]) {
                continue;
            }
            IMP method = [UIImage methodForSelector:selector];
            cv::Mat (*effectMethod)(id, SEL, cv::Mat, NSDictionary *) = (cv::Mat (*) (id, SEL, cv::Mat, NSDictionary *))method;
            mat = effectMethod(nil, selector, mat, options);
        }
        catch (cv::Exception exception)
        {
            NSString *errorMessage = [NSString stringWithCString:exception.msg.c_str() encoding:[NSString defaultCStringEncoding]];
            NSLog(@"An exception has occurred while applying effect %@. Code = %d, Message = %@.",
                  name, exception.code, errorMessage);
        }
    }
    
    return MatToUIImage(mat);
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
