import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import * as defaultAuthGuard from "../../auth/defaultAuth.guard";
import * as errors from "../../errors";
import { SaleService } from "../sale.service";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { SaleCreateInput } from "./SaleCreateInput";
import {Sale} from "./Sale";
@swagger.ApiBearerAuth()
@common.UseGuards(defaultAuthGuard.DefaultAuthGuard, nestAccessControl.ACGuard)
export class SaleControllerBase {
  constructor(
    protected readonly service: SaleService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}
  
  @common.UseInterceptors(AclValidateRequestInterceptor)
  @nestAccessControl.UseRoles({
    resource: "Sale",
    action: "create",
    possession: "any",
  })
  @common.Post()
  @swagger.ApiCreatedResponse({ type: Sale })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
    async create(@common.Body() data: SaleCreateInput): Promise<Sale> {
        return this.service.create({
            data: {
                ...data,

                customer: data.customer
                    ? {
                        connect: data.customer,
                    }
                    : undefined, 

                order: data.order
                    ? {
                        connect: data.order,
                    }
                    : undefined,
            },

            select: {
                createdAt: true,

                customer: {
                    select: {
                        id: true,
                    }
                },

                id: true,

                order: {
                    select: {
                        id: true,
                    }
                },

                totalPrice: true,
                updatedAt: true,
            },
        });
    }
}