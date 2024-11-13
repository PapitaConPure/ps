const { coerceValue } = require('./interpreter/values.js');
const { stringifyPSAST, logPSAST } = require('./util/debug.js');
const { Token } = require('./lexer/tokens.js');
const { Lexer } = require('./lexer/lexer.js');
const { Parser } = require('./parser/parser.js');
const { Interpreter } = require('./interpreter/interpreter.js');
const { Scope } = require('./interpreter/scope.js');
const { Input } = require('./interpreter/inputReader.js');
const { declareNatives, declareContext } = require('./interpreter/environment/environment.js');
const { EnvironmentProvider, PSGuild, PSChannel, PSRole, PSUser, PSMember } = require('./interpreter/environment/environmentProvider.js');

const CURRENT_PS_VERSION = 1.1;

/**
 * @typedef {Object} BaseTubercle
 * @property {String} id
 * @property {String} author
 * @property {Array<Array<*>>} [inputs]
 */

/**
 * @typedef {Object} PartialBasicTubercleData
 * @property {false} advanced
 * @property {String?} [content]
 * @property {Array<String>} [files]
 * @typedef {import('./util/types.js').RequireAtLeastOne<PartialBasicTubercleData>} BasicTubercleData
 */

/**
 * @typedef {Object} AdvancedTubercleData
 * @property {true} advanced
 * @property {undefined} [content]
 * @property {undefined} [files]
 * @property {String} script
 * @property {Map<String, import('./interpreter/values.js').RuntimeValue>} saved
 * @property {Number} psVersion
 */

/**
 * @typedef {BaseTubercle & BasicTubercleData} BasicTubercle
 * @typedef {BaseTubercle & AdvancedTubercleData} AdvancedTubercle
 */

/**@typedef {BasicTubercle | AdvancedTubercle} Tubercle*/

const lexer = new Lexer();
const parser = new Parser();
const interpreter = new Interpreter();

module.exports = {
    CURRENT_PS_VERSION,
    Token,
    Lexer,
    Parser,
    Interpreter,
    Scope,
    EnvironmentProvider,
    PSGuild,
    PSChannel,
    PSRole,
    PSUser,
    PSMember,
    Input,
    lexer,
    parser,
    interpreter,
    coerceValue,
    declareNatives,
    declareContext,
    stringifyPSAST,
    logPSAST,
};