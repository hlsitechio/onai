
declare module 'react-rnd' {
  import { Component } from 'react';

  export interface RndResizeCallback {
    (
      e: MouseEvent | TouchEvent,
      direction: string,
      ref: HTMLDivElement,
      delta: { width: number; height: number },
      position: { x: number; y: number }
    ): void;
  }

  export interface RndDragCallback {
    (e: MouseEvent | TouchEvent, data: { x: number; y: number }): void;
  }

  export interface RndProps {
    size?: { width: number | string; height: number | string };
    position?: { x: number; y: number };
    onResizeStop?: RndResizeCallback;
    onDragStop?: RndDragCallback;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    disableDragging?: boolean;
    enableResizing?: {
      top?: boolean;
      right?: boolean;
      bottom?: boolean;
      left?: boolean;
      topRight?: boolean;
      bottomRight?: boolean;
      bottomLeft?: boolean;
      topLeft?: boolean;
    };
    resizeHandleStyles?: {
      [key: string]: React.CSSProperties;
    };
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export class Rnd extends Component<RndProps> {}
}
