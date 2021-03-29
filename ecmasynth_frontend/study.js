function pseudoClass() {
  function method() {
    const func1 = () =>
      console.log(this);
    func1();
  }
  method();
}