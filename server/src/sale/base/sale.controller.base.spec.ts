import { Test } from "@nestjs/testing";
import {
  INestApplication,
  HttpStatus,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import request from "supertest";
import { MorganModule } from "nest-morgan";
import { ACGuard } from "nest-access-control";
import { DefaultAuthGuard } from "../../auth/defaultAuth.guard";
import { ACLModule } from "../../auth/acl.module";
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { map } from "rxjs";
import { SaleController } from "../sale.controller";
import { SaleService } from "../sale.service";

const CREATE_INPUT = {
    createdAt: new Date(),
    customerId: "exampleCustomerId",
    id: "exampleId",
    orderId: "exampleOrderId",
    totalPrice: 42,
    updatedAt: new Date(),
};

const service= {
    create() {
        return CREATE_INPUT;
    }
}

const basicAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const argumentHost = context.switchToHttp();
    const request = argumentHost.getRequest();
    request.user = {
      roles: ["user"],
    };
    return true;
  },
};

const acGuard = {
  canActivate: () => {
    return true;
  },
};

const aclFilterResponseInterceptor = {
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle().pipe(
      map((data) => {
        return data;
      })
    );
  },
};

const aclValidateRequestInterceptor = {
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle();
  },
};

describe("Sale", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                {
                provide: SaleService,
                useValue: service,
                },
            ],
            controllers: [SaleController],
            imports: [MorganModule.forRoot(), ACLModule],
        })
            .overrideGuard(DefaultAuthGuard)
            .useValue(basicAuthGuard)
            .overrideGuard(ACGuard)
            .useValue(acGuard)
            .overrideInterceptor(AclFilterResponseInterceptor)
            .useValue(aclFilterResponseInterceptor)
            .overrideInterceptor(AclValidateRequestInterceptor)
            .useValue(aclValidateRequestInterceptor)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    test("POST /sales", async () => {
        await request(app.getHttpServer())
            .post("/sales")
            .send(CREATE_INPUT)
            .expect(HttpStatus.CREATED)
            .expect({
                ...CREATE_INPUT,
                createdAt: CREATE_INPUT.createdAt.toISOString(),
                updatedAt: CREATE_INPUT.updatedAt.toISOString(),
            });
    })
});
