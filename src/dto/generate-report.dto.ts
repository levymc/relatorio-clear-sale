import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateReportDto {
  @ApiProperty({
    description: 'Lista de CPFs para gerar o relatório',
    example: ['11111111111', '222.222.222-22', '33333333333'],
    type: [String]
  })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  cpfs: string[];
}