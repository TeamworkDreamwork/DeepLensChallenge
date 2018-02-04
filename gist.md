# Teamwork Dreamwork DeepLens Challenge
### Challenge
https://awsdeeplens.devpost.com

### MXNET Version
`pip install mxnet-cu80==0.12.0`

### Training Toolset
#### MXNET SSD Example
https://github.com/apache/incubator-mxnet/tree/master/example/ssd

#### Finetune
https://github.com/zhreshold/mxnet-ssd/blob/master/train/train_net.py#L249

#### force_nms = True
https://github.com/zhreshold/mxnet-ssd/blob/master/deploy.py#L24

### Build Dataset
```python tools/prepare_dataset.py --dataset pascal --year 2017 --set train --target ./data/train.lst```
```python tools/prepare_dataset.py --dataset pascal --year 2017 --set validate --target ./data/val.lst```

### Training
```python3 train.py --data-shape 512 --finetune 1 --end-epoch 20 --num-class 3 --class-names 'nike, nikeText, adidas' --num-example 108```
```python3 train.py --data-shape 512 --resume 20 --end-epoch 40 --num-class 3 --class-names 'nike, nikeText, adidas' --num-example 108```

### Evaluation
```python3 evaluate.py --epoch 5 --data-shape 512 --num-class 3 --class-names 'nike, nikeText, adidas'```

### Manual Testing
```python demo.py --epoch 38 --images ./data/demo/adidasJacket3.jpg --thresh 0.25 --data-shape 512```

### Deploy Model
```python3 deploy.py --epoch 38 --num-class 2```

### Optimize Model
```python /opt/intel/deeplearning_deploymenttoolkit/deployment_tools/model_optimizer/model_optimizer_mxnet/mo_mxnet_converter.py --model-name deploy_ssd_resnet50_512 --models-dir . --output-dir . --img-format RGB --img-channels 3 --img-width 512 --img-height 512 --precision FP16 --fuse YES```
