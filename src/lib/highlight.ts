const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const STRING_PAT = String.raw`('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|` + "`(?:[^`\\\\]|\\\\.)*`" + `)`;

const COMMENTS: Record<string, string> = {
  cstyle: String.raw`\/\/[^\n]*|\/\*[\s\S]*?\*\/`,
  hash: String.raw`#[^\n]*`,
  sql: String.raw`--[^\n]*|\/\*[\s\S]*?\*\/`,
};

const KW: Record<string, string[]> = {
  typescript: [
    "const", "let", "var", "function", "return", "if", "else", "for", "while",
    "do", "import", "export", "from", "type", "interface", "new", "class",
    "extends", "implements", "async", "await", "try", "catch", "finally",
    "throw", "switch", "case", "break", "continue", "default", "of", "in",
    "as", "readonly", "public", "private", "protected", "enum", "namespace",
    "declare", "satisfies", "keyof", "typeof", "instanceof", "void", "delete",
    "null", "undefined", "true", "false", "this", "super", "static", "get",
    "set", "yield", "abstract", "never", "unknown", "string", "number",
    "boolean", "Promise", "Record", "Partial", "Array", "Map", "Set",
  ],
  python: [
    "def", "return", "if", "elif", "else", "for", "while", "import", "from",
    "as", "class", "try", "except", "finally", "raise", "with", "lambda",
    "pass", "break", "continue", "and", "or", "not", "in", "is", "None",
    "True", "False", "self", "yield", "global", "nonlocal", "assert", "del",
    "async", "await", "print", "len", "range", "enumerate", "zip", "dict",
    "list", "set", "tuple", "str", "int", "float", "bool", "min", "max",
    "sum", "sorted", "reversed", "abs", "map", "filter",
  ],
  go: [
    "func", "return", "if", "else", "for", "range", "package", "import",
    "type", "struct", "interface", "map", "chan", "go", "select", "case",
    "default", "switch", "break", "continue", "defer", "var", "const",
    "nil", "true", "false", "string", "int", "int64", "float64", "bool",
    "byte", "rune", "error", "len", "cap", "make", "append", "new",
  ],
  rust: [
    "fn", "let", "mut", "const", "if", "else", "match", "for", "while",
    "loop", "in", "impl", "trait", "struct", "enum", "pub", "use", "mod",
    "crate", "self", "Self", "super", "where", "type", "as", "ref", "move",
    "return", "break", "continue", "Some", "None", "Ok", "Err", "true",
    "false", "async", "await", "dyn", "static", "Vec", "String", "Option",
    "Result", "Box", "i32", "i64", "u32", "u64", "usize", "bool", "str",
  ],
  sql: [
    "select", "from", "where", "group", "by", "order", "limit", "offset",
    "insert", "into", "values", "update", "set", "delete", "join", "left",
    "right", "inner", "outer", "full", "cross", "on", "as", "and", "or",
    "not", "null", "count", "sum", "avg", "max", "min", "with", "over",
    "partition", "desc", "asc", "having", "distinct", "union", "all",
    "case", "when", "then", "else", "end", "between", "like", "in", "is",
    "exists", "create", "table", "primary", "key", "references", "index",
    "row_number", "rank", "dense_rank", "lag", "lead", "interval", "date",
    "now", "current_date", "SELECT", "FROM", "WHERE", "GROUP", "BY",
    "ORDER", "LIMIT", "JOIN", "LEFT", "ON", "AS", "AND", "OR", "WITH",
    "OVER", "PARTITION", "DESC", "ASC", "HAVING", "DISTINCT", "CASE",
    "WHEN", "THEN", "ELSE", "END", "INSERT", "INTO", "VALUES",
  ],
  bash: [
    "curl", "echo", "export", "cd", "npm", "npx", "node", "pnpm", "yarn",
    "git", "docker", "POST", "GET", "PATCH", "DELETE", "PUT", "if", "then",
    "fi", "for", "in", "do", "done",
  ],
};

const ALIAS: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  js: "typescript",
  jsx: "typescript",
  javascript: "typescript",
  mjs: "typescript",
  py: "python",
  golang: "go",
  rs: "rust",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  postgres: "sql",
  postgresql: "sql",
};

type Style = { cls: string };

const S: Record<string, Style> = {
  comment: { cls: "text-[#5b6577] italic" },
  string: { cls: "text-[#a8e07a]" },
  number: { cls: "text-[#f5a76f]" },
  keyword: { cls: "text-[#b49aff]" },
  fn: { cls: "text-[#7cc7ff]" },
  prop: { cls: "text-[#7cc7ff]" },
  at: { cls: "text-[#b49aff]" },
};

export function highlightCode(code: string, lang: string): string {
  const key = ALIAS[lang.toLowerCase()] ?? lang.toLowerCase();

  let commentPat: string = COMMENTS.cstyle;
  if (key === "python" || key === "bash") commentPat = COMMENTS.hash;
  if (key === "sql") commentPat = COMMENTS.sql;

  const kws = (KW[key] ?? []).sort((a, b) => b.length - a.length);
  const parts: string[] = [`(${commentPat})`, STRING_PAT, String.raw`(\b\d[\w.]*\b)`];
  if (kws.length > 0) parts.push(`\\b(${kws.join("|")})\\b`);

  if (key === "css") {
    parts.push(String.raw`@[\w-]+`);
    parts.push(String.raw`[A-Za-z-]+(?=\s*:)`);
    parts.push(String.raw`[A-Za-z_$][\w$-]*(?=\s*\()`);
  } else {
    parts.push(String.raw`[A-Za-z_$][\w$]*(?=\s*\()`);
  }
  const source = parts.join("|");

  let re: RegExp;
  try {
    re = new RegExp(source, "g");
  } catch {
    return escapeHtml(code);
  }

  let html = "";
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code)) !== null) {
    if (m[0].length === 0) {
      re.lastIndex += 1;
      continue;
    }
    html += escapeHtml(code.slice(last, m.index));
    const groups = m.slice(1);
    const gi = groups.findIndex((g) => g !== undefined);
    let cls: string = S.keyword.cls;
    if (key === "css") {
      if (gi === 0) cls = S.comment.cls;
      else if (gi === 1) cls = S.string.cls;
      else if (gi === 2) cls = S.number.cls;
      else if (gi === 3) cls = S.at.cls;
      else cls = S.prop.cls;
    } else {
      if (gi === 0) cls = S.comment.cls;
      else if (gi === 1) cls = S.string.cls;
      else if (gi === 2) cls = S.number.cls;
      else if (gi === groups.length - 1) cls = S.fn.cls;
      else cls = S.keyword.cls;
    }
    html += `<span class="${cls}">${escapeHtml(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  html += escapeHtml(code.slice(last));
  return html;
}
