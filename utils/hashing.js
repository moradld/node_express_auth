import {compare, hash} from 'bcryptjs';

const doHash = (value, saltValue)=>{
    const result = hash(value, saltValue);
    return result;
}
const doHashValidation = (value, hashedValue)=>{
    const result = compare(value, hashedValue);
    return result;
}
export {doHash, doHashValidation};