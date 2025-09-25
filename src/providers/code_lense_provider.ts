import * as vscode from 'vscode';
import * as scip from '../models'
import { findSCIPDoc, convertSCIPRange } from '../utils';

export class SCIPCodeLenseProvider implements vscode.CodeLensProvider {
  scipData: scip.Index | undefined

  provideCodeLenses(
    document: vscode.TextDocument, 
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.CodeLens[]> {
    let scipDoc = findSCIPDoc(document, this.scipData!)
    if (!scipDoc) return [];

    return scipDoc.occurrences.map((occ) => {
      return new vscode.CodeLens(
        convertSCIPRange(occ.range), 
        {
          title: occ.symbol!,
          command: '',
          arguments: []
        }
      );
    })
  }
}