const secret = 'mySecret'
const crypto = require('crypto')



module.exports.hashPassword  = (plainText) =>{
    const hash = crypto
    .createHmac('sha256',secret)
    .update(plainText)
    .digest('hex');

    return hash;
}