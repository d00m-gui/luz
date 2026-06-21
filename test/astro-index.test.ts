import { luz } from "../src/";

describe("luz config to style w/tokens", () => {
  const mockConfig = {
    primary: "#3eceec",
  };

  it("should generate basic luz styles", () => {
    const { variables } = luz(mockConfig);
    //console.log(cssOutput, typeof cssOutput);
    expect(typeof variables).toBe("string");
    expect(variables).toContain("secondary");
  });
});
