import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import * as qs from 'qs';

import { BaseQueryParams } from '../interfaces/base-query-params.interface';

export const QueryParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest();
    const values: BaseQueryParams = qs.parse(request.query);

    if (values.page) values.page = Number(values.page);
    if (values.limit) values.limit = Number(values.limit);

    return values;
  },
);
