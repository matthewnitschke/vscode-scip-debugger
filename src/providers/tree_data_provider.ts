import * as vscode from "vscode";
import * as scip from '../models'
import DeclarativeTreeProvider from "../declarative_tree_provider";


export default class SCIPTreeDataProvider extends DeclarativeTreeProvider {
  constructor() {
    super([])
  }

  setData(data: scip.Index) {
    super.update([
      { 
        label: 'Metadata',
        iconPath: new vscode.ThemeIcon('info'),

        selector: (data: scip.Index) => data.metadata,
        contextValue: 'hasSelector',

        children: [
          { label: 'Project Root', description: data.metadata.project_root },
          { label: 'Tool Name', description: data.metadata.tool_info.name },
          { label: 'Tool Version', description: data.metadata.tool_info.version },
        ],
      },
      // {
      //   label: 'Documents',
      //   iconPath: new vscode.ThemeIcon('files'),

      //   selector: (data: scip.Index) => data.documents,
      //   contextValue: 'hasSelector',

      //   children: data.documents.map((doc, i) => ({
      //     resourceUri: vscode.Uri.file(doc.relative_path),
      //     iconPath: vscode.ThemeIcon.File,

      //     selector: (data: scip.Index) => data.documents[i],
      //     contextValue: 'hasSelector',

      //     children: doc.occurrences.map((occ, j) => ({
      //       label: `${occ.range[0]}:${occ.range[1]}`,
      //       description: this.getSymbolDisplayName(occ.symbol),

      //       selector: (data: scip.Index) => data.documents[i].occurrences[j],
      //       contextValue: 'hasSelector',

      //       children: [
      //         { label: 'Symbol', description: occ.symbol },
      //         { label: 'Range', description: occ.range.toString() },
      //         { label: 'Symbol Role', description: scip.SymbolRole[occ.symbol_roles ?? 0] },
      //         { label: 'Syntax Kind', description: scip.SyntaxKind[occ.syntax_kind ?? 0] },
      //         ...(occ.diagnostics && occ.diagnostics.length > 0
      //           ? [{ 
      //             label: 'Diagnostics',
      //             children: occ.diagnostics?.map((diag) => ({
      //               label: diag.code,
      //               description: diag.message
      //             }))
      //           }]
      //           : []
      //         )
      //       ]
      //     }))
      //   }))
      // },
      // { 
      //   label: 'External Symbols',
      //   iconPath: new vscode.ThemeIcon('link-external'),
      //   children: [],
      //   // children: data.external_symbols?.map((symb) => ({
      //   //   label: symb.symbol,
      //   //   children: [
      //   //     { label: 'Display Name', description: symb.display_name ?? '<undefined>' },
      //   //     { label: 'Documentation', description: symb.documentation.join('\n') },
      //   //     { label: 'Kind', description: scip.SymbolInformationKind[symb.kind] }
      //   //   ]
      //   // })) ?? []
      // }
    ])
  }

  private getSymbolDisplayName(symbol?: string): string {
    if (!symbol) return '<undefined>';

    let parts = symbol.split(' ');

    // if not a `local x` symbol, return the last segment
    if (parts.length > 2) {
      return parts[parts.length - 1]
    }

    // otherwise return the whole symbol
    return symbol;
  }
}