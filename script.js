document.addEventListener("DOMContentLoaded", function () {
    console.log("screenSlide/skyScroll/script.js");
  
    let modal = document.getElementById('startModal');
      modal.classList.add('show');
  
      document.getElementById('startButton').addEventListener('click', function() {
        closeModal();
    });
  
  
    function closeModal() {
      let modal = document.getElementById('startModal');
      let storyOneBtn = document.querySelector(".story__part-one--btn");
  
      modal.style.opacity = 0; 
      
      setTimeout(function() {
          modal.classList.remove('show'); 
      }, 2000); 
  
        storyOneBtn.classList.add('show-btn'); 
  }
  
  document.getElementById('startButton').addEventListener('click', function() {
      closeModal();
  });
  
    let soundAllowed = false;
    let sfx = {};
  
    // Function to handle the first user interaction
    document.addEventListener("click", function handleFirstInteraction() {
      if (!soundAllowed) {
        // Check if sound has already been initialized
        sfx = {
          pewPew: new Howl({
            src: ["./audio/pew-pew.mp3"],
            volume: 0.5,
          }),
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
            // loop: true,
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
            loop: true,
            volume: 0.2,
          }),
          whoosh: new Howl({
            src: ["./audio/whoosh.mp3"],
            volume: 0.5,
          }),
          laserCannon: new Howl({
            src: ["./audio/laser-cannon.mp3"],
            volume: 0.5,
          }),
        };
        console.log("Sounds initialized.");
        soundAllowed = true; // Set flag to true after initializing sounds
        document.removeEventListener("click", handleFirstInteraction); // Optionally remove listener
      }
    });
  
    // Smooth scroll function to customize speed and easing
    function smoothScrollTo(targetY, duration) {
      const startY   = window.scrollY;
      const distance = targetY - startY;
      let startTime  = null;
  
      function scrollAnimation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const nextY       = easeFunction(timeElapsed, startY, distance, duration);
  
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
  
    const storyOne = document.querySelector(".sky__section-one");
    const storyOneBtn = document.querySelector(".story__part-one--btn");
    const sunButton = document.querySelector(".direction-button--up");
    const storyFour = document.querySelector(".story__part-four");
    const storyFourBtn = document.querySelector(".story__part-four--btn");
  
    function getCumulativeOffset(element) {
      let top = 0;
      do {
        top += element.offsetTop || 0;
        element = element.offsetParent;
      } while (element);
  
      return top;
    }
  
    function smoothScrollToCenter(element, duration) {
      const viewportHeight   = window.innerHeight;
      const elementHeight    = element.offsetHeight;
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
        // targetY = Math.max(targetY, 0);
        targetY = Math.max(targetY - 20, 0); // Adjust the offset by 20px to add some padding
      }
       
      // sfx.breeze.play();
      // Smooth scroll to the adjusted target position
      smoothScrollTo(targetY, duration);
    }
  
    storyOneBtn.addEventListener("click", () => {
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
  
    function createStars() {
      const space = document.querySelector(".space");
  
      // Function to create a star
      function createStar(type, amount) {
        for (let i = 0; i < amount; i++) {
          const star = document.createElement("div");
          star.className = `star ${type}`;
  
          // Generate random positions within the specified ranges
          const top = Math.random() * (150 - 65) + 65; // top: 55% to 135%
          const left = Math.random() * (99 - 0) + 0; // left: 0% to 99%
  
          // Apply the positions
          star.style.top = `${top}%`;
          star.style.left = `${left}%`;
  
          space.appendChild(star);
        }
      }
  
      // Create the stars
      createStar("star-one", 1000); //  transparent 1px stars
      createStar("star-two", 100); //  1/2 transparent 1px stars
      createStar("star-three", 75); // 1px stars
      createStar("star-four", 50); // 1px with box shadow
      createStar("star-five", 25); // 2px stars
    }
  
    // Run the function to populate the stars
    createStars();
  
    const bird = document.querySelectorAll(".bird");
    const cloudOne = document.querySelectorAll(".cloud-one__container");
  
    // Function to calculate and apply the transform for each element
    const applyTransform = (elements, directionMultiplier) => {
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
  
        // Calculate how far this element is from the center of the viewport
        const centerDistance = rect.top + rect.height / 2 - windowHeight / 2;
  
        // Apply the transformation, adjust multiplier to control the effect's strength
        const transformValue = centerDistance * 0.5 * directionMultiplier;
  
        // element.style.transform = `translateX(${transformValue}px)`;
        // Check if the current element has the 'bird' class
        if (element.classList.contains("bird")) {
          // Apply a specific transformation for 'bird' elements
          element.style.transform = `translateX(${transformValue}px) scale(0.3)`;
        } else {
          // Apply only the translation for other elements
          element.style.transform = `translateX(${transformValue}px)`;
        }
      });
    };
  
    let scrollInProgress = false;
  
    // Listen for scroll events and apply transformations
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
                // spaceShip.style.transition = "transform 15s ease";
                // spaceShip.style.transform = "scale(0.8)";
  
                let scaleValue = "scale(0.8)"; // Default scale
                let transitionDuration = "15s"; // Default transition duration
  
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
                  // sfx.pewPew.play();
                  // playPewPewSound();
                  leftLaser.style.display = "block";
                  animateLaser(".laser--one", 537, -281, "left", 305);
                  rightLaser.style.display = "block";
                  animateLaser(".laser--two", 537, -281, "right", 55);
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
                    // sfx.whoosh.play();
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
  
    function animateLaser(
      laserClass,
      initialTop,
      initialPosition,
      positionProperty,
      rotationAngle
    ) {
      const laser = document.querySelector(laserClass);
      let start = null;
      const speed = 1; // Speed of animation
  
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
        } else {
          laser.style.top = `${initialTop + deltaY}px`;
          laser.style.right = `${initialPosition - deltaX}px`;
        }
  
        // Continue the animation if within bounds
        if (
          parseInt(laser.style[positionProperty], 10) > -window.innerWidth &&
          parseInt(laser.style[positionProperty], 10) < window.innerWidth &&
          parseInt(laser.style.top, 10) < window.innerHeight
        ) {
          requestAnimationFrame(step);
        }
      }
  
      requestAnimationFrame(step);
    }
  
    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);
    spaceShipAnimation();
  
    var swiper = new Swiper(".mySwiper", {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 0,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      speed: 2000,
      pagination: {
        el: ".swiper-pagination",
      },
      navigation: {
        nextEl: ".direction-button--right",
        prevEl: ".direction-button--left",
      },
    });
  
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
  
    let isScreenOn = false;
  
    powerButton.addEventListener("click", () => {
      console.log("power button clicked");
      // clickLight.style.opacity = "1";
      // setTimeout(() => {
      //   clickLight.style.opacity = "0";
      // }, 250);
  
      isScreenOn = !isScreenOn;
  
      if (isScreenOn) {
        sfx.clickOn.play();
        projectImages.forEach((image) => {
          image.style.opacity = 1;
        });
        projectInfos.forEach((info) => {
          info.style.opacity = 1;
        });
        directionButtons.forEach((button) => {
          button.classList.add("power-on__direction-button");
        });
        powerButton.classList.add("power-on__power-button");
        powerButtonSVG.classList.add("power-on__power-button-svg");
        linkButtonBackLight.classList.add("power-on__link-button");
        remote.style.opacity = 1;
        projectScreen.forEach((screen) => {
          screen.classList.remove("screen-off");
          screen.classList.add("screen-on");
        });
      } else {
        // Turn all screens off
        sfx.clickOff.play();
        projectImages.forEach((image) => {
          image.style.opacity = 0;
        });
        projectInfos.forEach((info) => {
          info.style.opacity = 0;
        });
        directionButtons.forEach((button) => {
          button.classList.remove("power-on__direction-button");
        });
        powerButton.classList.remove("power-on__power-button");
        powerButtonSVG.classList.remove("power-on__power-button-svg");
        linkButtonBackLight.classList.remove("power-on__link-button");
        remote.style.opacity = 0;
        setTimeout(() => {
          projectScreen.forEach((screen) => {
            screen.classList.remove("screen-on");
            screen.classList.add("screen-off");
          });
        }, 2000);
      }
    });
  
    directionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        sfx.remoteClicks.play();
        clickLight.style.opacity = "1";
        setTimeout(() => {
          clickLight.style.opacity = "0";
        }, 250);
      });
    });
  
    const footer = document.querySelector(".footer");
  
    function updateFooterOpacity() {
      const scrollPosition = window.pageYOffset + window.innerHeight; // Current bottom of the viewport
      const documentHeight = document.documentElement.scrollHeight; // Total height of the document
      const distanceFromBottom = documentHeight - scrollPosition; // Distance from the bottom of the page
  
      // Define the range in pixels over which the opacity will change from 1 to 0.
      const fadeRange = 500; // Change this value to increase or decrease the fade effect range.
      const opacity = 1 - Math.min(1, distanceFromBottom / fadeRange);
  
      footer.style.opacity = opacity;
    }
  
    window.addEventListener("scroll", updateFooterOpacity);
    updateFooterOpacity();
  
  });
  