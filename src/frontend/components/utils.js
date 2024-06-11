import {isEqual} from 'lodash';

export function deepCompareObjects(obj1, obj2) {
  return isEqual(obj1, obj2);
}
