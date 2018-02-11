const AWS = require("aws-sdk");
const s3 = new AWS.S3({"signatureVersion": "v4"});

const copyObject = (params, s3) => {
    return new Promise((resolve) => {
        var newKey = convertKey(params.Key);
        console.log(newKey);
        console.log(params);
        s3.copyObject({ Bucket: params.Bucket, CopySource: params.Bucket + '/' + params.Key, Key: newKey }, (err, data) => {
            if (err)
                console.error("Error copying S3 object: ", err, err.stack);
            else {
                console.log("Object copied successfully: ", data);
            }
        });
    })
}

const convertKey = (key) => {
    console.log(key);
    var withoutPrefix = key.substring(key.indexOf('/'));
    var withoutPrefixAndSuffix = withoutPrefix.substring(0, withoutPrefix.lastIndexOf('.'));
    return "ARCHIVE" + withoutPrefixAndSuffix + ".csv";
}

exports.handler = (event, context, callback) => {
    //console.log(JSON.stringify(event));
    var bucket = event.Records[0].s3.bucket.name;
    var key = event.Records[0].s3.object.key;
    copyObject({ Bucket: bucket, Key: key }, s3)
    .then((data) => {
        console.log("Successfully moved file");
        callback(null, 'Successfully moved file');
    })
    .catch((err) => {
        console.error("ERROR", err);
        callback("ERROR");
    });
};