import { PSGuild } from './constructs/psGuild';
import { PSChannel } from './constructs/psChannel';
import { PSRole } from './constructs/psRole';
import { PSMember } from './constructs/psMember';
import { PSUser } from './constructs/psUser';
import { PSCanvas } from './constructs/psCanvas';

export const ALLOWED_SIZES = [ 16, 32, 64, 128, 256, 512, 1024, 2048, 4096 ] as const;
export const ALLOWED_EXTENSIONS = [ 'webp', 'png', 'jpg', 'jpeg', 'gif' ] as const;

/**@description Un adaptador de plataforma específica de funcionalidades de PuréScript.*/
export abstract class EnvironmentProvider { //NO volver una interfaz. Por lo que he visto, hay un problema en runtime al resolver el import de interfaces particularmente en "implements"
	abstract getGuild(): PSGuild;
	abstract getChannel(): PSChannel;
	abstract getUser(): PSUser;
	abstract getMember(): PSMember;
	abstract fetchChannel(query: string): PSChannel | null;
	abstract fetchRole(query: string): PSRole | null;
	abstract fetchMember(query: string): PSMember | null;
	abstract createCanvas(width: number, height: number): PSCanvas | null;
}
