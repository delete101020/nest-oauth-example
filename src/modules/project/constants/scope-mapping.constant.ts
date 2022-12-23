import { ProjectScope } from '../enums';

export const SCOPE_MAPPING = {
  [ProjectScope.DEFAULT]: ['_id', 'name'],
  [ProjectScope.EMAIL]: ['_id', 'name', 'email'],
  [ProjectScope.PHONE]: ['_id', 'name', 'phone'],
  [ProjectScope.FULL]: ['_id', 'name', 'email', 'phone'],
};
