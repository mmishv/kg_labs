from fastapi import APIRouter, UploadFile
from starlette.responses import JSONResponse
from src.lab2.service import process_image
router = APIRouter()


@router.post("/process_image/")
async def get_processed_images(image: UploadFile):
    if image.content_type.startswith('image'):
        images = await process_image(image)
        return JSONResponse(content=images)
    return {"error": "Uploaded file is not an image"}
