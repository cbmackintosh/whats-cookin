const glide = {
  type: "carousel",
  perView: 6,
  breakpoints: {
    1450: {
      perView: 5.5
    },
    1300: {
      perView: 4

    },
    1079: {
      perView: 3.75
    },
    890: {
      perView: 3.5,
      gap: 225,
    },
    850: {
      perView: 3,
      gap: 150,
      // focusAt: "center"
    },
    610: {
      perView: 2.5,
      gap: 150,   
    },
    500: {
      perView: 2,
      gap: 80,  
      peek: 80
    }
  },
  gap: 90,
  focusAt: 'center',
  autoplay: 5000,
  hooverpause: true,
  keyboard: true,
  animationDuration: 1000,
  peek: 100
}
window.addEventListener("load", () => new Glide('.glide', glide).mount())
