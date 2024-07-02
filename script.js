document.addEventListener("DOMContentLoaded", function () {
  console.log("screenSlide/skyScroll/script.js");

  //   WINDOW.ONLOAD FUNCTION ----------------------------------------------

  //   I was having an issue with the  (especially on the x-axis) scroll
  //   position when the page was reloaded. This window.onload function
  //   scrolls the page to the top when the page is reloaded.

  window.onload = function () {
    setTimeout(function () {
      window.scrollTo(0, 0);
    }, 100);
  };

  //   MODAL FUNCTION -----------------------------------------------------

  //   This page had music and sfx and web browsers require a user
  //   interaction to start audio. This modal is displayed when the
  //   page is loaded to allow the audio to play.

  let modal = document.getElementById("startModal");
  modal.classList.add("show");
  document.body.classList.add("body-fixed");

  document.getElementById("startButton").addEventListener("click", function () {
    closeModal();
    document.body.classList.remove("body-fixed");
  });

  function closeModal() {
    let modal = document.getElementById("startModal");
    let storyOneBtn = document.querySelector(".story__part-one--btn");

    modal.style.opacity = 0;

    setTimeout(function () {
      modal.classList.remove("show");
    }, 2000);

    storyOneBtn.classList.add("show-btn");
  }

  document.getElementById("startButton").addEventListener("click", function () {
    closeModal();
  });

  //   AUDIO FUNCTION -----------------------------------------------------

  //   This is how howler.js is used to play audio on the page.
  //   The audio files are loaded and stored in an object and called within
  //   other functions. Sort of a local api for the audio.

  let soundAllowed = false;
  let sfx = {};

  document.addEventListener("click", function handleFirstInteraction() {
    if (!soundAllowed) {
      sfx = {
        breeze: new Howl({
          src: ["./audio/breeze.mp3"],
          volume: 0.5,
        }),
        clickOn: new Howl({
          src: ["./audio/click-on.mp3"],
          volume: 0.8,
        }),
        clickOff: new Howl({
          src: ["./audio/click-off.mp3"],
        }),
        projectsTheme: new Howl({
          src: ["./audio/projects-theme_mid-fi.mp3"],
          volume: 0.2,
        }),
        shipApproach: new Howl({
          src: ["./audio/ship-approach__2.mp3"],
        }),
        hoist: new Howl({
          src: ["./audio/hoist-test__3.mp3"],
          volume: 0.2,
        }),
        remoteClicks: new Howl({
          src: ["./audio/remote-clicks.mp3"],
        }),
        soundOfSpace: new Howl({
          src: ["./audio/sound-of-space.mp3"],
          volume: 0.2,
        }),
        laserCannon: new Howl({
          src: ["./audio/laser-cannon.mp3"],
          volume: 0.5,
        }),
      };
      console.log("Sounds initialized.");
      soundAllowed = true; // Set flag to true after initializing sounds
      document.removeEventListener("click", handleFirstInteraction);
    }
  });

  //   SMOOTH SCROLL FUNCTION ---------------------------------------------

  //   This function is used to scroll the page to a specific element.

  function smoothScrollTo(targetY, duration) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    // scrollAnimation makes use of requestAnimationFrame to animate the scroll.
    // It calculates the next position of the scroll based on the easing function
    // and the time elapsed since the start of the scroll.
    // This helps to create a smoother scroll effect.

    function scrollAnimation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const nextY = easeFunction(timeElapsed, startY, distance, duration);

      window.scrollTo(0, nextY);

      if (timeElapsed < duration) {
        requestAnimationFrame(scrollAnimation);
      } else {
        window.scrollTo(0, targetY);
      }
    }

    requestAnimationFrame(scrollAnimation);
  }

  // Ease function - can be adjusted to change scroll behavior

  function easeFunction(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  function getCumulativeOffset(element) {
    let top = 0;
    do {
      top += element.offsetTop || 0;
      element = element.offsetParent;
    } while (element);

    return top;
  }

  function smoothScrollToCenter(element, duration) {
    const viewportHeight = window.innerHeight;
    const elementHeight = element.offsetHeight;
    const elementOffsetTop = getCumulativeOffset(element);

    // Calculate the extra space above and below the element when it's centered

    const extraSpace = (viewportHeight - elementHeight) / 2;

    // Calculate the target scroll position to center the element

    let targetY = elementOffsetTop - extraSpace;

    // If the element is taller than the viewport, adjust targetY so we don't scroll too far

    if (elementHeight > viewportHeight) {
      targetY = elementOffsetTop;
    } else {
      // Ensure we don't scroll to a negative offset

      targetY = Math.max(targetY - 20, 0); // Adjusted the offset by 20px to add some padding
    }

    smoothScrollTo(targetY, duration);
  }

  //  SCROLL TO EVENT LISTENERS ------------------------------------------

  const storyOne = document.querySelector(".sky__section-one");
  const storyOneBtn = document.querySelector(".story__part-one--btn");
  const sunButton = document.querySelector(".direction-button--up");
  const storyFour = document.querySelector(".story__part-four");
  const storyFourBtn = document.querySelector(".story__part-four--btn");

  storyOneBtn.addEventListener("click", () => {
    sfx.remoteClicks.play();
    if (!sfx.breeze.playing() && !sfx.projectsTheme.playing()) {
      sfx.breeze.play();
      sfx.projectsTheme.play();
    }
    smoothScrollToCenter(storyFour, 15000);
  });

  sunButton.addEventListener("click", () => {
    smoothScrollToCenter(storyOne, 15000);
  });

  storyFourBtn.addEventListener("click", () => {
    if (!sfx.soundOfSpace.playing()) {
      sfx.soundOfSpace.play();
    }
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    smoothScrollTo(documentHeight, 15000); // Adjust the duration as needed
  });

  //  CREATE STARS FUNCTION ----------------------------------------------

  //  Uses math.random to duplicate stars designs from the css file and randomly
  //  place them on the screen.

  function createStars() {
    const space = document.querySelector(".space");

    // Function to create a star

    function createStar(type, amount) {
      for (let i = 0; i < amount; i++) {
        const star = document.createElement("div");
        star.className = `star ${type}`;

        // Generate random positions within the specified ranges

        const top = Math.random() * (150 - 65) + 65; // top: 65% to 150%
        const left = Math.random() * (99 - 0) + 0; // left: 0% to 99%

        // Apply the positions

        star.style.top = `${top}%`;
        star.style.left = `${left}%`;

        space.appendChild(star);
      }
    }

    // Duplicate the stars

    createStar("star-one", 1000);
    createStar("star-two", 100);
    createStar("star-three", 75);
    createStar("star-four", 50);
    createStar("star-five", 25);
  }

  createStars();

  //  PARALLAX EFFECT FUNCTION -------------------------------------------

  //  Parallax effect is a technique where the background content moves at a
  //  different speed than the foreground content while scrolling.
  //  This function applies a parallax effect to elements using the
  //  getBoundingClientRect() method to calculate the position of the element
  //  relative to the viewport and using the transform property to move the
  //  element based on the calculated position.
  //  Basically, the closer the element is to the center of the viewport, the
  //  less it moves. The further away, the more it moves.

  const bird = document.querySelectorAll(".bird");
  const cloudOne = document.querySelectorAll(".cloud-one__container");

  const applyTransform = (elements, directionMultiplier) => {
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how far this element is from the center of the viewport
      // rect.top is the distance from the top .height is the height of the element

      const centerDistance = rect.top + rect.height / 2 - windowHeight / 2;

      // Apply the transformation, adjust multiplier to control the effect's strength

      const transformValue = centerDistance * 0.5 * directionMultiplier;

      if (element.classList.contains("bird")) {
        element.style.transform = `translateX(${transformValue}px) scale(0.3)`;
      } else {
        element.style.transform = `translateX(${transformValue}px)`;
      }
    });
  };

  //  BIRD/CLOUD SCROLL EVENT LISTENER ------------------------------------

  //  This uses requestAnimationFrame() to optimize the performance of the scroll
  //  event listener by ensuring that the transformations are applied only once per frame.
  //  This prevents the browser from having to recalculate the layout multiple times.
  //  Essentially, when the user isn't scrolling, the transformations are not applied.

  let scrollInProgress = false;

  const handleScroll = () => {
    if (!scrollInProgress) {
      requestAnimationFrame(() => {
        applyTransform(bird, -2);
        applyTransform(cloudOne, 4);
        scrollInProgress = false;
      });
    }
    scrollInProgress = true;
  };

  //  SPACE SHIP ANIMATION FUNCTION ---------------------------------------

  //  This function uses the Intersection Observer API to trigger the space ship animation
  //  Intersection Observer API is used to detect when the space ship is in the viewport.
  //  spaceShipAnimation() is called but only starts when the space ship is visible.

  //  REFACTOR?? The scale going from it's original to 0 when intersected and back was done to
  //  prevent issues with x-axis getting wonky on page refresh. This may have been solved by
  //  the window.onload function...

  const spaceShipAnimation = () => {
    const spaceShip = document.querySelector(".space-ship");
    const leftLaser = document.querySelector(".laser--one");
    const rightLaser = document.querySelector(".laser--two");
    const footer = document.querySelector(".footer");
    const me = document.querySelector(".me-torso");
    const gunBarrel = document.querySelectorAll(".gun__barrel");
    const sunglasses = document.querySelector(".sunglasses");
    const observer = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            spaceShip.style.transform = "scale(0)";
            spaceShip.style.transition = "transform 0s";
            sfx.shipApproach.play();

            setTimeout(() => {
              let scaleValue = "scale(0.8)";
              let transitionDuration = "15s";

              if (window.matchMedia("(max-width: 400px)").matches) {
                scaleValue = "scale(0.4)";
                transitionDuration = "8s";
              } else if (window.matchMedia("(max-width: 600px)").matches) {
                scaleValue = "scale(0.5)";
                transitionDuration = "8s";
              } else if (window.matchMedia("(max-width: 800px)").matches) {
                scaleValue = "scale(0.6)";
                transitionDuration = "10s";
              } else if (window.matchMedia("(max-width: 1200px)").matches) {
                scaleValue = "scale(0.7)";
                transitionDuration = "12s";
              }

              // Apply the adjusted scale and transition

              spaceShip.style.transition = `transform ${transitionDuration} ease`;
              spaceShip.style.transform = scaleValue;
              spaceShip.classList.remove("hidden-ship");
              setTimeout(() => {
                sfx.laserCannon.play();
              }, 2500);

              setTimeout(() => {
                sfx.hoist.play();

                me.style.top = "-78px";
                me.style.transition = "top 7s ease";
              }, 8000);

              setTimeout(() => {
                leftLaser.style.visibility = "visible";
                animateLaser(".laser--one", 537, -363, "left", 305);
                rightLaser.style.visibility = "visible";
                animateLaser(".laser--two", 537, -363, "right", 55);
                gunBarrel.forEach((gunBarrel) => {
                  gunBarrel.classList.add("gun__barrel--active");
                });

                setTimeout(() => {
                  gunBarrel.forEach((gunBarrel) => {
                    gunBarrel.classList.remove("gun__barrel--active");
                  });
                }, 200);

                setTimeout(() => {
                  footer.style.display = "flex";
                  leftLaser.style.display = "none";
                  rightLaser.style.display = "none";
                  sunglasses.style.opacity = "1";
                  sunglasses.style.left = "-35px";
                  sunglasses.style.transition = "left 1s ease";
                }, 300);
              }, 15000);
            }, 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(spaceShip);
  };

  //  ANIMATE LASER FUNCTION ----------------------------------------------

  //  This function animates the laser by calculating the movement along the angle
  //  of the laser and applying the calculated position changes to the laser element.
  //  The animation "should" go as long as the laser is within the bounds of the viewport.
  //  There is a lot of arguments in this function that are used to calculate the position
  //  changes of the laser. I may hard code these values in the future to make it easier
  //  to use.

  //  requestAnimationFrame() is a method that tells the browser that you wish to perform
  //  an animation and requests that the browser call a specified function to update an
  //  animation before the next repaint. "repaint" is the process of painting the entire
  //  window again. I'm still not sure if repaint applies to the entire window or just the
  //  element that is being animated.

  // math.sin() is a method that returns the sine of a number. The sine of a number is the
  // ratio of the length of the side that is opposite that angle to the length of the longest
  // side of the triangle. In this case, it is used to calculate the movement along the angle
  // of the laser.

  // math.cos() is a method that returns the cosine of a number. The cosine of a number is the
  // ratio of the length of the side that is adjacent to the angle to the length of the longest
  // side of the triangle. In this case, it is used to calculate the movement along the angle
  // of the laser.

  // Basically, the laser is moving along the angle of the laser and the position changes are
  // calculated using sin and cos to keep it on a straight path.

  function animateLaser(
    laserClass,
    initialTop,
    initialPosition,
    positionProperty,
    rotationAngle
  ) {
    const laser = document.querySelector(laserClass);
    let start = null;
    const speed = 1;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;

      // Convert angle to radians

      const angleInRadians = rotationAngle * (Math.PI / 180);

      // Calculate movement along the angle

      const deltaY = speed * progress * Math.sin(angleInRadians);
      const deltaX = speed * progress * Math.cos(angleInRadians);
      console.log(`DeltaX: ${deltaX}, DeltaY: ${deltaY}`);

      // Apply calculated position changes

      if (positionProperty === "left") {
        laser.style.top = `${initialTop - deltaY}px`;
        laser.style.left = `${initialPosition - deltaX}px`;
      } else if (positionProperty === "right") {
        laser.style.top = `${initialTop + deltaY}px`;
        laser.style.right = `${initialPosition - deltaX}px`;
      } else {
        console.error("Invalid position property.");
        return;
      }

      // Continue the animation if within bounds

      if (
        parseInt(laser.style[positionProperty], 10) > -window.innerWidth &&
        parseInt(laser.style[positionProperty], 10) < window.innerWidth &&
        parseInt(laser.style.top, 10) < window.innerHeight &&
        parseInt(laser.style.top, 10) > -laser.offsetHeight // Added condition to check top boundary
      ) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  window.addEventListener("scroll", handleScroll);
  spaceShipAnimation();

  //  SWIPER SLIDER FUNCTION ----------------------------------------------

  var swiper = new Swiper(".mySwiper", {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: true,
    },
    slidesPerView: 1,
    spaceBetween: 0,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    speed: 500,
    pagination: {
      el: ".swiper-pagination",
    },
    navigation: {
      nextEl: ".direction-button--right",
      prevEl: ".direction-button--left",
    },
  });

  //  "REMOTE CONTROL" LISTENERS ----------------------------------------------

  const linkButton = document.getElementById("link-button");

  function updateLinkButton() {
    setTimeout(() => {
      const currentLink = document.querySelector(
        ".swiper-slide-active .project-link"
      );
      if (currentLink) {
        linkButton.href = currentLink.href;
      }
    }, 50);
  }

  updateLinkButton();

  swiper.on("slideChange", function () {
    updateLinkButton();
  });

  const powerButton = document.querySelector(".power-button");
  const powerButtonSVG = document.querySelector(".power-button-svg");
  const linkButtonBackLight = document.querySelector(
    ".link-button__back-light"
  );
  const projectScreen = document.querySelectorAll(".projects");
  const projectImages = document.querySelectorAll(".projects__image-container");
  const projectInfos = document.querySelectorAll(".project-info");
  const directionButtons = document.querySelectorAll(".direction-button");
  const clickLight = document.querySelector(".click-light");
  const remote = document.querySelector(".remote-container");

  let isScreenOn = true;

  // powerButton.addEventListener("click", () => {
  //   console.log("power button clicked");

  //   isScreenOn = !isScreenOn;

  //   if (isScreenOn) {
  //     sfx.clickOn.play();
  //     projectImages.forEach((image) => {
  //       image.style.opacity = 1;
  //     });
  //     projectInfos.forEach((info) => {
  //       info.style.opacity = 1;
  //     });
  //     directionButtons.forEach((button) => {
  //       button.classList.add("power-on__direction-button");
  //     });
  //     powerButton.classList.remove("power-on__power-button");
  //     powerButtonSVG.classList.remove("power-on__power-button-svg");
  //     linkButtonBackLight.classList.add("power-on__link-button");
  //     remote.style.opacity = 1;
  //     projectScreen.forEach((screen) => {
  //       screen.classList.remove("screen-off");
  //       screen.classList.add("screen-on");
  //     });
  //   } else {
  //     // Turn all screens off
  //     sfx.clickOff.play();
  //     projectImages.forEach((image) => {
  //       image.style.opacity = 0;
  //     });
  //     projectInfos.forEach((info) => {
  //       info.style.opacity = 0;
  //     });
  //     directionButtons.forEach((button) => {
  //       button.classList.remove("power-on__direction-button");
  //     });
  //     powerButton.classList.add("power-on__power-button");
  //     powerButtonSVG.classList.add("power-on__power-button-svg");
  //     linkButtonBackLight.classList.remove("power-on__link-button");
  //     remote.style.opacity = 0;
  //     setTimeout(() => {
  //       projectScreen.forEach((screen) => {
  //         screen.classList.remove("screen-on");
  //         screen.classList.add("screen-off");
  //       });
  //     }, 2000);
  //   }
  // });

  directionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      this.disabled = true;
      console.log("Button disabled.", this);
      sfx.remoteClicks.play();
      clickLight.style.opacity = "1";
      setTimeout(() => {
        clickLight.style.opacity = "0";
      }, 250);
      setTimeout(() => {
        this.disabled = false;
        console.log("Button enabled.", this);
      }, 500);
    });
  });

  //  FOOTER OPACITY FUNCTION -----------------------------------------------

  //  Because of all the positioning on this page getting a footer to stay at the bottom
  //  without repositioning everything else was impossible unless the footer had a fixed
  //  position. I didn't want to always see the footer so this function uses the
  //  getBoundingClientRect method to calculate the position of the footer relative to the
  //  viewport and adjusts the opacity of the footer based on the distance from the bottom
  //  of the page. This creates a fade effect for the footer as the user scrolls to or away
  //  from the footer.

  const footer = document.querySelector(".footer");

  function updateFooterOpacity() {
    const scrollPosition = window.pageYOffset + window.innerHeight; // Current bottom of the viewport
    const documentHeight = document.documentElement.scrollHeight; // Total height of the document
    const distanceFromBottom = documentHeight - scrollPosition; // Distance from the bottom of the page
    const fadeRange = 500; // Change this value to increase or decrease the fade effect range.
    const opacity = 1 - Math.min(1, distanceFromBottom / fadeRange); // Calculate the opacity based on the distance from the bottom
    footer.style.opacity = opacity;
  }

  window.addEventListener("scroll", updateFooterOpacity);
  updateFooterOpacity();
});
