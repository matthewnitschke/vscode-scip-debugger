import * as vscode from "vscode";
import { runCommandInShell } from "./utils";
import { SCIPCodeLenseProvider } from "./providers/code_lense_provider";
import { SCIPHoverProvider } from "./providers/hover_provider";
import { SCIPDecoratorProvider } from "./providers/decorator_provider";
import DeclarativeTreeProvider from "./declarative_tree_provider";
import SCIPTreeDataProvider from "./providers/tree_data_provider";

export function activate(context: vscode.ExtensionContext) {
  let scipIndexPath: string | undefined;

  let hoverProvider = new SCIPHoverProvider();
  let decorationProvider = new SCIPDecoratorProvider();
  let treeDataProvider = new SCIPTreeDataProvider();

  let hasInitialized = false;

  async function applyFromFile() {
    if (!scipIndexPath) {
      vscode.window.showErrorMessage(
        "No SCIP index file found. Apply an index first"
      );
      return;
    }

    let data = await runCommandInShell("scip", ["print", "--json", scipIndexPath], {
      cwd: vscode.workspace.workspaceFolders![0].uri.fsPath,
    });
    let parsedData = JSON.parse(data);

    if (!hasInitialized) {
      hasInitialized = true;
      vscode.commands.executeCommand('setContext', 'scip-debugger.hasApplied', true);
      vscode.window.createTreeView("scip-debugger", { treeDataProvider });
      context.subscriptions.push(
        vscode.languages.registerHoverProvider(
          { scheme: "file" },
          hoverProvider
        )
      );
    }

    hoverProvider.scipData = parsedData;
    decorationProvider.scipData = parsedData;
    treeDataProvider.setData(parsedData);

    decorationProvider.applyDecorations(vscode.window.activeTextEditor);
  }

  context.subscriptions.push(
    vscode.commands.registerCommand("scip-debugger.apply", () => {
      vscode.window
        .showInputBox({
          title: "Enter path to SCIP index file",
          value: "./index.scip",
        })
        .then(async (res) => {
          if (!res) return;

          scipIndexPath = res;
          applyFromFile();
        });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("scip-debugger.refresh", applyFromFile)
  );
}

export function deactivate() {}
