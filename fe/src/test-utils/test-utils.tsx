import React from 'react';
import { render as jestRender, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const render = (ui: React.ReactElement, options?: RenderOptions) => {
  return jestRender(ui, { wrapper: BrowserRouter, ...options });
};

export default render;
