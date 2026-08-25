import React, { useMemo } from 'react';
import { Lottie } from 'lottie-react';
import { cn } from '../../utils/cn';

/** Lightweight inline Lottie JSON — no external CDN dependency */
const loaderAnim = {
  v: '5.7.4',
  fr: 60,
  ip: 0,
  op: 90,
  w: 200,
  h: 200,
  nm: 'EF Loader',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'ring',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [360] },
            { t: 90, s: [360] },
          ],
        },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ty: 'el',
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [90, 90] },
            },
            {
              ty: 'st',
              c: { a: 0, k: [0.133, 0.827, 0.933, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 8 },
              lc: 2,
              lj: 2,
            },
            {
              ty: 'tm',
              s: { a: 0, k: 0 },
              e: { a: 0, k: 70 },
              o: { a: 0, k: 0 },
              m: 1,
            },
            { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0,
    },
  ],
};

const successAnim = {
  v: '5.7.4',
  fr: 60,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: 'EF Success',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'check',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [0, 0, 100], e: [110, 110, 100] },
            { t: 25, s: [110, 110, 100], e: [100, 100, 100] },
            { t: 40, s: [100, 100, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ty: 'el',
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [110, 110] },
            },
            {
              ty: 'fl',
              c: { a: 0, k: [0.133, 0.827, 0.933, 1] },
              o: { a: 0, k: 100 },
            },
            { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        },
        {
          ty: 'gr',
          it: [
            {
              ty: 'sh',
              ks: {
                a: 0,
                k: {
                  i: [[0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0]],
                  v: [[-28, 2], [-10, 22], [32, -24]],
                  c: false,
                },
              },
            },
            {
              ty: 'st',
              c: { a: 0, k: [1, 1, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 10 },
              lc: 2,
              lj: 2,
            },
            {
              ty: 'tm',
              s: { a: 0, k: 0 },
              e: {
                a: 1,
                k: [
                  { t: 15, s: [0], e: [100] },
                  { t: 45, s: [100] },
                ],
              },
              o: { a: 0, k: 0 },
              m: 1,
            },
            { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
    },
  ],
};

const coinAnim = {
  v: '5.7.4',
  fr: 60,
  ip: 0,
  op: 120,
  w: 120,
  h: 120,
  nm: 'EF Coin',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'coin',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [360] },
            { t: 120, s: [360] },
          ],
        },
        p: {
          a: 1,
          k: [
            { t: 0, s: [60, 55, 0], e: [60, 45, 0] },
            { t: 60, s: [60, 45, 0], e: [60, 55, 0] },
            { t: 120, s: [60, 55, 0] },
          ],
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [70, 70] } },
            { ty: 'fl', c: { a: 0, k: [0.965, 0.78, 0.22, 1] }, o: { a: 0, k: 100 } },
            { ty: 'st', c: { a: 0, k: [0.85, 0.62, 0.1, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 4 } },
            { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0,
    },
  ],
};

const animations = {
  loader: loaderAnim,
  success: successAnim,
  coin: coinAnim,
};

export function LottieIcon({ type = 'loader', className, loop = true, autoplay = true }) {
  const data = useMemo(() => animations[type] || animations.loader, [type]);

  return (
    <div className={cn('inline-flex items-center justify-center', className)}>
      <Lottie src={data} loop={loop} autoplay={autoplay} className="h-full w-full" />
    </div>
  );
}

export function LottieLoader({ size = 'md', className }) {
  const sizes = { sm: 'h-8 w-8', md: 'h-14 w-14', lg: 'h-20 w-20' };
  return <LottieIcon type="loader" className={cn(sizes[size], className)} />;
}

export function PageLoader() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-navy-50/40 dark:bg-navy-950">
      <LottieLoader size="lg" />
      <p className="font-display text-sm font-medium text-navy-600 dark:text-navy-300">Loading ExpenseFlow…</p>
    </div>
  );
}
