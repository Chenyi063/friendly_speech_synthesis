# friendly_speech_synthesis

This repository provides code and procedures to synthesize friendly speech in Mandarin Chinese by manipulating acoustic features such as pitch, duration, and energy in neutral speech using the FastSpeech model. It utilizes the [PyTorch implementation of FastSpeech 2](https://github.com/ming024/FastSpeech2) by ming024 with some modifications.

## Corpus preparation

The neutral speech data in Chinese manarin is downloaed from the [AISHELL 3 dataset](https://www.aishelltech.com/aishell_3). Transcripts for each audio file are extracted from the transcript file downloaded along with the audio files. These transcripts are stored in LAB files, with each LAB file named identically to its corresponding audio file. Finally, each LAB file and its corresponding WAV file are stored together in the same directory, forming a corpus.

## Montreal Forced Aligner (MFA)

Before training the FastSpeech2 acoustic model, [Montreal Forced Alignment (MFA)](https://montreal-forced-aligner.readthedocs.io/en/latest/) is used to align the speech data. In the code, we will refer to the dictionary as `dictionary`, the acoustic model as `acoustic-model`, the g2p moel as `g2p`, and the corpus generated during the corpus preparation step as `corpus`.  The ~ symbol can be replaced with the name of the folder where the files are located.

1. create an environment for the alighner and activate it.
`conda create -n aligner -c conda-forge montreal-forced-aligner`
`conda activate aligner`

2. download the Chinese dictionary, G2P pretrained models from MFA, and train our own acoustic model using our dataset.
`mfa model download dictionary mandarin_pinyin`
`mfa model download acoustic mandarin_mfa`
`mfa train ~/corpus ~/dictionary ~/acoustic_mandarin` (the last part of command  is to specify the location where the acoustic model should be placed)

3. valiadte data strcuture for multi-speaker dataset
`mfa validate ~/corpus ~/dictionary ~/acoustic_model -t ~/temp` (we need the absolute path for 'temp')

4. generate pronunciations for OOV using g2p model and manually add these pronunciations to the dictionary
`mfa g2p ~/oovs.txt ~/g2p ~/output.txt`

5. generate textgrid files
`mfa align ~/corpus ~/dictionary ~/acoustic_model ~/output  -t ~/temp --no_textgrid_cleanup`

## train FastSpeech2 (FS2) acoustic model

After aligning speech data using MFA, we can train FS2 acoustic model using following steps. To utilize the FS2 model effectively, it is important to utilize a GPU. Specifically, for this project, the [Hábrók](https://wiki.hpc.rug.nl/habrok/start) GPU is employed. Before training the model, we need to prepare files by copying all the files of this repository to Hábrók and adding the coupus files.

1. preprocessing
`python3 preprocess.py ~/config/CN/preprocess.yaml`

2. train FS2 acoustic model
`python3 train.py -p ~/config/CN/preprocess1.yaml -m ~/config/CN/model1.yaml -t ~/config/CN/train1.yaml`

The training for the FS2 model with 600k steps took about 54 hours.

## synthesize audios 

To synthesize audios with trained FS2 acoustic model, follow the commands below. Given that it is a multi-speaker FS2 model, we also need to specify the voice to synthesize from voices used for training FS2 acousticmmdoel with parameter `--speaker_id `.

`python3 synthesize.py --text “今天上海的天气很好” --speaker_id 2 --restore_step 600000 --mode single -p ~/config/CN/preprocess1.yaml -m ~/config/CN/model1.yaml -t ~/config/CN/train1.yaml `

For this project, it is important to control pitch, duration and energy acoustic features to transition from a neutral speech to friendly speech. the control of these acoustic features acn be realized with parameters `--pitch_control`, `--duration_control`, `--energy_control`. 

`python3 synthesize.py --text “今天上海的天气很好” --speaker_id 2 --restore_step 600000 --mode single -p config/AISHELL3/preprocess.yaml -m config/AISHELL3/model.yaml -t config/AISHELL3/train.yaml --pitch_control 1.2 --duration_control 0.9 --energy_control 1`













