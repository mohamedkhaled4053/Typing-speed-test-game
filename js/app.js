// variables
    let theWord = document.querySelector('.the-word')
    let startButton = document.querySelector('.start')
    let upcomingWords = document.querySelector('.upcoming-words')
    let lvlSpan = document.querySelector('.message .lvl')
    let timeSpan = document.querySelector('.message .seconds')
    let input = document.querySelector('input')
    let remainingTime = document.querySelector('.control .time span')
    let score = document.querySelector('.score')
    let finish = document.querySelector('.finish')
    
    // add lvls
    let lvls = {
        easy: 6,
        normal: 4,
        hard: 2,
    }

    // default lvl
    let defaultLevel = 'easy';
    let defaultTime = lvls[defaultLevel]

    // array of words
    const words = [
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


// helper functions

    // get randomWord form array
    function randomWord() {
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
        // stop checking input field
        input.removeEventListener('keyup',inputCheck)

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



// main code
    lvlSpan.textContent = defaultLevel
    timeSpan.textContent = defaultTime
    remainingTime.textContent = defaultTime
    score.children[1].innerHTML = words.length

    // disable paste event
    input.onpaste = ()=> false



// events
    let timer
    startButton.addEventListener('click', ()=>{
        startButton.style.display = 'none' // hide the button
        input.value = '' // clear input field to type something else
        input.focus()
        // count down
        timer = setInterval(() => {
            remainingTime.textContent = remainingTime.textContent - 1
            if (remainingTime.textContent == 0) {
                gameOver()
            }
        }, 1000);
        // get a word
        randomWord()
    })

    // check what you type
    input.addEventListener('keyup', inputCheck)