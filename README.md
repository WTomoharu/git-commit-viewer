# Git Commit Viewr
GitのCommitを一覧で見るためのマクロです！  
あなたもこれで、自分の頑張りを見てみませんか？

## 使い方
以下のコマンドを、調べたいリポジトリの親ディレクトリ(workspaceなど)で実行してください

```bash:terminal
git clone https://github.com/WTomoharu/git-commit-viewer.git
cd git-commit-viewer
node index.js
```

そして、`localhost:3000`にアクセスすれば、あなたのコミット履歴を見ることができます！

## オプション
### マクロ実行時

| 名前   | デフォルト | 詳細|
| -------| ----- | ---------------------------------------- | 
| -root  | ..    | 検索するディレクトリを指定できます |
| -depth | 3     | 検索する深さを指定できます |
| -port  | 3000  | 表示用のローカルサーバーのポートを指定できます |

### ページ閲覧時
右上の設定ボタンより、設定画面が開けます
| 名前     | 詳細                                             | 
| -------- | ------------------------------------------------ | 
| classify | 分類を1段目〜3段目の間で指定できます             | 
| filter   | 検索フィルタをしてできます。スペースは or 扱いです | 

## 使用技術
### マクロ
- Node.js (No library)

### フロント
- Vue.js (v3)
- Day.js


