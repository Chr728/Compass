from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv
import cv2
import torch
import tensorflow as tf
from transformers import AutoImageProcessor, ViTForImageClassification
import numpy as np

load_dotenv()

PYTHON_PORT = int(os.getenv("PYTHON_PORT"))
PYTHON_HOST = os.getenv("PYTHON_HOST")

app = FastAPI()

def thresholding(img):
  # Split the image into the B,G,R components
  b, g, r = cv2.split(img)

  # Apply thresholding to each channel
  _, b = cv2.threshold(b, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
  _, g = cv2.threshold(g, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
  _, r = cv2.threshold(r, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

  # Merge the channels
  thresholded = cv2.merge([b, g, r])

  return thresholded

def predict(image_bytes, top_k=5):
    try:
        # Read the image from bytes
        image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
        # Your preprocessing steps here...
        
        image = thresholding(image)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = tf.image.resize(image, [256, 256])
        image /= 255.0
        
        # Replace these lines with your model loading and prediction code (WILL HAVE TO CHANGE THIS WITH OUR OWN MODEL ONCE FULLY TRAINED)
        feature_extractor = AutoImageProcessor.from_pretrained('google/vit-base-patch16-224')
        model = ViTForImageClassification.from_pretrained('google/vit-base-patch16-224')
        
        # Processing the image using the loaded model
        inputs = feature_extractor(images=image, return_tensors="pt")
        outputs = model(**inputs)
        logits = outputs.logits
        
        top_k_values, top_k_indices = torch.topk(logits, top_k)
        
        top_k_predictions = [{"class_idx": idx.item(), "score": score.item()} for idx, score in zip(top_k_indices[0], top_k_values[0])]
        for item in top_k_predictions:
            item["class_label"] = model.config.id2label[item["class_idx"]]
            
        for item in top_k_predictions:
            del(item["class_idx"])
        
        return top_k_predictions
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    
@app.get("/", status_code=200)
async def read_root():
    return {'message': 'Hello World'}

@app.post("/PillAI")
async def pill_predict(file: UploadFile = File(...)):
    try:
        extension = file.filename.split(".")[-1] in ("jpg", "jpeg", "png")
        if not extension:
            item = {"message": "Image format must be jpg, jpeg, or png!"}
            return JSONResponse(status_code=400, content=item)
        
        contents = await file.read()
        predictions = predict(contents)
        
        item = {"predictions": predictions, "filename": file.filename}
        return JSONResponse(status_code=200, content=item)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# CORS middleware setup
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
    uvicorn.run(app, host=PYTHON_HOST, port=PYTHON_PORT)
