import {
  CellCoord,
  CellError,
  isCellError,
  parseCellCoord,
} from './types';

export type TokenType =
  | 'NUMBER'
  | 'STRING'
  | 'BOOLEAN'
  | 'ERROR'
  | 'IDENT'
  | 'CELL'
  | 'COMMA'
  | 'COLON'
  | 'LPAREN'
  | 'RPAREN'
  | 'PLUS'
  | 'MINUS'
  | 'STAR'
  | 'SLASH'
  | 'CARET'
  | 'PERCENT'
  | 'AMP'
  | 'EQ'
  | 'NEQ'
  | 'LT'
  | 'LTE'
  | 'GT'
  | 'GTE'
  | 'EOF';

export interface Token {
  type: TokenType;
  value?: any;
  coord?: CellCoord;
  raw?: string;
  pos: number;
}

export type ASTNode =
  | { type: 'number'; value: number }
  | { type: 'string'; value: string }
  | { type: 'boolean'; value: boolean }
  | { type: 'error'; error: CellError }
  | { type: 'null' }
  | {
      type: 'cell';
      sheet?: string;
      col: number;
      row: number;
      absCol?: boolean;
      absRow?: boolean;
      rawRef: string;
    }
  | {
      type: 'range';
      sheet?: string;
      start: CellCoord;
      end: CellCoord;
      rawRef: string;
    }
  | { type: 'unary'; operator: '+' | '-' | '%'; argument: ASTNode }
  | {
      type: 'binary';
      operator:
        | '+'
        | '-'
        | '*'
        | '/'
        | '^'
        | '&'
        | '='
        | '<>'
        | '<'
        | '<='
        | '>'
        | '>=';
      left: ASTNode;
      right: ASTNode;
    }
  | { type: 'function'; name: string; args: ASTNode[] };

/**
 * Tokenizes an Excel formula string
 */
export function tokenize(formula: string): Token[] {
  let src = formula.trim();
  if (src.startsWith('=')) {
    src = src.slice(1);
  }

  const tokens: Token[] = [];
  let i = 0;
  const len = src.length;

  while (i < len) {
    const ch = src[i];

    // Skip whitespace
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Number literal: .5 or 123 or 123.45
    if (/\d/.test(ch) || (ch === '.' && i + 1 < len && /\d/.test(src[i + 1]))) {
      const start = i;
      let hasDot = ch === '.';
      i++;
      while (i < len) {
        if (src[i] === '.') {
          if (hasDot) break;
          hasDot = true;
          i++;
        } else if (/\d/.test(src[i])) {
          i++;
        } else if (
          (src[i] === 'e' || src[i] === 'E') &&
          i + 1 < len &&
          (/[\d+-]/.test(src[i + 1]))
        ) {
          i += 2;
          while (i < len && /\d/.test(src[i])) i++;
          break;
        } else {
          break;
        }
      }
      const numStr = src.slice(start, i);
      tokens.push({
        type: 'NUMBER',
        value: parseFloat(numStr),
        raw: numStr,
        pos: start,
      });
      continue;
    }

    // String literal: "hello ""world"""
    if (ch === '"') {
      const start = i;
      i++; // skip opening quote
      let str = '';
      while (i < len) {
        if (src[i] === '"') {
          if (i + 1 < len && src[i + 1] === '"') {
            str += '"';
            i += 2;
          } else {
            i++; // skip closing quote
            break;
          }
        } else {
          str += src[i];
          i++;
        }
      }
      tokens.push({
        type: 'STRING',
        value: str,
        raw: src.slice(start, i),
        pos: start,
      });
      continue;
    }

    // Excel error: #VALUE!, #REF!, #DIV/0!, #N/A, #NAME?, #NUM!, #NULL!
    if (ch === '#') {
      const start = i;
      i++;
      while (i < len && /[A-Za-z0-9_/?!]/.test(src[i])) {
        const c = src[i];
        i++;
        if (c === '!' || c === '?') break;
      }
      const errStr = src.slice(start, i).toUpperCase();
      if (isCellError(errStr)) {
        tokens.push({
          type: 'ERROR',
          value: errStr,
          raw: errStr,
          pos: start,
        });
      } else {
        tokens.push({
          type: 'ERROR',
          value: '#VALUE!',
          raw: errStr,
          pos: start,
        });
      }
      continue;
    }

    // Single-quoted sheet reference: 'Sheet Name'!A1
    if (ch === "'") {
      const start = i;
      i++; // skip '
      let sheetName = '';
      while (i < len && src[i] !== "'") {
        sheetName += src[i];
        i++;
      }
      if (i < len && src[i] === "'") {
        i++; // skip closing '
      }
      if (i < len && src[i] === '!') {
        i++; // skip !
        // Now scan the cell coordinate e.g. $A$1 or B4
        const cellStart = i;
        while (i < len && /[$A-Za-z0-9]/.test(src[i])) {
          i++;
        }
        const cellRef = src.slice(cellStart, i);
        const fullRef = `'${sheetName}'!${cellRef}`;
        const coord = parseCellCoord(fullRef);
        if (coord) {
          tokens.push({
            type: 'CELL',
            coord,
            raw: fullRef,
            pos: start,
          });
          continue;
        }
      }
      // If not a valid sheet cell reference, backtrack
      i = start + 1;
      continue;
    }

    // Multi-char operators: <>, <=, >=
    if (ch === '<') {
      if (i + 1 < len && src[i + 1] === '>') {
        tokens.push({ type: 'NEQ', raw: '<>', pos: i });
        i += 2;
        continue;
      }
      if (i + 1 < len && src[i + 1] === '=') {
        tokens.push({ type: 'LTE', raw: '<=', pos: i });
        i += 2;
        continue;
      }
      tokens.push({ type: 'LT', raw: '<', pos: i });
      i++;
      continue;
    }
    if (ch === '>') {
      if (i + 1 < len && src[i + 1] === '=') {
        tokens.push({ type: 'GTE', raw: '>=', pos: i });
        i += 2;
        continue;
      }
      tokens.push({ type: 'GT', raw: '>', pos: i });
      i++;
      continue;
    }

    // Single-char operators
    if (ch === '=') {
      tokens.push({ type: 'EQ', raw: '=', pos: i });
      i++;
      continue;
    }
    if (ch === '+') {
      tokens.push({ type: 'PLUS', raw: '+', pos: i });
      i++;
      continue;
    }
    if (ch === '-') {
      tokens.push({ type: 'MINUS', raw: '-', pos: i });
      i++;
      continue;
    }
    if (ch === '*') {
      tokens.push({ type: 'STAR', raw: '*', pos: i });
      i++;
      continue;
    }
    if (ch === '/') {
      tokens.push({ type: 'SLASH', raw: '/', pos: i });
      i++;
      continue;
    }
    if (ch === '^') {
      tokens.push({ type: 'CARET', raw: '^', pos: i });
      i++;
      continue;
    }
    if (ch === '%') {
      tokens.push({ type: 'PERCENT', raw: '%', pos: i });
      i++;
      continue;
    }
    if (ch === '&') {
      tokens.push({ type: 'AMP', raw: '&', pos: i });
      i++;
      continue;
    }
    if (ch === '(') {
      tokens.push({ type: 'LPAREN', raw: '(', pos: i });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'RPAREN', raw: ')', pos: i });
      i++;
      continue;
    }
    if (ch === ',') {
      tokens.push({ type: 'COMMA', raw: ',', pos: i });
      i++;
      continue;
    }
    if (ch === ':') {
      tokens.push({ type: 'COLON', raw: ':', pos: i });
      i++;
      continue;
    }

    // Identifiers or Cell references (with optional unquoted sheet prefix e.g. Sheet1!A1)
    if (/[A-Za-z_$]/.test(ch)) {
      const start = i;
      while (i < len && /[A-Za-z0-9_$!]/.test(src[i])) {
        // Stop if ! is encountered and check if sheet name
        if (src[i] === '!') {
          i++; // consume !
          // consume rest of cell ref
          while (i < len && /[$A-Za-z0-9]/.test(src[i])) {
            i++;
          }
          break;
        }
        i++;
      }
      const rawText = src.slice(start, i);

      // Check if it's a cross-sheet reference or single-cell reference
      const coord = parseCellCoord(rawText);
      if (coord) {
        // If followed by '(', it might be a function name instead (unlikely for A1, but check)
        let isFunc = false;
        let peekIdx = i;
        while (peekIdx < len && /\s/.test(src[peekIdx])) peekIdx++;
        if (peekIdx < len && src[peekIdx] === '(') {
          isFunc = true;
        }

        if (!isFunc) {
          tokens.push({
            type: 'CELL',
            coord,
            raw: rawText,
            pos: start,
          });
          continue;
        }
      }

      // Check for boolean literals
      const upper = rawText.toUpperCase();
      if (upper === 'TRUE') {
        tokens.push({ type: 'BOOLEAN', value: true, raw: rawText, pos: start });
        continue;
      }
      if (upper === 'FALSE') {
        tokens.push({ type: 'BOOLEAN', value: false, raw: rawText, pos: start });
        continue;
      }

      // Otherwise it's an IDENT (e.g. SUM, AVERAGE, IF)
      tokens.push({
        type: 'IDENT',
        value: upper,
        raw: rawText,
        pos: start,
      });
      continue;
    }

    // Unknown char, skip
    i++;
  }

  tokens.push({ type: 'EOF', pos: len });
  return tokens;
}

/**
 * Recursive descent parser for Excel formulas
 */
export class FormulaParser {
  private tokens: Token[];
  private current = 0;

  constructor(formula: string) {
    this.tokens = tokenize(formula);
  }

  public parse(): ASTNode {
    if (this.peek().type === 'EOF') {
      return { type: 'null' };
    }
    const expr = this.parseComparison();
    return expr;
  }

  private peek(): Token {
    return this.tokens[this.current] || { type: 'EOF', pos: -1 };
  }

  private advance(): Token {
    const t = this.peek();
    if (t.type !== 'EOF') {
      this.current++;
    }
    return t;
  }

  private check(type: TokenType): boolean {
    return this.peek().type === type;
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  // Precedence level 1: Comparison (=, <>, <, <=, >, >=)
  private parseComparison(): ASTNode {
    let expr = this.parseConcat();

    while (
      this.check('EQ') ||
      this.check('NEQ') ||
      this.check('LT') ||
      this.check('LTE') ||
      this.check('GT') ||
      this.check('GTE')
    ) {
      const opToken = this.advance();
      let operator: '=' | '<>' | '<' | '<=' | '>' | '>=' = '=';
      switch (opToken.type) {
        case 'EQ':
          operator = '=';
          break;
        case 'NEQ':
          operator = '<>';
          break;
        case 'LT':
          operator = '<';
          break;
        case 'LTE':
          operator = '<=';
          break;
        case 'GT':
          operator = '>';
          break;
        case 'GTE':
          operator = '>=';
          break;
      }
      const right = this.parseConcat();
      expr = {
        type: 'binary',
        operator,
        left: expr,
        right,
      };
    }

    return expr;
  }

  // Precedence level 2: String Concatenation (&)
  private parseConcat(): ASTNode {
    let expr = this.parseAddSub();

    while (this.match('AMP')) {
      const right = this.parseAddSub();
      expr = {
        type: 'binary',
        operator: '&',
        left: expr,
        right,
      };
    }

    return expr;
  }

  // Precedence level 3: Addition & Subtraction (+, -)
  private parseAddSub(): ASTNode {
    let expr = this.parseMulDiv();

    while (this.check('PLUS') || this.check('MINUS')) {
      const opToken = this.advance();
      const operator = opToken.type === 'PLUS' ? '+' : '-';
      const right = this.parseMulDiv();
      expr = {
        type: 'binary',
        operator,
        left: expr,
        right,
      };
    }

    return expr;
  }

  // Precedence level 4: Multiplication & Division (*, /)
  private parseMulDiv(): ASTNode {
    let expr = this.parsePower();

    while (this.check('STAR') || this.check('SLASH')) {
      const opToken = this.advance();
      const operator = opToken.type === 'STAR' ? '*' : '/';
      const right = this.parsePower();
      expr = {
        type: 'binary',
        operator,
        left: expr,
        right,
      };
    }

    return expr;
  }

  // Precedence level 5: Exponentiation (^)
  private parsePower(): ASTNode {
    let expr = this.parseUnary();

    while (this.match('CARET')) {
      // In Excel, 2^3^2 is evaluated left-to-right (64)
      const right = this.parseUnary();
      expr = {
        type: 'binary',
        operator: '^',
        left: expr,
        right,
      };
    }

    return expr;
  }

  // Precedence level 6: Unary prefix (+, -)
  private parseUnary(): ASTNode {
    if (this.check('PLUS') || this.check('MINUS')) {
      const opToken = this.advance();
      const operator = opToken.type === 'PLUS' ? '+' : '-';
      const argument = this.parseUnary();
      return {
        type: 'unary',
        operator,
        argument,
      };
    }

    return this.parsePostfix();
  }

  // Precedence level 7: Postfix (%)
  private parsePostfix(): ASTNode {
    let expr = this.parsePrimary();

    while (this.match('PERCENT')) {
      expr = {
        type: 'unary',
        operator: '%',
        argument: expr,
      };
    }

    return expr;
  }

  // Primary: Literals, Parentheses, Functions, Cells, Ranges
  private parsePrimary(): ASTNode {
    const token = this.peek();

    if (token.type === 'NUMBER') {
      this.advance();
      return { type: 'number', value: token.value };
    }

    if (token.type === 'STRING') {
      this.advance();
      return { type: 'string', value: token.value };
    }

    if (token.type === 'BOOLEAN') {
      this.advance();
      return { type: 'boolean', value: token.value };
    }

    if (token.type === 'ERROR') {
      this.advance();
      return { type: 'error', error: token.value };
    }

    if (token.type === 'LPAREN') {
      this.advance();
      const expr = this.parseComparison();
      if (this.check('RPAREN')) {
        this.advance();
      }
      return expr;
    }

    // Function call: IDENT followed by LPAREN
    if (token.type === 'IDENT') {
      const funcName = token.value as string;
      this.advance();

      if (this.check('LPAREN')) {
        this.advance(); // consume (
        const args: ASTNode[] = [];

        if (!this.check('RPAREN')) {
          while (true) {
            if (this.check('COMMA')) {
              // Empty argument e.g. FUNC(a, , c)
              args.push({ type: 'null' });
              this.advance();
              if (this.check('RPAREN')) {
                args.push({ type: 'null' });
                break;
              }
            } else {
              args.push(this.parseComparison());
              if (this.check('COMMA')) {
                this.advance();
                if (this.check('RPAREN')) {
                  args.push({ type: 'null' });
                  break;
                }
              } else {
                break;
              }
            }
          }
        }

        if (this.check('RPAREN')) {
          this.advance();
        }

        return {
          type: 'function',
          name: funcName.toUpperCase(),
          args,
        };
      }

      // Identifier without paren - unknown name error in Excel
      return {
        type: 'error',
        error: '#NAME?',
      };
    }

    // Cell reference or Range (Cell : Cell)
    if (token.type === 'CELL') {
      this.advance();
      const firstCoord = token.coord!;
      const rawFirst = token.raw || '';

      if (this.check('COLON')) {
        this.advance(); // consume :
        if (this.check('CELL')) {
          const secondToken = this.advance();
          const secondCoord = secondToken.coord!;
          const sheet = firstCoord.sheet || secondCoord.sheet;

          return {
            type: 'range',
            sheet,
            start: {
              ...firstCoord,
              sheet,
            },
            end: {
              ...secondCoord,
              sheet,
            },
            rawRef: `${rawFirst}:${secondToken.raw || ''}`,
          };
        }
      }

      return {
        type: 'cell',
        sheet: firstCoord.sheet,
        col: firstCoord.col,
        row: firstCoord.row,
        absCol: firstCoord.absCol,
        absRow: firstCoord.absRow,
        rawRef: rawFirst,
      };
    }

    // Fallback on unexpected token
    this.advance();
    return { type: 'null' };
  }
}

export function parseFormula(formula: string): ASTNode {
  const parser = new FormulaParser(formula);
  return parser.parse();
}
