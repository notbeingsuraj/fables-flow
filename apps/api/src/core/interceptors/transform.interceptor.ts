import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { ApiSuccessResponse, PaginatedResponse } from '@fables-flow/types';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiSuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiSuccessResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If the service already returns the paginated shape (data + meta), wrap with success flag
        if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
          return {
            success: true,
            ...(data as unknown as PaginatedResponse<unknown>),
          } as unknown as ApiSuccessResponse<T>;
        }

        return {
          success: true,
          data,
        };
      }),
    );
  }
}
