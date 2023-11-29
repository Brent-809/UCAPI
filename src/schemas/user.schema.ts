import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String })
  _id: mongoose.Schema.Types.ObjectId
  
  @Prop({ type: [String], default: [] })
  userFriendIds: string[];

  @Prop({ type: [String], default: [] })
  pendingFriendRequests: string[];
  
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: Number })
  age: number;

  @Prop({ type: Boolean })
  verified: boolean;

  @Prop({ type: String })
  developmentalDisorder: string;

  @Prop({ type: String })
  gender: string;

  @Prop({ type: String })
  username: string;

  @Prop({ type: String })
  sexuality: string;

  @Prop({ type: String })
  chosen: string;

  @Prop({ type: String })
  bio: string;

  @Prop({ type: String })
  profileImg: string;

  @Prop({ type: [String], default: [] })
  profileImages: string[];

  @Prop({ type: Boolean })
  isGenderPublic: boolean;

  @Prop({ type: Boolean })
  isDisorderPublic: boolean;

  @Prop({ type: Boolean })
  isAgePublic: boolean;

  @Prop({ type: Boolean })
  isSexualityPublic: boolean;

  @Prop({ type: Boolean })
  isNewUser: boolean;

  @Prop({ type: Boolean })
  isAdmin: boolean;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: String })
  ipAddress: string;

  @Prop({ type: Boolean })
  featured: boolean;

  @Prop({ type: [String], default: [] })
  joinedGroups: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
