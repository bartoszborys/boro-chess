import { greet } from "./index";

describe("greet", () => {
  it("returns a greeting", () => {
    expect(greet("chess")).toBe("Hello, chess!");
  });
});
