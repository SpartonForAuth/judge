var runbutton = document.querySelector(".runbutton");
var execbutton = document.querySelector(".exec");
var settingsbutton = document.querySelector(".settingsbut");
var langpicker = document.getElementById("lang-pick");
var outputArea = document.querySelector("#outputbox");
var inparea = document.querySelector("#inputbox");
var bodytotal = document.querySelector(".remainingbody");
var navbarOfficial = document.querySelector(".navbar");
var ioContainer = document.querySelector(".ioAreaContainer");
var codeAreaContainer = document.querySelector(".codeAreaContainer");
var settingsPage = document.querySelector(".settingspage");
var runanim = document.querySelector(".runanim");


var setOne = document.querySelector(".setOne");
var setTwo = document.querySelector(".setTwo");
var setThree = document.querySelector(".setThree");
var setButTexts = document.getElementsByClassName("setButText");

const closeSet = () => {
    settingsPage.style.display = "none";
}

closeSet();

ace.require("ace/ext/language_tools");
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/c_cpp");

const startTheme = () => {
    runanim.style.display="none";
    inparea.classList.add('dark');
    outputArea.classList.add('dark');
    bodytotal.classList.add('dark');
    navbarOfficial.classList.add('navbar-dark');
    ioContainer.style.backgroundColor = "#2f3129";
    for (var i = 0; i < setButTexts.length; i++) {
        setButTexts[i].style.color = "white";
    }

}

startTheme();

const lightMode = () => {
    editor.setTheme("ace/theme/xcode");
    inparea.classList.remove('dark');
    outputArea.classList.remove('dark');
    inparea.classList.add('light');
    outputArea.classList.add('light');
    bodytotal.classList.remove('dark');
    bodytotal.classList.add('light');
    navbarOfficial.classList.remove('navbar-dark');
    navbarOfficial.classList.add('navbar-light');
    ioContainer.style.backgroundColor = "#eeeeee";
    for (var i = 0; i < setButTexts.length; i++) {
        setButTexts[i].style.color = "black";
    }

}
const darkMode = () => {
    editor.setTheme("ace/theme/monokai");
    inparea.classList.remove('light');
    outputArea.classList.remove('light');
    inparea.classList.add('dark');
    outputArea.classList.add('dark');
    bodytotal.classList.remove('light');
    bodytotal.classList.add('dark');
    navbarOfficial.classList.remove('navbar-light');
    navbarOfficial.classList.add('navbar-dark');
    ioContainer.style.backgroundColor = "#2f3129";
    for (var i = 0; i < setButTexts.length; i++) {
        setButTexts[i].style.color = "white";
    }

}

var isdark = true;
setOne.addEventListener("click", () => {
    if (isdark)
        lightMode();
    else
        darkMode();
    isdark = !isdark;
});


settingsbutton.addEventListener("click", () => {
    settingsPage.style.display = "flex";
})

setThree.addEventListener("click", () => {
    closeSet();
})

var inpMode = true;
const openIOArea = () => {
    ioContainer.style.display = "flex";
    codeAreaContainer.style.height = "65%";
    editor.resize();
    inpMode = !inpMode;
    closeSet();
}
const closeIOArea = () => {
    ioContainer.style.display = "none";
    codeAreaContainer.style.height = "93%";
    editor.resize();
    inpMode = !inpMode;
    closeSet();
}
setTwo.addEventListener("click", () => {
    if (inpMode) {
        closeIOArea();
    } else {
        openIOArea();
    }

});


var langid = 50;
// use setOptions method to set several options at once
editor.setOptions({
    autoScrollEditorIntoView: true,
    copyWithEmptySelection: true,
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});

var subid;
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
var data;
var called;

runbutton.addEventListener("click", () => {

    var issued = true;
    if (!inpMode) {
        openIOArea();
        issued = false;
    }
    if (issued) {
        runanim.style.display="block";
        runbutton.textContent = "SUBMITTING";
        runbutton.classList.add("runbutton-add");
        runbutton.disabled = true;
        outputArea.textContent = "";
        called = 1;
        var inpdata = inparea.value;
        var typedPgm = editor.getValue();
        //    console.log(typedPgm);
        data = JSON.stringify({
            "language_id": langid,
            "source_code": `${typedPgm}`,
            "stdin": inpdata
        });


        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE && called === 1) {
                try {
                    subid = JSON.parse(this.response).token;
                    //                console.log(subid);
                    runbutton.textContent = "COMPILING";
                    goOutp();
                } catch (err) {
                    console.log("some error");
                    runanim.style.display="none";
                    runbutton.textContent = "RUN";
                    runbutton.classList.remove("runbutton-add");
                    runbutton.disabled = false;
                }
            }
        });

        xhr.open("POST", "https://judge0.p.rapidapi.com/submissions");
        xhr.setRequestHeader("x-rapidapi-host", "judge0.p.rapidapi.com");
        xhr.setRequestHeader("x-rapidapi-key", "17ea6ab84cmsh986b74a45401961p1b47a4jsn74daedf4a01c");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("accept", "application/json");

        xhr.send(data);

    }


});
const goOutp = () => {
    called = 2;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE && called === 2) {
            try {
                var resp = JSON.parse(this.response);
                //            console.log(resp);
                var mytimefun;
                if (resp.status.id === 1 || resp.status.id === 2) {
                    goOutp();
                } else {
                    if (resp.status.id === 6) {
                        outputArea.textContent = atob(resp.compile_output);
                    } else if (resp.status.id === 3) {
                        outputArea.textContent = atob(resp.stdout);
                    } else {
                        if (langid === 71) {
                            outputArea.textContent = atob(resp.stderr);
                        } else {

                            outputArea.textContent = resp.status.description;
                        }
                        //if python then stderr report
                    }
                    runanim.style.display="none";
                    runbutton.textContent = "RUN";
                    runbutton.classList.remove("runbutton-add");
                    runbutton.disabled = false;
                    //            clearTimeout(mytimefun);

                }

            } catch (err) {
                console.log(err);
                runanim.style.display="none";
                runbutton.textContent = "RUN";
                runbutton.classList.remove("runbutton-add");
                runbutton.disabled = false;
            }
        }
    });

    xhr.open("GET", `https://judge0.p.rapidapi.com/submissions/${subid}?base64_encoded=true`);
    xhr.setRequestHeader("x-rapidapi-host", "judge0.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "17ea6ab84cmsh986b74a45401961p1b47a4jsn74daedf4a01c");

    xhr.send(data);
};


langpicker.addEventListener("change", () => {
    var sel = langpicker.value;
    if (sel === 'c') {
        langid = 50;
        editor.session.setMode("ace/mode/c_cpp");
    } else if (sel === 'cpp') {
        langid = 54;
        editor.session.setMode("ace/mode/c_cpp");
    } else if (sel === 'python') {
        langid = 71;
        editor.session.setMode("ace/mode/python");
    }
});
