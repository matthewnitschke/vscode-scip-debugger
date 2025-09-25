import * as vscode from "vscode";

export interface TreeItem extends vscode.TreeItem {
  children?: TreeItem[];  
}

export default class DeclarativeTreeProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  data: TreeItem[];

  constructor(data: TreeItem[]) {
    this.data = this.translateData(data);
  }

  update(data: TreeItem[]) {
    this.data = this.translateData(data);
    this._onDidChangeTreeData.fire();
  }

  private _onDidChangeTreeData = new vscode.EventEmitter<
    vscode.TreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  getTreeItem = (element: vscode.TreeItem) => element;

  getChildren(
    element?: TreeItem | undefined
  ): vscode.ProviderResult<vscode.TreeItem[]> {
    if (element === undefined) return this.data;
    return element.children;
  }

  private translateData(data: TreeItem[]): TreeItem[] {
    return data.map((data) => {

      if (data.children != null && data.children.length > 0) {
        data.collapsibleState ??= vscode.TreeItemCollapsibleState.Collapsed

        data.children = this.translateData(data.children);
      }

      return data;
    });
  }
}
