(function signatureDraw() {
    const canvas = $("#canvas");
    const ctx = canvas[0].getContext("2d");
    const signature = $("#signature");
    let dataURL;

    // Attach a mousedown, mousemove, and mouseup event listener to the canvas DOM
    // on mousedown, get the mouse coordinates, and use the moveTo() method to position your drawing cursor and the beginPath() method to begin a new drawing path.
    // on mousemove, continuously add a new point to the path with lineTo(), and color the last segment with stroke().
    // on mouseup, set a flag to disable the drawing.

    canvas.on("mousedown", (evt) => {
        let flag = true;
        let canvasX = canvas.offset().left;
        let canvasY = canvas.offset().top;
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(evt.pageX - canvasX, evt.pageY - canvasY);

        canvas.on("mousemove", (evt) => {
            if (flag) {
                ctx.lineTo(evt.pageX - canvasX, evt.pageY - canvasY);
                ctx.stroke();
            }
        });
        $("canvas").on("mouseup", (evt) => {
            flag = false;
            // dataURL = canvas.val.toDataURL();
            // signature = data.URL;
        });
    });
})();
