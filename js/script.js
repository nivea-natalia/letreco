const tiles = document.querySelector(".tile-container");
    const backspaceAndEnterRow = document.querySelector("#backspaceAndEnterRow");
    const keyboardFirstRow = document.querySelector("#keyboardFirstRow");
    const keyboardSecondRow = document.querySelector("#keyboardSecondRow");
    const keyboardThirdRow = document.querySelector("#keyboardThirdRow");

    const keysFirstRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
    const keysSecondRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
    const keysThirdRow = ["Z", "X", "C", "V", "B", "N", "M"];

    const rows = 6;
    const columns = 5;
    let currentRow = 0;
    let currentColumn = 0;
    let letreco = "NIVEA";
    let words = ["FALSO", "GANSO", "TESTA", "CARRO", "TREVO", "SANTO", "DISCO", "PISCA", "RISCO"];
    let letrecoMap = {};
    for (let index = 0; index < letreco.length; index++) {
        letrecoMap[letreco[index]] = index;
    }
    const guesses = [];//array das palavras digitadas

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        guesses[rowIndex] = new Array(columns);
        const tileRow = document.createElement("div");
        tileRow.setAttribute("id", "row" + rowIndex);
        tileRow.setAttribute("class", "tile-row");
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            const tileColumn = document.createElement("div");
            tileColumn.setAttribute("id", "row" + rowIndex + "column" + columnIndex);
            tileColumn.setAttribute(
                "class",
                rowIndex === 0 ? "tile-column typing" : "tile-column disabled"
            );
            tileRow.append(tileColumn);
            guesses[rowIndex][columnIndex] = "";
        }
        tiles.append(tileRow);
    }

    const checkGuess = () => {//verifica se a palavra coincide
        const guess = guesses[currentRow].join("");
        if (guess.length !== columns) {//se a palavra for menor nao verifica
            return;
        }

        var currentColumns = document.querySelectorAll(".typing");
        for (let index = 0; index < columns; index++) {
            const letter = guess[index];
            if (letrecoMap[letter] === undefined) {
                currentColumns[index].classList.add("wrong")//se a letra digitada nao aparece em nenhum indice, cor vermelha
            } else {
                if (letrecoMap[letter] === index) {
                    currentColumns[index].classList.add("right")//se a letra esta no indice certo, muda cor verde
                } else {
                    currentColumns[index].classList.add("displaced")//tem a letra mas nao no indice certo
                }
            }
        }

        if (guess === letreco) {//ao digitar enter 
            console.log("achou!")//se achar
            return
        } {
            if (currentRow === rows - 1) {//diminui uma tentativa
                window.alert("Errou!")
            } else {
                moveToNextRow()
            }
        }
    };

    const moveToNextRow = () => {
        var typingColumns = document.querySelectorAll(".typing")
        for (let index = 0; index < typingColumns.length; index++) {
            typingColumns[index].classList.remove("typing")
            typingColumns[index].classList.add("disabled")
        }
        currentRow++
        currentColumn = 0

        const currentRowEl = document.querySelector("#row" + currentRow)//
        var currentColumns = currentRowEl.querySelectorAll(".tile-column")
        for (let index = 0; index < currentColumns.length; index++) {
            currentColumns[index].classList.remove("disabled")
            currentColumns[index].classList.add("typing")
        }
    }
    const handleKeyboardOnClick = (key) => {
        if (currentColumn === columns) {
            return;
        }
        const currentTile = document.querySelector(
            "#row" + currentRow + "column" + currentColumn
        );
        currentTile.textContent = key;//adiciona a letra no espaco reservado
        guesses[currentRow][currentColumn] = key;
        currentColumn++;//apos digitar, selecionar a letra seguinte
    };

    const createKeyboardRow = (keys, keyboardRow) => {
        keys.forEach((key) => {
            var buttonElement = document.createElement("button");
            buttonElement.textContent = key;
            buttonElement.setAttribute("id", key);
            buttonElement.addEventListener("click", () => handleKeyboardOnClick(key));
            keyboardRow.append(buttonElement);
        });
    };

    createKeyboardRow(keysFirstRow, keyboardFirstRow);
    createKeyboardRow(keysSecondRow, keyboardSecondRow);
    createKeyboardRow(keysThirdRow, keyboardThirdRow);

    const handleBackspace = () => {
        if (currentColumn === 0) {
            return
        }

        currentColumn--
        guesses[currentRow][currentColumn] = ""//altera texto pra vazio
        const tile = document.querySelector("#row" + currentRow + "column" + currentColumn)
        tile.textContent = ""
    };

    const backspaceButton = document.createElement("button");//cria tecla backspace
    backspaceButton.addEventListener("click", handleBackspace);
    backspaceButton.textContent = "<";
    backspaceAndEnterRow.append(backspaceButton);

    const enterButton = document.createElement("button");//cria tecla enter
    enterButton.addEventListener("click", checkGuess);
    enterButton.textContent = "ENTER";
    backspaceAndEnterRow.append(enterButton);

    document.onkeydown = function (evt) {//adiciona captura do teclado fisico
        evt = evt || window.evt
        if (evt.key === "Enter") {//se key é enter, chama metodo do enter
            checkGuess();
        } else if (evt.key === "Backspace") {//se key é backspace, chama backspace
            handleBackspace()
        } else {
            handleKeyboardOnClick(evt.key.toUpperCase())//ou passa tecla digitar maiuscula
        }
    }