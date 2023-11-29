import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Group } from "src/schemas/group.schema";

@Injectable()
export class GroupService {
  constructor(
    @InjectModel("Group") private readonly groupModel: Model<Group>
  ) {}

  async getGroupById(id: string) {
    try {
      const group = await this.groupModel.findOne({ _id: id }).exec();
      console.log("Group found:", group); // Add this line to check if the group is found
      return group;
    } catch (error) {
      console.error("Error fetching group:", error);
      throw error;
    }
  }

  async deleteGroup(groupId: string): Promise<void> {
    await this.groupModel.deleteOne({ _id: groupId }).exec();
  }

  async createGroup(groupData: Group): Promise<Group> {
    const newGroup = new this.groupModel(groupData);
    return await newGroup.save();
  }

  async editGroup(groupId: string, groupData: Group): Promise<Group> {
    const editedGroup = await this.groupModel
      .findByIdAndUpdate(groupId, groupData, {
        new: true, // Return the updated group instead of the old one
      })
      .exec();

    return editedGroup;
  }
}
