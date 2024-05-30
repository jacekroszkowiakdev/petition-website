(function signatureDraw() {
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    let signature = document.querySelector("#signature");
    let dataURL;
    let buttonIsDown = false;
    let canvasX;
    let canvasY;

    function getCanvasPosition(evt) {
        let rect = canvas.getBoundingClientRect();
        canvasX = rect.left;
        canvasY = rect.top;
    }

    // Browser mouse events:
    canvas.addEventListener("mousedown", (evt) => {
        buttonIsDown = true;
        getCanvasPosition(evt);
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(evt.pageX - canvasX, evt.pageY - canvasY);
    });

    canvas.addEventListener("mousemove", (evt) => {
        if (buttonIsDown) {
            ctx.lineTo(evt.pageX - canvasX, evt.pageY - canvasY);
            ctx.stroke();
        }
    });

    canvas.addEventListener("mouseup", () => {
        buttonIsDown = false;
        dataURL = canvas.toDataURL();
        signature.value = dataURL;
        console.log("signature.value: ", signature.value);
    });

    // Touch events:
    canvas.addEventListener("touchstart", (evt) => {
        c;
        buttonIsDown = true;
        getCanvasPosition(evt.touches[0]);
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(
            evt.touches[0].pageX - canvasX,
            evt.touches[0].pageY - canvasY
        );
    });

    canvas.addEventListener("touchmove", (evt) => {
        if (buttonIsDown) {
            ctx.lineTo(
                evt.touches[0].pageX - canvasX,
                evt.touches[0].pageY - canvasY
            );
            ctx.stroke();
        }
        evt.preventDefault(); // Prevent scrolling when drawing
    });

    canvas.addEventListener("touchend", () => {
        buttonIsDown = false;
        dataURL = canvas.toDataURL();
        signature.value = dataURL;
        console.log("signature.value: ", signature.value);
    });
})();
