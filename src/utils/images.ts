const CLOUDINARY_UPLOAD_SEGMENT = '/image/upload/';

const hasCloudinaryTransform = (segment: string) => /(^|,)(c_|f_|h_|q_|w_|dpr_)/.test(segment);

export const getCloudinaryImageUrl = (url: string, transformations: string) => {
  if (!url.includes('res.cloudinary.com') || !url.includes(CLOUDINARY_UPLOAD_SEGMENT)) {
    return url;
  }

  const [baseUrl, hash] = url.split('#', 2);
  const [urlWithoutQuery, query] = baseUrl.split('?', 2);
  const uploadIndex = urlWithoutQuery.indexOf(CLOUDINARY_UPLOAD_SEGMENT);
  const prefixEnd = uploadIndex + CLOUDINARY_UPLOAD_SEGMENT.length;
  const prefix = urlWithoutQuery.slice(0, prefixEnd);
  const suffix = urlWithoutQuery.slice(prefixEnd);
  const firstSegment = suffix.split('/', 1)[0] ?? '';
  const optimizedPath = hasCloudinaryTransform(firstSegment) ? `${prefix}${suffix}` : `${prefix}${transformations}/${suffix}`;
  const queryString = query ? `?${query}` : '';
  const hashString = hash ? `#${hash}` : '';

  return `${optimizedPath}${queryString}${hashString}`;
};
