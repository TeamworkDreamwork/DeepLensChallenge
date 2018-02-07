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
```python3 train.py --data-shape 512 --finetune 1 --end-epoch 20 --num-class 2 --class-names 'nike, adidas' --num-example 108```

```python3 train.py --data-shape 512 --resume 20 --end-epoch 40 --num-class 2 --class-names 'nike, adidas' --num-example 108```

#### Finetune
https://github.com/zhreshold/mxnet-ssd/blob/master/train/train_net.py#L249

### Evaluation
```python3 evaluate.py --epoch 5 --data-shape 512 --num-class 2 --class-names 'nike, adidas'```

### Manual Testing
```python demo.py --epoch 38 --images ./data/demo/adidasJacket3.jpg --thresh 0.25 --data-shape 512```

### Deploy Model
```python3 deploy.py --epoch 38 --num-class 2```

#### force_nms = True
https://github.com/zhreshold/mxnet-ssd/blob/master/deploy.py#L24

### Optimize Model
```python /opt/intel/deeplearning_deploymenttoolkit/deployment_tools/model_optimizer/model_optimizer_mxnet/mo_mxnet_converter.py --model-name deploy_ssd_resnet50_512 --models-dir . --output-dir . --img-format RGB --img-channels 3 --img-width 512 --img-height 512 --precision FP16 --fuse YES```
