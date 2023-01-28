import { InputType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested, IsOptional, IsInt } from "class-validator";
import { Type } from "class-transformer";
import { CustomerWhereUniqueInput } from "../../customer/base/CustomerWhereUniqueInput";
// import { OrderCreateNestedManyWithoutProductsInput } from "../../product/base/OrderCreateNestedManyWithoutProductsInput";
// import { OrderCreateInput } from "../../order/base/OrderCreateInput";
import { OrderWhereUniqueInput } from "../../order/base/OrderWhereUniqueInput";

@InputType()
class SaleCreateInput {
    @ApiProperty({
        required: false,
        type: CustomerWhereUniqueInput,
    })
    @ValidateNested()
    @Type(() => CustomerWhereUniqueInput)
    @IsOptional()
    @Field(() => CustomerWhereUniqueInput, {
        nullable: true,
     })
    customer?: CustomerWhereUniqueInput | null;

    @ApiProperty({
        required: true,
        type: () => OrderWhereUniqueInput,
    })
    @ValidateNested()
    @Type(() => OrderWhereUniqueInput)
    @Field(() => OrderWhereUniqueInput, {
        nullable: false,
    })
    order!: OrderWhereUniqueInput;

    @ApiProperty({
        required: true,
        type: Number,
    })
    @IsInt()
    @Field(() => Number, {
        nullable: false,
    })
    totalPrice!: number;
}

export { SaleCreateInput }
