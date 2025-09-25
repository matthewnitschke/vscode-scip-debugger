import * as vscode from "vscode";
import * as scip from '../models'
import { convertSCIPRange, findSCIPDoc } from "../utils";

export class SCIPHoverProvider implements vscode.HoverProvider {
  scipData: scip.Index | undefined

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    let scipDoc = findSCIPDoc(document, this.scipData!)
    if (!scipDoc) return;

    const range = document.getWordRangeAtPosition(position);
    if (!range) return;

    let occ = scipDoc.occurrences.find((occ) => convertSCIPRange(occ.range).isEqual(range))
    if (!occ) return;

    let symbolInfo = scipDoc.symbols.find((symb) => symb.symbol == occ.symbol) ?? this.scipData?.external_symbols.find((symb) => symb.symbol == occ.symbol)
    return new vscode.Hover([
      '### SCIP Metadata',
      `* Symbol: \`${occ.symbol?.replaceAll('`', '')}\``,
      `* Role: ${scip.SymbolRole[occ.symbol_roles ?? 0]} _(${occ.symbol_roles})_`,
      `* Kind: ${scip.SyntaxKind[symbolInfo?.kind ?? 0]} _(${symbolInfo?.kind})_`,
    ]);
  }
}
