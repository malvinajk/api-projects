
const resizer = document.querySelector(".resizer")
const leftPanel = document.getElementById("left-panel")
const resizerHandle = document.querySelector(".resizer-handle")

let startX, startY, startWidth, handleHeight;

handleHeight = resizerHandle.offsetHeight;

resizer.addEventListener("mousedown", dragging)



function dragging(e) {
    startX = e.clientX;
    // startY = e.clientY - 20;
    startWidth = parseInt(window.getComputedStyle(leftPanel). width, 10);

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
}



function resize (e){
    const newWidth = startWidth + (e.clientX - startX);
    leftPanel.style.width = `${newWidth}px`;

    updateHandlePosition(e.pageY);
}

function stopResize() {
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
}

document.addEventListener("mousemove", function (e) {
    if (!handleHeight) handleHeight = resizerHandle.offsetHeight;
    updateHandlePosition(e.pageY);
});

function updateHandlePosition(yPage) {
    if (!handleHeight) handleHeight = resizerHandle.offsetHeight;

    const bounds = resizer.getBoundingClientRect();
    const resizerTop = bounds.top + window.scrollY;
    const resizerBottom = bounds.bottom + window.scrollY;



    // Clamp the Y value to prevent overflow
    const clampedY = Math.max(
        resizerTop + handleHeight / 2,
        Math.min(yPage, resizerBottom - handleHeight / 2)
    );

    // Position relative to the resizer (since it's position: relative)
    const localY = clampedY - resizerTop;
    resizerHandle.style.top = `${localY - handleHeight / 2}px`;
}

const url = "https://poetrydb.org/author"
const select = document.getElementById("author-select")
let currentPoems = []

fetch(url)
    .then(res => res.json())
    .then(data => {
        const authorsArray = data.authors
        for(let i = 0; i < authorsArray.length; i++){
            const option = document.createElement("option")
            option.value = authorsArray[i]
            option.innerText = authorsArray[i]
            select.appendChild(option)
        }
    })
    .catch(err => {
        console.log(`fetching data failed because ${err}`)
    })

    select.addEventListener("change", event => {
        let url = `https://poetrydb.org/author/${event.target.value}`
        console.log(url)
        allTitles(url);
        assignName();
    })



    function allTitles(url) {
        const rightPanel = document.getElementById("poem-section");
        rightPanel.innerHTML = "";

        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                let titlesArr = []
                let titles = document.getElementById("titles-list")

                titles.innerHTML = "";

                for(let i = 0; i < data.length; i++) {
                    titlesArr.push(data[i].title)
                    let titleItem = document.createElement("li")
                    titleItem.innerText = data[i].title
                    titles.appendChild(titleItem)
                    titleItem.addEventListener("click", () => {
                        const poem = currentPoems.find(p => p.title === data[i].title);
                        if (poem) displayPoem(poem);
                    });
                }
                console.log(titlesArr)
                currentPoems = data
            })
    }

    function assignName(url) {
        let name = document.getElementById("authors-name")
        const selectedAuthor = select.value;
        name.innerText = selectedAuthor;
    }

function displayPoem(poem) {
    const rightPanel = document.getElementById("poem-section");
    rightPanel.innerHTML = "";

    const titleEl = document.createElement("h2");
    titleEl.innerText = poem.title;
    rightPanel.appendChild(titleEl);

    poem.lines.forEach(line => {
        const lineEl = document.createElement("p");
        lineEl.innerText = line;
        rightPanel.appendChild(lineEl);
    });
    }


