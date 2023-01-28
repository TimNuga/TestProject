import { ObjectType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsDate,
  ValidateNested,
  IsOptional,
  IsNumber,
  IsString,
  IsInt,
} from "class-validator";
import { Type } from "class-transformer";
import { Customer } from "../../customer/base/Customer";
import { Order } from "../../order/base/Order";

@ObjectType()
class Sale {
    @ApiProperty({
        required: true,
    })
    @IsDate()
    @Type(() => Date)
    @Field(() => Date)
    createdAt!: Date;

    @ApiProperty({
        required: false,
        type: () => Customer,
    })
    @ValidateNested()
    @Type(() => Customer)
    @IsOptional()
    @Field(() => Customer)
    customer?: Customer | null;

    @ApiProperty({
        required: true,
        type: String,
    })
    @IsString()
    @Field(() => String)
    id!: string;

    @ApiProperty({
        required: false,
        type: () => Order,
    })
    @ValidateNested()
    @Type(() => Order)
    @IsOptional()
    @Field(() => Order)
    order?: Order | null;
    
    @ApiProperty({
        required: true,
        type: Number,
    })
    @IsInt()
    @Field(() => Number)
    totalPrice!: number;

    @ApiProperty({
        required: true,
    })
    @IsDate()
    @Type(() => Date)
    @Field(() => Date)
    updatedAt!: Date;
}

export { Sale };
