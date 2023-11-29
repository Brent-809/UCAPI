import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "./controllers/users/user/user.controller";
import { UserService } from "./services/user.service";
import { User, UserSchema } from "./schemas/user.schema";
import { AuthController } from "./controllers/users/auth/auth.controller";
import { MailService } from "@sendgrid/mail";
import { TokenService } from "./services/createToken";
import { AppController } from "./app.controller";
import { GroupController } from "./controllers/groups/group/group.controller";
import { Group, GroupSchema } from "./schemas/group.schema";
import { GroupService } from "./services/group/group.service";
import { Message, MessageSchema } from "./schemas/message.schema";
import { MessagesController } from "./controllers/messages/messages.controller";
import { MessagesGateway } from "./gateways/messages/messages.gateway";
import { SocketIoModule } from "./socket-io.module"; // Import the custom SocketIoModule
import { MessagesService } from "./services/messages.service";
import { SocketService } from "./services/socket.service";
import { FriendGateway } from "./gateways/friend/friend.gateway";

const config = { url: "http://localhost:8080", options: {} };

const uri =
  "mongodb+srv://doadmin:2NLuty51374w0Qg6@uc-db-4c2d7836.mongo.ondigitalocean.com/admin?replicaSet=uc-db&tls=true&authSource=admin";

@Module({
  imports: [
    MongooseModule.forRoot(uri, {dbName: "uc-db"}),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    SocketIoModule.forRoot(config),
  ],
  controllers: [
    AuthController,
    UserController,
    AppController,
    GroupController,
    MessagesController,
  ],
  providers: [
    UserService,
    MailService,
    TokenService,
    GroupService,
    MessagesGateway,
    MessagesService,
    SocketService,
    FriendGateway,
  ],
})
export class AppModule {}
