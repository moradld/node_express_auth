import Joi from "joi";
import { createHmac } from 'crypto';
const signupSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: { allow: ['com', 'net'] },
    }),
  password: Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'))
    .messages({
      'string.pattern.base': 'Password must be at least 8 characters long, and include an uppercase letter, a lowercase letter, and a number.',
    }),
});
const signinSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: { allow: ['com', 'net'] },
    }),
  password: Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'))
    .messages({
      'string.pattern.base': 'Password must be at least 8 characters long, and include an uppercase letter, a lowercase letter, and a number.',
    }),
});

const hmacProcess = (value, key)=>{
    const result = createHmac('sha256',key).update(value).digest('hex');
    return result;
}


export {signupSchema, signinSchema, hmacProcess };
