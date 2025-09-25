import * as vscode from "vscode";
import { spawn } from "child_process";
import * as scip from "./models";

export const outputChannel = vscode.window.createOutputChannel(
  "SCIP Debugger Extension"
);

export async function runCommandInShell(
  command: string,
  args: string[],
  options?: { cwd: string }
): Promise<string> {
  const shell = vscode.env.shell;
  if (!shell) {
    vscode.window.showErrorMessage("No shell configured in VS Code.");
    return "";
  }

  return new Promise((res) => {
    const child = spawn(
      shell,
      ["-l", "-c", `${command} ${args.join(" ")}`],
      options
    );

    let stdout = "";

    child.stdout.on("data", function (chunk) {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      outputChannel.appendLine(`ERROR (stderr): ${chunk.toString()}`);
    });

    child.on("error", (err) => {
      outputChannel.appendLine(`ERROR: ${err.message}`);
    });

    child.stdout.on("end", () => res(stdout));
  });
}

export function findSCIPDoc(
  document: vscode.TextDocument,
  scipData: scip.Index | undefined
): scip.Document | undefined {
  if (!scipData) return;

  let sortedDocuments =
    scipData?.documents.sort(
      (a, b) => a.relative_path.length - b.relative_path.length
    ) ?? [];
  let scipDoc = sortedDocuments.find((doc) =>
    document.uri.fsPath.endsWith(doc.relative_path.replace(/^\.?\/?/, ""))
  );

  return scipDoc;
}

export function convertSCIPRange(range: number[]): vscode.Range {
  return range.length == 3
    ? new vscode.Range(range[0], range[1], range[0], range[2])
    : new vscode.Range(range[0], range[1], range[2], range[3]);
}
