
function showPassFunction() {
    var passType = document.getElementById("passField")
    var showPassLogo = document.getElementsByClassName("showPass")[0]

    if (passType.type === "password") {
        passType.type = "text"
        showPassLogo.src = "images/eye-big.png"
    
    } else {
        passType.type = "password"
        showPassLogo.src = "images/eye-slash.png"
    }
}