const textarea = document.getElementById("textInput");
const counter = document.getElementById("charCount");

textarea.addEventListener("input", function(){
counter.textContent = textarea.value.length;
});
