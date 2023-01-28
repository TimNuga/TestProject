import { PrismaService } from "../../prisma/prisma.service";
import { Prisma, Sale } from "@prisma/client";

export class SaleServiceBase {
    constructor(protected readonly prisma: PrismaService) {}

    async create<T extends Prisma.SaleCreateArgs>(
        args: Prisma.SelectSubset<T, Prisma.SaleCreateArgs>
    ): Promise<Sale> {
        return this.prisma.sale.create<T>(args);
    }
}