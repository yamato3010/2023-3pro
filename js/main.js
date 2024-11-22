// /level/level0sample.html?id=3
// グローバル変数
// ボタンを押して選択された文字を記憶する
var selectedLetter = null;
var selectedImage = null;
var selectedButtonId = 0;
var getCheckGroupsDataFlag = false;
var checkGroups;
let isModalOpen = false;
// 正解したgroupが一時的に格納される配列
let correctArr = [];

/**
 * 正解したgroupの正解モーダルを表示する関数
 * @param {Object} group - 正解したグループ
 */
function showCorrectModal(group) {
  for (var i = 0; i < window.descriptionArray.length; i++) {
    let arrayString = group.charData.join(" ");
    let string = window.descriptionArray[i].ans
    let baseUrl = "https://www.youtube.com/embed/";
    if (arrayString === string) {
      // モーダルに付与する情報を作成
      var modalBody = document.getElementById('modalBody');
      modalBody.textContent = window.descriptionArray[i].description;
      var modalMedia = document.getElementById('modalMedia');
      if (window.descriptionArray[i].url != "") {
        modalMedia.src = window.descriptionArray[i].url + "?autoplay=1&mute=1&loop=1&playlist=" + window.descriptionArray[i].url.replace(baseUrl, "");
        modalMedia.style.display = 'block';
      } else {
        modalMedia.src = "";
        modalMedia.style.display = 'none';
      }
      // モーダルを表示
      // モーダルが開いている間はタイマー停止
      stopTimer();
      var myModal = new bootstrap.Modal(document.getElementById('correctModal'));
      myModal.show();
    }
  }
  group.alertShown = true;
  correctArr.splice(0, 1);
}

/**
 * 正解したグループをcorrectArrに追加する関数
 * @param {Object} group - チェックするグループ
 */
function checkCorrectness(group) {
  var allCorrect = true;
  // 正解しているかチェック
  for (var i = 0; i < group.specificCells.length; i++) {
    // cellを取得
    var cell = $(group.specificCells[i]);
    // cell内のimgタグを取得
    var img = cell.find('img');
    if (img.data('letter') !== cell.data('correct-letter')) {
      allCorrect = false;
      break;
    }
  }
  if (allCorrect && !group.alertShown) {
    // 正解していたらpush
    correctArr.push(group)
  }
}

/**
 * ローマ字をひらがなに変換する関数
 * @param {string} romaji - 変換したいローマ字
 * @returns {string} - 変換されたひらがな
 */
function romajiToHiragana(romaji) {
  const romajiToHiraganaMap = {
      'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
      'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
      'sa': 'さ', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
      'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',
      'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
      'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
      'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
      'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
      'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
      'wa': 'わ', 'wo': 'を', 'n': 'ん',
      'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
      'za': 'ざ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
      'da': 'だ', 'ji': 'ぢ', 'zu': 'づ', 'de': 'で', 'do': 'ど',
      'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
      'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
      'ltu': 'っ', 'xtu': 'っ', 'la': 'ぁ', 'li': 'ぃ', 'lu': 'ぅ',
      'le': 'ぇ', 'lo': 'ぉ',
      '-': 'ー',
  };

  return romajiToHiraganaMap[romaji] || romaji;
}

$(document).ready(function () {
  // 文字選択ボタンをクリックしたときの処理
  $('.wrapper.row').on('click', '.letter-button', function () {
    // もともと選択されているボタンがある場合はそのボタンの色をもとに戻す
    $('.letter-button[data-button-id="' + selectedButtonId + '"]').css('background-color', '');
    // 選択された文字を記憶する
    selectedLetter = $(this).data('letter');
    selectedImage = $(this).data('img');
    selectedButtonId = $(this).data('button-id');
    // 選択している文字のボタンの色を変更する
    $('.letter-button[data-button-id="' + selectedButtonId + '"]').css('background-color', '#0d6efd');
    console.log("selectedLetter: " + selectedLetter);
  });

  // マスをクリックしたときの処理
  $(document).on('click', '.cell-content', function () {
    // 緑色のマスは変更できないように
    var bgColor = $(this).css('background-color');
    // TODO:判定に背景色を使わないほうがいい
    if (bgColor === 'rgb(144, 238, 144)') {
      return;
    }

    // すでにマスに文字が配置されている場合、その文字のボタンを再表示する
    var img = $(this).find('img');
    var existingLetter = img.data('letter');
    var existingButtonId = img.data('button');
    if (existingButtonId) {
      // $('.letter-button[data-letter="' + existingLetter + '"]').show();
      $('.letter-button[data-button-id="' + existingButtonId + '"]').show();
    }

    if (selectedLetter) {
      // マスに選択した文字を配置する
      $(this).text(selectedLetter);
      $(this).html('<img class="hand-syuwa-on-cell" data-letter="' + selectedLetter + '" data-button= "' + selectedButtonId + '" src="' + selectedImage + '" alt="選択された画像">');
      // 選択した文字のボタンを非表示にする
      $('.letter-button[data-button-id="' + selectedButtonId + '"]').hide();
      // もし選択された文字が正しければ、マスの背景色を変更する
      if ($(this).data('correct-letter') === selectedLetter) {
        $(this).css('background-color', 'rgb(144 238 144)');
      } else {
        $(this).css('background-color', '');
      }
      // ボタンの色をもとに戻す
      $('.letter-button[data-button-id="' + selectedButtonId + '"]').css('background-color', '');
      selectedLetter = null;
      selectedImage = null;
      selectedButtonId = 0;

      // 答え格納データを初回だけ更新するように
      if (!getCheckGroupsDataFlag) {
        console.log("更新")
        var checkGroupsData = $('body').attr('data-check-groups');
        if (checkGroupsData) {
          try {
            checkGroups = JSON.parse(checkGroupsData);
            getCheckGroupsDataFlag = true;
          } catch (e) {
            console.error('Invalid JSON:', checkGroupsData);
          }
        } else {
          console.error('No data-check-groups attribute found');
        }
      }

      // 特定のセルが正しい文字で埋められているかチェックする
      for (var i = 0; i < checkGroups.length; i++) {
        if (checkGroups[i].alertShown) {
          continue;
        } else {
          checkCorrectness(checkGroups[i]);
        }
      }
      console.log("correctArr: " + correctArr);
      if (correctArr.length != 0) {
        // 正解モーダルを出す
        showCorrectModal(correctArr[0]);
      }
      // 全問正解の判定
      let allAlertsShown = checkGroups.every(item => item.alertShown === true);
      console.log("allAlertsShown: " + allAlertsShown);
      if (allAlertsShown) {
        // 全問正解時にタイマーを停止
        stopTimer();
        console.log("全問正解")
      }
    } else {
      // マスに配置された文字のボタンを再表示する
      var letter = $(this).text();
      $('.letter-button[data-button-id="' + letter + '"]').show();
      $(this).text('');
      // マスの背景色を元に戻す
      $(this).css('background-color', '');
    }
  });
});

/**
 * 全問正解した際のモーダルの表示
 */
document.getElementById('correctModal').addEventListener('hidden.bs.modal', function () {
  // 全問正解の判定
  let allAlertsShown = checkGroups.every(item => item.alertShown === true);
  console.log("allAlertsShown: " + allAlertsShown);
  if (allAlertsShown) {
    // タイマーを停止
    stopTimer();
    // cell-content内のhand-syuwa-on-cellのimgタグをひっくり返して文字に置き換える
    var imgElements = document.querySelectorAll('.hand-syuwa-on-cell');
    imgElements.forEach(function (imgElement) {
      // 画像を回転させるクラスを追加
      imgElement.classList.add('vertical-rotate-animation');
      // アニメーション終了後に文字に置き換える
      imgElement.addEventListener('animationend', function() {
        var letter = romajiToHiragana(imgElement.getAttribute('data-letter'));
        var parentElement = imgElement.parentElement;
        parentElement.removeChild(imgElement);
        // テキストをdivタグで囲む
        var textDiv = document.createElement('div');
        textDiv.textContent = letter;
        textDiv.classList.add('vertical-rotate-animation');
        parentElement.appendChild(textDiv);
      });
    });
    // パーティクル表示
    var element = document.getElementById("particles-js");
    if (element) {
      element.style.opacity = 1;
    }
    // クリアまでの時間を表示
    var timeTextContent = document.getElementById('time').textContent;
    var clearModalBody = document.getElementById('clearModalBody');
    var br = document.createElement('br');
    var p = document.createElement('p');
    p.textContent = "クリアタイム：" + timeTextContent;
    clearModalBody.appendChild(br);
    clearModalBody.appendChild(p);
    var myModal = new bootstrap.Modal(document.getElementById('clearModal'));
    myModal.show();
  }
}, {});

/**
 * 全問正解した際の紙吹雪のパーティクル
 */
particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 125,//この数値を変更すると紙吹雪の数が増減できる
      "density": {
        "enable": false,
        "value_area": 400
      }
    },
    "color": {
      "value": ["#EA5532", "#F6AD3C", "#FFF33F", "#00A95F", "#00ADA9", "#00AFEC", "#4D4398", "#E85298"]//紙吹雪の色の数を増やすことが出来る
    },
    "shape": {
      "type": "polygon",//形状はpolygonを指定
      "stroke": {
        "width": 0,
      },
      "polygon": {
        "nb_sides": 5//多角形の角の数
      }
    },
    "opacity": {
      "value": 1,
      "random": false,
      "anim": {
        "enable": true,
        "speed": 20,
        "opacity_min": 0,
        "sync": false
      }
    },
    "size": {
      "value": 5.305992965476349,
      "random": true,//サイズをランダムに
      "anim": {
        "enable": true,
        "speed": 1.345709068776642,
        "size_min": 0.8,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false,
    },
    "move": {
      "enable": true,
      "speed": 10,//この数値を小さくするとゆっくりな動きになる
      "direction": "bottom",//下に向かって落ちる
      "random": false,//動きはランダムにならないように
      "straight": false,//動きをとどめない
      "out_mode": "out",//画面の外に出るように描写
      "bounce": false,//跳ね返りなし
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": false,
      },
      "onclick": {
        "enable": false,
      },
      "resize": true
    },
  },
  "retina_detect": true
});

/**
 * モーダルが開かれた時にフラグを立てる
 */
$('#correctModal').on('shown.bs.modal', function () {
  isModalOpen = true;
  console.log("モーダルが開いている");
});

/**
 * モーダルが閉じられた時にフラグを下げる
 */
$('#correctModal').on('hidden.bs.modal', function () {
  isModalOpen = false;
  console.log("モーダルが閉じている");
  // モーダルが閉じたらタイマー再開
  resumeTimer();
  if (correctArr.length != 0) {
    showCorrectModal(correctArr[0]);
  }
});