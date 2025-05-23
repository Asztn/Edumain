import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { GenerateDescriptionDto } from './dto/generate-description.dto';

@Injectable()
export class AiService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      this.logger.error('OPENAI_API_KEY is not configured.');
      throw new InternalServerErrorException('OpenAI API key is missing.');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async generateResourceDescription(dto: GenerateDescriptionDto): Promise<string> {
    const { keywords, baseOutline, resourceTitle, targetAudience } = dto;

    let prompt = `Generate a compelling and informative product description for an educational resource.`;

    if (resourceTitle) {
      prompt += ` The title of the resource is "${resourceTitle}".`;
    }
    if (targetAudience) {
      prompt += ` The target audience is ${targetAudience}.`;
    }

    prompt += `\n\nThe resource is about: ${keywords.join(', ')}.`;

    if (baseOutline) {
      prompt += `\n\nConsider the following outline or key points:\n${baseOutline}`;
    }

    prompt += `\n\nThe description should be engaging, highlight the key benefits for educators or students, and encourage them to learn more or purchase. Make it concise yet informative.`;
    prompt += `\n\nDescription:`;


    try {
      this.logger.log(`Sending request to OpenAI with prompt: ${prompt.substring(0, 100)}...`); // Log first 100 chars
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Or your preferred model
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 250, // Adjust as needed
        temperature: 0.7, // Adjust for creativity vs. factualness
      });

      this.logger.log(`Received response from OpenAI.`);
      const description = response.choices[0]?.message?.content?.trim();

      if (!description) {
        this.logger.warn('OpenAI response did not contain a description.');
        throw new InternalServerErrorException('Failed to generate description from AI: Empty response');
      }
      return description;
    } catch (error) {
      this.logger.error('Error calling OpenAI API', error.stack);
      if (error instanceof OpenAI.APIError) {
         throw new InternalServerErrorException(`OpenAI API Error: ${error.status} ${error.name} ${error.message}`);
      }
      throw new InternalServerErrorException('Failed to generate description due to an AI service error.');
    }
  }
}
