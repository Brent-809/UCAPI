import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema()
export class Group {
    @Prop({ type: String })
    name: string;

    @Prop({ type: Number })
    members: number;

    @Prop({ type: String })
    category: string;

    @Prop({ type: String })
    description: string;

    @Prop({ type: String })
    image: string;

    @Prop({ type: Boolean })
    featured: boolean;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
