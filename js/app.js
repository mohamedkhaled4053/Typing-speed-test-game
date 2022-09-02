// variables
    let theWord = document.querySelector('.the-word')
    let startButton = document.querySelector('.start')
    let restartButton = document.querySelector('.restart')
    let exitButton = document.querySelector('.exit')
    let upcomingWords = document.querySelector('.upcoming-words')
    let lvlSpan = document.querySelector('.message .lvl')
    let timeSpan = document.querySelector('.message .seconds')
    let input = document.querySelector('.test-input')
    let remainingTime = document.querySelector('.control .time span')
    let score = document.querySelector('.score')
    let finish = document.querySelector('.finish')
    let selectMenu = document.querySelector('.message select')
    let wordsNumberInput = document.querySelector('#words-number')
    let wordMaxLengthInput = document.querySelector('#words-length')

    
    // add lvls
    let lvls = {
        easy: 6,
        normal: 4,
        hard: 2,
    }

    // get defaultLevel from localstorage if any
    let defaultLevel =window.localStorage.getItem('level') || 'normal';
    let defaultTime = lvls[defaultLevel]

    // array of default words
    let defaltWords = ["Hello","Programming","Code","Javascript","Town","Country","Testing","Youtube","Linkedin","Twitter","Github","Leetcode","Internet","Python","Scala","Destructuring","Paradigm","Styling","Cascade","Documentation","Coding","Funny","Working","Dependencies","Task","Runner","Roles","Test","Rust","Playing"];
    let words = defaltWords


// helper functions

    // start the game
    let timer
    function startGame() {
        // remove loading text
        startButton.textContent = 'start playing'
        restartButton.textContent = 'restart'

        // get the style
        startButton.style.display = 'none' // hide the button
        restartButton.style.display = 'block'
        exitButton.style.display = 'block'

        score.children[1].innerHTML = wordsNumberInput.value || 20
        input.value = '' // clear input field to type something else
        input.focus()
        // count down
        timer = setInterval(() => {
            remainingTime.textContent = remainingTime.textContent - 1
            if (remainingTime.textContent == 0) {
                gameOver()
            }
        }, 1000);
        // count down in the beginning
        if (score.children[0].textContent == 0) {
            remainingTime.textContent = 3 + +remainingTime.textContent
        }
        
        // get a word
        randomWord()
    }

    // get randomWord form array
    function randomWord() {
        // gameover when no words remains
        if (words.length == 0){
            theWord.textContent = ''
            gameOver()
            return;
        }

        let randomIndex = Math.floor(Math.random()*words.length);
        let randomWord = words.splice(randomIndex,1)
        theWord.textContent = randomWord
        showWords()
        // remove upcomingWords section if it is empty
        if (words.length == 0){
            upcomingWords.style.display ='none'
        }
    }

    // show the remaining words in upcoming-words section
    function showWords() {
        upcomingWords.innerHTML = ''
        let fragment = document.createDocumentFragment()
        words.forEach((word)=>{
            let div = document.createElement('div')
            div.textContent = word
            fragment.appendChild(div)
        })
        upcomingWords.appendChild(fragment)
    }

    // check if you write the word
    function inputCheck() {
        if (input.value.toUpperCase() == theWord.textContent.toUpperCase()) {
            remainingTime.textContent = defaultTime // reset the countdown time
            score.children[0].textContent++
            clearInterval(timer)
            startGame()
        }
    }    

    // gameOver function
    function gameOver(){
        clearInterval(timer)
        input.removeEventListener('keyup',inputCheck) // stop checking input field
        input.disabled = true // disable input field when game is over
        upcomingWords.style.display ='none' // remove upcomming words section

        let div = document.createElement('div')
        finish.appendChild(div)
        if (words.length == 0 && score.children[0].textContent == score.children[1].textContent) {
            div.classList.add('good')
            div.textContent = 'you won'
        } else {
            div.classList.add('bad')
            div.textContent = 'gameOver'
        }
    }

    // reset everything
    function reset() {
        input.value = '' // clear input field to type something else
        clearInterval(timer)

        remainingTime.textContent = defaultTime
        score.children[0].innerHTML = 0

        upcomingWords.innerHTML = 'Words Will Show Here'
        theWord.innerHTML = ''

        input.addEventListener('keyup', inputCheck) // add the eventListener again after gameover
        input.disabled = false // remove disabled attr from input
        upcomingWords.style.display ='flex' // show upcomming words after gameover
        finish.innerHTML = ''
    }

    // auto build select menu
    function buildSelectMenu(){
        for (const lvl in lvls) {
            let opt = document.createElement('option')
            opt.textContent = lvl + ` : ` + lvls[lvl] + 's'
            opt.value = lvl
            selectMenu.appendChild(opt)
        }
    }

    function rebuildWords(data){
        words = []

        // get setting values or assign it to default values
        let wordMaxLength = (wordMaxLengthInput.value)? wordMaxLengthInput.value: 8
        let wordsNumber = (wordsNumberInput.value)? wordsNumberInput.value : 20
        // rebuid words depending on setting
        for (let i = 0; i < wordsNumber; i++) {
            let randomWord = data[Math.floor(Math.random() * data.length)]
            if (randomWord.length <= wordMaxLength) {
                words.push(randomWord)
            } else {
                i--
            }
        }
    }


// main code
    lvlSpan.textContent = defaultLevel
    timeSpan.textContent = defaultTime
    remainingTime.textContent = defaultTime
    score.children[1].innerHTML = 20

    // auto build select menu
    buildSelectMenu()

    // disable paste event
    input.onpaste = ()=> false


// events
    startButton.addEventListener('click', ()=>{
        // check if setting are valid
        if (wordsNumberInput.value && wordsNumberInput.value < 5) {
            alert('words number can\'t be less than 5')
            return false
        }
        if (wordMaxLengthInput.value && wordMaxLengthInput.value < 3) {
            alert('word length can\'t be less than 3')
            return false
        }

        // disable inputs
        selectMenu.disabled = true
        wordMaxLengthInput.disabled = true
        wordsNumberInput.disabled = true

        startButton.textContent = 'loading random words...'
        // get random words from an API
        fetch('https://random-word-api.herokuapp.com/all')
        .then(res => res.json())
        .then(rebuildWords)
        .then(startGame)
        // if request failed we can began with the default array of words
        .catch(()=>{
            rebuildWords(defaltWords)
            startGame()
        })
    })

    // check what you type
    input.addEventListener('keyup', inputCheck)

    // restart button
    restartButton.addEventListener('click', ()=>{
        restartButton.textContent = 'loading random words...'
        reset()
        startButton.click()
    })

    // exit button
    exitButton.addEventListener('click', ()=>{
        // handle buttons
        exitButton.style.display = 'none'
        restartButton.style.display = 'none'
        startButton.style.display = 'block'

        // remove disabled attr form settings
        selectMenu.disabled = false 
        wordMaxLengthInput.disabled = false 
        wordsNumberInput.disabled = false

        reset()
    })

    // select menu
    selectMenu.addEventListener('change',()=>{
        lvlSpan.textContent = selectMenu.value
        timeSpan.textContent = lvls[selectMenu.value]
        remainingTime.textContent = lvls[selectMenu.value]

        // update defaultLevel and defaultTime
        defaultTime = lvls[selectMenu.value]
        defaultLevel = selectMenu.value
        window.localStorage.setItem('level',`${defaultLevel}`)
    })