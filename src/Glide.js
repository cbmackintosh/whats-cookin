const glide = {
  type: "carousel",
  perView: 6,
  focusAt: 3,
  autoplay: 5000,
  hooverpause: true,
  keyboard: true,
  animationDuration: 1000,
  peek: 100
}

new Glide('.glide', glide).mount()