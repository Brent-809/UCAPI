import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class PersonalMessage extends Document {
  @Prop()
  content: string;

  @Prop()
  sender: string;

  @Prop()
  Receiver: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const PersonalMessageSchema = SchemaFactory.createForClass(PersonalMessage);
