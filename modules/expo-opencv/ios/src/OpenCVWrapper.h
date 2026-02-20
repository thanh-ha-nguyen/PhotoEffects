//
//  OpenCVWrapper.h
//  ExpoOpenCV
//
//  Created by Thanh Ha Nguyen on 20.2.2026.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIImage.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIImage (OpenCV)
- (UIImage *)withEffects:(NSArray *)effects;
@end

NS_ASSUME_NONNULL_END
