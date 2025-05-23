import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUrl, IsArray, ArrayNotEmpty, Min } from 'class-validator';

export class CreateResourceDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsString()
  category: string; // e.g., 'Worksheet', 'Lesson Plan', 'Assessment'

  @IsNotEmpty()
  @IsString()
  subject: string; // e.g., 'Math', 'Science', 'History'

  @IsNotEmpty()
  @IsString()
  gradeLevel: string; // e.g., 'K-2', '6-8', 'High School'

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  previewImageUrls?: string[];

  @IsNotEmpty()
  @IsUrl()
  fileUrl: string; // URL to the actual resource file (e.g., PDF, DOCX)
}
