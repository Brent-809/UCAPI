import { Module, DynamicModule } from "@nestjs/common";
import { SocketIoConfig } from "ngx-socket-io";

@Module({})
export class SocketIoModule {
  static forRoot(config: SocketIoConfig): DynamicModule {
    return {
      module: SocketIoModule,
      providers: [
        {
          provide: "SOCKET_IO_CONFIG",
          useValue: config,
        },
      ],
      exports: ["SOCKET_IO_CONFIG"],
    };
  }
}
