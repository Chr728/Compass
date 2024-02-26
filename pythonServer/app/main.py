from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv
import torch
import numpy as np
from transformers import AutoImageProcessor, ViTForImageClassification, ViTModel, ViTImageProcessor
from PIL import Image
import io
from sklearn.preprocessing import LabelEncoder
import librosa
import tensorflow as tf 
from huggingface_hub import from_pretrained_keras
from itertools import groupby
from pydub import AudioSegment

load_dotenv()

IS_LOCAL = os.getenv("IS_LOCAL")

if IS_LOCAL == 'true':
    PYTHON_PORT = int(os.getenv("PYTHON_PORT"))
else:
    PYTHON_PORT = int(os.getenv("PORT"))
PYTHON_HOST = os.getenv("PYTHON_HOST")

app = FastAPI()

# Load the label encoder
encoder = LabelEncoder()
encoder.classes_ = np.load('encoder/encoder.npy', allow_pickle=True)

# Load the pre-trained model and feature extractor
snoringModel = from_pretrained_keras("CXDJY/snore_ai")

def load_audio_to_tensor(file, type):
    # Convert mp3 to wav since librosa soundfile doesn't support mp3
    if type == "mp3":
        try:
            print(1)
            seg=AudioSegment.from_mp3(io.BytesIO(file))
        # Some mp3 files are actually in acc format which should be handled specifically
        except:
            print(1.2)
            seg = AudioSegment.from_file(io.BytesIO(file), format="aac")
        print(2)
        wavIO=io.BytesIO()
        print(3)
        seg.export(wavIO, format="wav")
        print(4)
        audio, sampling_rate = librosa.load(io.BytesIO(wavIO.getvalue()), sr=None, mono=True)
    else:
        audio, sampling_rate = librosa.load(io.BytesIO(file), sr=None, mono=True)  # load audio and convert to mono
    print(5)
    wave = librosa.resample(audio, orig_sr=sampling_rate, target_sr=16000)  # resample to 16KHz
    print(6)
    rms = librosa.feature.rms(y=audio)[0]                           # get root mean square of audio
    print(7)
    volume = np.mean(rms)                                             # get volume of audio
    print(8)
    return wave, volume

def preprocess_mp3(sample, index):
    sample = sample[0]
    sample = tf.cast(sample, tf.float32)
    zero_padding = tf.zeros([16000] - tf.shape(sample), dtype=tf.float32)
    wave = tf.concat([zero_padding, sample], 0)
    spectrogram = tf.signal.stft(wave, frame_length=320, frame_step=32)
    spectrogram = tf.abs(spectrogram)
    spectrogram = tf.expand_dims(spectrogram, axis=2)
    return spectrogram


pretrained_model = ViTModel.from_pretrained('pillIdentifierAI/pillIdentifier')
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

model.eval()

def preprocess_image(contents):
    # Convert image bytes to PIL Image
    image = Image.open(io.BytesIO(contents))
    
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
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
    

@app.post("/SnoringAI")
async def snoring_predict(file: UploadFile = File(...)):
    try:
        extension = file.filename.split(".")[-1] in ("mp3", "wav")
        
        if not extension:
            item = {"message": "Audio format must be mp3, wav!"}
            return JSONResponse(status_code=400, content=item)
        
        if file.filename.split(".")[-1] == "mp3":
            file = await file.read()
            wave, volume = load_audio_to_tensor(file, "mp3")
        else:
            file = await file.read()
            wave, volume = load_audio_to_tensor(file, "wav")
        # tensor_wave = tf.convert_to_tensor(wave, dtype=tf.float32)  # convert to tensor
        # min_wave = min(wave)  
        if len(wave) > 16000:
            sequence_stride = 16000
        else:
            sequence_stride = 16000-1

        # create audio slices
        audio_slices = tf.keras.utils.timeseries_dataset_from_array(wave, wave, sequence_length=16000, sequence_stride=sequence_stride, batch_size=1)
        # samples, index = audio_slices.as_numpy_iterator().next()   
    
        audio_slices = audio_slices.map(preprocess_mp3)
        audio_slices = audio_slices.batch(64)   

        yhat = snoringModel.predict(audio_slices)
        yhat = [1 if prediction > 0.99 else 0 for prediction in yhat]
        yhat1 = [key for key, group in groupby(yhat)]
        result = {"results": yhat1}
        return JSONResponse(status_code=200, content=result)
        
    except Exception as e:
        print(e)
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


