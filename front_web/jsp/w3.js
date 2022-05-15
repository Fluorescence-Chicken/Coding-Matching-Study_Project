// 외부에서 다른 html 호출하는 스크립트 
window.addEventListener('load', function() {
    var allElements = document.getElementsByTagName('*');
    Array.prototype.forEach.call(allElements, function(el) {
        var includePath = el.dataset.includePath;
        if (includePath) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    el.outerHTML = this.responseText;
                }
            };
            xhttp.open('GET', includePath, true);
            xhttp.send();
        }
    });
});

/*(function() {
    let onpageLoad = localStorage.getItem("theme") || "";
    let element = document.body;
    element.classList.add(onpageLoad);
    document.getElementById("theme").textContent =
      localStorage.getItem("theme") || "light";
      localStorage.clear();
  })();*/
// This function makes website Dark mode and create alarm that indicates dark mode is started.
// Using bootstrap's class "dark-mode" to make website dark mode.
// dark mode is handled by localStorage's key "theme"
// If localStorage's key "theme" is "dark", then dark mode is activated.
function darkzzing(){
    // Edit this variable to change the text of the alert.
    const darkmode_alert_message = "Dark mode is activated. 다크 모드 활성화 되어짐.";
  
    let element = document.body;
    // Toggle dark mode
    element.classList.toggle("dark-mode");
    // Toggles the "theme" in localStorage between "dark" and "normal"
    localStorage.setItem("theme", element.classList.contains("dark-mode") ? "dark" : "normal");
    // If dark mode is enabled, then create dark mode alert message
    if(localStorage.getItem("theme") === "dark"){
      // Creates frame
      var alert_element = document.createElement("div");
      alert_element.setAttribute("name", "dark-mode-alert");
      alert_element.setAttribute("class", "alert-custom " + "alert-success " + "theme ");
      // Creates <strong> element
      var strong_element = document.createElement("strong");
      // creates <i> element
      var i_element = document.createElement("i");
      i_element.setAttribute("class", "fa "+ "fa-exclamation-circle " +  "fa-lg ");
      // creates <center> element
      var center_element = document.createElement("center");
      // Insert Text elements into <center> element
      center_element.appendChild(document.createTextNode(darkmode_alert_message));
      // insert <i>, <center> element into <strong>
      strong_element.appendChild(i_element);
      strong_element.appendChild(center_element);
      // insert <strong> element into <div> element
      alert_element.appendChild(strong_element);
      // insert <div> element under the <header> element
      document.getElementsByTagName("header")[0].appendChild(alert_element);
    } else {
      // If dark mode is disabled, then remove dark mode alert message.
      // Alert message's name is "dark-mode-alert"
      var alert_element = document.getElementsByName("dark-mode-alert");
      // If alert message exists, then remove it.
      if(alert_element.length > 0){
        alert_element[0].remove();
      }
    }
}