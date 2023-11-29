import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FriendGateway } from "src/gateways/friend/friend.gateway";
import { User, UserDocument } from "src/schemas/user.schema";
import { UserService } from "src/services/user.service";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly friendGateway: FriendGateway
  ) {}

  @Get("")
  async getAllUsers() {
    try {
      return await this.userService.getAllUsers();
    } catch (err) {
      throw new Error(err);
    }
  }

  @Get("count")
  async countUsers(): Promise<{ count: number }> {
    const count = await this.userModel.count({ verified: true }).exec();
    return { count };
  }

  @Get("count/toverify")
  async countYetToVerify(): Promise<{ count: number }> {
    const count = await this.userModel.count({ verified: false }).exec();
    return { count };
  }

  @Get("verified/:id")
  async getVerifiedUserById(@Param("id") id: string) {
    const user = await this.userService.getVerifiedUserById(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  @Get(":id")
  async getUserById(@Param("id") id: string) {
    try {
      return await this.userService.getUserById(id);
    } catch (err) {
      throw new Error(err);
    }
  }

  @Patch(":_id")
  async updateUser(@Param("_id") _id: string, @Body() req: any) {
    try {
      const user = await this.userService.updateUser(_id, req);
      return user;
    } catch (err) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
  }

  @Patch(":id/verify")
  async verifyUser(@Param("id") userId: string) {
    const verifiedUser = await this.userService.verifyUser(userId);
    return { message: "User verified successfully", user: verifiedUser };
  }

  @Post(":id/decline/remove")
  async declineUser(@Param("id") userId: string) {
    const user = await this.userService.declineUser(userId);
    return { message: "User declined successfully", user: user };
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: string) {
    try {
      await this.userService.deleteUser(id);
      return { message: "User deleted successfully" };
    } catch (err) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
  }

  @Get("admin/:id")
  async getAdminUserById(@Param("id") id: string) {
    try {
      const user = await this.userService.getAdminUserById(id);
      return user;
    } catch (err) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
  }

  /* User Info Functions */

  @Put(":id/namePrivacy")
  async updateNamePrivacyStatusById(
    @Param("id") id: string,
    @Body("isNamePublic") isNamePublic: boolean
  ) {
    try {
      const result = await this.userService.updateNamePrivacyStatusById(
        id,
        isNamePublic
      );
      return { id, isNamePublic };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException("Server error");
    }
  }

  @Put(":id/genderPrivacy")
  async updateGenderPrivacyStatusById(
    @Param("id") id: string,
    @Body("isGenderPublic") isGenderPublic: boolean
  ) {
    try {
      const result = await this.userService.updateGenderPrivacyStatusById(
        id,
        isGenderPublic
      );
      return { id, isGenderPublic };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException("Server error");
    }
  }

  @Put(":id/sexualityPrivacy")
  async updateSexualityPrivacyStatusById(
    @Param("id") id: string,
    @Body("isSexualityPublic") isSexualityPublic: boolean
  ) {
    try {
      const result = await this.userService.updateSexualityPrivacyStatusById(
        id,
        isSexualityPublic
      );
      return { id, isSexualityPublic };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException("Server error");
    }
  }

  @Put(":id/disorderPrivacy")
  async updateDisorderPrivacyStatusById(
    @Param("id") id: string,
    @Body("isDisorderPublic") isDisorderPublic: boolean
  ) {
    try {
      const result = await this.userService.updateDisorderPrivacyStatusById(
        id,
        isDisorderPublic
      );
      return { id, isDisorderPublic };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException("Server error");
    }
  }

  @Put(":id/agePrivacy")
  async updateAgePrivacyStatusById(
    @Param("id") id: string,
    @Body("isAgePublic") isAgePublic: boolean
  ) {
    try {
      const result = await this.userService.updateAgePrivacyStatusById(
        id,
        isAgePublic
      );
      return { id, isAgePublic };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException("Server error");
    }
  }

  @Put(":id/gender")
  async updateGender(@Param("id") id: string, @Body("gender") gender: string) {
    try {
      const result = await this.userService.updateGender(id, gender);
      return { id, gender };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException("Server error");
    }
  }

  @Put(":id/age")
  async updateAge(@Param("id") id: string, @Body("age") age: number) {
    try {
      const result = await this.userService.updateAge(id, age);
      return { id, age };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException("Server error");
    }
  }

  @Put(":id/removeAge")
  async removeAge(@Param("id") id: string) {
    try {
      const result = await this.userService.removeAge(id);
      return { id };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException("Server error");
    }
  }

  @Put(":id/bio")
  async updateBio(@Param("id") id: string, @Body("bio") bio: string) {
    try {
      const result = await this.userService.updateBio(id, bio);
      return { id, bio };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException("Server error");
    }
  }

  @Put(":id/disorder")
  async updateDisorder(
    @Param("id") id: string,
    @Body("developmentalDisorder") developmentalDisorder: string
  ) {
    try {
      const result = await this.userService.updateDisorder(
        id,
        developmentalDisorder
      );
      return { id, developmentalDisorder };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException("Server error");
    }
  }

  @Put(":id/sexuality")
  async updateSexuality(
    @Param("id") id: string,
    @Body("sexuality") sexuality: string
  ) {
    try {
      const result = await this.userService.updateSexuality(id, sexuality);
      return { id, sexuality };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException("Server error");
    }
  }

  @Put(":id/newuserstatus")
  async updateNewUserStatus(@Param("id") id: string) {
    try {
      const result = await this.userService.updateIsNewUserStatusById(id);
      return { id };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException("Server error");
    }
  }

  @Put(":id/image")
  async selectProfileImage(
    @Param("id") id: string,
    @Body() req: { profileImage: string }
  ) {
    try {
      const { profileImage } = req;

      const user = await this.userService.getUserById(id);

      if (!user) {
        throw new NotFoundException("User not found");
      }

      console.log(profileImage);

      const updatedUser = await this.userService.updateUser(id, {
        profileImg: profileImage,
      });

      return {
        message: "Profile image selected successfully",
        user: updatedUser,
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException("Server error");
    }
  }

  @Get("profile/images")
  getProfileImages() {
    return this.userService.getProfileImages();
  }

  //////////////////////////////
  //
  // Add Friends Logic
  //
  //////////////////////////////

  @Put("friends/add")
  async addFriend(@Body() body: { userFriendId: string; userId: string }) {
    const { userFriendId, userId } = body;

    if (!userFriendId || !userId) {
      throw new NotFoundException("User or friend ID not provided");
    }

    const [userObj, userFriendObj] = await Promise.all([
      this.userModel.findById(userId).exec(),
      this.userModel.findById(userFriendId).exec(),
    ]);

    if (!userObj || !userFriendObj) {
      throw new NotFoundException("User or friend not found");
    }

    if (userFriendObj.pendingFriendRequests.includes(userId)) {
      return { message: "Friend request already sent" };
    }

    // Add userFriendId to pending friend requests
    userFriendObj.pendingFriendRequests.push(userId);
    await userFriendObj.save();

    return { message: "Friend request sent" };
  }

  @Put("friends/confirm")
  async confirmFriendship(
    @Body() body: { userFriendId: string; userId: string }
  ) {
    const { userFriendId, userId } = body;

    if (!userFriendId || !userId) {
      throw new NotFoundException("User or friend ID not provided");
    }

    const [userObj, userFriendObj] = await Promise.all([
      this.userModel.findById(userId).exec(),
      this.userModel.findById(userFriendId).exec(),
    ]);

    if (!userObj || !userFriendObj) {
      throw new NotFoundException("User or friend not found");
    }

    if (!userObj.pendingFriendRequests.includes(userFriendId)) {
      throw new NotFoundException("Friend request not found");
    }

    userObj.pendingFriendRequests = userObj.pendingFriendRequests.filter(
      (id) => id !== userFriendId
    );
    userObj.userFriendIds.push(userFriendId);
    userFriendObj.userFriendIds.push(userId);

    await Promise.all([userObj.save(), userFriendObj.save()]);

    return { message: "Friendship confirmed" };
  }

}
