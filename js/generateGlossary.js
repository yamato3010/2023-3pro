const baseUrl = "https://www.youtube.com/embed/";

fetch("level/levels.json")
    .then(response => response.json())
    .then(data => {
        for (let i = 0; i < data.levels.length; i++) {
            // テストレベルを除外
            if (data.levels[i].name.includes("テストレベル")) {
                continue;
            }
            // "quiz"配列の"kagi"の値を取得
            // const quizItems = data.levels[i].quiz.map(item => item.ansStr);
            const quizItems = data.levels[i].quiz;
            const quizName = data.levels[i].name;
            // HTMLに出力
            const listElement = document.getElementById("prefectureList");

            const topItem = document.createElement("div");
            topItem.classList.add("accordion");
            // topItem.id("accordionExample");

            const accordionItem = document.createElement("div");
            accordionItem.classList.add("accordion-item");
            listElement.appendChild(accordionItem);

            // 同じ名前の分野があったら，元々あるその分野の名前のところに追加
            const targetH2 = Array.from(listElement.querySelectorAll('h2')).find(h2 => h2.textContent === quizName);
            if (targetH2) {
                for (let j = 0; j < quizItems.length; j++) {
                    const listItem = document.createElement("button");
                    listItem.classList.add("accordion-body", "btn", "btn-outline-dark", "glossary-btn");
                    // listItem.setAttribute("data-bs-toggle", "modal");
                    listItem.setAttribute("data-target", "#explanationModal");
                    listItem.setAttribute("data-description", quizItems[j].description);
                    listItem.setAttribute("data-url", quizItems[j].url);
                    listItem.textContent = quizItems[j].ansStr;
                    const collapseDiv = targetH2.nextElementSibling;
                    if (collapseDiv && collapseDiv.classList.contains("accordion-collapse")) {
                        const accordionBody = collapseDiv.querySelector(".accordion-body");

                        accordionBody.appendChild(listItem);
                    }
                }
                continue;
            }

            const accordionHeader = document.createElement("h2");
            accordionHeader.classList.add("accordion-header");
            accordionItem.appendChild(accordionHeader);

            const buttonItem = document.createElement("button");
            buttonItem.classList.add("accordion-button", "collapsed");
            buttonItem.setAttribute("type", "button");
            buttonItem.setAttribute("data-bs-toggle", "collapse");
            buttonItem.setAttribute("data-bs-target", "#collapse" + i);
            buttonItem.setAttribute("aria-expanded", "false");
            buttonItem.setAttribute("aria-controls", "collapse" + i);
            buttonItem.textContent = quizName;
            accordionHeader.appendChild(buttonItem);

            const collapseDiv = document.createElement("div");
            collapseDiv.classList.add("accordion-collapse", "collapse");
            collapseDiv.setAttribute("id", "collapse" + i);
            collapseDiv.setAttribute("data-bs-parent", "#accordionExample");
            accordionItem.appendChild(collapseDiv);

            const accordionBody = document.createElement("div");
            accordionBody.classList.add("accordion-body");
            collapseDiv.appendChild(accordionBody);

            for (let j = 0; j < quizItems.length; j++) {
                const listItem = document.createElement("button");
                listItem.classList.add("accordion-body", "btn", "btn-outline-dark", "glossary-btn");
                // listItem.setAttribute("data-bs-toggle", "modal");
                listItem.setAttribute("data-target", "#explanationModal");
                listItem.setAttribute("data-description", quizItems[j].description);
                listItem.setAttribute("data-url", quizItems[j].url);
                listItem.textContent = quizItems[j].ansStr;
                accordionBody.appendChild(listItem);
            }
        }
        // 全てのボタンにクリックイベントを設定
        document.querySelectorAll('.glossary-btn').forEach(button => {
            console.log(button);
            button.addEventListener('click', function () {
                console.log("ボタンがクリックされました");
                // data-info属性から情報を取得
                var description = this.getAttribute('data-description');
                var url = this.getAttribute('data-url');
                console.log(description);
                console.log(url);
                var modalBody = document.getElementById('modalBody');
                modalBody.textContent = description;
                var modalMedia = document.getElementById('modalMedia');
                if (url != "") {
                    modalMedia.src = url + "?autoplay=1&mute=1&loop=1&playlist=" + url.replace(baseUrl, "");
                    modalMedia.style.display = 'block';
                } else {
                    modalMedia.src = "";
                    modalMedia.style.display = 'none';
                }

                var explanationModal = new bootstrap.Modal(document.getElementById('explanationModal'));
                explanationModal.show();
            });
        });
    })
    .catch(error => console.error("Error loading JSON data:", error));