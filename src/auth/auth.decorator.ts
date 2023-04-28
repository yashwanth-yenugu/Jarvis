import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'SkipAuth';
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);
