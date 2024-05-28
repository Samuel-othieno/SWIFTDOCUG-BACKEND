import Joi from "joi";

const profileSchema = Joi.object({
    first_name: Joi.string().min(3).max(20).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required().messages({
        'string.empty':'Please enter your first name',
        'any.required' : 'Please enter your first name'
    }),
    
    last_name: Joi.string().min(3).max(20).alphanum().required().messages({
        'string.empty':'Please enter your last name',
        'any.required' : 'Please enter your last name'
    }),

    date_of_birth: Joi.date().less('now').required().messages({
        'date.base':'Please enter your date of birth',
        'any.required' : 'Please enter your date of birth'
    }),

    nationality: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required().messages({
        'string.empty':'Please enter your nationality',
        'any.required' : 'Please enter your nationality'
    }),

    address: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required().messages({
        'string.empty':'Please enter your address',
        'any.required' : 'Please enter your address'
    }),
    
    
    gender: Joi.string().valid('MALE', 'FEMALE', 'PREFER_NOT_TO_SAY').required().messages({
        'string.empty': 'Please select your gender',
        'any.only': 'Please select a valid gender',
        'any.required':'Please select your gender'
    }),

    userId: Joi.number().required()
})

const schema = Joi.object({
    username: Joi.string().min(3).max(40).alphanum().required(),
    password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    role: Joi.string().required(),
    first_name: Joi.string().min(3).max(20).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required().messages({
        'string.empty':'Please enter your first name',
        'any.required' : 'Please enter your first name'
    }),
    
    last_name: Joi.string().min(3).max(20).alphanum().required().messages({
        'string.empty':'Please enter your last name',
        'any.required' : 'Please enter your last name'
    }),

    date_of_birth: Joi.date().less('now').required().messages({
        'date.base':'Please enter your date of birth',
        'any.required' : 'Please enter your date of birth'
    }),

    nationality: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required().messages({
        'string.empty':'Please enter your nationality',
        'any.required' : 'Please enter your nationality'
    }),

    address: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required().messages({
        'string.empty':'Please enter your address',
        'any.required' : 'Please enter your address'
    }),
    
    
    gender: Joi.string().valid('MALE', 'FEMALE', 'PREFER_NOT_TO_SAY').required().messages({
        'string.empty': 'Please select your gender',
        'any.only': 'Please select a valid gender',
        'any.required':'Please select your gender'
    }),

    medication: Joi.string().min(3).max(20).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required(),
    duration: Joi.string().min(3).max(20).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required(),
    notes: Joi.string().min(10).max(250).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required(),
    allergies: Joi.string().min(3).max(20).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required(),
    medical_Conditions: Joi.string().min(3).max(20).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required(),
    immunizations: Joi.string().min(3).max(20).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required(),
    family_history: Joi.string().min(4).max(500).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required(),

})


const prescriptionsSchema = Joi.object({
    medication: Joi.string().min(3).max(20).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required(),
    duration: Joi.number().integer().min(3).max(20).required(),
    notes: Joi.string().min(10).max(250).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required(),         
})

const medicalRecordsSchema = Joi.object({
    allergies: Joi.string().min(3).max(20).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required(),
    medical_Conditions: Joi.string().min(3).max(20).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required(),
    immunizations: Joi.string().min(3).max(20).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required(),
    family_history: Joi.string().min(4).max(500).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required(),
})


function validate(schema) {

    return (req, res, next) => {

        if (typeof req.body !== 'object' || req.body === null) {
            return res.json({error:'Request body is not an object or is undefined'});
        }


        const {error} = schema.validate(req.body, {abortEarly: false});

        if (error) {
            const errors = error.details.map(err=>{
                return {field: err.path[0], message: err.message};
            })

            return res.status(400).json(errors)
        } else {
            next()
        }
    }
}

export {
    validate,
    schema,
    profileSchema,
    prescriptionsSchema,
    medicalRecordsSchema
}