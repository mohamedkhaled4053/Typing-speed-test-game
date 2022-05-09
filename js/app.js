// variables
    let theWord = document.querySelector('.the-word')
    let startButton = document.querySelector('.start')
    let restartButton = document.querySelector('.restart')
    let exitButton = document.querySelector('.exit')
    let upcomingWords = document.querySelector('.upcoming-words')
    let lvlSpan = document.querySelector('.message .lvl')
    let timeSpan = document.querySelector('.message .seconds')
    let input = document.querySelector('input')
    let remainingTime = document.querySelector('.control .time span')
    let score = document.querySelector('.score')
    let finish = document.querySelector('.finish')
    let selectMenu = document.querySelector('.message select')
    
    // add lvls
    let lvls = {
        easy: 6,
        normal: 4,
        hard: 2,
    }

    // default lvl
    let defaultLevel = 'normal';
    let defaultTime = lvls[defaultLevel]

    // array of words
    let words = [
        "Hello",
        "Programming",
        "Code",
        "Javascript",
        "Town",
        "Country",
        "Testing",
        "Youtube",
        "Linkedin",
        "Twitter",
        "Github",
        "Leetcode",
        "Internet",
        "Python",
        "Scala",
        "Destructuring",
        "Paradigm",
        "Styling",
        "Cascade",
        "Documentation",
        "Coding",
        "Funny",
        "Working",
        "Dependencies",
        "Task",
        "Runner",
        "Roles",
        "Test",
        "Rust",
        "Playing"
    ];

    let callbackWords = [...words]

// helper functions

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
            startButton.click()
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
        selectMenu.disabled = false // remove disabled attr form selectMenu

        remainingTime.textContent = defaultTime
        score.children[0].innerHTML = 0
        words = [...callbackWords]

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
            opt.textContent = lvl
            opt.value = lvl
            selectMenu.appendChild(opt)
        }
    }


// main code
    lvlSpan.textContent = defaultLevel
    timeSpan.textContent = defaultTime
    remainingTime.textContent = defaultTime
    score.children[1].innerHTML = words.length

    // auto build select menu
    buildSelectMenu()

    // disable paste event
    input.onpaste = ()=> false


// events
    let timer
    startButton.addEventListener('click', ()=>{
        startButton.style.display = 'none' // hide the button
        restartButton.style.display = 'block'
        exitButton.style.display = 'block'
        selectMenu.disabled = true
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
    })

    // check what you type
    input.addEventListener('keyup', inputCheck)

    // restart button
    restartButton.addEventListener('click', ()=>{
        reset()
        startButton.click()
    })

    // exit button
    exitButton.addEventListener('click', ()=>{
        exitButton.style.display = 'none'
        restartButton.style.display = 'none'
        startButton.style.display = 'block'
        reset()
    })

    // select menu
    selectMenu.addEventListener('change',()=>{
        lvlSpan.textContent = selectMenu.value
        timeSpan.textContent = lvls[selectMenu.value]
        remainingTime.textContent = lvls[selectMenu.value]
    })