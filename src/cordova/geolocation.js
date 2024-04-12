export default {
  getLocation: function (success, error, options) {
    navigator.geolocation.getCurrentPosition(success, error, options);
  },
};
