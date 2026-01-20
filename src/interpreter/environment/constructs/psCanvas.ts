import { ImageValue } from '../../values';

export interface PSCanvasDrawTextOptions {
	fontSize?: number;
	fillColor?: number;
	strokeColor?: number;
	strokeWidth?: number;
	bold?: boolean;
	italic?: boolean;
}

export abstract class PSCanvas {
	abstract get width(): number;

	abstract get height(): number;

	abstract drawImage(): Promise<void>;

	abstract drawText(x: number, y: number, text: string, options?: PSCanvasDrawTextOptions): Promise<void>;

	abstract setTextAlignment(alignment: CanvasTextAlign): void;

	abstract setTextBaseline(baseline: CanvasTextBaseline): void;

	abstract renderImage(): Promise<ImageValue>;
}
