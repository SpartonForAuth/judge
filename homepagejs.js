var runbutton = document.querySelector(".runbutton");
var execbutton = document.querySelector(".exec");
var langpicker = document.getElementById("lang-pick");
var outputArea = document.querySelector("#outputbox");
var inparea = document.querySelector("#inputbox");
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/c_cpp");

var langid = 50;
// use setOptions method to set several options at once
editor.setOptions({
    autoScrollEditorIntoView: true,
    copyWithEmptySelection: true,
});

var subid;
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
var data;
var called;

runbutton.addEventListener("click", () => {
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
                console.log("some");
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
});
const goOutp = () => {
    called = 2;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE && called === 2) {
            try{
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
                    outputArea.textContent = atob(resp.status.description);
                }
                runbutton.textContent = "RUN";
                runbutton.classList.remove("runbutton-add");
                runbutton.disabled = false;
                //            clearTimeout(mytimefun);

            }
                
            }catch(err){
                console.log("some err");
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
