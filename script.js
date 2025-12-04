(function () {
      // --- Element references ---
      const previewTitle = document.getElementById("preview-title");
      const previewSubtitle = document.getElementById("preview-subtitle");
      const previewBody = document.getElementById("preview-body");
      const previewFrom = document.getElementById("preview-from");
      const previewButtonText = document.getElementById("preview-button-text");
      const previewButtonIcon = document.getElementById("preview-button-icon");
      const toggleBtn = document.getElementById("toggle-card-btn");
      const insideCard = document.getElementById("inside-card");

      const titleInput = document.getElementById("title-input");
      const subtitleInput = document.getElementById("subtitle-input");
      const messageInput = document.getElementById("message-input");
      const fromInput = document.getElementById("from-input");
      const buttonLabelInput = document.getElementById("button-label-input");
      const cardForm = document.getElementById("card-form");

      let isOpen = false;

      // --- Simple card open/close interaction ---
      function updateCardState() {
        if (isOpen) {
          insideCard.classList.remove("pointer-events-none");
          insideCard.classList.add("card-pop");
          insideCard.style.opacity = "1";
          previewButtonText.textContent = window.elementSdk
            ? (window.elementSdk.config.button_text || defaultConfig.button_text)
            : (buttonLabelInput.value || "Open Card");
          previewButtonIcon.textContent = "✕";
        } else {
          insideCard.style.opacity = "0";
          insideCard.classList.add("pointer-events-none");
          previewButtonText.textContent = window.elementSdk
            ? (window.elementSdk.config.button_text || defaultConfig.button_text)
            : (buttonLabelInput.value || "Open Card");
          previewButtonIcon.textContent = "➜";
        }
      }

      toggleBtn.addEventListener("click", function () {
        isOpen = !isOpen;
        updateCardState();
      });

      // Prevent form submit reloading page
      cardForm.addEventListener("submit", function (e) {
        e.preventDefault();
      });

      // --- Local preview updates (when not using Canva’s editor) ---
      function updateFromInputs() {
        previewTitle.textContent = titleInput.value || "Happy Teachers’ Day!";
        previewSubtitle.textContent = subtitleInput.value || "To the best teacher ever";
        previewBody.textContent =
          messageInput.value ||
          "Thank you for inspiring, guiding, and supporting me every single day. Your patience and passion make learning feel magical.";
        previewFrom.textContent = fromInput.value || "With love, Your student";
        previewButtonText.textContent = buttonLabelInput.value || "Open Card";
      }

      ["input", "keyup"].forEach(function (eventName) {
        titleInput.addEventListener(eventName, updateFromInputs);
        subtitleInput.addEventListener(eventName, updateFromInputs);
        messageInput.addEventListener(eventName, updateFromInputs);
        fromInput.addEventListener(eventName, updateFromInputs);
        buttonLabelInput.addEventListener(eventName, updateFromInputs);
      });

      updateFromInputs();

      // ---------------- Canva Element SDK Integration ----------------
      const defaultConfig = {
        main_title: "Happy Teachers’ Day!",
        subtitle_text: "To the best teacher ever",
        body_message:
          "Thank you for inspiring, guiding, and supporting me every single day.\nYour patience and passion make learning feel magical.",
        from_text: "With love, Your student",
        button_text: "Open Card",
        background_color: "#0f172a",
        surface_color: "#1b263b",
        text_color: "#f1faee",
        primary_action_color: "#ffe66d",
        secondary_action_color: "#f4a261",
        font_family: "system-ui",
        font_size: 16
      };

      async function onConfigChange(config) {
        const cfg = Object.assign({}, defaultConfig, config || {});

        // Apply text from config
        previewTitle.textContent = cfg.main_title;
        previewSubtitle.textContent = cfg.subtitle_text;
        previewBody.textContent = cfg.body_message;
        previewFrom.textContent = cfg.from_text;
        previewButtonText.textContent = cfg.button_text;

        // Sync inputs with config (for when used inside Canva editor)
        titleInput.value = cfg.main_title;
        subtitleInput.value = cfg.subtitle_text;
        messageInput.value = cfg.body_message;
        fromInput.value = cfg.from_text;
        buttonLabelInput.value = cfg.button_text;

        // Apply colors
        document.body.style.background =
          "linear-gradient(to bottom right, " +
          cfg.background_color +
          ", #1d3557)";

        const previewCard = document.querySelector("article");
        if (previewCard) {
          previewCard.style.backgroundColor = cfg.surface_color;
          previewCard.style.borderColor = cfg.surface_color;
        }

        const textElements = [
          previewTitle,
          previewSubtitle,
          previewBody,
          previewFrom,
          document.querySelector("h2.text-lg"),
          document.querySelector("p.text-xs.text-[#f1faee]/70.mb-4"),
          document.querySelector("p.mt-4.text-[11px].text-[#f1faee]/60"),
          document.querySelector("footer")
        ];

        textElements.forEach(function (el) {
          if (el) {
            el.style.color = cfg.text_color;
          }
        });

        toggleBtn.style.backgroundColor = cfg.primary_action_color;
        toggleBtn.style.color = "#0b1320";

        // Font family and sizing (base scale)
        var customFont = cfg.font_family || defaultConfig.font_family;
        var baseStack = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        var baseSize = cfg.font_size || defaultConfig.font_size;

        var headingEls = [previewTitle, document.querySelector("h2.text-lg")];
        headingEls.forEach(function (el) {
          if (el) {
            el.style.fontFamily = customFont + ", " + baseStack;
            el.style.fontSize = (baseSize * 1.6) + "px";
          }
        });

        var bodyEls = [
          previewBody,
          document.querySelector("p.text-xs.text-[#f1faee]/70.mb-4"),
          document.querySelector("p.mt-4.text-[11px].text-[#f1faee]/60"),
          document.querySelector("footer"),
          insideCard.querySelector("#inside-main-text"),
          insideCard.querySelector("#inside-small-text")
        ];
        bodyEls.forEach(function (el) {
          if (el) {
            el.style.fontFamily = customFont + ", " + baseStack;
            el.style.fontSize = baseSize + "px";
          }
        });

        var smallEls = [
          previewSubtitle,
          document.querySelector("p.text-xs.text-[#f1faee]/80.mb-1"),
          document.querySelector("p.text-xs.text-[#f1faee]/60")
        ];
        smallEls.forEach(function (el) {
          if (el) {
            el.style.fontFamily = customFont + ", " + baseStack;
            el.style.fontSize = (baseSize * 0.85) + "px";
          }
        });

        toggleBtn.style.fontFamily = customFont + ", " + baseStack;

        // Re-apply open/close label in case button text changed
        updateCardState();
      }

      function mapToCapabilities(config) {
        var cfg = Object.assign({}, defaultConfig, config || {});
        return {
          recolorables: [
            {
              get: function () {
                return cfg.background_color;
              },
              set: function (value) {
                if (window.elementSdk) {
                  window.elementSdk.setConfig({ background_color: value });
                }
              }
            },
            {
              get: function () {
                return cfg.surface_color;
              },
              set: function (value) {
                if (window.elementSdk) {
                  window.elementSdk.setConfig({ surface_color: value });
                }
              }
            },
            {
              get: function () {
                return cfg.text_color;
              },
              set: function (value) {
                if (window.elementSdk) {
                  window.elementSdk.setConfig({ text_color: value });
                }
              }
            },
            {
              get: function () {
                return cfg.primary_action_color;
              },
              set: function (value) {
                if (window.elementSdk) {
                  window.elementSdk.setConfig({ primary_action_color: value });
                }
              }
            },
            {
              get: function () {
                return cfg.secondary_action_color;
              },
              set: function (value) {
                if (window.elementSdk) {
                  window.elementSdk.setConfig({ secondary_action_color: value });
                }
              }
            }
          ],
          borderables: [],
          fontEditable: {
            get: function () {
              return cfg.font_family;
            },
            set: function (value) {
              if (window.elementSdk) {
                window.elementSdk.setConfig({ font_family: value });
              }
            }
          },
          fontSizeable: {
            get: function () {
              return cfg.font_size;
            },
            set: function (value) {
              if (window.elementSdk) {
                window.elementSdk.setConfig({ font_size: value });
              }
            }
          }
        };
      }

      function mapToEditPanelValues(config) {
        var cfg = Object.assign({}, defaultConfig, config || {});
        return new Map([
          ["main_title", cfg.main_title],
          ["subtitle_text", cfg.subtitle_text],
          ["body_message", cfg.body_message],
          ["from_text", cfg.from_text],
          ["button_text", cfg.button_text]
        ]);
      }

      if (window.elementSdk && typeof window.elementSdk.init === "function") {
        window.elementSdk.init({
          defaultConfig: defaultConfig,
          onConfigChange: onConfigChange,
          mapToCapabilities: mapToCapabilities,
          mapToEditPanelValues: mapToEditPanelValues
        });
      } else {
        // If not in Canva, still apply default styles and state
        onConfigChange(defaultConfig);
      }
    })();