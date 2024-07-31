module.exports = function (api) {
  api.cache(true);
  // This works
  // return {
  //   presets: ["babel-preset-expo"],
  // };

  // This doesn't work
  return {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [["@babel/plugin-transform-private-methods", { loose: true }]], // Jest complains is this isn't set
  };
};
