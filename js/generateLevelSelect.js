fetch("level/levels.json")
  .then(response => response.json())
  .then(data => {

    /**
     * カード要素を生成する関数
     * @param {Object} level - レベルデータのオブジェクト
     * @param {number} level.id - レベルのID
     * @param {string} level.description - レベルの説明
     * @param {string} level.levelSelectName - レベル選択名
     * @param {string} level.image - レベルの画像ファイル名
     * @returns {HTMLElement} - 生成されたカード要素
     */
    function createCard(level) {
      // カードのdiv要素を作成
      const cardDiv = document.createElement('div');
      cardDiv.className = 'card';
      cardDiv.setAttribute('data-toggle', 'tooltip');
      cardDiv.setAttribute('data-bs-placement', 'bottom');
      cardDiv.setAttribute('data-bs-custom-class', 'ctm-tooltip');
      cardDiv.setAttribute('title', level.description);
      cardDiv.style.width = '15rem';

      // リンク要素を作成
      const link = document.createElement('a');
      link.href = `level/game.html?id=${level.id}`;
      link.className = 'btn btn-outline-primary';
      link.type = 'button';

      // 画像要素を作成
      const img = document.createElement('img');
      img.src = `./img/level_icon/${level.image}`;
      img.alt = 'カードの画像';
      img.className = 'card-img-top img-responsive';

      // カードボディのdiv要素を作成
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';

      // カードテキストのh5要素を作成
      const cardText = document.createElement('h5');
      cardText.className = 'card-text';
      cardText.textContent = level.levelSelectName;

      // カードボディにテキストを追加
      cardBody.appendChild(cardText);

      // リンクに画像とカードボディを追加
      link.appendChild(img);
      link.appendChild(cardBody);

      // カードのdivにリンクを追加
      cardDiv.appendChild(link);

      return cardDiv;
    }

    // JSONデータを元に要素を生成して配置する
    data.levels.forEach(level => {
      if (level.level === 1) {
        const level1Div = document.querySelector('.level-1');
        const card = createCard(level);
        level1Div.appendChild(card);
      } else if (level.level === 2) {
        const level2Div = document.querySelector('.level-2');
        const card = createCard(level);
        level2Div.appendChild(card);
      }
    });
    // Tooltipを初期化
    document.querySelectorAll('[data-toggle="tooltip"]').forEach(function (tooltipElement) {
      new bootstrap.Tooltip(tooltipElement);
    });
  })
  .catch(error => console.error("Error loading JSON data:", error));