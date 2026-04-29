import { discordFunctions } from './discord';
import { kindFunctions } from './kinds';
import { utilFunctions } from './utils';

export const NativeFunctions = [...utilFunctions, ...kindFunctions, ...discordFunctions];
