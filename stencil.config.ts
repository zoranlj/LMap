import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'l-map',
  outputTargets:[
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: null
    }
  ]
};
