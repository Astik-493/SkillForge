import mongoose from 'mongoose';
import { SUPPORTED_ROLES } from '../config/roleRequirements.js';

const careerGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true // Ensures each user has only one active career goal
    },
    targetRole: {
      type: String,
      required: true,
      trim: true,
      enum: {
        values: SUPPORTED_ROLES,
        message: '{VALUE} is not a supported target role'
      }
    }
  },
  {
    timestamps: true
  }
);

const CareerGoal = mongoose.model('CareerGoal', careerGoalSchema);

export default CareerGoal;
