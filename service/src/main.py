from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from service.src.lab2.router import router as lab2_router
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lab2_router)
