
document.getElementById("toggleMembers").onclick = function() {
    console.log("show members");
    if (document.getElementById("memberList").style.display == "none") {
    document.getElementById("memberList").style.display = "flex";
    }
    else {
        document.getElementById("memberList").style.display = "none";
    }
}