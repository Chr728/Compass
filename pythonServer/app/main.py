from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

PYTHON_PORT = int(os.getenv("PYTHON_PORT"))
PYTHON_HOST = os.getenv("PYTHON_HOST")

app = FastAPI()

def predict(file):
    return "your prediction"

@app.get("/", status_code=200)
async def read_root():
    return {'message': 'Hello World'}

@app.post("/PillAI")
async def pill_predict(file: UploadFile = File(...)):
    try:
        extension = file.filename.split(".")[-1] in ("jpg", "jpeg", "png")
        if not extension:
            item = {"message": "Image format must jpg, jpeg or png!"}
            return JSONResponse(status_code=404, content=item)
    
        # here should insert the predict progress
        prediction = predict(file)
        item = {"prediction": prediction, "filename": file.filename}
        return JSONResponse(status_code=200, content=item)
    except Exception as err:
        raise HTTPException(status_code=400, detail=f"{type(err).__name__} was raised: {err}")
    

origins = ["*"]    
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    expose_headers=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host=PYTHON_HOST, port =PYTHON_PORT)