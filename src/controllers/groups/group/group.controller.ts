import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FileInterceptor } from "@nestjs/platform-express";
import mongoose, { Model, Types } from "mongoose";
import { Observable, from, map } from "rxjs";
import { Group, GroupDocument } from "src/schemas/group.schema";
import { User, UserDocument } from "src/schemas/user.schema";
import { GroupService } from "src/services/group/group.service";
import { uploadImageToExternalService } from "src/utils/upload-image.util";
import { Uploader } from "uploader";

@Controller("groups")
export class GroupController {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private groupsService: GroupService
  ) {}

  @Get("count")
  async countUsers(): Promise<{ count: number }> {
    const count = await this.groupModel.count().exec();
    return { count };
  }

  @Get(":id/users/count")
  async countUsersInGroup(
    @Param("id") groupId: string
  ): Promise<{ count: number }> {
    try {
      const objectId = new Types.ObjectId(groupId);

      const group = await this.groupModel.findById(objectId).exec();
      if (!group) {
        throw new Error("Group not found");
      }

      const usersInGroup = await this.userModel
        .find({ joinedGroups: group._id })
        .exec();
      const count = usersInGroup.length;

      return { count };
    } catch (error) {
      throw new Error("Error counting users in group");
    }
  }

  @Get(":id/user/joined")
  async getGroupsByuser(@Param("id") userId: string) {
    const id = userId;

    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new Error("User not found!");
      }

      const joinedGroups = user.joinedGroups;

      return joinedGroups;
    } catch (error) {
      throw new Error("Error fetching joined groups!");
    }
  }

  @Post("")
  @UseInterceptors(FileInterceptor("image"))
  async createGroup(
    @Body() groupData: Group,
    @UploadedFile() image: Express.Multer.File // Use the imported type here
  ): Promise<Group> {
    // If an image was uploaded, upload it to the external service
    if (image) {
      const imageUrl = await uploadImageToExternalService(image);
      groupData.image = imageUrl;
    }

    groupData.members = 0;

    return this.groupsService.createGroup(groupData);
  }

  @Post(":id/edit")
  @UseInterceptors(FileInterceptor("image"))
  async editGroup(
    @Param("id") groupId: string,
    @Body() groupData: Group,
    @UploadedFile() image: Express.Multer.File
  ): Promise<Group> {
    if (image) {
      const imageUrl = await uploadImageToExternalService(image);
      groupData.image = imageUrl;
    }

    return this.groupsService.editGroup(groupId, groupData);
  }

  @Get(":id")
  getGroupId(@Param("id") id: string) {
    return this.groupModel.findOne({ _id: id });
  }

  @Get("")
  getGroups() {
    return this.groupModel.find();
  }

  @Post("join")
  async joinGroup(
    @Body("groupId") groupId: string,
    @Body("userId") userId: string
  ): Promise<any> {
    if (!groupId) {
      throw new Error("Group ID not provided");
    }

    const objectId = new Types.ObjectId(groupId);

    const group = await this.groupModel.findOne({ _id: objectId }).exec();

    if (!group) {
      throw new Error("Group not found");
    }

    const userObj = await this.userModel.findById(userId).exec();
    if (!userObj) {
      throw new NotFoundException("User not found");
    }

    if (userObj.joinedGroups.includes(groupId)) {
      return { message: "User is already a member of the group" };
    }

    await group.save();

    const user = await this.userModel.findById(userId).exec();
    user.joinedGroups.push(groupId);
    await user.save();

    const groupObject = group.toObject();

    return groupObject;
  }

  @Post(":id/delete")
  async deleteGroup(@Param("id") id: string) {
    try {
      await this.groupsService.deleteGroup(id);
      return { message: "Group deleted successfully" };
    } catch (err) {
      throw new HttpException("Group not found", HttpStatus.NOT_FOUND);
    }
  }

  @Post("leave")
  async leaveGroup(
    @Body("groupId") groupId: string,
    @Body("userId") userId: string
  ): Promise<any> {
    if (!groupId) {
      throw new Error("Group Id not provided!");
    }

    const objectId = new Types.ObjectId(groupId);

    const group = await this.groupModel.findOne({ _id: objectId }).exec();

    if (!group) {
      throw new Error("Group not found");
    }

    const userObj = await this.userModel.findById(userId).exec();
    if (!userObj) {
      throw new NotFoundException("User not found");
    }
  }
}
