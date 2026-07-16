import {
  Catch,
  type ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  ExceptionFilter,
} from '@nestjs/common';
import type { Response } from 'express';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@fables-flow/database';
import { ZodError } from 'zod';
import type { ApiErrorResponse } from '@fables-flow/types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected error occurred';
    let details: Record<string, unknown> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as Record<string, unknown>;
      if (typeof res === 'object' && res !== null) {
        code = (res['code'] as string) || 'HTTP_EXCEPTION';
        message = (res['message'] as string) || exception.message;
        details = res['details'] as Record<string, unknown> | undefined;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;
      code = 'DATABASE_ERROR';
      message = 'A database error occurred';

      // Handle specific Prisma errors (e.g. Unique constraint)
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        code = 'RESOURCE_ALREADY_EXISTS';
        message = 'A resource with these unique identifiers already exists.';
      }
    } else if (exception instanceof PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      code = 'DATABASE_VALIDATION_ERROR';
      message = 'Invalid data provided for database operation';
    } else if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      code = 'VALIDATION_ERROR';
      message = 'Input validation failed';
      details = { issues: exception.errors };
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error('Unknown exception', JSON.stringify(exception));
    }

    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message,
        details,
      },
    };

    response.status(status).json(errorResponse);
  }
}
