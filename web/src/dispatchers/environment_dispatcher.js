export default {
  setWindowSize({data: {width}}) {
    this.$store.refine('environment').merge({
      isMobile640: width < 640,
      isMobile1030: width <= 1030,
    });
  },
};
