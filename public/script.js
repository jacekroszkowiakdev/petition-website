(function signatureDraw() {
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    let signature = document.querySelector("#signature");
    let dataURL;

    // Attach a mousedown, mousemove, and mouseup event listener to the canvas DOM
    // on mousedown, get the mouse coordinates, and use the moveTo() method to position your drawing cursor and the beginPath() method to begin a new drawing path.
    // on mousemove, continuously add a new point to the path with lineTo(), and color the last segment with stroke().
    // on mouseup, set a flag to disable the drawing.

    canvas.addEventListener("mousedown", (evt) => {
        let flag = true;
        let canvasX = canvas.getBoundingClientRect().left;
        let canvasY = canvas.getBoundingClientRect().top;
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(evt.pageX - canvasX, evt.pageY - canvasY);

        canvas.addEventListener("mousemove", (evt) => {
            if (flag) {
                ctx.lineTo(evt.pageX - canvasX, evt.pageY - canvasY);
                ctx.stroke();
            }
        });
        canvas.addEventListener("mouseup", () => {
            flag = false;
            dataURL = canvas.toDataURL();
            signature = dataURL;
            console.log("signature: ", signature);
        });
    });
})();

// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAACWCAYAAADwkd5lAAAFm0lEQVR4nO3du27cRhQG4PPUKVzpJVIbfol0hg27dKlSBlQEaWwjDgzEji1LSiEL4nJJLu9zuPw+gE3MXY5ms+efGV42AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAq5/7VR3l3pBgD0cd+wUY7PANiEpvBQwMrR/8AmdIWHArauq9D/wAZ8iIc1dgFS1nV0fw4AafQJDQVseX0/B4AUugrVXcs+zEuAA5tzKjja9mMep4LjLpwDARJqKlgfeu7LNF3BcRcP50Cq9D+QxtBlEQVsHh+j/6yvSv8DKYxZU1fApmubdfS5szx7/2dvHzCDsSdkFYhp2mYdH0e+Ppvs7QMmmnI1jwIx3thZR9d7ZJO9fcAEU8Kj6fX0M7Xf294nm+ztA0aao4gpEMPNFR5N75XNlNkVkNReRsCZ3Ma84REzv9fcbuKwbTdlmwPMYU8j4NJO3RA4Veb+r//twIa9jH2NgEvrCo65+ipz/1u+gjOxxPJJLPB+56IrOOYspln73/IVnIm2ZZQ5ZC1gJTX19e1Kx8rC8hWcgb2OgEtYcqmq7zEzqM92LV/BBq0xEs5YwEpZOzyajplBxjYBAzQVs5crHGfPSoy6s/V/felqqaU7YCFrjoSzFbCSSizXZOt/S1ewYdbg9yVb/5t9wAa9jW2uwff55T2XgLbLFCD1k+fABix1j0cfY4859Le+LYk0yxQgLt2FjVnyHo8+xhT4ocGRqUhmk6lvMrUFOCHDKL167PcD9x+7mYk8yVS0M7UFaNE261j7pOX7GFYwmtrdR/2xGIrTk0z9IuQhsZ/RPip/W6A9Q0+aTi12CtSxrAHiCixIpmkEX7KQDikYc5xgzVQss8jSJ67Agg3IEBwREc/jsGA8P7F/39BTgIbJEiCuwAJ6qy+ndTlVXNqW5TgtS59lmRUDGzCkYHTte+qKK7pl6S/nP4DeqgXjXcd+Y2cfGYriFmToq/r5j9tf211l6/M5m8XADryL/kWrq8D1LSy0y9BXYwJCkMBO/YjpAaKIzKN0gHxuaIMgAVpVv9g/Bux73/LfmgpE/d/73OW+RyUD5L+G41eXsaYsYbVtX1f5y4DFVL/Qrwfs27b1fS3HqsV5zVH6dQz/PIdqCx6zEdio1zGsWIwNj4jjR6UIkWPnHCCPBAmcia8xX4D0Mfb5WXtRKkBexXoBEnH8/111+77QMYGZ1R9seMocRab+2n8Hvv6clQqQqjUD3mwENuxbPH1pv614XLOQZtV7MErdwFfiMSbZngsH9FAqQJ7FYbF4tuKxM8sQIKUepPg9DCxgM67jcOS3ZoBENI84r1duQzYZAuRNHH4ub1Y89lXt2FcrHhsYoH7lzdoB8ncch8jjdrFyW7LIECARh5/F2u2wjAUbUA+QzwXa8E80B8irAm3JIGOAlPxZZctYkFT1ESa3USZAHv0Vh8tpew2Q6lVxNwXbUfL3QMxAILmLyDniv4xc7VlblgApdSLd7AM24CKevqSXZZty5DIESOkAiTgs5Gssp7mMFzbiIh6+pL8XbkebP0o3oJCsAbJ0MW86DwYkdRF5w2PPquceSp6TqrdlqVnIpxAesDm/lW4AjapF9EXhtkQsV9i7HgkPwEAvIl8hrZ9Mn7qUVX8/4QEw0UXkPYE811JW16wj098LsCn1n5L9s2xzjkyZKXQ9cffTjG0E2KXryD0aH7qU9SW6Zxwl77IHYGV97k4/9XvpGcMRgBV0BYLgAKDVqRmG4ACgVZ8Q+VKsdQCk514OAEYTHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwxf9vqbMOV6yewwAAAABJRU5ErkJggg==

// Your string is 2014 characters long
