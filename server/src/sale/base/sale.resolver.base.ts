import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as apollo from "apollo-server-express";
import * as nestAccessControl from "nest-access-control";
import { GqlDefaultAuthGuard } from "../../auth/gqlDefaultAuth.guard";
import * as gqlACGuard from "../../auth/gqlAC.guard";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { Sale } from "./Sale";
import { SaleService } from "../sale.service";
import { CreateSaleArgs } from "./CreateSaleArgs";

@graphql.Resolver(() => Sale)
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
export class SaleResolverBase {
    constructor(
    protected readonly service: SaleService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
    ) {}

    @common.UseInterceptors(AclValidateRequestInterceptor)
    @graphql.Mutation(() => Sale)
    @nestAccessControl.UseRoles({
    resource: "Order",
    action: "create",
    possession: "any",
    })
    async createSale(@graphql.Args() args: CreateSaleArgs): Promise<Sale> {
        return await this.service.create({
        ...args,
        data: {
            ...args.data,

            customer: args.data.customer
            ? {
                connect: args.data.customer,
                }
            : undefined,

            order: args.data.order
            ? {
                connect: args.data.order,
                }
            : undefined,
        },
        });
    }
}