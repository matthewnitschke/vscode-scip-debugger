import * as vscode from "vscode";
import { runCommandInShell } from "../utils";

export class SCIPBinaryContentProvider implements vscode.TextDocumentContentProvider {
  async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
    let json = await runCommandInShell('scip', ['print', '--json', uri.fsPath]);
    return JSON.stringify(JSON.parse(json), undefined, 2)
  }
}


export class SCIPCustomEditorProvider implements vscode.CustomReadonlyEditorProvider {
  async openCustomDocument(uri: vscode.Uri): Promise<vscode.CustomDocument> {
    return { uri, dispose: () => {} };
  }

  async resolveCustomEditor(
    document: vscode.CustomDocument,
    panel: vscode.WebviewPanel
  ): Promise<void> {
    const virtualUri = vscode.Uri.parse(`scip-text:${document.uri.fsPath}`);
    const doc = await vscode.workspace.openTextDocument(virtualUri);
    vscode.languages.setTextDocumentLanguage(doc, 'json')
    
    await vscode.window.showTextDocument(doc, panel.viewColumn);
    panel.dispose(); // close the empty webview panel
  }
}