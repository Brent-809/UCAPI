import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { User, UserDocument } from "../schemas/user.schema";
import { MailService } from "@sendgrid/mail";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailerService: MailService
  ) {}

  async updateUser(id: string, data: any) {
    const { firstName, lastName, email, password, isAdmin, verified, profileImg } = data;

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        password,
        isAdmin,
        verified,
        profileImg
      },
      { new: true }
    );

    if (updatedUser) {
      return updatedUser;
    } else {
      throw new NotFoundException("User not found");
    }
  }

  async findUsersByGroupId(groupId: string): Promise<User[]> {
    try {
      return this.userModel.find({ joinedGroups: groupId }).exec();
    } catch (error) {
      throw new Error('Error finding users by group ID');
    }
  }

  async verifyUser(userId: string): Promise<User> {
    // Find the user by their ID
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Set the `verified` field to true
    user.verified = true;
    await user.save();

    return user;
  }

  async declineUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      console.log("User not found!");
    }

    const email = user.email;

    const apiKey =
      process.env.SENDGRID_API_KEY ||
      "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";
    this.mailerService.setApiKey(apiKey);

    // Send a verification email
    const msg = {
      to: email,
      from: "brent@brent809.com",
      templateId: "d-6f00ebff4e2a48ccac298f5c603ce32f",
    };

    await this.mailerService.send(msg);

    await user.deleteOne();

    return user;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userModel.deleteOne({ _id: userId }).exec();
  }

  getProfileImages() {
    const profileImages = [
      "https://api.multiavatar.com/" + imageGen(1, 1000000000) + ".png?apikey=L4XfGy0RQBi6Ae",
      // Add more image URLs as needed
    ];

    return profileImages;
  }

  async getVerifiedUserById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async getAdminUserById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!user.isAdmin) {
      throw new Error("User is not an admin");
    }

    return user;
  }

  async countUsers(): Promise<number> {
    return;
  }

  async getAllUsers() {
    const users = await this.userModel.find();
    return users;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id);

    if (user) {
      return user;
    } else {
      throw new NotFoundException("User not found");
    }
  }

  getIpAddress(req) {
    const ipAddress = req.clientIp;
    return ipAddress;
  }

  async updateNamePrivacyStatusById(id: string, isNamePublic: boolean) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { isNamePublic },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
  }

  async updateGenderPrivacyStatusById(id: string, isGenderPublic: boolean) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { isGenderPublic },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
  }

  async updateSexualityPrivacyStatusById(
    id: string,
    isSexualityPublic: boolean
  ) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { isSexualityPublic },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
  }

  async updateDisorderPrivacyStatusById(id: string, isDisorderPublic: boolean) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { isDisorderPublic },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
  }

  async updateAgePrivacyStatusById(id: string, isAgePublic: boolean) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { isAgePublic },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
  }

  async updateGender(id: string, gender: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { gender },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
  }

  async updateAge(id: string, age: number) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { age },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
  }

  async removeAge(id: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { age: null },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
  }

  async updateBio(id: string, bio: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { bio },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
  }

  async updateDisorder(id: string, developmentalDisorder: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { developmentalDisorder },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
  }

  async updateSexuality(id: string, sexuality: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { sexuality },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
  }

  async updateIsNewUserStatusById(id: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { isNewUser: false },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
  }
}

function imageGen(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
