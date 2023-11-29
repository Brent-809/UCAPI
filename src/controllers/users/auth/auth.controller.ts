import { Controller, Post, Body, Res, Inject } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { MailService } from "@sendgrid/mail";
import { Response } from "express";
import { UserService } from "src/services/user.service";
import { v4 as uuidv4 } from "uuid";
import * as sgClient from "@sendgrid/client";
import { TokenService } from "src/services/createToken";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly mailerService: MailService,
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  @Post("create")
  async createUser(@Body() reqBody: any, @Res() res: Response) {
    const userId = uuidv4();
    console.log("Received request to create a user:", reqBody);

    const isAdmin = reqBody.isAdmin || false;
    const isNewUser = reqBody.isNewUser || true;
    const {
      name,
      email,
      password,
      username,
      chosen,
      isSexualityPublic,
      isAgePublic,
      isDisorderPublic,
      isGenderPublic,
    } = reqBody;

    console.log("user info check done!");

    // Check that all required fields are present
    if (!name || !email || !password || !username || !chosen) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("all fields are present!");

    try {
      console.log("try started!");
      // Check if user with the same email already exists
      const existingUser = await this.userService.findUserByEmail(email);
      if (existingUser) {
        console.log("User with email already exists");
        return res
          .status(400)
          .json({ message: "User with email already exists" });
      }

      console.log("User exist!");

      // Check if user with the same username already exists
      const existingUserByUsername = await this.userService.findUserByUsername(
        username
      );
      if (existingUserByUsername) {
        console.log("User with username already exists");
        return res
          .status(400)
          .json({ message: "User with username already exists" });
      }

      // Hash password with bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user and save it to the database
      const createdUser = await this.userService.createUser({
        _id: userId,
        name,
        email,
        password: hashedPassword,
        username,
        verified: false,
        isAdmin,
        isNewUser,
        chosen,
        isSexualityPublic: true,
        isAgePublic: true,
        isDisorderPublic: true,
        isGenderPublic: true,
      });

      console.log("New user created with id:", userId);

      // Create and assign a JWT token
      const token = this.tokenService.createToken(userId);
      console.log("Token created:", token);

      const apiKey =
        process.env.SENDGRID_API_KEY ||
        "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";
      this.mailerService.setApiKey(apiKey);

      // Send a verification email
      const msg = {
        to: email,
        from: "brent@brent809.com",
        templateId: "d-cb661998fa2b464e94e2f63451843a98",
      };

      await this.mailerService.send(msg);
      console.log("Verification email sent to:", email);

      return res.status(201).json({ message: "User created", token });
    } catch (err) {
      console.error("Error occurred while creating a user:", err);
      await this.userService.deleteUser(userId);
      return res.status(500).send(err);
    }
  }

  @Post("login")
  async loginUser(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    try {
      const user = await this.userService.findUserByEmail(email);

      if (!user) {
        return { statusCode: 401, message: "Invalid credentials" };
      }

      const isPasswordMatch = await this.userService.comparePasswords(
        password,
        user.password
      );

      if (!isPasswordMatch) {
        return { statusCode: 401, message: "Invalid credentials" };
      }

      const { _id, name, isAdmin, verified } = user;
      const token = this.tokenService.createToken(_id.toString());

      return { statusCode: 200, _id, name, isAdmin, verified, token };
    } catch (err) {
      console.error(err);
      return { statusCode: 500, message: "Server error" };
    }
  }
}
