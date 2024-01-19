from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv
import cv2
import torch
import numpy as np
from transformers import AutoImageProcessor, ViTForImageClassification, ViTModel, ViTImageProcessor
from PIL import Image
from torchvision.transforms import ToTensor
import io
from sklearn.preprocessing import LabelEncoder

load_dotenv()

PYTHON_PORT = int(os.getenv("PYTHON_PORT"))
PYTHON_HOST = os.getenv("PYTHON_HOST")

app = FastAPI()

# Load the label encoder
encoder = LabelEncoder()
encoder.classes_ = np.load('encoder/encoder.npy', allow_pickle=True)

# Load the pre-trained model and feature extractor
pretrained_model = ViTModel.from_pretrained('google/vit-base-patch16-224')
feature_extractor = ViTImageProcessor(
    image_size=224,
    do_resize=True,
    do_normalize=True,
    do_rescale=False,
    image_mean=[0.5, 0.5, 0.5],
    image_std=[0.5, 0.5, 0.5],
)

# Load the model weights
config = pretrained_model.config
config.num_labels = 2112  # Change this to the appropriate number of classes
model = ViTForImageClassification(config)
model.vit = pretrained_model
model.load_state_dict(torch.load('model/model_weights.pth', map_location=torch.device('cpu')))

model.eval()

def preprocess_image(contents):
    # Convert image bytes to PIL Image
    image = Image.open(io.BytesIO(contents))
    
    # Use the feature extractor directly
    inputs = feature_extractor(images=[image])
    image_tensor = inputs['pixel_values'][0]
    
    # Convert to tensor
    image_tensor = torch.tensor(image_tensor, dtype=torch.float32)
    
    return image_tensor


def predict(image_tensor, top_k=5):
    # Ensure the model is in evaluation mode
    model.eval()
    
    # Make prediction
    with torch.no_grad():
        outputs = model(pixel_values=image_tensor.unsqueeze(0))  # Add batch dimension
        logits = outputs.logits.numpy()
    
    # Get top k predictions and their probabilities
    predictions = np.argsort(logits, axis=1)[:, ::-1][:, :top_k]
    probabilities = np.sort(logits, axis=1)[:, ::-1][:, :top_k]

    # Decode predictions using the label encoder and create the result dictionary
    result = {}
    for i in range(top_k):
        class_name = encoder.inverse_transform([predictions[0][i]])[0]
        probability = probabilities[0][i]
        result[i + 1] = {'label': str(class_name), 'probability': float(probability)}

    return result



@app.get("/", status_code=200)
async def read_root():
    return {'message': 'Hello World'}

@app.post("/PillAI")
async def pill_predict(file: UploadFile = File(...), top_k: int = 5):
    try:
        extension = file.filename.split(".")[-1] in ("jpg", "jpeg", "png")
        if not extension:
            item = {"message": "Image format must be jpg, jpeg, or png!"}
            return JSONResponse(status_code=400, content=item)
        # Read image contents
        contents = await file.read()
        
        # Preprocess image
        image_tensor = preprocess_image(contents)
        
        # Make predictions
        predictions = predict(image_tensor, top_k)
        
        item = {"predictions": predictions, "filename": file.filename}
        return JSONResponse(status_code=200, content=item)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: HTTPException")

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
