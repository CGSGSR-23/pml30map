import { createRoot } from 'react-dom/client';

export function renderC( target: string, dom: any ) {
  const root = createRoot(document.getElementById(target));
  root.render(dom);
} /* End of 'renderC' function */

