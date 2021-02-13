const glide = {
  type: "carousel",
  perView: 4,
  breakpoints: {
    1300: {
      perView: 3
    },
    1150: {
      perView: 2
    },
    850: {
      perView: 2,
      // gap:100,
      // focusAt: "center"
    }
  },
  focusAt: 'center',
  autoplay: 5000,
  hooverpause: true,
  keyboard: true,
  animationDuration: 1000,
  peek: { before: 100, after: 50 }
}

new Glide('.glide', glide).mount()