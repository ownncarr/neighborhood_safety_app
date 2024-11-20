const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
    },
    role: {
        type: String,
        enum: ['resident', 'admin', 'governing-body'],
        default: 'resident'
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Check if the model is already compiled, and if not, compile it
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
