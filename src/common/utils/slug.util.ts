import * as randomString from 'randomstring';
import slugify from 'slugify';

export const sanitizeSlugInput = (input: string) => {
  return input
    .toLowerCase()
    .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9_-]/g, '')
    .replace(/-+/g, '-');
};

export const generateSlug = (name: string): string => {
  return `${slugify(name, {
    replacement: '-',
    lower: true,
    trim: true,
  })}-${randomString.generate(5)}`;
};

export const compareSlugs = (slug1: string, slug2: string): boolean => {
  return (
    slug1.slice(0, slug1.lastIndexOf('-')) ===
    slug2.slice(0, slug2.lastIndexOf('-'))
  );
};
