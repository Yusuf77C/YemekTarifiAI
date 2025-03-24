import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  ad: string;
  soyad: string;
  diyetTercihleri: string[];
  karsilastirmaYontemi: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email adresi zorunludur'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Şifre zorunludur'],
    minlength: 6,
    select: false
  },
  ad: {
    type: String,
    required: [true, 'Ad zorunludur'],
    trim: true
  },
  soyad: {
    type: String,
    required: [true, 'Soyad zorunludur'],
    trim: true
  },
  diyetTercihleri: [{
    type: String,
    enum: ['vejetaryen', 'vegan', 'glutensiz', 'keto', 'paleo']
  }]
}, {
  timestamps: true
});

// Şifre hashleme middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Şifre karşılaştırma metodu
userSchema.methods.karsilastirmaYontemi = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema); 