// 以下のURLにアクセスして動作確認を行う
// クエリパラメータを忘れない
// /level/level0sample.html?id=0

// 解説が格納される配列
window.descriptionArray = [];

// アニメーションが必要になる文字のリスト
// 画像ファイル名と一致させること
// ltu lya lyu lyoは　っ　ゃ　ゅ　ょ　を表す
const animLetter = ["ga", "gi", "gu", "ge", "go", "za", "zi", "zu", "ze", "zo", "da", "di", "du", "de", "do", "ba", "bi", "bu", "be", "bo", "pa", "pi", "pu", "pe", "po", "-", "ltu", "lya", "lyu", "lyo"]

function arrayShuffle(array) {
  for (let i = (array.length - 1); 0 < i; i--) {

    // 0〜(i+1)の範囲で値を取得
    let r = Math.floor(Math.random() * (i + 1));

    // 要素の並び替えを実行
    let tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
  return array;
}

// 各問題の文字がクロスワードのどの位置に配置されるかを計算する関数
function getPositionsWithChars(question) {
  const positions = [];
  const [x, y] = question.loc;
  const answer = question.ans.split(" ");

  for (let i = 0; i < answer.length; i++) {
    const char = answer[i];
    if (question.direction === "vertical") {
      positions.push({ position: [x, y + i], char });
    } else if (question.direction === "horizontal") {
      positions.push({ position: [x + i, y], char });
    }
  }

  return positions;
}

// 問題同士で重なった文字を探す関数
function findOverlapsWithChars(positions) {
  const positionMap = new Map();
  const overlaps = [];

  for (let qIndex = 0; qIndex < positions.length; qIndex++) {
    for (let pos of positions[qIndex]) {
      const key = pos.position.toString();
      if (positionMap.has(key)) {
        const previousEntry = positionMap.get(key);
        overlaps.push({
          position: pos.position,
          chars: [previousEntry.char, pos.char],
          questions: [previousEntry.qIndex, qIndex]
        });
      } else {
        positionMap.set(key, { qIndex, char: pos.char });
      }
    }
  }

  return overlaps;
}

// 配列から特定の要素を一つだけ削除する関数
function removeElement(arr, element) {
  const index = arr.indexOf(element);
  if (index !== -1) {
    arr.splice(index, 1);
  }
  return arr;
}

// 問題情報をjsonファイルから読み込む処理
fetch('./levels.json')
  .then(response => response.json())
  .then(data => {
    const levelJsonData = data;
    console.log("jsonファイルの読み込みが完了");
    const board = document.querySelector("#board");
    // 特定のパラメータを取得
    let params = new URLSearchParams(window.location.search);
    let currentLevelId = params.get('id');
    let cellNum = 0;
    console.log("クエリからidを取得：" + currentLevelId)
    // エラーハンドリング（クエリパラメータがない場合）
    if (currentLevelId == null) alert("【エラー！！！！】クエリパラメータがないみたいだ。");
    // クエリパラメータのidを用いてjsonファイルから問題を読み込み
    const currentLevelData = levelJsonData.levels.filter(level => level.id == currentLevelId);
    // エラーハンドリング（不正なクエリパラメータ）
    if (currentLevelData.length == 0) alert("【エラー！！！！】存在しない問題idを指定したね。");
    // console.log(currentLevelData);

    // 問題のタイトルに変更
    let titleElement = document.querySelector('.levelTitle');
    if (titleElement == null) {
      console.log("タイトルエレメントがない")
    } else {
      titleElement.textContent = currentLevelData[0].name;
    }
    document.title = currentLevelData[0].name;

    // ボタンを動的に生成
    // これから作るボタンが入る配列
    let generateButtons = [];
    for (const ansStr of currentLevelData[0].quiz) {
      for (const ans of ansStr.ans.split(" ")) {
        generateButtons.push(ans);
      }
    }
    const allPositions = currentLevelData[0].quiz.map(getPositionsWithChars);
    const overlaps = findOverlapsWithChars(allPositions);
    console.log("mapはこれや");
    console.log(allPositions);
    console.log("重なっているところをいかに出力します")
    console.log(overlaps);
    // 重なった文字を削除
    for (const overlap of overlaps) {
      generateButtons = removeElement(generateButtons, overlap.chars[0]);
    }
    // generateButtonsをシャッフル
    generateButtons = arrayShuffle(generateButtons);
    console.log("シャッフルしたもの");
    console.log(generateButtons)
    // buttonIdを定義
    let buttonId = 1;
    for (const buttonStr of generateButtons) {
      console.log("id" + buttonId + "のボタンを生成します");
      console.log(buttonStr);
      let button = document.createElement("button");
      button.className = "letter-button btn btn-light handbtn";
      button.setAttribute("data-letter", buttonStr);
      // アニメーションが必要な指文字はgifとして配置する
      if (animLetter.includes(buttonStr)) {
        button.setAttribute("data-img", "../img/hand_syuwa/new/" + buttonStr + ".gif");
        button.setAttribute("data-img-src", "../img/hand_syuwa/new/" + buttonStr + ".gif");
      } else {
        button.setAttribute("data-img", "../img/hand_syuwa/new/" + buttonStr + ".png");
        button.setAttribute("data-img-src", "../img/hand_syuwa/new/" + buttonStr + ".png");
      }
      button.setAttribute("data-button-id", buttonId)
      buttonId++;
      let img = document.createElement("img")
      img.className = "hand-syuwa";
      // アニメーションが必要な指文字はgifとして配置する
      if (animLetter.includes(buttonStr)) {
        img.setAttribute("src", "../img/hand_syuwa/new/" + buttonStr + ".gif");
      } else {
        img.setAttribute("src", "../img/hand_syuwa/new/" + buttonStr + ".png");
      }
      button.appendChild(img);
      let wrapper = document.querySelector('.mb-1');
      wrapper.appendChild(button);
    }

    // マス目を生成
    for (let cy = 0; cy < currentLevelData[0].board.length; cy++) {
      for (let cx = 0; cx < currentLevelData[0].board[cy].length; cx++) {
        cellNum++;
        console.log(currentLevelData[0].board[cy][cx]);
        let cell_elm = document.createElement("div");
        // もしダミーマスだった場合
        if (currentLevelData[0].board[cy][cx] == -1) {
          cell_elm.className = "dummy-cell"
        }
        // もし透過マスだった場合
        else if (currentLevelData[0].board[cy][cx] == -2) {
          cell_elm.className = "invisible-cell"
        }
        // 通常のマスの場合
        else {
          cell_elm.className = "cell";
          let span_elm = document.createElement("span");
          span_elm.className = "cell-number";
          if (currentLevelData[0].board[cy][cx]) {
            span_elm.innerHTML = currentLevelData[0].board[cy][cx];
          }
          let cell_con_elm = document.createElement("div");
          // class名とセル番号を追加
          cell_con_elm.className = "cell-content";
          cell_con_elm.id = "cell-" + cellNum;
          cell_elm.appendChild(span_elm);
          cell_elm.appendChild(cell_con_elm);
        }
        board.appendChild(cell_elm);
      }
    }

    const vertical_key = document.querySelector("#vertical");
    const horizontal_key = document.querySelector("#horizontal");
    // ゲームのメイン処理に使用される正誤判定用のdataCheckGroupsを定義
    let dataCheckGroups = []

    for (let q of currentLevelData[0].quiz) {
      console.log(q);
      // ヒントエリアの描画
      let q_elm = document.createElement("li");
      q_elm.classList.add('hint-text');
      // 検索アイコンを追加
      // ボタンの生成
      const button = document.createElement('button');
      button.className = 'btn btn-primary btn-sm';
      button.type = 'button';
      // アイコンの生成
      const icon = document.createElement('i');
      icon.className = 'bi bi-search';
      // ボタンにアイコンを追加
      button.appendChild(icon);
      // ボタンをクリックしたときの動作を設定
      button.addEventListener('click', function () {
        // 移動したいリンク先URLを設定
        window.open('https://www.google.com/search?q=' + q.kagi);
      });
      q_elm.innerHTML = currentLevelData[0].board[q.loc[1]][q.loc[0]] + "." + q.kagi;
      if (q.direction == "vertical") {
        vertical_key.appendChild(q_elm);
        q_elm.appendChild(button);
      } else if (q.direction == "horizontal") {
        horizontal_key.appendChild(q_elm);
        q_elm.appendChild(button);
      }

      // dataCheckGroupsに枠組みを追加
      dataCheckGroups.push({
        specificCells: [],
        charData: [],
        alertShown: false
      })

      // cellのdata-correct-letterプロパティに正解の文字を追加
      let ansArr = q.ans.split(" ");
      // 縦の場合
      if (q.direction == "vertical") {
        let y = q.loc[1];
        // 答えの配列でループ
        for (let i = 0; i < ansArr.length; i++) {
          // 十の位が0の場合、先頭に0をつけないように
          if (y == 0) {
            console.log("答えを追加：#cell-" + (q.loc[0] + 1) + ":" + ansArr[i])
            let element = document.getElementById("cell-" + (q.loc[0] + 1));
            element.setAttribute("data-correct-letter", ansArr[i]);
            // dataCheckGroupsのspecificCells配列にcell名を追加
            dataCheckGroups[dataCheckGroups.length - 1].specificCells.push("#cell-" + (q.loc[0] + 1));
            dataCheckGroups[dataCheckGroups.length - 1].charData.push(ansArr[i]);
          } else if (q.loc[0] == 9) {
            console.log("答えを追加：#cell-" + (y + 1) + 0 + ":" + ansArr[i])
            let element = document.getElementById("cell-" + (y + 1) + 0);
            element.setAttribute("data-correct-letter", ansArr[i]);
            // dataCheckGroupsのspecificCells配列にcell名を追加
            dataCheckGroups[dataCheckGroups.length - 1].specificCells.push("#cell-" + (y + 1) + 0);
            dataCheckGroups[dataCheckGroups.length - 1].charData.push(ansArr[i]);
          } else {
            console.log("答えを追加：#cell-" + y + (q.loc[0] + 1) + ":" + ansArr[i])
            let element = document.getElementById("cell-" + y + (q.loc[0] + 1));
            element.setAttribute("data-correct-letter", ansArr[i]);
            // dataCheckGroupsのspecificCells配列にcell名を追加
            dataCheckGroups[dataCheckGroups.length - 1].specificCells.push("#cell-" + y + (q.loc[0] + 1));
            dataCheckGroups[dataCheckGroups.length - 1].charData.push(ansArr[i]);
          }
          y++;
        }
        // 横の場合  
      } else if (q.direction == "horizontal") {
        let x = q.loc[0];
        let y = q.loc[1];
        // 答えの配列でループ
        for (let i = 0; i < ansArr.length; i++) {
          // 十の位が0の場合、先頭に0をつけないように
          if (y == 0) {
            console.log("答えを追加：#cell-" + (x + 1) + ":" + ansArr[i])
            let element = document.getElementById("cell-" + (x + 1));
            element.setAttribute("data-correct-letter", ansArr[i]);
            // dataCheckGroupsのspecificCells配列にcell名を追加
            dataCheckGroups[dataCheckGroups.length - 1].specificCells.push("#cell-" + (x + 1))
            dataCheckGroups[dataCheckGroups.length - 1].charData.push(ansArr[i]);
          } else if (x == 9) {
            console.log("答えを追加：#cell-" + (y + 1) + 0 + ":" + ansArr[i])
            let element = document.getElementById("cell-" + (y + 1) + 0);
            element.setAttribute("data-correct-letter", ansArr[i]);
            // dataCheckGroupsのspecificCells配列にcell名を追加
            dataCheckGroups[dataCheckGroups.length - 1].specificCells.push("#cell-" + (y + 1) + 0)
            dataCheckGroups[dataCheckGroups.length - 1].charData.push(ansArr[i]);
          } else {
            console.log("答えを追加：#cell-" + y + (x + 1) + ":" + ansArr[i])
            let element = document.getElementById("cell-" + y + (x + 1));
            element.setAttribute("data-correct-letter", ansArr[i]);
            // dataCheckGroupsのspecificCells配列にcell名を追加
            dataCheckGroups[dataCheckGroups.length - 1].specificCells.push("#cell-" + y + (x + 1))
            dataCheckGroups[dataCheckGroups.length - 1].charData.push(ansArr[i]);
          }
          x++;
        }
      }
      // bodyタグのdata-check-groupsプロパティにJSON形式の文字列を追加
      // bodyタグを取得
      let body_elm = document.querySelector("body");
      // data-check-groupsプロパティを追加
      body_elm.setAttribute("data-check-groups", JSON.stringify(dataCheckGroups));

      descriptionArray = currentLevelData[0].quiz;
    }
  })
  .catch(error => {
    console.error('Error:', error);
    // TypeError: element is nullエラーは無視
    if (error.toString() !== 'TypeError: element is null') {
      alert(`なんかのエラーが発生しました。\n${error}`);
    }
  });
