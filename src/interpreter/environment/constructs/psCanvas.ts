import { ValuesOf } from '../../../util/types';
import { ImageValue } from '../../values';

export interface PSCanvasDrawTextOptions {
	fontSize?: number;
	fillColor?: number;
	strokeColor?: number;
	strokeWidth?: number;
	bold?: boolean;
	italic?: boolean;
}

export const PSCanvasTextAlignments = ({
	INICIO: 'inicio',
	IZQUIERDA: 'izquierda',
	CENTRO: 'centro',
	DERECHA: 'derecha',
	FIN: 'fin',
}) as const;
export type PSCanvasTextAlignment = ValuesOf<typeof PSCanvasTextAlignments>;

export const PSCanvasTextBaselines = ({
	SUPERIOR: 'superior',
	ARRIBA: 'arriba',
	MEDIO: 'medio',
	ABAJO: 'abajo',
	INFERIOR: 'inferior',
}) as const;
export type PSCanvasTextBaseline = ValuesOf<typeof PSCanvasTextBaselines>;

export type PSImageResolvable = string | URL | Buffer | ArrayBufferLike;

export abstract class PSCanvas {
	abstract get width(): number;

	abstract get height(): number;

	abstract drawImage(x: number, y: number, image: PSImageResolvable): Promise<void>;

	abstract drawText(x: number, y: number, text: string, options?: PSCanvasDrawTextOptions): Promise<void>;

	abstract setTextAlignment(alignment: PSCanvasTextAlignment): void;

	abstract setTextBaseline(baseline: PSCanvasTextBaseline): void;

	abstract renderImage(): Promise<ImageValue>;
}
