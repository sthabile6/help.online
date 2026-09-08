document.addEventListener("DOMContentLoaded", () => {
  /* =========================
       MOBILE MENU
    ========================= */

  const menuButton = document.getElementById("menuButton");
  const navigation = document.getElementById("navigation");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      navigation.classList.toggle("open");
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");
      });
    });
  }

  /* =========================
       QUESTIONNAIRE UNLOCK
    ========================= */

  const lockedCard = document.getElementById("lockedCard");
  const questionnaireBox = document.getElementById("questionnaireBox");

  const unlockButton = document.getElementById("unlockButton");

  const paymentModal = document.getElementById("paymentModal");

  const completePayment = document.getElementById("completePayment");

  const closeModal = document.getElementById("closeModal");

  function unlockQuestionnaire() {
    if (lockedCard) {
      lockedCard.classList.add("hidden");
    }

    if (questionnaireBox) {
      questionnaireBox.classList.remove("hidden");
    }

    if (questionnaireBox) {
      questionnaireBox.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  if (unlockButton) {
    unlockButton.addEventListener("click", () => {
      if (paymentModal) {
        paymentModal.classList.add("active");
      }
    });
  }

  if (completePayment) {
    completePayment.addEventListener("click", () => {
      if (paymentModal) {
        paymentModal.classList.remove("active");
      }

      unlockQuestionnaire();
    });
  }

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      paymentModal.classList.remove("active");
    });
  }

  /* =========================
       QUESTIONNAIRE STEPS
    ========================= */

  const formSteps = document.querySelectorAll(".form-step");

  const nextButton = document.getElementById("nextButton");

  const previousButton = document.getElementById("previousButton");

  const submitButton = document.getElementById("submitButton");

  const progressBar = document.getElementById("progressBar");

  const stepText = document.getElementById("stepText");

  const percentage = document.getElementById("percentage");

  let currentStep = 1;

  function updateStep() {
    formSteps.forEach((step) => {
      step.classList.remove("active");

      if (Number(step.dataset.step) === currentStep) {
        step.classList.add("active");
      }
    });

    const percent = currentStep * 25;

    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }

    if (stepText) {
      stepText.textContent = `Step ${currentStep} of 4`;
    }

    if (percentage) {
      percentage.textContent = `${percent}%`;
    }

    if (previousButton) {
      if (currentStep === 1) {
        previousButton.classList.add("hidden");
      } else {
        previousButton.classList.remove("hidden");
      }
    }

    if (nextButton) {
      if (currentStep === 4) {
        nextButton.classList.add("hidden");
      } else {
        nextButton.classList.remove("hidden");
      }
    }

    if (submitButton) {
      if (currentStep === 4) {
        submitButton.classList.remove("hidden");
      } else {
        submitButton.classList.add("hidden");
      }
    }
  }

  function validateCurrentStep() {
    const activeStep = document.querySelector(
      `.form-step[data-step="${currentStep}"]`,
    );

    if (!activeStep) {
      return true;
    }

    const requiredFields = activeStep.querySelectorAll("[required]");

    for (const field of requiredFields) {
      if (!field.checkValidity()) {
        field.reportValidity();

        return false;
      }
    }

    return true;
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (!validateCurrentStep()) {
        return;
      }

      if (currentStep < 4) {
        currentStep++;

        updateStep();
      }
    });
  }

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      if (currentStep > 1) {
        currentStep--;

        updateStep();
      }
    });
  }

  /* =========================
       SKILLS
    ========================= */

  const skillInput = document.getElementById("skillInput");

  const addSkill = document.getElementById("addSkill");

  const skillsList = document.getElementById("skillsList");

  const skillsHidden = document.getElementById("skills");

  let skills = [];

  function renderSkills() {
    if (!skillsList) {
      return;
    }

    skillsList.innerHTML = "";

    skills.forEach((skill, index) => {
      const skillElement = document.createElement("span");

      skillElement.className = "skill";

      skillElement.innerHTML = `
                ${escapeHTML(skill)}
                <button
                    type="button"
                    data-index="${index}"
                    aria-label="Remove ${escapeHTML(skill)}"
                >
                    ×
                </button>
            `;

      skillsList.appendChild(skillElement);
    });

    updateHiddenSkills();

    skillsList.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);

        skills.splice(index, 1);

        renderSkills();
      });
    });
  }

  function updateHiddenSkills() {
    if (skillsHidden) {
      skillsHidden.value = skills.join(", ");
    }
  }

  function addNewSkill() {
    if (!skillInput) {
      return;
    }

    const value = skillInput.value.trim();

    if (!value) {
      return;
    }

    if (!skills.includes(value)) {
      skills.push(value);

      renderSkills();
    }

    skillInput.value = "";

    skillInput.focus();
  }

  if (addSkill) {
    addSkill.addEventListener("click", addNewSkill);
  }

  if (skillInput) {
    skillInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();

        addNewSkill();
      }
    });
  }

  function escapeHTML(value) {
    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
  }

  /* =========================
       REAL FORM SUBMISSION
    ========================= */

  const form = document.getElementById("cvForm");

  const formMessage = document.getElementById("formMessage");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!validateCurrentStep()) {
        return;
      }

      updateHiddenSkills();

      const formData = new FormData(form);

      if (formMessage) {
        formMessage.textContent = "Sending your information...";

        formMessage.className = "form-message sending";
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      try {
        const response = await fetch("submit.php", {
          method: "POST",

          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          if (formMessage) {
            formMessage.textContent =
              "Thank you! Your questionnaire has been submitted successfully.";

            formMessage.className = "form-message success";
          }

          form.reset();

          skills = [];

          renderSkills();

          currentStep = 1;

          updateStep();
        } else {
          throw new Error(result.message || "Something went wrong.");
        }
      } catch (error) {
        console.error(error);

        if (formMessage) {
          formMessage.textContent =
            "We couldn't submit your questionnaire. Please try again.";

          formMessage.className = "form-message error";
        }
      }

      if (submitButton) {
        submitButton.disabled = false;

        submitButton.textContent = "Submit Questionnaire";
      }
    });
  }

  updateStep();
});
