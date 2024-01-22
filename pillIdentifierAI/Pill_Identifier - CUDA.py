#!/usr/bin/env python
# coding: utf-8

# # Pill Identifier Machine Learning Model and API
# All pills and tablets have a unique combination of features that allow them to be identified. 
# These features are its color, its shape, and imprints made in front and/or at the back of the drug.
# The model aims to predict the name of an unknown pill/tablet based on these features.
# 
# This model will utilize `google/vit-base-patch16-224` for image classification.
# 
# The dataset is from the U.S. Department of Health's Computational Photography Project for Pill Identification (C3PI).

# # Imports, Declarations, and Globals

# In[1]:


import tensorflow as tf
import torch
import os
import requests
from PIL import Image
from torchvision.transforms import ToTensor
from tensorflow import keras
import matplotlib.pyplot as plt     # to plot charts
import numpy as np
import pandas as pd                 # for data manipulation
import cv2                          # for image processing
from io import BytesIO
from tabulate import tabulate       # to print pretty tables

# sklearn imports for metrics and dataset splitting
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.metrics import ConfusionMatrixDisplay
from sklearn.preprocessing import LabelEncoder

# keras imports for image preprocessing
from keras.preprocessing.image import img_to_array
from keras.preprocessing.image import ImageDataGenerator
from keras.preprocessing.image import load_img
from keras.utils import to_categorical

# huggingface imports for model building 
import torch.nn as nn
from transformers import ViTModel, ViTForImageClassification, TrainingArguments, Trainer, \
  default_data_collator, EarlyStoppingCallback, ViTConfig, AutoImageProcessor, ViTImageProcessor 
from transformers.modeling_outputs import SequenceClassifierOutput

# keras imports for early stoppage and model checkpointing
from torchvision.transforms import ToTensor, Resize
from torch.utils.data import Dataset, DataLoader
from torchvision.io import read_image

from datasets import load_dataset, load_metric, Features, ClassLabel, Array3D, Dataset
import datasets


# In[2]:


DATASET_URL = 'https://data.lhncbc.nlm.nih.gov/public/Pills/'
directory = "dataset"
img_height = 224
img_width = 224
batch_size = 64


# # Helper Functions

# In[3]:


# Function to convert an image file to a tensor
def image_to_tensor(image_file):
    image = Image.open(image_file)
    image = Resize((224, 224))(image)
    return ToTensor()(image)


# # Data Acquisition
# Retrieves the images from our dataset and stores them in memory.
# Corresponding labels are retrieved, as well.

# In[ ]:


# read the csv file with labels
csv_file = "table.csv"
df = pd.read_csv(csv_file)

# encode the labels
label_encoder = LabelEncoder()
df["encoded_label"] = label_encoder.fit_transform(df["name"])

# create a dataset from the dataframe
image_paths = df["rxnavImageFileName"].values
labels = df["encoded_label"].values
num_labels = len(df["encoded_label"].unique())
print("Number of labels:", num_labels)

dataset = tf.data.Dataset.from_tensor_slices((image_paths, labels))
dataset_df = pd.DataFrame(list(dataset.as_numpy_iterator()), columns=['image_paths', 'labels'])

# print the first 5 image paths and decoded labels
for image, label in dataset.take(5):
  print("Image:", image.numpy())
  print("Label:", label_encoder.inverse_transform([label.numpy()])[0])
  print()

# np.save('encoder/encoder.npy', label_encoder.classes_)


# In[5]:


def load_images(path, label):
  image = tf.io.read_file(directory + '/' + path)
  image = tf.image.decode_jpeg(image, channels=3)
  image = tf.image.resize(image, [256, 256])
  image /= 255.0 
  return image, label

dataset = dataset.map(load_images)


# In[ ]:


# display the first 9 images and their labels
plt.figure(figsize=(10, 10))
for i, (image, label) in enumerate(dataset.take(9)):
  ax = plt.subplot(3, 3, i + 1)
  plt.imshow(image)
  plt.title(label_encoder.inverse_transform([label.numpy()])[0])
  plt.axis("off")


# # Add datapoints to dataset

# In[7]:


excel_file = "directory_consumer_grade_images.xlsx"
df_xls = pd.read_excel(excel_file)

# encode the labels
df_xls["encoded_label"] = label_encoder.fit_transform(df_xls["Name"])

# Check for missing labels
missing_labels = df_xls['encoded_label'].isnull().sum()
print("Number of missing labels:", missing_labels)

# Remove data points without a label
df_xls = df_xls.dropna(subset=['encoded_label'])

# Check the number of labels again
print("Total number of labels after removing missing labels: ", len(df_xls["encoded_label"]))

# Combine old and new df
df_combined = pd.concat([df, df_xls])

# Check if the data is imbalanced
label_counts = df_combined['encoded_label'].value_counts()
print(label_counts)

# Check if the data is imbalanced
label_counts = df_combined['encoded_label'].value_counts()

# Plot the label counts
plt.figure(figsize=(10,6))
plt.hist(label_counts, bins=250, alpha=0.5, color='g')
plt.title('Distribution of Labels')
plt.xlabel('Number of Images per Label')
plt.ylabel('Number of Labels')
plt.grid(True)
plt.show()


# # Data Augmentation and Preprocessing
# Because each pill/tablet only has one picture, the data set in itself is not ideal.
# To improve the quality of the data set, and that of the model, we augment the data.
# We do this by transforming the image, mimicking how an actual user may take a picture.
# That is, the image can be brightened, resized, rotated, sheared, cropped, and etc. Other processes are also performed to improve training of the model such as splitting the data into a training set and testing set.

# In[ ]:


#Convert column into strings
dataset_df["image_paths"] = dataset_df["image_paths"].astype(str)
dataset_df["labels"] = dataset_df["labels"].astype(str)

print(dataset_df["image_paths"].head())

#Splitting dataset into 60/20/20
train_df, temp_df = train_test_split(dataset_df, test_size=0.4, random_state=42)
eval_df, test_df = train_test_split(temp_df, test_size=0.5, random_state=1337)

# Create the image data generator for the training set
imageTrain_data = ImageDataGenerator(
    rescale = 1./255.,
    rotation_range = 60,
    shear_range = 0.3,
    zoom_range = 0.5,
    vertical_flip = True,
    horizontal_flip = True,
    width_shift_range = 0.3,
    height_shift_range = 0.3,
    brightness_range=[0.5, 1.5],
    fill_mode="nearest",
)

train_generator = imageTrain_data.flow_from_dataframe(
    dataframe=train_df,
    directory=directory,
    target_size = (img_height, img_width),
    batch_size = batch_size,
    x_col = "image_paths",
    y_col = "labels",
    class_mode="categorical",
)

# Create the image data generator for the evaluation set
imageEval_data = ImageDataGenerator(rescale = 1./255.)


eval_generator = imageEval_data.flow_from_dataframe(
    dataframe=eval_df,
    directory=directory,
    target_size = (img_height, img_width),
    batch_size = batch_size,
    x_col = "image_paths",
    y_col = "labels",
    class_mode="categorical",
)


# Create the image data generator for the test set
imageTest_data = ImageDataGenerator(rescale = 1./255.)


test_generator = imageTest_data.flow_from_dataframe(
    dataframe=test_df,
    directory=directory,
    target_size = (img_height, img_width),
    batch_size = batch_size,
    x_col = "image_paths",
    y_col = "labels",
    class_mode="categorical",
)

#Display example of image augmentation
sample_dataframe = train_df.sample(n=1).reset_index(drop=True)
sample_generator = imageTrain_data.flow_from_dataframe(
    dataframe=sample_dataframe,
    directory=directory,
    target_size = (img_height, img_width),
    batch_size = batch_size,
    x_col = "image_paths",
    y_col = "labels",
    class_mode="categorical",
)

plt.figure(figsize=(12, 12))
for i in range (0, 15):
  ax = plt.subplot(5, 3, i + 1)
  for X_column, Y_column in sample_generator:
    plt.imshow(X_column[0])
    break
plt.tight_layout()
plt.show()


# # Filtering
# Using OpenCV, we filter out any artifacts (i.e. background, lens flares, graininess, etc.) and extract the features necessary for identification.

# In[ ]:


def thresholding(img, alpha=0.5):
    # Convert the image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Apply CLAHE to the grayscale image
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(2,2))
    gray_clahe = clahe.apply(gray)

    # Convert the grayscale image back to BGR
    img_clahe = cv2.cvtColor(gray_clahe, cv2.COLOR_GRAY2BGR)

    # Blend the CLAHE image with the original image
    result = cv2.addWeighted(img, alpha, img_clahe, 1 - alpha, 0)

    return result

def remove_background(image):
    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply a blur
    blur = cv2.GaussianBlur(gray, (5, 5), 0)

    # Threshold the image
    _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    # Filter out small contours based on area
    contours = [cnt for cnt in contours if cv2.contourArea(cnt) > 500]

    # Create an empty mask to store the result
    mask = np.zeros_like(thresh)

    # Draw the contours on the mask
    cv2.drawContours(mask, contours, -1, (255), thickness=cv2.FILLED)

    # Perform morphological operations
    kernel = np.ones((3,3),np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations = 2)
    mask = cv2.dilate(mask,kernel,iterations = 1)

    # Invert the mask
    mask = cv2.bitwise_not(mask)

    # Bitwise AND the mask and the original image
    res = cv2.bitwise_and(image, image, mask=mask)

    return res


# # Hyperparameter Search
# To ensure the best set of hyperparameters used by the model, we enable hyperparameter search prior to training the model. This exhaustively searches the best combination of hyperparameters to be used for training.
# 

# In[ ]:


# Converts the dataframe into a dataset
class ImageClassificationDataset(Dataset):
    def __init__(self, image_paths, labels):
        self.image_paths = image_paths
        self.labels = labels
        self.label_encoder = LabelEncoder()
        self.labels = self.label_encoder.fit_transform(self.labels)

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        if torch.is_tensor(idx):
            idx = idx.tolist()

        image_path = self.image_paths[idx]
        label = self.labels[idx]
        image = read_image(image_path)  # Open the image and convert it to a tensor
        image = Resize((224, 224), antialias=True)(image)  # Resize the image
        return {'pixel_values': image, 'labels': torch.tensor(label, dtype=torch.long)}


# In[ ]:


get_ipython().run_line_magic('', '')
def optuna_hp_space(trial):
    return {
        "learning_rate": trial.suggest_float("learning_rate", 1e-5, 5e-5, log=True),
        "per_device_train_batch_size": trial.suggest_categorical("per_device_train_batch_size", [16, 32, 64]),
        "weight_decay": trial.suggest_float("weight_decay", 0.0, 0.3),
    }

model_name = 'google/vit-base-patch16-224'
token = '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'             # Jan's personal access token
configuration = ViTConfig()

# Select only 100 rows from the training set
train_df = train_df.sample(n=100)

# Prepend the path to the dataset folder to each file path
train_df['image_paths'] = train_df['image_paths'].apply(lambda x: x if x.startswith('dataset') else os.path.join('dataset', x))

# Split data into a training set and an evaluation set
train_df, eval_df = train_test_split(train_df, test_size=0.2)  # Use 20% of your data for evaluation

# Reset the index of the DataFrame to avoid indexing errors
train_df = train_df.reset_index(drop=True)
eval_df = eval_df.reset_index(drop=True)

# Convert your images and labels to tensors
pixel_values = [image_to_tensor(image_file) for image_file in train_df['image_paths']]
labels = train_df['labels'].to_numpy()

# Create a dictionary with the pixel values and labels
train_data = {'pixel_values': pixel_values, 'labels': labels}

# Instantiate datasets
train_dataset = ImageClassificationDataset(train_df['image_paths'], train_df['labels'].to_numpy())
eval_dataset = ImageClassificationDataset(eval_df['image_paths'], eval_df['labels'].to_numpy())

training_args = TrainingArguments(
    output_dir='./results',
    gradient_accumulation_steps=1,      # prevents vanishing/exploding gradients
    evaluation_strategy="steps",    
    max_grad_norm=1.0,                  # prevents vanishing/exploding gradients
)


def model_init(trial):
    num_labels = len(np.unique(train_df['labels'].to_numpy()))
    configuration.num_labels = num_labels           # Set the number of output units to match the number of classes
    return ViTForImageClassification.from_pretrained(
        model_name,
        config=configuration,
        from_tf=bool(".ckpt" in model_name),
        cache_dir=model_name,                       # use cache to speed up model loading
        token=token,
        ignore_mismatched_sizes=True                # ignore image size mismatch errors
    )

trainer = Trainer(
    model_init=model_init,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
)


#Execute hyperparameter search
hypersearch = trainer.hyperparameter_search(
    direction="maximize",
    backend="optuna",
    hp_space=optuna_hp_space,
    n_trials=8, 
)


print(hypersearch)


# # Incremental Learning with Dataset Chunks
#  Explore the efficiency of incremental learning with 3.3TB dataset chunks. Optimize training by iteratively downloading, processing, and removing chunks for improved resource management.

# In[2]:


device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# read the xlsx file
xlsx_file = "./directory_consumer_grade_images.xlsx"
df = pd.read_excel(xlsx_file)

# create feature extractor to tokenize data
feature_extractor = ViTImageProcessor(
    image_size=224,
    do_resize=True,
    do_normalize=True,
    do_rescale=False,
    image_mean=[0.5, 0.5, 0.5],
    image_std=[0.5, 0.5, 0.5],
)

# Iterate over the third column and append to the list
image_label_mapping = {}

for index, row in df.iterrows():
    image_path = row.iloc[2]  
    label = row.iloc[4]  
    if not image_path.endswith('.WMV'):
        image_label_mapping[image_path] = label

# get the image paths and labels
image_paths = list(image_label_mapping.keys())
labels = list(image_label_mapping.values())

# encode the labels
label_encoder = LabelEncoder()
labels = label_encoder.fit_transform(labels)

# create a dataset from the dataframe
dataset = tf.data.Dataset.from_tensor_slices((image_paths, labels))
dataset_df = pd.DataFrame(list(dataset.as_numpy_iterator()), columns=['image_paths', 'labels'])

# print the first 5 image paths and decoded labels
for image, label in dataset.take(5):
  print("Image:", image.numpy())
  print("Label:", label_encoder.inverse_transform([label.numpy()])[0])
  print()



# In[3]:


# Split the dataset into training, validation, and test sets (60/20/20)
train_df, temp_df = train_test_split(dataset_df, test_size=0.4, random_state=42)
val_df, test_df = train_test_split(temp_df, test_size=0.5, random_state=42)

# Create TensorFlow datasets
train_dataset = tf.data.Dataset.from_tensor_slices((train_df['image_paths'].values, train_df['labels'].values))
val_dataset = tf.data.Dataset.from_tensor_slices((val_df['image_paths'].values, val_df['labels'].values))
test_dataset = tf.data.Dataset.from_tensor_slices((test_df['image_paths'].values, test_df['labels'].values))

# Shuffle and batch the datasets
train_dataset = train_dataset.shuffle(buffer_size=len(train_df)).batch(batch_size).prefetch(buffer_size=tf.data.AUTOTUNE)
val_dataset = val_dataset.batch(batch_size).prefetch(buffer_size=tf.data.AUTOTUNE)
test_dataset = test_dataset.batch(batch_size).prefetch(buffer_size=tf.data.AUTOTUNE)

# Load the first batch of data
first_batch = next(iter(train_dataset))

# Unpack the batch
image_paths, labels = first_batch

plt.figure(figsize=(15, 15))
for i in range(len(image_paths)):
    image_path_str = image_paths[i].numpy().decode('utf-8')
    image = Image.open(BytesIO(requests.get(DATASET_URL + image_path_str).content))
    ax = plt.subplot(8, 8, i + 1) 
    plt.imshow(image)
    plt.title(label_encoder.inverse_transform([labels[i].numpy()])[0])
    plt.axis("off")

plt.show()


# # Model Training
# We train the model using the best hyperparameters on the training set.

# In[ ]:


# Check if CUDA is available and set the device accordingly
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

class ViTForImageClassification(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.config = config
        # self.vit = ViTModel(config, add_pooling_layer=False)
        # self.classifier = nn.Linear(config.hidden_size, config.num_labels)
        self.vit = ViTModel(config, add_pooling_layer=False).to(device)                # Move model to Nvidia card
        self.classifier = nn.Linear(config.hidden_size, config.num_labels).to(device)  # Move model to Nvidia card

    def forward(self, pixel_values, labels):
        outputs = self.vit(pixel_values=pixel_values)
        logits = self.classifier(outputs.last_hidden_state[:, 0])
        loss = None
        if labels is not None:
            loss_fct = nn.CrossEntropyLoss()
            loss = loss_fct(logits, labels)
        return SequenceClassifierOutput(
            loss=loss,
            logits=logits,
            hidden_states=outputs.hidden_states,
            attentions=outputs.attentions,
        )
    

# compute accuracy
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    if isinstance(labels, int):
        labels = [labels]
    accuracy = load_metric("accuracy").compute(predictions=predictions, references=labels)
    print(f"Accuracy: {accuracy}")
    return accuracy
    
        
# create feature extractor to tokenize data
feature_extractor = ViTImageProcessor(
    image_size=224,
    do_resize=True,
    do_normalize=True,
    do_rescale=False,
    image_mean=[0.5, 0.5, 0.5],
    image_std=[0.5, 0.5, 0.5],
)


# Define a function to load and preprocess the images
def load_and_preprocess_images(example):
    # Load the image from the file
    image = Image.open('dataset/' + example['image_paths'])
    image = np.array(image, dtype=np.uint8)
    image = np.moveaxis(image, source=-1, destination=0)
    # Preprocess the image
    inputs = feature_extractor(images=[image])
    pixel_values = torch.tensor(inputs['pixel_values'][0], dtype=torch.float32).to(device)  # convert to tensor and move to device
    label = int(example['labels'])
    return {'pixel_values': pixel_values, 'labels': label}


# define a custom data collator
def data_collator(features):
    pixel_values = [torch.tensor(feature['pixel_values'], dtype=torch.float32).to(device) for feature in features]  # Move to device
    labels = [feature['labels'] for feature in features]
    pixel_values = torch.stack(pixel_values)
    return {'pixel_values': pixel_values, 'labels': torch.tensor(labels).to(device)}  # Move to device


num_classes = labels.max() + 1

# Define the features of the dataset
features = Features({
    'labels': ClassLabel(num_classes=num_classes),
    'img': Array3D(dtype="int64", shape=(3, 32, 32)),
    'pixel_values': Array3D(dtype="float32", shape=(3, 224, 224)),
})

# Generate lists of image paths and labels for training dataset
train_image_paths = train_df["image_paths"].tolist()
train_labels = train_df["labels"].tolist()

# Create a dictionary with the image paths and labels
train_dict = {'image_paths': train_image_paths, 'labels': train_labels}

# Create the dataset
train_dataset = Dataset.from_dict(train_dict)

# Apply the function to the dataset
train_dataset = train_dataset.map(load_and_preprocess_images)
train_dataset = train_dataset.remove_columns(['image_paths'])


# Repeat the same process for the evaluation and test datasets
eval_image_paths = eval_df["image_paths"].tolist()
eval_labels = eval_df["labels"].tolist()
eval_dict = {'image_paths': eval_image_paths, 'labels': eval_labels}
eval_dataset = Dataset.from_dict(eval_dict)
eval_dataset = eval_dataset.map(load_and_preprocess_images)
eval_dataset = eval_dataset.remove_columns(['image_paths'])


test_image_paths = test_df["image_paths"].tolist()
test_labels = test_df["labels"].tolist()
test_dict = {'image_paths': test_image_paths, 'labels': test_labels}
test_dataset = Dataset.from_dict(test_dict)
test_dataset = test_dataset.map(load_and_preprocess_images)
test_dataset = test_dataset.remove_columns(['image_paths'])


# Load the pre-trained model
pretrained_model = ViTModel.from_pretrained('google/vit-base-patch16-224')

# Define your custom model
config = pretrained_model.config
config.num_labels = num_labels
model = ViTForImageClassification(config)

# Copy the pre-trained weights to your custom model
model.vit = pretrained_model



early_stopping_callback = EarlyStoppingCallback(
    early_stopping_patience=10,  # Number of evaluations with no improvement after which training will be stopped.
    early_stopping_threshold=0.0  # Threshold for measuring the new optimum, to only focus on significant changes.
)


# create the training arguments
training_args = TrainingArguments(
    output_dir='./results',          # output directory
    num_train_epochs=50,              # total number of training epochs
    per_device_train_batch_size=16,  # batch size per device during training
    per_device_eval_batch_size=16,   # batch size for evaluation
    warmup_steps=75,                # number of warmup steps for learning rate scheduler
    weight_decay=0.018,               # strength of weight decay
    logging_dir='./logs',            # directory for storing logs
    logging_steps=10,
    logging_first_step=True,
    logging_strategy='steps',
    evaluation_strategy='epoch',
    eval_steps=10,  
    save_strategy='epoch',
    load_best_model_at_end=True,
    metric_for_best_model='accuracy',
    greater_is_better=True,
    learning_rate=3e-5,
    gradient_accumulation_steps=1,      # prevents vanishing/exploding gradients
    max_grad_norm=1.0,                  # prevents vanishing/exploding gradients
    # fp16=True                     # mixed precision training; enable if using nVidia graphics cards
)

class CustomTrainer(Trainer):
    def get_train_dataloader(self):
        return DataLoader(self.train_dataset, batch_size=self.args.train_batch_size, shuffle=True, collate_fn=self.data_collator)
    
    def compute_loss(self, model, inputs, return_outputs=False):
        # Move inputs to device
        for key, value in inputs.items():
            inputs[key] = value.to(device)

        outputs = model(**inputs)
        logits = outputs.logits

        labels = inputs["labels"]  # Get labels from inputs

        loss = torch.nn.functional.cross_entropy(logits, labels)
        return (loss, outputs) if return_outputs else loss
        
mainTrainer = CustomTrainer (
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    data_collator=data_collator,
    compute_metrics=compute_metrics,
    callbacks=[early_stopping_callback]  # Add the early stopping callback

)

# mainTrainer.train()
# model.save_pretrained('./saved_model')


# # Model Testing
# We test the model on the test set to validate training.

# In[ ]:


model.load_state_dict(torch.load('./saved_model/model_weights.pth'))


# In[ ]:


# Define a function to load and preprocess the images for testing
def load_and_preprocess_test_images(example):
    image = Image.open('dataset/' + example['image_paths'])
    image = np.array(image, dtype=np.uint8)
    image = np.moveaxis(image, source=-1, destination=0)
    inputs = feature_extractor(images=[image])
    pixel_values = torch.tensor(inputs['pixel_values'][0], dtype=torch.float32).to(device)
    label = int(example['labels'])
    return {'pixel_values': pixel_values, 'labels': label}

# Apply the function to the test dataset
test_dataset = Dataset.from_dict(test_dict)
test_dataset = test_dataset.map(load_and_preprocess_test_images)
test_dataset = test_dataset.remove_columns(['image_paths'])


# In[ ]:


# Set the model to evaluation mode
model.eval()

# Create a DataLoader for the test dataset
test_dataloader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False, collate_fn=data_collator)

# Lists to store predictions and true labels
all_predictions = []
all_labels = []
all_losses = []

# Iterate through the test dataset
for batch in test_dataloader:
    with torch.no_grad():
        # Forward pass
        inputs = batch['pixel_values']
        labels = batch['labels']
        outputs = model(pixel_values=inputs, labels=labels)
        logits = outputs.logits

        # Convert logits to predictions
        predictions = torch.argmax(logits, dim=1).cpu().numpy()

        loss = outputs.loss.item()

        # Append predictions and true labels to lists
        all_predictions.extend(predictions)
        all_labels.extend(labels.cpu().numpy())
        all_losses.append(loss)

# Convert lists to numpy arrays
all_predictions = np.array(all_predictions)
all_labels = np.array(all_labels)
all_losses = np.array(all_losses)


# In[ ]:


# Calculate accuracy and other metrics
accuracy = accuracy_score(all_labels, all_predictions)
precision, recall, fscore, _ = precision_recall_fscore_support(all_labels, all_predictions, average='weighted')
classification_report_str = classification_report(all_labels, all_predictions)

# Print or use the metrics as needed
print(f"Accuracy: {accuracy}")
print(f"Precision: {precision}")
print(f"Recall: {recall}")
print(f"F1 Score: {fscore}")
print("Classification Report:\n", tabulate([[''] + classification_report_str.split('\n')[0].split()] + [line.split() for line in classification_report_str.split('\n')[2:-5]], headers='firstrow', tablefmt='grid'))

plt.figure(figsize=(10, 5))
plt.subplot(1, 2, 1)
plt.plot(all_losses, label='Test Loss')
plt.xlabel('Batch')
plt.ylabel('Loss')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(all_labels, all_predictions, 'bo', markersize=3)
plt.xlabel('True Labels')
plt.ylabel('Predicted Labels')
plt.title('True vs Predicted Labels')
plt.show()


# In[ ]:


# # Evaluate the trained model on the eval dataset
# test_results = mainTrainer.evaluate(eval_dataset=test_dataset)

# epoch_accuracies = []
# epoch_test_loss = []

# for epoch in range(mainTrainer.args.num_train_epochs):
#     test_accuracy = test_results['eval_accuracy']
#     test_loss = test_results['eval_loss']
#     epoch_test_loss.append(test_loss)
#     epoch_accuracies.append(test_accuracy)
#     print(f"Epoch {epoch + 1} - Test Accuracy: {test_accuracy}")
#     print(f"Epoch {epoch + 1} - Test Loss: {test_loss}")

# # Plot accuracy per epoch
# plt.plot(range(1, mainTrainer.args.num_train_epochs + 1), epoch_accuracies, marker='o')
# plt.xlabel('Epochs')
# plt.ylabel('Accuracy')
# plt.title('Accuracy per Epoch')
# plt.show()

# # Plot loss per epoch
# plt.plot(range(1, mainTrainer.args.num_train_epochs + 1), epoch_test_loss, marker='o')
# plt.xlabel('Epochs')
# plt.ylabel('Loss')
# plt.title('Loss per Epoch')
# plt.show()


# # Save the Model
# We serialize the model for checkpointing and for later use.

# In[ ]:


#Save Directory
save_directory = "saved_model"

# Save the trained model
mainTrainer.save_model(save_directory)


# # Predicting using the base model
# Utilizing the base model, we predict the label of an image and produce up to five responses with their corresponding relevance scores.

# In[ ]:


# Replace this with your own path
path = "00002-3228-30_NLMIMAGE10_391E1C80.jpg"

def predict(path, top_k):
    # read the image using openCV
    image = cv2.imread(path)
    # applying the thresholding function for preprocessing
    bg1 = remove_background(image)
    thresh1 = thresholding(bg1)
    image = thresh1
    # openCV reads image in BGR, convert it to RGB for tensorflow
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) 
    # resize the image
    image = tf.image.resize(image, [256, 256])
    image /= 255.0 
    
    # This is to show the image after preprocessing. Saved this for debugging.
    # plt.figure(figsize=(10, 10))
    # plt.imshow(image)
    
    # ViTFeatureExtractor is deprecated (still work but will give warning). For transformer of version 5+, AutoImageProcessor is used.
    # load the model. Should be replaced with our own model later
    # model_directory = “our_model_dic”
    # feature_extractor = AutoImageProcessor.from_pretrained(model_directory)
    # model = ViTForImageClassification.from_pretrained(model_directory, return_dict=False)
     
    feature_extractor = AutoImageProcessor.from_pretrained('google/vit-base-patch16-224')
    model = ViTForImageClassification.from_pretrained('google/vit-base-patch16-224')
    
    inputs = feature_extractor(images=image, return_tensors="pt")
    outputs = model(**inputs)
    logits = outputs.logits
    
    # get the top five predictions
    top_k_values, top_k_indices = torch.topk(logits, top_k)

    # pack everything in a list 
    top_k_predictions = [{"class_idx": idx.item(), "score": score.item()} for idx, score in zip(top_k_indices[0], top_k_values[0])]
    for item in top_k_predictions:
        item["class_label"] = model.config.id2label[item["class_idx"]]
        
    for item in top_k_predictions:
        del(item["class_idx"])
    
    return top_k_predictions 
   

top_k_predictions = predict(path, 5)

# print the five top predictions and the score they have
for prediction in top_k_predictions:
    score = prediction["score"]
    class_label = prediction["class_label"]
    print(f"Predicted Class: {class_label}, Score: {score}")

# check the whole list
print()
print(top_k_predictions)


# # Predicting using the saved model
# Utilizing the trained model, we predict the label of an image and produce up to five responses with their corresponding relevance scores.

# In[ ]:


# Replace this with your own path
path = "00002-3228-30_NLMIMAGE10_391E1C80.jpg"

def local_predict(path, k):
    # First initialized the customized model and the classes that will be used in preprocessing:
    # Check if CUDA is available and set the device accordingly
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    class ViTForImageClassification(nn.Module):
        def __init__(self, config):
            super().__init__()
            self.config = config
            # self.vit = ViTModel(config, add_pooling_layer=False)
            # self.classifier = nn.Linear(config.hidden_size, config.num_labels)
            self.vit = ViTModel(config, add_pooling_layer=False).to(device)                # Move model to Nvidia card
            self.classifier = nn.Linear(config.hidden_size, config.num_labels).to(device)  # Move model to Nvidia card

        def forward(self, pixel_values, labels):
            outputs = self.vit(pixel_values=pixel_values)
            logits = self.classifier(outputs.last_hidden_state[:, 0])
            loss = None
            if labels is not None:
                loss_fct = nn.CrossEntropyLoss()
                loss = loss_fct(logits, labels)
            return SequenceClassifierOutput(
                loss=loss,
                logits=logits,
                hidden_states=outputs.hidden_states,
                attentions=outputs.attentions,
            )
    

    # compute accuracy
    def compute_metrics(eval_pred):
        logits, labels = eval_pred
        predictions = np.argmax(logits, axis=-1)
        if isinstance(labels, int):
            labels = [labels]
        accuracy = load_metric("accuracy").compute(predictions=predictions, references=labels)
        print(f"Accuracy: {accuracy}")
        return accuracy

        
    # create feature extractor to tokenize data
    feature_extractor = ViTImageProcessor(
        image_size=224,
        do_resize=True,
        do_normalize=True,
        do_rescale=False,
        image_mean=[0.5, 0.5, 0.5],
        image_std=[0.5, 0.5, 0.5],
    )


    # define a custom data collator
    def data_collator(features):
        pixel_values = [torch.tensor(feature['pixel_values'], dtype=torch.float32).to(device) for feature in features]  # Move to device
        labels = [feature['labels'] for feature in features]
        pixel_values = torch.stack(pixel_values)
        return {'pixel_values': pixel_values, 'labels': torch.tensor(labels).to(device)}  # Move to device

    # num_classes = labels.max() + 1
    num_classes = 2113


    # Define the features of the dataset
    features = Features({
        'labels': ClassLabel(num_classes=num_classes),
        'img': Array3D(dtype="int64", shape=(3, 32, 32)),
        'pixel_values': Array3D(dtype="float32", shape=(3, 224, 224)),
    })


    train_dataset = Dataset.from_dict({'pixel_values': 'pixel_values', 'labels': 'label6789101'})


    # Load the pre-trained model
    pretrained_model = ViTModel.from_pretrained('google/vit-base-patch16-224')

    # Define your custom model
    config = pretrained_model.config
    config.num_labels = 2112
    model = ViTForImageClassification(config)

    # Copy the pre-trained weights to your custom model
    model.vit = pretrained_model

    model.load_state_dict(torch.load('./saved_model/model_weights.pth'))


    early_stopping_callback = EarlyStoppingCallback(
        early_stopping_patience=10,  # Number of evaluations with no improvement after which training will be stopped.
        early_stopping_threshold=0.0  # Threshold for measuring the new optimum, to only focus on significant changes.
    )


    # create the training arguments
    training_args = TrainingArguments(
        output_dir='./results',          # output directory
        num_train_epochs=50,              # total number of training epochs
        per_device_train_batch_size=16,  # batch size per device during training
        per_device_eval_batch_size=16,   # batch size for evaluation
        warmup_steps=75,                # number of warmup steps for learning rate scheduler
        weight_decay=0.018,               # strength of weight decay
        logging_dir='./logs',            # directory for storing logs
        logging_steps=10,
        logging_first_step=True,
        logging_strategy='steps',
        evaluation_strategy='epoch',
        eval_steps=10,  
        save_strategy='epoch',
        load_best_model_at_end=True,
        metric_for_best_model='accuracy',
        greater_is_better=True,
        learning_rate=3e-5,
        gradient_accumulation_steps=1,      # prevents vanishing/exploding gradients
        max_grad_norm=1.0,                  # prevents vanishing/exploding gradients
        # fp16=True                     # mixed precision training; enable if using nVidia graphics cards
    )

    class CustomTrainer(Trainer):
        def get_train_dataloader(self):
            return DataLoader(self.train_dataset, batch_size=self.args.train_batch_size, shuffle=True, collate_fn=self.data_collator)

        def compute_loss(self, model, inputs, return_outputs=False):
            # Move inputs to device
            for key, value in inputs.items():
                inputs[key] = value.to(device)

            outputs = model(**inputs)
            logits = outputs.logits

            labels = inputs["labels"]  # Get labels from inputs

            loss = torch.nn.functional.cross_entropy(logits, labels)
            return (loss, outputs) if return_outputs else loss
        
    mainTrainer = CustomTrainer (
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=train_dataset,
        data_collator=data_collator,
        compute_metrics=compute_metrics,
        callbacks=[early_stopping_callback]  # Add the early stopping callback

    )

#     print('done')
    
    # Second preprocess the input:
    # OpenCV follows BGR convention and PIL follows RGB color convention
    def load_and_preprocess_user_input(example):
#         thresholding(image) not used for now cause it will make the prediction worse      
        image = Image.open(path)
        image = np.array(image, dtype=np.uint8)
        image = np.moveaxis(image, source=-1, destination=0)
        inputs = feature_extractor(images=[image])
        pixel_values = torch.tensor(inputs['pixel_values'][0], dtype=torch.float32).to(device)  # convert to tensor and move to device
        label = example['labels']
        return {'pixel_values': pixel_values, 'labels': label}
    
    # Create the pandas DataFrame using user input. The lable is a random number, won't be used so can be any value.
    user_data = [[path, 987]]
 
    # Create the user input pandas DataFrame
    user_df = pd.DataFrame(user_data, columns=['image_paths', 'labels'])

    image_paths = user_df['image_paths'].values
    labels = user_df["labels"].values
    
    # Transfer the user input into the object that can be accepted by the model
    user_dataset = tf.data.Dataset.from_tensor_slices((image_paths, labels))
    user_dataset_df = pd.DataFrame(list(user_dataset.as_numpy_iterator()), columns=['image_paths', 'labels'])
 
    user_test_image_paths = user_dataset_df["image_paths"].tolist()
    user_test_labels = user_dataset_df["labels"].tolist()
    user_test_dict = {'image_paths': user_test_image_paths, 'labels': user_test_labels}
    user_test_dataset = Dataset.from_dict(user_test_dict)
    user_test_dataset = user_test_dataset.map(load_and_preprocess_user_input)
    user_test_dataset = user_test_dataset.remove_columns(['image_paths'])
    
    # Third use the model to predict:
    outputs = mainTrainer.predict(user_test_dataset)
    
    # Fourth use the saved encoder to decode the predictions
    y_pred = np.argsort(outputs.predictions, axis=1)[:, ::-1][:, :5]
    encoder = LabelEncoder()
    encoder.classes_ = np.load('encoder/encoder.npy', allow_pickle=True)
    
    # Fifth return the list containing top k possibilities
    result={}
    i = 0
    while i < k:
        result[i+1] = encoder.inverse_transform([y_pred[0][i]])[0]
#         print('Rank '+ str(i+1) + ' possibility of the pill: ' + encoder.inverse_transform([y_pred[0][i]])[0])
        i += 1
    return result

results = local_predict(path, 5)
print(results)


# In[ ]:


# Check if CUDA is available and set the device accordingly
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

class ViTForImageClassification(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.config = config
        # self.vit = ViTModel(config, add_pooling_layer=False)
        # self.classifier = nn.Linear(config.hidden_size, config.num_labels)
        self.vit = ViTModel(config, add_pooling_layer=False).to(device)                # Move model to Nvidia card
        self.classifier = nn.Linear(config.hidden_size, config.num_labels).to(device)  # Move model to Nvidia card

    def forward(self, pixel_values, labels):
        outputs = self.vit(pixel_values=pixel_values)
        logits = self.classifier(outputs.last_hidden_state[:, 0])
        loss = None
        if labels is not None:
            loss_fct = nn.CrossEntropyLoss()
            loss = loss_fct(logits, labels)
        return SequenceClassifierOutput(
            loss=loss,
            logits=logits,
            hidden_states=outputs.hidden_states,
            attentions=outputs.attentions,
        )
    

# compute accuracy
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    if isinstance(labels, int):
        labels = [labels]
    accuracy = load_metric("accuracy").compute(predictions=predictions, references=labels)
    print(f"Accuracy: {accuracy}")
    return accuracy
    
        
# create feature extractor to tokenize data
feature_extractor = ViTImageProcessor(
    image_size=224,
    do_resize=True,
    do_normalize=True,
    do_rescale=False,
    image_mean=[0.5, 0.5, 0.5],
    image_std=[0.5, 0.5, 0.5],
)


# Define a function to load and preprocess the images
# def load_and_preprocess_images(example):
#     # Load the image from the file
#     image = Image.open('dataset/' + example['image_paths'])
#     image = np.array(image, dtype=np.uint8)
#     image = np.moveaxis(image, source=-1, destination=0)
#     # Preprocess the image
#     inputs = feature_extractor(images=[image])
#     pixel_values = torch.tensor(inputs['pixel_values'][0], dtype=torch.float32).to(device)  # convert to tensor and move to device
#     label = int(example['labels'])
#     return {'pixel_values': pixel_values, 'labels': label}


# define a custom data collator
def data_collator(features):
    pixel_values = [torch.tensor(feature['pixel_values'], dtype=torch.float32).to(device) for feature in features]  # Move to device
    labels = [feature['labels'] for feature in features]
    pixel_values = torch.stack(pixel_values)
    return {'pixel_values': pixel_values, 'labels': torch.tensor(labels).to(device)}  # Move to device

# num_classes = labels.max() + 1
num_classes = 2113


# Define the features of the dataset
features = Features({
    'labels': ClassLabel(num_classes=num_classes),
    'img': Array3D(dtype="int64", shape=(3, 32, 32)),
    'pixel_values': Array3D(dtype="float32", shape=(3, 224, 224)),
})

# # Generate lists of image paths and labels for training dataset
# train_image_paths = train_df["image_paths"].tolist()
# train_labels = train_df["labels"].tolist()

# # Create a dictionary with the image paths and labels
# train_dict = {'image_paths': train_image_paths, 'labels': train_labels}

# # Create the dataset
# train_dataset = Dataset.from_dict(train_dict)

# # Apply the function to the dataset
# train_dataset = train_dataset.map(load_and_preprocess_images)
# train_dataset = train_dataset.remove_columns(['image_paths'])


# # Repeat the same process for the evaluation and test datasets
# eval_image_paths = eval_df["image_paths"].tolist()
# eval_labels = eval_df["labels"].tolist()
# eval_dict = {'image_paths': eval_image_paths, 'labels': eval_labels}
# eval_dataset = Dataset.from_dict(eval_dict)
# eval_dataset = eval_dataset.map(load_and_preprocess_images)
# eval_dataset = eval_dataset.remove_columns(['image_paths'])


# test_image_paths = test_df["image_paths"].tolist()
# test_labels = test_df["labels"].tolist()
# test_dict = {'image_paths': test_image_paths, 'labels': test_labels}
# test_dataset = Dataset.from_dict(test_dict)
# test_dataset = test_dataset.map(load_and_preprocess_images)
# test_dataset = test_dataset.remove_columns(['image_paths'])

train_dataset = Dataset.from_dict({'pixel_values': 'pixel_values', 'labels': 'label6789101'})


# Load the pre-trained model
pretrained_model = ViTModel.from_pretrained('google/vit-base-patch16-224')

# Define your custom model
config = pretrained_model.config
config.num_labels = 2112
model = ViTForImageClassification(config)

# Copy the pre-trained weights to your custom model
model.vit = pretrained_model

model.load_state_dict(torch.load('./saved_model/model_weights.pth'))


early_stopping_callback = EarlyStoppingCallback(
    early_stopping_patience=10,  # Number of evaluations with no improvement after which training will be stopped.
    early_stopping_threshold=0.0  # Threshold for measuring the new optimum, to only focus on significant changes.
)


# create the training arguments
training_args = TrainingArguments(
    output_dir='./results',          # output directory
    num_train_epochs=50,              # total number of training epochs
    per_device_train_batch_size=16,  # batch size per device during training
    per_device_eval_batch_size=16,   # batch size for evaluation
    warmup_steps=75,                # number of warmup steps for learning rate scheduler
    weight_decay=0.018,               # strength of weight decay
    logging_dir='./logs',            # directory for storing logs
    logging_steps=10,
    logging_first_step=True,
    logging_strategy='steps',
    evaluation_strategy='epoch',
    eval_steps=10,  
    save_strategy='epoch',
    load_best_model_at_end=True,
    metric_for_best_model='accuracy',
    greater_is_better=True,
    learning_rate=3e-5,
    gradient_accumulation_steps=1,      # prevents vanishing/exploding gradients
    max_grad_norm=1.0,                  # prevents vanishing/exploding gradients
    # fp16=True                     # mixed precision training; enable if using nVidia graphics cards
)

class CustomTrainer(Trainer):
    def get_train_dataloader(self):
        return DataLoader(self.train_dataset, batch_size=self.args.train_batch_size, shuffle=True, collate_fn=self.data_collator)
    
    def compute_loss(self, model, inputs, return_outputs=False):
        # Move inputs to device
        for key, value in inputs.items():
            inputs[key] = value.to(device)

        outputs = model(**inputs)
        logits = outputs.logits

        labels = inputs["labels"]  # Get labels from inputs

        loss = torch.nn.functional.cross_entropy(logits, labels)
        return (loss, outputs) if return_outputs else loss
        
mainTrainer = CustomTrainer (
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=train_dataset,
    data_collator=data_collator,
    compute_metrics=compute_metrics,
    callbacks=[early_stopping_callback]  # Add the early stopping callback

)

print('done')


# In[ ]:


# OpenCV follows BGR convention and PIL follows RGB color convention
def load_and_preprocess_images2(example):
#     image = cv2.imread('00002-3228-30_NLMIMAGE10_391E1C80.jpg')
    # applying the thresholding function for preprocessing
#     image = thresholding(image)
    # openCV reads image in BGR, convert it to RGB for tensorflow
#     image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) 
#     image = tf.image.resize(image, [256, 256])
#     image /= 255.0 
    image = Image.open('00002-3228-30_NLMIMAGE10_391E1C80.jpg')
    image = np.array(image, dtype=np.uint8)
    image = np.moveaxis(image, source=-1, destination=0)
    # Preprocess the image
    inputs = feature_extractor(images=[image])
    pixel_values = torch.tensor(inputs['pixel_values'][0], dtype=torch.float32).to(device)  # convert to tensor and move to device
    label = example['labels']
    return {'pixel_values': pixel_values, 'labels': label}


# Create the pandas DataFrame
user_data = [['00002-3228-30_NLMIMAGE10_391E1C80.jpg', 987]]
 
# Create the pandas DataFrame
user_df = pd.DataFrame(user_data, columns=['image_paths', 'labels'])

image_paths = user_df['image_paths'].values
labels = user_df["labels"].values

user_dataset = tf.data.Dataset.from_tensor_slices((image_paths, labels))
user_dataset_df = pd.DataFrame(list(user_dataset.as_numpy_iterator()), columns=['image_paths', 'labels'])
 

user_test_image_paths = user_dataset_df["image_paths"].tolist()
user_test_labels = user_dataset_df["labels"].tolist()
user_test_dict = {'image_paths': user_test_image_paths, 'labels': user_test_labels}
user_test_dataset = Dataset.from_dict(user_test_dict)
user_test_dataset = user_test_dataset.map(load_and_preprocess_images2)
user_test_dataset = user_test_dataset.remove_columns(['image_paths'])
print(user_test_dataset)

# test_dict2 = {'pixel_values': pixel_values, 'labels': 137}

# test_dict2 = {'image_paths': '00002-3228-30_NLMIMAGE10_391E1C80.jpg', 'labels': 137}
# test_dataset2 = datasets.DatasetDict(test_dict2)
# test_dataset2 = Dataset.from_dict(test_dict2)
# test_dataset2 = test_dataset2.map(load_and_preprocess_images2)


# In[ ]:


outputs = mainTrainer.predict(user_test_dataset)


# In[ ]:


# y_pred = outputs.predictions.argmax(1)
y_pred = np.argsort(outputs.predictions, axis=1)[:, ::-1][:, :5]
encoder = LabelEncoder()
encoder.classes_ = np.load('encoder/encoder.npy', allow_pickle=True)
print(y_pred[0][4])
top_5 = y_pred[0]
i = 0
result={}
while i < 5:
    result[i+1] = encoder.inverse_transform([y_pred[0][i]])[0]
    print('Rank ' + str(i+1) + ' possibility of the pill: ' + str(encoder.inverse_transform([y_pred[0][i]])[0]))
    i += 1
# label_encoder.inverse_transform([y_pred[0]])[0]
# print(outputs.predictions)
print(result)
print(outputs)


# In[ ]:




