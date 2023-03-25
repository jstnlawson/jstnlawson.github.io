const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        } else {
            entry.target.classList.remove("show");
        }

/* "IntersectionObserver" is a class that takes a callback function in 
it's constructor. It observes multiple elements/entries at the same 
time. This runs anytime the visability of one of the observed elements 
changes. The if/else statement is checking to see if the hidden content
is being intersected and showing it when this is true and removing it 
when the intersecting is false. */

    });
});

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));

/* The "observer" is observing the "hiddenElements". */  

const scrollDown = document.querySelectorAll(".scroll-fade");
scrollDown.forEach((el) => observer.observe(el));
