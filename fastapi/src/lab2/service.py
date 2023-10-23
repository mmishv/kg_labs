import base64
import cv2
import numpy as np


class ImageProcessor:
    @staticmethod
    def apply_gaussian_blur(image):
        return cv2.GaussianBlur(image, (5, 5), 0)

    @staticmethod
    def apply_blur(image):
        return cv2.blur(image, (5, 5))

    @staticmethod
    def apply_median_blur(image):
        return cv2.medianBlur(image, 5)

    @staticmethod
    def apply_local_thresholding_bernsen(image, window_size=15, contrast_threshold=-0.2):
        return cv2.ximgproc.niBlackThreshold(image, maxValue=255, type=cv2.THRESH_BINARY, blockSize=window_size,
                                             k=contrast_threshold)

    @staticmethod
    def apply_local_thresholding_niblack(image, window_size=15, k=0.2, r=15):
        return cv2.ximgproc.niBlackThreshold(image, maxValue=255, type=cv2.THRESH_BINARY, blockSize=window_size, k=k,
                                             r=r)

    @staticmethod
    def apply_adaptive_thresholding(image):
        return cv2.adaptiveThreshold(image, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2)


async def process_image(input_image):
    def encode_image(image):
        image_bytes = cv2.imencode('.jpg', image)[1].tobytes()
        return base64.b64encode(image_bytes).decode('utf-8')

    image_bytes = await input_image.read()
    image_array = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_GRAYSCALE)
    processor = ImageProcessor()

    smoothed_gaussian_image = processor.apply_gaussian_blur(image)
    smoothed_image = processor.apply_blur(image)
    smoothed_median_image = processor.apply_median_blur(image)
    local_thresholding_niblack_image = processor.apply_local_thresholding_niblack(image)
    local_thresholding_bernsen_image = processor.apply_local_thresholding_bernsen(image)
    adaptive_thresholded_image = processor.apply_adaptive_thresholding(image)

    images = {"smoothed_gaussian_image.jpg": encode_image(smoothed_gaussian_image),
              "smoothed_image.jpg": encode_image(smoothed_image),
              "smoothed_median_image.jpg": encode_image(smoothed_median_image),
              "local_thresholding_niblack_image.jpg": encode_image(local_thresholding_niblack_image),
              "local_thresholding_bernsen_image.jpg": encode_image(local_thresholding_bernsen_image),
              "adaptive_thresholding_image.jpg": encode_image(adaptive_thresholded_image), }

    return images
