import mongoose from 'mongoose';

//Middleware to validate the object id
const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404);
        throw new Error('Invalid Object Id');
    }
    next();
};

export default validateObjectId;