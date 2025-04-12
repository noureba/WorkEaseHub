/* eslint-disable @typescript-eslint/no-require-imports */
require("../scss/main.scss");

const backendUrl = process.env.BACKEND_URL;

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
const statusElement = document.getElementById("status") as HTMLElement;

sendNewsLaterBtn.addEventListener("click", () => {
  interface emailInrface {
    email: string;
  }
  const userEmail: emailInrface = {
    email: email.value,
  };

  fetch(`${backendUrl}/api/save-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userEmail),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        statusElement.innerText = data.message;
        statusElement.style.color = "green";
        email.value = "";
      } else {
        statusElement.innerText = data.message;
        statusElement.style.color = "red";
      }
    })
    .catch((err) => {
      alert(err);
    });
});

//send message
const requisteDemo = document.getElementById("demo") as HTMLInputElement;
const emailElement = document.getElementById("email") as HTMLInputElement;
const messageElement = document.getElementById(
  "message"
) as HTMLTextAreaElement;
const emailStatus = document.getElementById("email-status") as HTMLElement;

requisteDemo.addEventListener("click", (e) => {
  e.preventDefault();
  requisteDemo.style.cursor = "wait";

  interface datainterface {
    email: string;
    message: string;
  }
  const info: datainterface = {
    email: emailElement.value,
    message: messageElement.value,
  };

  fetch(`${backendUrl}/api/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        emailStatus.innerText = data.message;
        emailStatus.style.color = "green";
        emailElement.value = "";
        messageElement.value = "";
        requisteDemo.style.cursor = "alias";
      } else {
        emailStatus.innerText = data.message;
        emailStatus.style.color = "red";
      }
    })
    .catch((err) => {
      alert(err);
    });
});
