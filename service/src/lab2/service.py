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

    @staticmethod
    def apply_erosion(image, kernel_size=3):
        kernel = np.ones((kernel_size, kernel_size), np.uint8)
        return cv2.erode(image, kernel, iterations=1)

    @staticmethod
    def apply_dilation(image, kernel_size=3):
        kernel = np.ones((kernel_size, kernel_size), np.uint8)
        return cv2.dilate(image, kernel, iterations=1)

    @staticmethod
    def apply_opening(image, kernel_size=3):
        kernel = np.ones((kernel_size, kernel_size), np.uint8)
        return cv2.morphologyEx(image, cv2.MORPH_OPEN, kernel)

    @staticmethod
    def apply_closing(image, kernel_size=3):
        kernel = np.ones((kernel_size, kernel_size), np.uint8)
        return cv2.morphologyEx(image, cv2.MORPH_CLOSE, kernel)

    @staticmethod
    def apply_linear_contrast(image):
        min_intensity = np.min(image)
        max_intensity = np.max(image)
        # растягиваем интенсивность вдоль всего диапазона [0, 255]
        stretched_image = ((image - min_intensity) / (max_intensity - min_intensity) * 255).astype(np.uint8)
        return stretched_image

    @staticmethod
    def apply_elementwise_operation(image, operation_type, value=None):
        # `operation_type` - тип операции ("add", "subtract", "cube", "square", "negative", "log", "sqrt")
        # `value` - константа для операций "add" и "subtract"
        if operation_type == "add":
            result_image = cv2.add(image, value)
        elif operation_type == "subtract":
            result_image = cv2.subtract(image, value)
        elif operation_type == "cube":
            result_image = np.power(image / 255.0, 3).clip(0, 1.0) * 255.0
        elif operation_type == "square":
            result_image = np.square(image / 255.0).clip(0, 1.0) * 255.0
        elif operation_type == "negative":
            result_image = 255 - image
        elif operation_type == "log":
            result_image = (255 * np.log1p(image / 255)).clip(0, 255).astype(np.uint8)
        elif operation_type == "sqrt":
            result_image = (255 * np.sqrt(image / 255)).clip(0, 255).astype(np.uint8)
        else:
            raise ValueError("Invalid operation type")

        return result_image


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

    eroded_image = processor.apply_erosion(image)
    dilated_image = processor.apply_dilation(image)
    opened_image = processor.apply_opening(image)
    closed_image = processor.apply_closing(image)

    elementwise_addition_image = processor.apply_elementwise_operation(image, "add", value=50)
    elementwise_subtraction_image = processor.apply_elementwise_operation(image, "subtract", value=30)
    elementwise_cubed_image = processor.apply_elementwise_operation(image, "cube")
    elementwise_squared_image = processor.apply_elementwise_operation(image, "square")
    elementwise_negative_image = processor.apply_elementwise_operation(image, "negative")
    elementwise_log_image = processor.apply_elementwise_operation(image, "log")
    elementwise_sqrt_image = processor.apply_elementwise_operation(image, "sqrt")

    linear_contrasted_image = processor.apply_linear_contrast(image)

    images = {
        "smoothed_gaussian_image.jpg": encode_image(smoothed_gaussian_image),
        "smoothed_image.jpg": encode_image(smoothed_image),
        "smoothed_median_image.jpg": encode_image(smoothed_median_image),
        "local_thresholding_niblack_image.jpg": encode_image(local_thresholding_niblack_image),
        "local_thresholding_bernsen_image.jpg": encode_image(local_thresholding_bernsen_image),
        "adaptive_thresholding_image.jpg": encode_image(adaptive_thresholded_image),
        "eroded_image.jpg": encode_image(eroded_image),
        "dilated_image.jpg": encode_image(dilated_image),
        "opened_image.jpg": encode_image(opened_image),
        "closed_image.jpg": encode_image(closed_image),
        "elementwise_addition_image.jpg": encode_image(elementwise_addition_image),
        "elementwise_subtraction_image.jpg": encode_image(elementwise_subtraction_image),
        "elementwise_cubed_image.jpg": encode_image(elementwise_cubed_image),
        "elementwise_squared_image.jpg": encode_image(elementwise_squared_image),
        "elementwise_negative_image.jpg": encode_image(elementwise_negative_image),
        "elementwise_log_image.jpg": encode_image(elementwise_log_image),
        "elementwise_sqrt_image.jpg": encode_image(elementwise_sqrt_image),
        "linear_contrasted_image.jpg": encode_image(linear_contrasted_image)
    }
    return images
