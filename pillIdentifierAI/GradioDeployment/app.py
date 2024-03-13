import gradio as gr
import torch
import numpy as np
from transformers import ViTForImageClassification, ViTModel, ViTImageProcessor
from PIL import Image
import PIL
import io
from sklearn.preprocessing import LabelEncoder
import json

def greet(name):
    return "Hello " + name + "!!"


async def test2(file, top_k: int = 5):
    image_tensor = preprocess_image(file)
        
        # Make predictions
    predictions = predict(image_tensor, top_k)
        
    item = {"predictions": predictions}
    return json.dumps(item)

encoder = LabelEncoder()
encoder.classes_ = np.load('encoder.npy', allow_pickle=True)

pretrained_model = ViTModel.from_pretrained('pillIdentifierAI/pillIdentifier')
feature_extractor = ViTImageProcessor(
    image_size=224,
    do_resize=True,
    do_normalize=True,
    do_rescale=False,
    image_mean=[0.5, 0.5, 0.5],
    image_std=[0.5, 0.5, 0.5],
)


config = pretrained_model.config
config.num_labels = 2112  # Change this to the appropriate number of classes
model = ViTForImageClassification(config)
model.vit = pretrained_model

model.eval()

# def preprocess_image(contents):
def preprocess_image(image):
    image = Image.fromarray(np.uint8(image))
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

iface = gr.Interface(fn=test2, inputs="image", outputs="text")
iface.launch(share=True)