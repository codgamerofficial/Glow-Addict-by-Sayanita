"use client";

import React from 'react';
import NextImage, { ImageProps } from 'next/image';

type Props = ImageProps & React.ImgHTMLAttributes<HTMLImageElement>;

export function Image(props: Props) {
  return <NextImage {...props} alt={props.alt || 'Product image'} />;
}