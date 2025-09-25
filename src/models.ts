// ---------------------- Enums ----------------------

export enum ProtocolVersion {
  UnspecifiedProtocolVersion = 0,
}

export enum TextEncoding {
  UnspecifiedTextEncoding = 0,
  UTF8 = 1,
  UTF16 = 2,
}

export enum PositionEncoding {
  UnspecifiedPositionEncoding = 0,
  UTF8CodeUnitOffsetFromLineStart = 1,
  UTF16CodeUnitOffsetFromLineStart = 2,
  UTF32CodeUnitOffsetFromLineStart = 3,
}

export enum DescriptorSuffix {
  UnspecifiedSuffix = 0,
  Namespace = 1,
  Package = 1, // deprecated alias
  Type = 2,
  Term = 3,
  Method = 4,
  TypeParameter = 5,
  Parameter = 6,
  Meta = 7,
  Local = 8,
  Macro = 9,
}

export enum SymbolInformationKind {
  UnspecifiedKind = 0,
  Array = 1,
  Assertion = 2,
  AssociatedType = 3,
  Attribute = 4,
  Axiom = 5,
  Boolean = 6,
  Class = 7,
  Constant = 8,
  Constructor = 9,
  DataFamily = 10,
  Delegate = 73,
  Enum = 11,
  EnumMember = 12,
  Event = 13,
  Extension = 84,
  Fact = 14,
  Field = 15,
  File = 16,
  Function = 17,
  Getter = 18,
  Grammar = 19,
  Instance = 20,
  Interface = 21,
  Key = 22,
  Lang = 23,
  Lemma = 24,
  Macro = 25,
  Method = 26,
  MethodReceiver = 27,
  MethodSpecification = 67,
  Message = 28,
  Mixin = 85,
  Module = 29,
  Namespace = 30,
  Null = 31,
  Number = 32,
  Object = 33,
  Operator = 34,
  Package = 35,
  PackageObject = 36,
  Parameter = 37,
  ParameterLabel = 38,
  Pattern = 39,
  Predicate = 40,
  Property = 41,
  Protocol = 42,
  ProtocolMethod = 68,
  PureVirtualMethod = 69,
  Quasiquoter = 43,
  SelfParameter = 44,
  Setter = 45,
  Signature = 46,
  SingletonClass = 75,
  SingletonMethod = 76,
  StaticDataMember = 77,
  StaticEvent = 78,
  StaticField = 79,
  StaticMethod = 80,
  StaticProperty = 81,
  StaticVariable = 82,
  String = 48,
  Struct = 49,
  Subscript = 47,
  Tactic = 50,
  Theorem = 51,
  ThisParameter = 52,
  Trait = 53,
  TraitMethod = 70,
  Type = 54,
  TypeAlias = 55,
  TypeClass = 56,
  TypeClassMethod = 71,
  TypeFamily = 57,
  TypeParameter = 58,
  Union = 59,
  Value = 60,
  Variable = 61,
  Contract = 62,
  Error = 63,
  Library = 64,
  Modifier = 65,
  AbstractMethod = 66,
  Accessor = 72,
  MethodAlias = 74,
}

export enum SymbolRole {
  UnspecifiedSymbolRole = 0,
  Definition = 0x1,
  Import = 0x2,
  WriteAccess = 0x4,
  ReadAccess = 0x8,
  Generated = 0x10,
  Test = 0x20,
  ForwardDefinition = 0x40,
}

export enum SyntaxKind {
  UnspecifiedSyntaxKind = 0,
  Comment = 1,
  PunctuationDelimiter = 2,
  PunctuationBracket = 3,
  Keyword = 4,
  IdentifierOperator = 5,
  Identifier = 6,
  IdentifierBuiltin = 7,
  IdentifierNull = 8,
  IdentifierConstant = 9,
  IdentifierMutableGlobal = 10,
  IdentifierParameter = 11,
  IdentifierLocal = 12,
  IdentifierShadowed = 13,
  IdentifierNamespace = 14,
  IdentifierFunction = 15,
  IdentifierFunctionDefinition = 16,
  IdentifierMacro = 17,
  IdentifierMacroDefinition = 18,
  IdentifierType = 19,
  IdentifierBuiltinType = 20,
  IdentifierAttribute = 21,
  RegexEscape = 22,
  RegexRepeated = 23,
  RegexWildcard = 24,
  RegexDelimiter = 25,
  RegexJoin = 26,
  StringLiteral = 27,
  StringLiteralEscape = 28,
  StringLiteralSpecial = 29,
  StringLiteralKey = 30,
  CharacterLiteral = 31,
  NumericLiteral = 32,
  BooleanLiteral = 33,
  Tag = 34,
  TagAttribute = 35,
  TagDelimiter = 36,
}

export enum Severity {
  Unspecified = 0,
  Error = 1,
  Warning = 2,
  Information = 3,
  Hint = 4,
}

// ---------------------- Messages ----------------------

export interface Index {
  metadata: Metadata;
  documents: Document[];
  external_symbols: SymbolInformation[];
}

export interface Metadata {
  version: ProtocolVersion;
  tool_info: ToolInfo;
  project_root: string;
  text_document_encoding: TextEncoding;
}

export interface ToolInfo {
  name: string;
  version: string;
  arguments: string[];
}

export interface Document {
  relative_path: string;
  occurrences: Occurrence[];
  symbols: SymbolInformation[];
  language: string;
  text?: string;
  position_encoding: PositionEncoding;
}

export interface Symbol {
  scheme: string;
  package?: Package;
  descriptors: Descriptor[];
}

export interface Package {
  manager: string;
  name: string;
  version: string;
}

export interface Descriptor {
  name: string;
  disambiguator: string;
  suffix: DescriptorSuffix;
}

export interface SymbolInformation {
  symbol: string;
  documentation: string[];
  relationships: Relationship[];
  kind: SymbolInformationKind;
  display_name?: string;
  signature_documentation?: Document;
  enclosing_symbol?: string;
}

export interface Relationship {
  symbol: string;
  is_reference?: boolean;
  is_implementation?: boolean;
  is_type_definition?: boolean;
  is_definition?: boolean;
}

export interface Occurrence {
  range: number[]; // 3 or 4 ints
  symbol?: string;
  symbol_roles?: SymbolRole;
  override_documentation?: string[];
  syntax_kind?: SyntaxKind;
  diagnostics?: Diagnostic[];
  enclosing_range?: number[];
}

export interface Diagnostic {
  severity: Severity;
  code?: string;
  message?: string;
}