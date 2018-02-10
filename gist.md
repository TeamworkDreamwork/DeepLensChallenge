# Model Training
### MXNET Version
For training, we standardized on mxnet 0.12.0.  In addition to installing this version on the notebook instance, we also needed to upgrade mxnet on the DeepLens device.
`pip install mxnet-cu80==0.12.0`

### Training Toolset
#### MXNET SSD Example
Our primary source of information on how to train an object detection model was this [mxnet example](https://github.com/apache/incubator-mxnet/tree/master/example/ssd).

### Build Dataset
To build the dataset, we used a total 123 images from Google.  108 were used in our training set, and 15 were for our validation set.  We used [LabelImg](https://github.com/tzutalin/labelImg) to annotate the images and save them in the PASCAL VOC format.  Finally, we used [prepare_dataset.py](https://github.com/apache/incubator-mxnet/blob/master/example/ssd/tools/prepare_dataset.py) to convert the images into a format that mxnet recognizes, [recordIO](https://mxnet.incubator.apache.org/architecture/note_data_loading.html).

```python tools/prepare_dataset.py --dataset pascal --year 2017 --set train --target ./data/train.lst```

```python tools/prepare_dataset.py --dataset pascal --year 2017 --set validate --target ./data/val.lst```

### Training
For model training, we used the pretrained [Resnet-50 model](https://github.com/zhreshold/mxnet-ssd/releases/download/v0.6/resnet50_ssd_512_voc0712_trainval.zip).  Using the pretrained model significantly sped up the training process as we did not need to start from scratch.  Resnet-50 was selected because it is what the example ssd project uses for the demo script.  

#### Finetune
To start the training, we used the finetune setting to take advantage of the existing pretrained model.

```python3 train.py --data-shape 512 --finetune 1 --end-epoch 20 --num-class 2 --class-names 'nike, adidas' --num-example 108```

The ssd example in mxnet didn't work with the finetuning process right out of the box.  There were compatibility issues with the pretrained model, so we adopted some code from another [ssd implementation](https://github.com/zhreshold/mxnet-ssd/blob/master/train/train_net.py#L249) that strips out layers that mismatch the parameters we are using.

#### Resume
Depending on how well the initial finetuning went, we would also sometimes resume training to try and increase the accuracy of the model.  This process can be repeated many times, though after a point, it no longer provides value as the model becomes overfitted.

```python3 train.py --data-shape 512 --resume 20 --end-epoch 40 --num-class 2 --class-names 'nike, adidas' --num-example 108```

### Evaluation
We would use the following script to determine the quality of the trained model, and also determine if additional training was required.

```python3 evaluate.py --epoch 20 --data-shape 512 --num-class 2 --class-names 'nike, adidas'```

### Manual Testing
In addition, we spot checked the models on a variety of different sample files.

```python demo.py --epoch 38 --images ./data/demo/adidasJacket3.jpg --thresh 0.25 --data-shape 512```

### Deploy Model
Once a model was determined to be of sufficient quality to deploy on the DeepLens, we would go through optimization steps.

```python3 deploy.py --epoch 38 --num-class 2```

#### force_nms = True
Similar to the compatibility issue with the finetuning, we had to enable force_nms to successfully deploy the model.  The code to accomplish this is from the same [repository](https://github.com/zhreshold/mxnet-ssd/blob/master/deploy.py#L24) as the finetuning code.

### Optimize Model
After successfully deploying the model, we would then run the model through the Intel model optimizer to create the artifacts that will be deployed to the DeepLens.

```python /opt/intel/deeplearning_deploymenttoolkit/deployment_tools/model_optimizer/model_optimizer_mxnet/mo_mxnet_converter.py --model-name deploy_ssd_resnet50_512 --models-dir . --output-dir . --img-format RGB --img-channels 3 --img-width 512 --img-height 512 --precision FP16 --fuse YES```
