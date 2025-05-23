import { IsArray, IsString, IsOptional, ArrayNotEmpty } from 'class-validator';

export class GenerateDescriptionDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  keywords: string[];

  @IsOptional()
  @IsString()
  baseOutline?: string;

  @IsOptional()
  @IsString()
  resourceTitle?: string; // Optional: Title of the resource to help generate a better description

  @IsOptional()
  @IsString()
  targetAudience?: string; // Optional: e.g., "5th-grade students", "High school physics teachers"
}
