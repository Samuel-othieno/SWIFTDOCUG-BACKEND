import Joi from "joi";

const userSchema = Joi.object({
    username: Joi.string().min(3).max(40).alphanum().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    role: Joi.string().required()
})

const profileSchema = Joi.object({
    first_name: Joi.string().min(3).max(20).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required(),
    last_name: Joi.string().min(3).max(20).alphanum().required(),
    date_of_birth: Joi.date().less('now').required(),
    nationality: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required(),
    address: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z0-9 ,.!;:\'\"-]+$')).required()

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


        const result = schema.validate(req.body)

        if (result.error) {
            return res.status(400).json(result.error)
        } else {
            next()
        }
    }
}

export {
    validate,
    userSchema,
    profileSchema,
    prescriptionsSchema,
    medicalRecordsSchema
}