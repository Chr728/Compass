import gradio as gr
import librosa
import tensorflow as tf 
from huggingface_hub import from_pretrained_keras
from itertools import groupby
import numpy as np

model = from_pretrained_keras("CXDJY/snore_ai")

def load_audio_to_tensor(filename):
    audio, sampling_rate = librosa.load(filename, sr=None, mono=True)  # load audio and convert to mono
    wave = librosa.resample(audio, orig_sr=sampling_rate, target_sr=16000)  # resample to 16KHz
    rms = librosa.feature.rms(y=audio)[0]                           # get root mean square of audio
    volume = np.mean(rms)                                               # get volume of audio
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

def greet(name):
    wave, volume = load_audio_to_tensor(name)
    # power = sum(wave * 2) / len(wave)   # audio signal power
    # SNR = 3.5                           # signal-to-noise ratio
    # SNR_linear = 10 ** (SNR / 10)       # convert SNR to linear scale
    # noise_power = power / SNR_linear    # noise power

    # # add noise to audio to simulate environment
    # noise = np.random.normal(0, noise_power ** 0.5, wave.shape)  # generate noise
    # wave = (wave + noise) * 32768.0     # add noise to the audio signal
    tensor_wave = tf.convert_to_tensor(wave, dtype=tf.float32)  # convert to tensor
    min_wave = min(wave)  
    if len(wave) > 16000:
        sequence_stride = 16000
    else:
        sequence_stride = 16000-1

# create audio slices
    audio_slices = tf.keras.utils.timeseries_dataset_from_array(wave, wave, sequence_length=16000, sequence_stride=sequence_stride, batch_size=1)
    samples, index = audio_slices.as_numpy_iterator().next()   
    
    audio_slices = audio_slices.map(preprocess_mp3)
    audio_slices = audio_slices.batch(64)   

    # model = from_pretrained_keras("CXDJY/snore_ai")

    yhat = model.predict(audio_slices)
    yhat = [1 if prediction > 0.99 else 0 for prediction in yhat]
    yhat1 = [key for key, group in groupby(yhat)]
    return yhat1

iface = gr.Interface(fn=greet, inputs="audio", outputs="text")
iface.launch()