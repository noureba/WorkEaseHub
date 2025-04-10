// eslint-disable-next-line @typescript-eslint/no-require-imports
require("../scss/main.scss");

const barMenuBTN = document.getElementById("barMenuBTN") as HTMLButtonElement;
const navMenu = document.getElementById("navMenu") as HTMLElement;

barMenuBTN.addEventListener("click", () => {
  navMenu.classList.toggle("activeMobileMenu");
});
