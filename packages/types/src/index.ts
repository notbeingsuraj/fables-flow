/**
 * Standard domain event envelope.
 * All events published to the event bus must implement this interface.
 * @see docs/03-architecture/system_design.md
 */
export interface DomainEvent<T = unknown> {
  eventId: string;
  eventName: string;
  organizationId: string;
  timestamp: string;
  actorId: string | null;
  payload: T;
}

/**
 * Standard paginated API response.
 * All list endpoints return this shape.
 * @see docs/05-api/standards.md
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Standard API error response.
 * @see docs/05-api/standards.md
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * Standard API success response.
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * Union type for all API responses.
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * JWT Payload structure for access tokens.
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  orgId: string; // Organization ID
  roleId: string; // Role ID
  type: 'access' | 'refresh';
}
