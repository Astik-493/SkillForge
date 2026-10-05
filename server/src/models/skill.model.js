import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    proficiency: {
      type: Number,
      required: true,
      min: [1, 'Proficiency must be at least 1 (Beginner)'],
      max: [5, 'Proficiency cannot exceed 5 (Expert)']
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index to ensure a user cannot have duplicate skills
skillSchema.index({ user: 1, name: 1 }, { unique: true });

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
