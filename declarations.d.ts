declare module "*.png" {
  const path: string;
  export default path;
}

declare module "*.jpg" {
  const path: string;
  export default path;
}

declare module "*.jpeg" {
  const path: string;
  export default path;
}

declare module "*.gif" {
  const path: string;
  export default path;
}

declare module "*.webp" {
  const path: string;
  export default path;
}

declare module "*.ico" {
  const path: string;
  export default path;
}

declare module "*.svg" {
  import React = require('react')
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
    const src: string
    export default src
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}
