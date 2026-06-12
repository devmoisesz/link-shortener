import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
        }
    },
    {
        timestamps: true
    }
);

const UserSchema = model('User', userSchema);

async function create(name: string, email: string, password: string) {
    return await UserSchema.create({
        name, email, password
    });
}

async function findByEmail(email: string) {
    return await UserSchema.findOne({
        email
    })
}

export default {
    create,
    findByEmail
}