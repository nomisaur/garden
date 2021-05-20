(() => {
  const vue = document.getElementById('app').__vue__;
  const gDown = new KeyboardEvent('keydown', { key: 'g', ctrlKey: true });
  const gUp = new KeyboardEvent('keyup', { key: 'g', ctrlKey: true });
  const repeat = () => {
    document.dispatchEvent(gDown);
    document.dispatchEvent(gUp);
    !vue.bot && setTimeout(repeat, 38);
  };
  repeat();
})();
