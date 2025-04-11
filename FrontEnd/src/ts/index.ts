// eslint-disable-next-line @typescript-eslint/no-require-imports
require("../scss/main.scss");

const barMenuBTN = document.getElementById("barMenuBTN") as HTMLButtonElement;
const navMenu = document.getElementById("navMenu") as HTMLElement;

barMenuBTN.addEventListener("click", () => {
  navMenu.classList.toggle("activeMobileMenu");
});

//subscribe for newliter
const email = document.getElementById("newsLater") as HTMLInputElement;
const sendNewsLaterBtn = document.getElementById(
  "sendNewsLaterBtn"
) as HTMLButtonElement;

sendNewsLaterBtn.addEventListener("click", () => {
  const emailValue: string = email.value;
  fetch("https://example.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.parse(emailValue),
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
});

//send message
// const requisteDemo = document.getElementById("demo") as HTMLInputElement;
// const email = document.getElementById() as HTMLInputElement;
// requisteDemo.addEventListener("click", (e) => {
//   e.preventDefault();
// });
