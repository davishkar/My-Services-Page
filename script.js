function myFunction(imgs) {
    var modal = document.getElementById("imgModal");
    var expandImg = document.getElementById("expandedImg");
    var imgText = document.getElementById("imgtext");
    
    // Set the clicked image in the modal
    expandImg.src = imgs.src;
   

    // Show the modal
    modal.style.display = "flex";
}

function closeModal() {
    var modal = document.getElementById("imgModal");
    // Hide the modal
    modal.style.display = "none";
}
