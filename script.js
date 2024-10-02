document.addEventListener('DOMContentLoaded', function(){

    Promise.all([

        fetch('acupoints.json').then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch acupoints.json');
            }
            return response.json();
        }).catch(error => {
            console.error("Error fetching acupoints.json:", error);
        }),

        fetch('acupointsFunction.json').then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch acupointsFunction.json');
            }
            return response.json();
        }).catch(error => {
            console.error("Error fetching acupointsFunction.json:", error);
        })
    ])

        .then(([jsonData, acupointfunctionData]) => {
            const points = document.querySelectorAll('.acupoint span');
            const imgDisplay = document.getElementById('img-display');
            const songInfoDisplay = document.getElementById('jsonText');
            const audioPlayer = document.getElementById('audio-player');
            const albumCoverDisplay = document.getElementById('albumCover');
            const acupointFunctionDisplay = document.getElementById('acupointfunction');
            // console.log('Fetched JSON data:', jsonData); 
            points.forEach(point =>{
                const title = point.getAttribute('data-title');
                const acupointName = point.getAttribute('id')
                const matchingTrack = jsonData.find(track => track.title === title);
                const matchingFunction = acupointfunctionData.find(track => track.id === acupointName);

                if (matchingFunction) {
                    console.log('Matching Function: all good');
                } else {
                    console.error('No matching function for', title);
                }

                if(matchingTrack) {
                    point.addEventListener('mouseenter', function() {
                        imgDisplay.style.backgroundImage = `url(${matchingTrack.picture})`;
                        imgDisplay.style.left = `${point.offsetLeft + 20}px`;
                        imgDisplay.style.top = `${point.offsetTop}px`; 
                        imgDisplay.style.width = "8vw"; 
                        imgDisplay.style.height = "8vw";
                        imgDisplay.style.backgroundSize = "cover";
                        imgDisplay.style.display = 'block'; 
                        imgDisplay.style.opacity = '1';
                        imgDisplay.style.transitionDelay = '0s';
                    });

                    point.addEventListener('click',function(){
                        // console.log('Deep Thought in click event:', matchingTrack.deepThought);

                        albumCoverDisplay.style.backgroundImage =  `url(${matchingTrack.picture})`

                        setTimeout(() => {
                            albumCoverDisplay.classList.add('show'); 
                        }, 100);

                        acupointFunctionDisplay.innerHTML = '';
                        acupointFunctionDisplay.style.opacity = '0';

                        displayTypingEffect(songInfoDisplay, matchingTrack,)
                        
                        setTimeout(() => {
                            displayacupointsFunction(acupointFunctionDisplay, matchingFunction,);
                        console.log('displayDeepThought function is running');
                    }, 3500);

                    })

                    point.addEventListener('mouseleave', function(){
                        imgDisplay.style.opacity = '0';
                        imgDisplay.style.transitionDelay = '0s'; 
                    });

                    point.addEventListener('click', function(event){
                        event.stopPropagation();
                        audioPlayer.src = matchingTrack.audioUrl;
                        audioPlayer.style.display = 'none';
                        audioPlayer.play();
                    })
                }
                else{
                    console.error('nomatching')
                }

                document.addEventListener('click', function(){
                    if(!audioPlayer.paused){
                        audioPlayer.pause();
                    }
                })
            })
        })
})

function displayTypingEffect(element, trackData){
    const textContent = `
    {
        "title": "${trackData.title}",
        "artist": "${trackData.artist}",
        "album": "${trackData.album}",
        "duration": "${trackData.duration} seconds",
        "id": "${trackData.id}"
    },
            `;

    const words = textContent.split('')
    element.innerHTML = '';
    console.log(textContent)

    let wordIndex = 0;

    function typeNextChar(){
        if(wordIndex < words.length){
            element.innerHTML += words[wordIndex]+''
            wordIndex++;

            element.scrollTop = element.scrollHeight;

            const randomDelay = Math.floor(Math.random() * (20 - 5 + 1)) + 5; 
            setTimeout(typeNextChar, randomDelay); 
        }
    }

    typeNextChar();
}

function displayacupointsFunction(element, trackFunction) {

    const functionText = `
        <p>${trackFunction.name}:</p>
        <p>${trackFunction.function_Chinese}</p>
        <p>${trackFunction.function_English}</p>
    `;

    element.innerHTML = '';
    element.style.opacity = '0';

    setTimeout(function() {
        element.style.opacity = '1'; 
        element.innerHTML = functionText;
    }, 300); 
}

function playAudio(url){
    new Audio(url).play();
}